from rdflib import Namespace, RDF, XSD

BASE = Namespace('https://dj1tjoo.github.io/linked-data-supermarket/')
SCHEMA = Namespace('https://schema.org/')
TERMS = Namespace(BASE["terms/"])

def bind_namespaces(graph):
    graph.bind("base", BASE)
    graph.bind("schema", SCHEMA)
    graph.bind("terms", TERMS)
    return graph