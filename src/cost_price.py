import pandas as pd
from rdflib import Graph, Literal, RDF, BNode, XSD
from config import BASE, SCHEMA, TERMS, bind_namespaces
from pathlib import Path

def cost_price_graph(rows = 1000):
    cost_prices = pd.read_csv('data/annex3.csv', nrows=rows)
    graph = bind_namespaces(Graph())
    
    cost_price_map = {}

    for r in cost_prices.itertuples(index=False):
        date = r[0]
        item_code = r[1]
        cost_price = r[2]
        
        if item_code not in cost_price_map:
            cost_price_map[item_code] = 0
        
        sub = BASE[f"product/{item_code}/cost-price/{cost_price_map[item_code]}"]
        cost_price_map[item_code] += 1
        
        graph.add((sub, RDF.type, TERMS["CostPrice"]))
        graph.add((sub, SCHEMA["itemOffered"], BASE[f"product/{item_code}"]))
        graph.add((sub, SCHEMA["validFrom"], Literal(date, datatype=SCHEMA["Date"])))
        
        price_specification = BNode()
        graph.add((sub, SCHEMA["priceSpecification"], price_specification))
        graph.add((price_specification, SCHEMA["price"], Literal(cost_price, datatype=XSD.double)))
        graph.add((price_specification, SCHEMA["priceCurrency"], Literal("CNY")))
        graph.add((price_specification, SCHEMA["referenceQuantity"], TERMS["perKG"]))

    return graph

def cost_price(rows = 1000):
    graph = cost_price_graph(rows)
    
    Path("out").mkdir(parents=True, exist_ok=True)
    graph.serialize(destination='out/cost_price.ttl', format='turtle')
    print("Generated out/cost_price.ttl")

if __name__ == "__main__":
    cost_price()