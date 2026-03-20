import pandas as pd
from rdflib import Graph, Literal, RDF, BNode
from config import BASE, SCHEMA, TERMS, bind_namespaces
from pathlib import Path
from arguments import get_arguments

def cost_prices_graph(rows = 1000):
    cost_prices_df = pd.read_csv('data/annex3.csv', nrows=rows)
    
    cost_prices_df.columns = (
        cost_prices_df.columns
        .str.strip()
        .str.lower()
        .str.replace(" ", "_")
        .str.replace(r"_\([^)]*\)$", "", regex=True) 
    )
    
    cost_prices_df['date'] = pd.to_datetime(cost_prices_df['date'])
    cost_prices_df = cost_prices_df.sort_values(by=['item_code', 'date']).reset_index(drop=True)
    
    graph = bind_namespaces(Graph())
    

    for item_code, group in cost_prices_df.groupby('item_code'):
        group_list = group.to_dict('records')
        
        cost_prices_counter = 0
        for i, row in enumerate(group_list):
            date_str = row['date'].strftime('%Y-%m-%d')
            price_val = row['wholesale_price']
            
            sub = BASE[f"product/{item_code}/cost-price/{cost_prices_counter}"]
            cost_prices_counter += 1
            
            graph.add((sub, RDF.type, TERMS["CostPrice"]))
            graph.add((sub, SCHEMA["itemOffered"], BASE[f"product/{item_code}"]))
            graph.add((sub, SCHEMA["validFrom"], Literal(date_str, datatype=SCHEMA["Date"])))
            
            if i + 1 < len(group_list):
                next_date = group_list[i+1]['date'].strftime('%Y-%m-%d')
                graph.add((sub, SCHEMA["validUntil"], Literal(next_date, datatype=SCHEMA["Date"])))
            else:
                # Could also be left blank?
                graph.add((sub, SCHEMA["validUntil"], Literal("9999-12-31", datatype=SCHEMA["Date"])))

            price_spec = BNode()
            graph.add((sub, SCHEMA["priceSpecification"], price_spec))
            graph.add((price_spec, SCHEMA["price"], Literal(price_val, datatype=SCHEMA["Number"])))
            graph.add((price_spec, SCHEMA["priceCurrency"], Literal("CNY")))
            graph.add((price_spec, SCHEMA["referenceQuantity"], TERMS["perKG"]))
    
    return graph

def cost_prices(rows = 1000):
    graph = cost_prices_graph(rows)
    
    Path("out").mkdir(parents=True, exist_ok=True)
    graph.serialize(destination='out/cost_prices.ttl', format='turtle')
    print("Generated out/cost_prices.ttl")

if __name__ == "__main__":
    args = get_arguments()
    cost_prices(args.rows)