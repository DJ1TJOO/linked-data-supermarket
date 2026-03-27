import pandas as pd
from rdflib import Graph, Literal, RDF, XSD
from config import BASE, SCHEMA, TERMS, bind_namespaces
from pathlib import Path
from arguments import get_arguments

def vegetables_graph(rows = 1000):
    vegetable_data = pd.read_csv('data/vegetables.csv', nrows=rows)
    products = pd.read_csv('data/annex1.csv', nrows=rows)
    graph = bind_namespaces(Graph())

    print(products.columns)

    for r in vegetable_data.itertuples(index=False):
        vegetable_name = r[1]
        scientific_name = r[2]
        colors = r[4]
        season = r[5]
        origin = r[6]
        nutrition = r[7]
        availability = r[9]
        shelf_life = r[10]
        storage = r[11]
        growing = r[12]
        health = r[13]
        varieties = r[14]

        sub = BASE[f"vegetable/{vegetable_name.replace(" ", "")}"]
        pred = TERMS["name"]
        obj = Literal(vegetable_name)
        graph.add((sub, pred, obj))

        pred = TERMS["scientificName"]
        obj = Literal(scientific_name)
        graph.add((sub, pred, obj))

        pred = TERMS["origin"]
        obj = Literal(origin)
        graph.add((sub, pred, obj))

        pred = TERMS["shelfLife"]
        obj = Literal(shelf_life)
        graph.add((sub, pred, obj))

        pred = TERMS["healthBenefits"]
        obj = Literal(health)
        graph.add((sub, pred, obj))

        pred = TERMS["commonVariety"]
        for variety in varieties.split(","):
            variety = variety.strip()
            obj = Literal(variety)
            graph.add((sub, pred, obj))

        pred = TERMS["hasColor"]
        for color in colors.split(","):
            color = color.strip()
            obj = Literal(color)
            graph.add((sub, pred, obj))

        pred = TERMS["growsIn"]
        for season in season.split(","):
            season = season.strip()
            obj = Literal(season)
            graph.add((sub, pred, obj))

        pred = TERMS["storedLike"]
        obj = Literal(storage)
        graph.add((sub, pred, obj))

        pred = TERMS["availabileIn"]
        obj = Literal(availability)
        graph.add((sub, pred, obj))

        # Growing Conditions

        # Nutritional Value

    return graph

def vegetables(rows = 1000):
    graph = vegetables_graph(rows)

    Path("out").mkdir(parents=True, exist_ok=True)
    graph.serialize(destination='out/vegetables.ttl', format='turtle')
    print("Generated out/vegetables.ttl")