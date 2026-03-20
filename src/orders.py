import pandas as pd
from rdflib import Graph, Literal, RDF, BNode, XSD
from config import BASE, SCHEMA, TERMS, bind_namespaces
from pathlib import Path

def orders_graph(rows = 1000):
    sales = pd.read_csv('data/annex2.csv', nrows=rows)
    graph = bind_namespaces(Graph())
    
    sales.columns = (
        sales.columns
        .str.strip()
        .str.lower()
        .str.replace(" ", "_")
        .str.replace(r"_\([^)]*\)$", "", regex=True) 
    )
    
    product_offers_map = {} 

    for index, sale in sales.iterrows():
        item_code = sale["item_code"]
        date = sale["date"]
        time = sale["time"]
        quantity_sold = sale["quantity_sold"]
        unit_selling_price = sale["unit_selling_price"]
        discount = sale["discount"]

        order_uri = BASE[f"order/{index}"]
        graph.add((order_uri, RDF.type, SCHEMA["Order"]))
        graph.add((order_uri, SCHEMA["orderDate"], Literal(f"{date}T{time}Z", datatype=XSD.dateTime)))
        
        quantity_node = BNode()
        graph.add((order_uri, TERMS["orderQuantity"], quantity_node))
        graph.add((quantity_node, RDF.type, SCHEMA["QuantitativeValue"]))
        graph.add((quantity_node, SCHEMA["value"], Literal(quantity_sold, datatype=XSD.double)))
        graph.add((quantity_node, SCHEMA["unitCode"], Literal("KGM")))
        
        if item_code not in product_offers_map:
            product_offers_map[item_code] = {}
        
        offers_for_item = product_offers_map[item_code]
        
        if unit_selling_price in offers_for_item:
            offer_uri = offers_for_item[unit_selling_price]
        else:
            offer_count = len(offers_for_item) + 1
            offer_uri = BASE[f"product/{item_code}/offer/{offer_count}"]
            offers_for_item[unit_selling_price] = offer_uri
            
            graph.add((offer_uri, RDF.type, SCHEMA["Offer"]))
            graph.add((offer_uri, SCHEMA["itemOffered"], BASE[f"product/{item_code}"]))
            graph.add((offer_uri, TERMS["isDiscounted"], Literal(str(discount).lower() == "yes", datatype=XSD.boolean)))
            
            price_specification = BNode()
            graph.add((offer_uri, SCHEMA["priceSpecification"], price_specification))
            graph.add((price_specification, SCHEMA["price"], Literal(unit_selling_price, datatype=XSD.double)))
            graph.add((price_specification, SCHEMA["referenceQuantity"], TERMS["perKG"]))
        
        graph.add((order_uri, SCHEMA["acceptedOffer"], offer_uri))

    return graph

def orders(rows = 1000):
    graph = orders_graph(rows)
    
    Path("out").mkdir(parents=True, exist_ok=True)
    graph.serialize(destination='out/orders.ttl', format='turtle')
    print("Generated out/orders.ttl")

if __name__ == "__main__":
    orders()