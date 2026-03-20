import argparse

def get_arguments():
    parser = argparse.ArgumentParser()
    parser.add_argument("--rows", type=int, default=1000, help="Number of rows to process from the CSV files.")
    args = parser.parse_args()
    
    if args.rows == -1:
        args.rows = None
    return args