from rdflib import Namespace, RDF, XSD

BASE = Namespace('http://localhost/')
SCHEMA = Namespace('http://schema.org/')
TERMS = Namespace(BASE["terms/"])

def bind_namespaces(graph):
    graph.bind("base", BASE)
    graph.bind("schema", SCHEMA)
    graph.bind("terms", TERMS)
    return graph