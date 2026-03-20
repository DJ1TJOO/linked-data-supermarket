import pandas as pd
from rdflib import Graph, Literal, RDF, BNode
from config import BASE, SCHEMA, TERMS, bind_namespaces
from pathlib import Path

def cost_prices_graph(rows = 1000):
    cost_prices_dataframe = pd.read_csv('data/annex3.csv', nrows=rows)
    graph = bind_namespaces(Graph())
    
    cost_prices_map = {}

    for r in cost_prices_dataframe.itertuples(index=False):
        date = r[0]
        item_code = r[1]
        prices = r[2]
        
        if item_code not in cost_prices_map:
            cost_prices_map[item_code] = 0
        
        sub = BASE[f"product/{item_code}/cost-price/{cost_prices_map[item_code]}"]
        cost_prices_map[item_code] += 1
        
        graph.add((sub, RDF.type, TERMS["CostPrice"]))
        graph.add((sub, SCHEMA["itemOffered"], BASE[f"product/{item_code}"]))
        graph.add((sub, SCHEMA["validFrom"], Literal(date, datatype=SCHEMA["Date"])))
        
        price_specification = BNode()
        graph.add((sub, SCHEMA["priceSpecification"], price_specification))
        graph.add((price_specification, SCHEMA["price"], Literal(prices, datatype=SCHEMA["Number"])))
        graph.add((price_specification, SCHEMA["priceCurrency"], Literal("CNY")))
        graph.add((price_specification, SCHEMA["referenceQuantity"], TERMS["perKG"]))

    return graph

def cost_prices(rows = 1000):
    graph = cost_prices_graph(rows)
    
    Path("out").mkdir(parents=True, exist_ok=True)
    graph.serialize(destination='out/cost_prices.ttl', format='turtle')
    print("Generated out/cost_prices.ttl")

if __name__ == "__main__":
    cost_prices()