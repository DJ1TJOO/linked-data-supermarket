from pandas.core.methods.selectn import DataFrame
from rdflib import Graph, FOAF, Namespace, URIRef, RDF, Literal, OWL
import pandas as pd

item_info = pd.read_csv('data/annex1.csv')
sales = pd.read_csv('data/annex2.csv')
cost_prices = pd.read_csv('data/annex3.csv')
product_loss_rates = pd.read_csv('data/annex4.csv')