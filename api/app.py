from flask import Flask, request, jsonify
from datetime import datetime
import os
from flask_cors import CORS
from model_predictor import ServiceCompletionTimePredictor
import joblib
from xgboost import XGBRegressor
import pandas as pd

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Path to model files
MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
                         'Model', 'Tast1')

# Initialize the predictor
try:
    # Initialize with our robust fallback predictor that works even without model files
    predictor = ServiceCompletionTimePredictor()
    print("Model predictor initialized successfully with fallback logic")
except Exception as e:
    print(f"Error initializing model predictor: {e}")
    predictor = None
        
@app.route('/predict', methods=['POST'])
def predict():
    """Endpoint to predict service completion time"""
    try:
        # Check if predictor is initialized
        if predictor is None:
            return jsonify({
                'error': 'Model predictor not initialized. Please try again later.'
            }), 500
        
        data = request.get_json()
        
        # Validate input
        if not all(key in data for key in ['date', 'time', 'task_id']):
            return jsonify({
                'error': 'Missing required parameters. Please provide date, time, and task_id'
            }), 400
            
        date = data['date']
        time = data['time']
        task_id = data['task_id']
        
        # Validate date format
        try:
            datetime.strptime(date, "%Y-%m-%d")
        except ValueError:
            return jsonify({
                'error': 'Invalid date format. Please use YYYY-MM-DD'
            }), 400
            
        # Validate time format
        try:
            datetime.strptime(time, "%H:%M")
        except ValueError:
            return jsonify({
                'error': 'Invalid time format. Please use HH:MM (24-hour format)'
            }), 400
        
        # Make prediction using our predictor
        try:
            completion_time = predictor.predict_completion_time(date, time, task_id)
        except Exception as e:
            return jsonify({
                'error': f'Prediction error: {str(e)}'
            }), 500
            
        # Ensure prediction is positive
        completion_time = max(1, completion_time)
        
        return jsonify({
            'expected_completion_time_minutes': completion_time
        })
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': f'Prediction error: {str(e)}'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Endpoint to check if the API is running"""
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
