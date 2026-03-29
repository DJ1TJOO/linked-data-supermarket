import pandas as pd
from rdflib import Graph, Literal, RDF, XSD, BNode
from config import BASE, TERMS, bind_namespaces
from pathlib import Path
from arguments import get_arguments

storeageRequirements = {
    "Refrigeration": TERMS["Refrigeration"],
    "Cool, dry place": TERMS["CoolDry"],
    "Cool, dark place": TERMS["CoolDark"]
}

availableIn = {
    "Year-round": TERMS["YearRound"],
    "Seasonal": TERMS["Seasonal"]
}

growingConditions = {
    # Sunlight
    "full sunlight": TERMS["FullSunlight"],
    "partial shade": TERMS["PartialSunlight"],
    "shaded environment": TERMS["NoSunlight"],

    # Soil
    "coastal soil": TERMS["CoastalSoil"],
    "well-drained soil": TERMS["WellDrainedSoil"],
    "loose soil": TERMS["LooseSoil"],
    "moist soil": TERMS["MoistSoil"],
    "rich soil": TERMS["RichSoil"],
    "salty soil": TERMS["SaltySoil"],
    "wet soil": TERMS["WetSoil"],

    # Climate
    "cool": TERMS["CoolClimate"],
    "cool climate": TERMS["CoolClimate"],
    "warm climate": TERMS["WarmClimate"],
    "coastal climate": TERMS["CoastalClimate"],

    # Watering
    "moderate watering": TERMS["ModerateWatering"]
}

def vegetables_graph(rows = 1000):
    vegetable_data = pd.read_csv('data/vegetables.csv', nrows=rows)
    graph = bind_namespaces(Graph())

    for r in vegetable_data.itertuples(index=False):
        vegetable_name = r[1]
        scientific_name = r[2]
        colors = r[4]
        seasons = r[5]
        origin = r[6]
        nutrition = r[7]
        availability = r[9]
        shelf_life = r[10]
        storage = r[11]
        growing = r[12]
        health = r[13]
        varieties = r[14]

        sub = BASE[f"vegetable/{scientific_name.title().replace(".", "").replace(" ", "")}"]
        graph.add((sub, RDF.type, TERMS["Vegetable"]))
        graph.add((sub, TERMS["name"], Literal(vegetable_name, datatype=XSD.string)))
        graph.add((sub, TERMS["scientificName"], Literal(scientific_name, datatype=XSD.string)))
        graph.add((sub, TERMS["origin"], Literal(origin, datatype=XSD.string)))
        
        graph.add((sub, TERMS["shelfLife"], Literal(int(shelf_life), datatype=XSD.integer)))
        graph.add((sub, TERMS["healthBenefits"], Literal(health, datatype=XSD.string)))

        for variety in varieties.split(","):
            graph.add((sub, TERMS["commonVariety"], Literal(variety.strip(), datatype=XSD.string)))

        for color in colors.split(","):
            colorNode = BASE[f"vegetable-color/{color.title().replace(" ", "")}"]
            graph.add((colorNode, RDF.type, TERMS["Color"] ))
            graph.add((colorNode, TERMS["value"], Literal(color.strip())))
            graph.add((sub, TERMS["hasColor"], colorNode))

        for season in seasons.split("/"):
            season_uri = TERMS[season.strip()]
            graph.add((sub, TERMS["growsIn"], season_uri))

        graph.add((sub, TERMS["storedLike"], storeageRequirements[storage.strip()]))

        graph.add((sub, TERMS["availableIn"], availableIn[availability.strip()]))

        for condition in growing.split(","):
            graph.add((sub, TERMS["growingCondition"], growingConditions[condition.strip().lower()]))

        kcal, protein, fiber = nutrition.split(",")
        nut_value = BNode()
        graph.add((sub, TERMS["hasNutritionalValue"], nut_value))
        graph.add((nut_value, RDF.type, TERMS["NutritionalValue"]))
        graph.add((nut_value, TERMS["kcal"], Literal(int(kcal.replace("kcal", "").strip()), datatype=XSD.integer)))
        graph.add((nut_value, TERMS["protein"], Literal(float(protein.replace("g protein", "").strip()), datatype=XSD.double)))
        graph.add((nut_value, TERMS["fiber"], Literal(float(fiber.replace("g fiber", "").strip()), datatype=XSD.double)))

    return graph

def vegetables(rows = 1000):
    graph = vegetables_graph(rows)

    Path("out").mkdir(parents=True, exist_ok=True)
    graph.serialize(destination='out/vegetables.ttl', format='turtle')
    print("Generated out/vegetables.ttl")

if __name__ == "__main__":
    args = get_arguments()
    vegetables(args.rows)