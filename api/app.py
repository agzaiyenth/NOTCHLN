from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import traceback
import joblib
import pandas as pd
from datetime import datetime

# Paths to model folders
TASK1_MODEL_DIR = os.path.join(os.path.dirname(__file__), '../Model/Tast1')
TASK2_MODEL_DIR = os.path.join(os.path.dirname(__file__), '../Model/Task2')

# Load Task 1 (Service Completion Time) model and encoders
service_model = joblib.load(os.path.join(TASK1_MODEL_DIR, 'xgb_service_completion_model.pkl'))
service_scaler = joblib.load(os.path.join(TASK1_MODEL_DIR, 'scaler.pkl'))
service_le_task = joblib.load(os.path.join(TASK1_MODEL_DIR, 'task_label_encoder.pkl'))
service_le_section = joblib.load(os.path.join(TASK1_MODEL_DIR, 'section_label_encoder.pkl'))
service_task_df = pd.read_csv(os.path.join(os.path.dirname(__file__), 'datasets/tasks.csv'))

# Load Task 2 (Staffing Needs) model and encoders
staffing_model = joblib.load(os.path.join(TASK2_MODEL_DIR, 'xgb_staffing_model.pkl'))
staffing_scaler = joblib.load(os.path.join(TASK2_MODEL_DIR, 'scaler.pkl'))
staffing_le_section = joblib.load(os.path.join(TASK2_MODEL_DIR, 'section_label_encoder.pkl'))

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

@app.route('/predict_service_time', methods=['POST'])
def predict_service_time():
    try:
        data = request.get_json(force=True)
        date = data['date']
        time_str = data['time']
        task_id = data['task_id']
        # Get section_id from tasks.csv
        row = service_task_df[service_task_df['task_id'] == task_id]
        if row.empty:
            return jsonify({'error': 'Invalid task_id'}), 400
        section_id = row.iloc[0]['section_id']
        # Feature engineering
        date_dt = pd.to_datetime(date)
        hour = int(time_str.split(':')[0])
        weekday = date_dt.weekday()
        month = date_dt.month
        task_id_encoded = service_le_task.transform([task_id])[0]
        section_id_encoded = service_le_section.transform([section_id])[0]
        # Dummy values for staff_load_ratio and employees_on_duty (could be improved)
        staff_load_ratio = 1.0
        employees_on_duty = 1.0
        X = [[hour, weekday, month, task_id_encoded, section_id_encoded, staff_load_ratio, employees_on_duty]]
        X_scaled = service_scaler.transform(X)
        pred = service_model.predict(X_scaled)[0]
        return jsonify({'expected_completion_time_minutes': max(1, round(pred))})
    except Exception as e:
        return jsonify({'error': str(e), 'trace': traceback.format_exc()}), 500

@app.route('/predict_staffing', methods=['POST'])
def predict_staffing():
    try:
        data = request.get_json(force=True)
        date = data['date']
        section_id = data['section_id'].upper()
        date_dt = pd.to_datetime(date)
        month = date_dt.month
        weekday = date_dt.weekday()
        section_id_encoded = staffing_le_section.transform([section_id])[0]
        X = [[month, weekday, section_id_encoded]]
        X_scaled = staffing_scaler.transform(X)
        pred = staffing_model.predict(X_scaled)[0]
        return jsonify({'predicted_employee_count': max(1, round(pred))})
    except Exception as e:
        return jsonify({'error': str(e), 'trace': traceback.format_exc()}), 500

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json(force=True)
        # Decide which prediction to run based on keys in data
        if 'task_id' in data and 'date' in data and 'time' in data:
            # Service completion time prediction
            date = data['date']
            time_str = data['time']
            task_id = data['task_id']
            row = service_task_df[service_task_df['task_id'] == task_id]
            if row.empty:
                return jsonify({'error': 'Invalid task_id'}), 400
            section_id = row.iloc[0]['section_id']
            date_dt = pd.to_datetime(date)
            hour = int(time_str.split(':')[0])
            weekday = date_dt.weekday()
            month = date_dt.month
            task_id_encoded = service_le_task.transform([task_id])[0]
            section_id_encoded = service_le_section.transform([section_id])[0]
            staff_load_ratio = 1.0
            employees_on_duty = 1.0
            X = [[hour, weekday, month, task_id_encoded, section_id_encoded, staff_load_ratio, employees_on_duty]]
            X_scaled = service_scaler.transform(X)
            pred = service_model.predict(X_scaled)[0]
            return jsonify({'expected_completion_time_minutes': max(1, round(pred))})
        elif 'section_id' in data and 'date' in data and 'staffing' in data:
            # Staffing prediction (expects 'staffing' key to distinguish)
            date = data['date']
            section_id = data['section_id'].upper()
            date_dt = pd.to_datetime(date)
            month = date_dt.month
            weekday = date_dt.weekday()
            section_id_encoded = staffing_le_section.transform([section_id])[0]
            X = [[month, weekday, section_id_encoded]]
            X_scaled = staffing_scaler.transform(X)
            pred = staffing_model.predict(X_scaled)[0]
            return jsonify({'predicted_employee_count': max(1, round(pred))})
        else:
            return jsonify({'error': 'Invalid request format'}), 400
    except Exception as e:
        return jsonify({'error': str(e), 'trace': traceback.format_exc()}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
