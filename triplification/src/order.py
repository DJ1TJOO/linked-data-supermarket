from pandas.core.methods.selectn import DataFrame
from rdflib import Graph, FOAF, Namespace, URIRef, RDF, Literal, OWL, XSD, BNode
import pandas as pd

sales = pd.read_csv('data/annex2.csv', nrows=1000)
sales.columns = (
    sales.columns
    .str.strip()
    .str.lower()
    .str.replace(" ", "_")
    .str.replace(r"_\([^)]*\)$", "", regex=True) 
)

graph = Graph()

base = Namespace('http://example.com/')
terms = Namespace('http://example.com/terms/')
schema = Namespace('http://schema.org/')

graph.bind("base", base, override=True)
graph.bind("terms", terms, override=True)
graph.bind("schema", schema, override=True)

# perKG = terms["perKG"]
# graph.add((perKG, RDF.type, schema["QuantitativeValue"]))
# graph.add((perKG, schema["value"], Literal(1, datatype=XSD.double)))
# graph.add((perKG, schema["unitCode"], URIRef("https://qudt.org/vocab/unit/KiloGM")))

offersMap = {}
for (index, sale) in sales.iterrows():
    print(sale)
    item_code = sale["item_code"]
    date = sale["date"]
    time = sale["time"]
    quantity_sold = sale["quantity_sold"]
    unit_selling_price = sale["unit_selling_price"]
    sale_or_return = sale["sale_or_return"]
    discount = sale["discount"]
    
    graph.add((base[f"order/{index}"], RDF.type, schema["Order"]))
    graph.add((base[f"order/{index}"], schema["orderDate"], Literal(f"{date}T{time}Z", datatype=schema["DateTime"])))
    graph.add((base[f"order/{index}"], terms["orderQuantity"], Literal(quantity_sold, datatype=XSD.double)))
    
    offer = None
    if not item_code in offersMap:
        offersMap[item_code] = {}
        
    offersForItem = offersMap[item_code]
    if unit_selling_price in offersForItem:
        offer = offersForItem[unit_selling_price]
    else:
        offer = offersForItem[unit_selling_price] = base[f"product/{item_code}/offer/{len(offersForItem) + 1}"]
        graph.add((offer, RDF.type, schema["Offer"]))
        graph.add((offer, schema["itemOffered"], base[f"product/{item_code}"]))
        graph.add((offer, terms["isDiscounted"], Literal(discount == "Yes", datatype=XSD.boolean)))
        
        priceSpecification = BNode()
        graph.add((offer, schema["priceSpecification"], priceSpecification))
        graph.add((priceSpecification, RDF.type, schema["UnitPriceSpecification"]))
        graph.add((priceSpecification, schema["price"], Literal(unit_selling_price, datatype=XSD.double)))
        graph.add((priceSpecification, schema["priceCurrency"], Literal("CNY", datatype=XSD.string)))
        graph.add((priceSpecification, schema["referenceQuantity"], terms["perKG"]))
        
    
    graph.add((base[f"order/{index}"], schema["acceptedOffer"], offer))    

graph.serialize(destination='orders.ttl', format='turtle')