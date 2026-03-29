import os

from products import products
from orders import orders
from cost_prices import cost_prices
from vegetables import vegetables

from pathlib import Path
import shutil
from arguments import get_arguments

def run_all(rows = 1000):
    if Path("out").exists():
        print(f"Cleaning existing directory: out")
        shutil.rmtree("out")
    
    row_display = "Full File" if rows is None else f"{rows} rows"
    print(f"--- Starting RDF Triplification Process ({row_display}) ---")

    print("\n[1/4] Generating Products...")
    products(rows)

    print("\n[2/4] Generating Orders...")
    orders(rows)

    print("\n[3/4] Generating Cost Prices...")
    cost_prices(rows)

    print("\n[4/4] Generating Vegetables...")
    vegetables(rows)
    
    print("\n--- Process Complete! ---")
    print("Files generated: terms.ttl, products.ttl, orders.ttl, cost_price.ttl, vegetables.ttl")

if __name__ == "__main__":
    args = get_arguments()
    
    if not os.path.exists('data'):
        print("Error: 'data' directory not found. Please ensure your CSV files are in a folder named 'data'.")
    else:
        run_all(args.rows)