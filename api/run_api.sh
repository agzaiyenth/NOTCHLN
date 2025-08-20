#!/bin/bash

echo "Setting up Flask API for the Service Completion Time Predictor..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python is not installed. Please install Python and try again."
    exit 1
fi

# Create and activate virtual environment
echo "Creating virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Export and save model if it doesn't exist
echo "Checking model file..."
if [ ! -f "../Model/Tast1/model.pkl" ]; then
    echo "Model file not found. Exporting model from notebook..."
    python export_model.py
fi

# Run the Flask app
echo "Starting the Flask API..."
flask run --host=0.0.0.0 --port=5000
