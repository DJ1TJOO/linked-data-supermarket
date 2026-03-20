import os
from terms import terms
from products import products
from orders import orders
from cost_prices import cost_prices
import argparse

def run_all(rows = 1000):
    num_rows = None if rows == -1 else rows
    
    row_display = "Full File" if num_rows is None else f"{num_rows} rows"
    print(f"--- Starting RDF Triplification Process ({row_display}) ---")
    
    print("\n[1/4] Generating Terms...")
    terms()
    
    print("\n[2/4] Generating Products...")
    products(num_rows)
    
    print("\n[3/4] Generating Orders...")
    orders(num_rows)
    
    print("\n[4/4] Generating Cost Prices...")
    cost_prices(num_rows)
    
    print("\n--- Process Complete! ---")
    print("Files generated: terms.ttl, products.ttl, orders.ttl, cost_price.ttl")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--rows", type=int, default=1000, help="Number of rows to process from the CSV files.")
    args = parser.parse_args()
    
    if not os.path.exists('data'):
        print("Error: 'data' directory not found. Please ensure your CSV files are in a folder named 'data'.")
    else:
        run_all(args.rows)