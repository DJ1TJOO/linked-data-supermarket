from pandas.core.methods.selectn import DataFrame
from rdflib import Graph, FOAF, Namespace, URIRef, RDF, Literal, OWL, BNode
import pandas as pd

item_info = pd.read_csv('data/annex1.csv')
sales = pd.read_csv('data/annex2.csv')
cost_prices = pd.read_csv('data/annex3.csv', nrows=10000)
product_loss_rates = pd.read_csv('data/annex4.csv')

graph = Graph()
base = Namespace('http://localhost/')
schema = Namespace('http://schema.org/')
terms = Namespace(base["terms/"])

graph.bind("base", base)
graph.bind("schema", schema)
graph.bind("terms", terms)

categories = []

for r in item_info.itertuples(index=False):
    item_code = r[0]
    item_name = r[1]
    category_code = r[2]
    category_name = r[3]

    sub = base[f"product/{item_code}"]
    pred = RDF.type
    obj = schema["Product"]
    graph.add((sub,pred,obj))

    pred = schema["name"]
    obj = Literal(item_name)
    graph.add((sub,pred,obj))

    pred = schema["sku"]
    obj = Literal(item_code)
    graph.add((sub,pred,obj))

    pred = terms["lossRate"]
    obj = Literal(product_loss_rates.loc[product_loss_rates["Item Code"] == item_code]["Loss Rate (%)"].iloc[0])
    graph.add((sub,pred,obj))

    pred = schema["category"]
    obj = base[f"category/{category_code}"]
    graph.add((sub,pred,obj))

    if category_code not in categories:
        sub = obj
        pred = RDF.type
        obj = schema["CategoryCode"]
        graph.add((sub,pred,obj))

        pred = schema["name"]
        obj = Literal(category_name)
        graph.add((sub,pred,obj))

        pred = schema["codeValue"]
        obj = Literal(category_code)
        graph.add((sub,pred,obj))

        categories.append(category_code)

cost_price_map = {}

for r in cost_prices.itertuples(index=False):
    date = r[0]
    item_code = r[1]
    cost_price = r[2]

    if item_code not in cost_price_map:
        cost_price_map[item_code] = 0

    sub = base[f"product/{item_code}/cost-price/{cost_price_map[item_code]}"]
    pred = RDF.type
    obj = base["CostPrice"]
    graph.add((sub,pred,obj))

    pred = schema["itemOffered"]
    obj = base[f"product/{item_code}"]
    graph.add((sub,pred,obj))

    pred = schema["priceSpecification"]
    obj = BNode()
    graph.add((sub,pred,obj))

    sub = obj
    pred = schema["price"]
    obj = Literal(cost_price)
    graph.add((sub,pred,obj))

    pred = schema["priceCurrency"]
    obj = Literal("CNY")
    graph.add((sub,pred,obj))

    pred = schema["referenceQuantity"]
    obj = terms["perKG"]

    cost_price_map[item_code] += 1

graph.serialize(destination='triplified.ttl', format='turtle')

