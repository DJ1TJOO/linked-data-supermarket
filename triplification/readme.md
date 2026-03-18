# Project Name

This project requires **Python 3.12**.

## Setup Environment

### 1. Create a virtual environment

python3.12 -m venv .env

### 2. Activate the environment

- **Windows**:

.env\Scripts\activate

- **macOS / Linux**:

source .env/bin/activate

### 3. Install dependencies

pip install --upgrade pip
pip install -r requirements.txt
or in pyenv
pyenv exec python -m pip --version

## Run the Script

The main script is located at `src/triplifier.py`. Run it using:

python src/triplifier.py

## Notes

- Ensure you are using **Python 3.12**.
- All dependencies are listed in `requirements.txt`.
- To deactivate the environment, simply run:

deactivate
