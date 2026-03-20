import pandas as pd
from rdflib import Graph, Literal, RDF, XSD
from config import BASE, SCHEMA, TERMS, bind_namespaces
from pathlib import Path
from arguments import get_arguments

def products_graph(rows = 1000):
    item_info = pd.read_csv('data/annex1.csv', nrows=rows)
    product_loss_rates = pd.read_csv('data/annex4.csv')
    graph = bind_namespaces(Graph())
    
    categories = []

    for r in item_info.itertuples(index=False):
        item_code = r[0]
        item_name = r[1]
        category_code = r[2]
        category_name = r[3]

        sub = BASE[f"product/{item_code}"]
        graph.add((sub, RDF.type, SCHEMA["Product"]))
        graph.add((sub, SCHEMA["name"], Literal(item_name)))
        graph.add((sub, SCHEMA["sku"], Literal(item_code)))
        
        loss_rate_row = product_loss_rates.loc[product_loss_rates["Item Code"] == item_code]
        if not loss_rate_row.empty:
            loss_rate = loss_rate_row["Loss Rate (%)"].iloc[0]
            graph.add((sub, TERMS["lossRate"], Literal(loss_rate, datatype=XSD.double)))
        
        category_uri = BASE[f"category/{category_code}"]
        graph.add((sub, SCHEMA["category"], category_uri))
        
        if category_code not in categories:
            graph.add((category_uri, RDF.type, SCHEMA["CategoryCode"]))
            graph.add((category_uri, SCHEMA["name"], Literal(category_name)))
            graph.add((category_uri, SCHEMA["codeValue"], Literal(category_code)))
            categories.append(category_code)
            
    return graph

def products(rows = 1000):
    graph = products_graph(rows)
    
    Path("out").mkdir(parents=True, exist_ok=True)
    graph.serialize(destination='out/products.ttl', format='turtle')
    print("Generated out/products.ttl")

if __name__ == "__main__":
    args = get_arguments()
    products(args.rows)