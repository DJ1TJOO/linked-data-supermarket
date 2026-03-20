import pandas as pd
from rdflib import Graph, Literal, RDF, BNode, XSD
from config import BASE, SCHEMA, TERMS, bind_namespaces
from pathlib import Path

CHUNK_SIZE = 500

def build_orders_graph(sales_chunk, product_offers_mapping):
    orders_chunk_graph = bind_namespaces(Graph())
    new_offers_graph = bind_namespaces(Graph())
    
    sales_chunk.columns = (
        sales_chunk.columns
        .str.strip()
        .str.lower()
        .str.replace(" ", "_")
        .str.replace(r"_\([^)]*\)$", "", regex=True) 
    )
    
    for index, sale_row in sales_chunk.iterrows():
        item_code = sale_row["item_code"]
        sale_date = sale_row["date"]
        sale_time = sale_row["time"]
        quantity_sold = sale_row["quantity_sold"]
        unit_selling_price = sale_row["unit_selling_price"]
        is_discounted = str(sale_row.get("discount", "")).lower() == "yes"

        order_resource_uri = BASE[f"order/{index}"]
        orders_chunk_graph.add((order_resource_uri, RDF.type, SCHEMA["Order"]))
        orders_chunk_graph.add((order_resource_uri, SCHEMA["orderDate"], Literal(f"{sale_date}T{sale_time}Z", datatype=XSD.dateTime)))
        
        quantity_blank_node = BNode()
        orders_chunk_graph.add((order_resource_uri, TERMS["orderQuantity"], quantity_blank_node))
        orders_chunk_graph.add((quantity_blank_node, RDF.type, SCHEMA["QuantitativeValue"]))
        orders_chunk_graph.add((quantity_blank_node, SCHEMA["value"], Literal(quantity_sold, datatype=XSD.double)))
        orders_chunk_graph.add((quantity_blank_node, SCHEMA["unitCode"], Literal("KGM")))
        
        if item_code not in product_offers_mapping:
            product_offers_mapping[item_code] = {}
        
        existing_offers_for_item = product_offers_mapping[item_code]
        
        if unit_selling_price in existing_offers_for_item:
            offer_resource_uri = existing_offers_for_item[unit_selling_price]
        else:
            new_offer_index = len(existing_offers_for_item) + 1
            offer_resource_uri = BASE[f"product/{item_code}/offer/{new_offer_index}"]
            existing_offers_for_item[unit_selling_price] = offer_resource_uri
            
            new_offers_graph.add((offer_resource_uri, RDF.type, SCHEMA["Offer"]))
            new_offers_graph.add((offer_resource_uri, SCHEMA["itemOffered"], BASE[f"product/{item_code}"]))
            new_offers_graph.add((offer_resource_uri, TERMS["isDiscounted"], Literal(is_discounted, datatype=XSD.boolean)))
            
            price_specification_node = BNode()
            new_offers_graph.add((offer_resource_uri, SCHEMA["priceSpecification"], price_specification_node))
            new_offers_graph.add((price_specification_node, SCHEMA["price"], Literal(unit_selling_price, datatype=XSD.double)))
            new_offers_graph.add((price_specification_node, SCHEMA["referenceQuantity"], TERMS["perKG"]))
        
        orders_chunk_graph.add((order_resource_uri, SCHEMA["acceptedOffer"], offer_resource_uri))

    return orders_chunk_graph, new_offers_graph

def orders(rows = 1000):
    output_directory = Path("out")
    output_directory.mkdir(parents=True, exist_ok=True)
    
    product_offers_mapping = {}
    master_offers_graph = bind_namespaces(Graph())
    
    csv_chunks = pd.read_csv('data/annex2.csv', nrows=rows, chunksize=CHUNK_SIZE)
    
    for chunk_index, sales_chunk in enumerate(csv_chunks, start=1):
        current_orders_graph, discovered_offers_graph = build_orders_graph(
            sales_chunk, 
            product_offers_mapping
        )
        
        orders_output_path = output_directory / f"orders-{chunk_index}.ttl"
        current_orders_graph.serialize(destination=str(orders_output_path), format='turtle')
        print(f"Successfully generated: {orders_output_path}")
        
        master_offers_graph += discovered_offers_graph

    offers_output_path = output_directory / "offers.ttl"
    master_offers_graph.serialize(destination=str(offers_output_path), format='turtle')
    print(f"Successfully generated: {offers_output_path}")

if __name__ == "__main__":
    orders()