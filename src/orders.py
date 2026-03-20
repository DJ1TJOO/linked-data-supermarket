import pandas as pd
from rdflib import Graph, Literal, RDF, BNode, XSD
from config import BASE, SCHEMA, TERMS, bind_namespaces
from pathlib import Path
import threading
from concurrent.futures import ThreadPoolExecutor, wait
from tqdm import tqdm
import sys
import signal

CHUNK_SIZE = 175000
MAX_WORKERS = 8
mapping_lock = threading.Lock()
exit_event = threading.Event()

def build_orders_graph(sales_chunk, product_offers_mapping, offers_graph, pbar=None):
    orders_graph = bind_namespaces(Graph())
    
    sales_chunk.columns = (
        sales_chunk.columns
        .str.strip()
        .str.lower()
        .str.replace(" ", "_")
        .str.replace(r"_\([^)]*\)$", "", regex=True) 
    )
    
    for index, sale_row in sales_chunk.iterrows():
        if exit_event.is_set():
            break
            
        item_code = sale_row["item_code"]
        sale_date = sale_row["date"]
        sale_time = sale_row["time"]
        quantity_sold = sale_row["quantity_sold"]
        unit_selling_price = sale_row["unit_selling_price"]
        is_discounted = str(sale_row.get("discount", "")).lower() == "yes"

        order_resource_uri = BASE[f"order/{index}"]
        orders_graph.add((order_resource_uri, RDF.type, SCHEMA["Order"]))
        orders_graph.add((order_resource_uri, SCHEMA["orderDate"], Literal(f"{sale_date}T{sale_time}Z", datatype=SCHEMA["DateTime"])))
        
        quantity_blank_node = BNode()
        orders_graph.add((order_resource_uri, TERMS["orderQuantity"], quantity_blank_node))
        orders_graph.add((quantity_blank_node, RDF.type, SCHEMA["QuantitativeValue"]))
        orders_graph.add((quantity_blank_node, SCHEMA["value"], Literal(quantity_sold, datatype=SCHEMA["Number"])))
        orders_graph.add((quantity_blank_node, SCHEMA["unitCode"], Literal("KGM")))
        
        with mapping_lock:
            if item_code not in product_offers_mapping:
                product_offers_mapping[item_code] = {}
            
            existing_offers_for_item = product_offers_mapping[item_code]
            
            if unit_selling_price in existing_offers_for_item:
                offer_resource_uri = existing_offers_for_item[unit_selling_price]
            else:
                new_offer_index = len(existing_offers_for_item) + 1
                offer_resource_uri = BASE[f"product/{item_code}/offer/{new_offer_index}"]
                existing_offers_for_item[unit_selling_price] = offer_resource_uri
                
                offers_graph.add((offer_resource_uri, RDF.type, SCHEMA["Offer"]))
                offers_graph.add((offer_resource_uri, SCHEMA["itemOffered"], BASE[f"product/{item_code}"]))
                offers_graph.add((offer_resource_uri, TERMS["isDiscounted"], Literal(is_discounted, datatype=XSD.boolean)))
                
                price_specification_node = BNode()
                offers_graph.add((offer_resource_uri, SCHEMA["priceSpecification"], price_specification_node))
                offers_graph.add((price_specification_node, SCHEMA["price"], Literal(unit_selling_price, datatype=SCHEMA["Number"])))
                offers_graph.add((price_specification_node, SCHEMA["referenceQuantity"], TERMS["perKG"]))
        
        orders_graph.add((order_resource_uri, SCHEMA["acceptedOffer"], offer_resource_uri))
        if pbar:
            pbar.update(1)
            
    return orders_graph

def output_orders_graph(chunk_index, orders_graph, output_directory):
    if exit_event.is_set():
        return
    
    output_path = output_directory / f"orders-{chunk_index}.ttl"
    orders_graph.serialize(destination=str(output_path), format='turtle')
    
def process_chunk_worker(sales_chunk, chunk_index, product_offers_mapping, offers_graph, output_directory):
    if exit_event.is_set():
        return
    
    with tqdm(total=len(sales_chunk), desc=f"Parsing chunk {chunk_index:02d}", position=chunk_index, leave=False) as pbar:
        orders_graph = build_orders_graph(sales_chunk, product_offers_mapping, offers_graph, pbar)
        output_orders_graph(chunk_index, orders_graph, output_directory)
        pbar.write(f"Successfully generated: {output_path}")

def orders(rows = 1000):
    output_directory = Path("out")
    output_directory.mkdir(parents=True, exist_ok=True)
    
    product_offers_mapping = {}
    offers_graph = bind_namespaces(Graph())
    
    csv_chunks = pd.read_csv('data/annex2.csv', nrows=rows, chunksize=CHUNK_SIZE)
    executor = ThreadPoolExecutor(max_workers=MAX_WORKERS)
    futures = []
    
    try:        
        for chunk_index, sales_chunk in enumerate(csv_chunks, start=1):
            future = executor.submit(
                process_chunk_worker, 
                sales_chunk, 
                chunk_index, 
                product_offers_mapping, 
                offers_graph, 
                output_directory
            )
            futures.append(future)
            
        while any(f.running() for f in futures):
            done, not_done = wait(futures, timeout=0.5)
            if exit_event.is_set():
                break

        offers_output_path = output_directory / "offers.ttl"
        offers_graph.serialize(destination=str(offers_output_path), format='turtle')
        print(f"Successfully generated: {offers_output_path}")
        
    except KeyboardInterrupt:
        print("\nAborting... cleaning up threads.")
        exit_event.set()
        executor.shutdown(wait=False, cancel_futures=True)
        sys.exit(1)

if __name__ == "__main__":
    signal.signal(signal.SIGINT, signal.SIG_DFL)
    orders()