from pandas.core.methods.selectn import DataFrame
from rdflib import Graph, FOAF, Namespace, URIRef, RDF, Literal, OWL
import pandas as pd

item_info = pd.read_csv('data/annex1.csv')
sales = pd.read_csv('data/annex2.csv')
cost_prices = pd.read_csv('data/annex3.csv')
product_loss_rates = pd.read_csv('data/annex4.csv')

graph = Graph()
base = Namespace('http://localhost/')
schema = Namespace('http://schema.org/')

graph.bind("base", base)
graph.bind("schema", schema)

for r in item_info.itertuples(index=False):
    item_code = r[0]
    item_name = r[1]
    category_code = r[2]
    category_name = r[3]



    sub = base[f"product/{item_code}"]
    pred = RDF.type
    obj = schema["Product"]
    graph.add((sub,pred,obj))

graph.serialize(destination='triplified.ttl', format='turtle')

