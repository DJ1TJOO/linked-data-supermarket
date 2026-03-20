from rdflib import Graph, RDF, RDFS, Literal, XSD
from config import TERMS, SCHEMA, bind_namespaces
from pathlib import Path

def terms_graph():
    graph = bind_namespaces(Graph())
    
    graph.add((TERMS["lossRate"], RDF.type, RDF.Property))
    graph.add((TERMS["lossRate"], RDFS.label, Literal("Loss Rate")))
    graph.add((TERMS["lossRate"], RDFS.comment, Literal("The percentage of product lost during processing.")))
    
    graph.add((TERMS["isDiscounted"], RDF.type, RDF.Property))
    graph.add((TERMS["isDiscounted"], RDFS.label, Literal("Is Discounted")))
    graph.add((TERMS["isDiscounted"], RDFS.comment, Literal("Whether the product is discounted.")))
    graph.add((TERMS["isDiscounted"], RDFS.range, XSD.boolean))
    
    graph.add((TERMS["orderQuantity"], RDF.type, RDF.Property))
    graph.add((TERMS["orderQuantity"], RDFS.label, Literal("Order Quantity")))
    graph.add((TERMS["orderQuantity"], RDFS.comment, Literal("The quantity of the product ordered.")))
    graph.add((TERMS["orderQuantity"], RDFS.range, SCHEMA["QuantitativeValue"]))

    graph.add((TERMS["perKG"], RDF.type, SCHEMA["QuantitativeValue"]))
    graph.add((TERMS["perKG"], RDFS.label, Literal("Per KG")))
    graph.add((TERMS["perKG"], RDFS.comment, Literal("The one unit per kilogram.")))
    graph.add((TERMS["perKG"], SCHEMA["value"], Literal(1)))
    graph.add((TERMS["perKG"], SCHEMA["unitCode"], Literal("KGM")))
    
    return graph

def terms():
    graph = terms_graph()
    
    Path("out").mkdir(parents=True, exist_ok=True)
    graph.serialize(destination='out/terms.ttl', format='turtle')
    print("Saved out/terms.ttl")

if __name__ == "__main__":
    terms()