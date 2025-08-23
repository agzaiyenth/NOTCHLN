import pandas as pd
import os
from datetime import datetime
import random

# Seed the random number generator for deterministic predictions
random.seed(42)

class ServiceCompletionTimePredictor:
    def __init__(self, model_dir=None, datasets_dir=None):
        """
        Loads the trained model, scaler, encoders, and required datasets from disk.
        """
        import joblib
        if model_dir is None:
            model_dir = os.path.join(os.path.dirname(__file__), '../Model/Tast1')
        if datasets_dir is None:
            datasets_dir = os.path.join(os.path.dirname(__file__), 'datasets')
        self.model_dir = model_dir
        self.datasets_dir = datasets_dir
        self.model = joblib.load(os.path.join(model_dir, 'xgb_service_completion_model.pkl'))
        self.scaler = joblib.load(os.path.join(model_dir, 'scaler.pkl'))
        self.le_task = joblib.load(os.path.join(model_dir, 'task_label_encoder.pkl'))
        self.le_section = joblib.load(os.path.join(model_dir, 'section_label_encoder.pkl'))
        self.num_features = ['appointment_hour','appointment_weekday','month','staff_load_ratio','employees_on_duty']
        # Load datasets
        self.task_df = pd.read_csv(os.path.join(datasets_dir, 'tasks.csv'))
        # Build a mapping from task_name (upper, no spaces/underscores) to task_id
        self.task_name_to_id = {}
        if 'task_name' in self.task_df.columns:
            for _, row in self.task_df.iterrows():
                name = str(row['task_name']).strip().upper().replace(' ', '').replace('_', '')
                if name and name != 'NAN':
                    self.task_name_to_id[name] = row['task_id']
        self.staff_df = pd.read_csv(os.path.join(datasets_dir, 'staffing_train.csv'), parse_dates=['date'])
        print("ML Predictor initialized with trained model, encoders, and datasets.")

    def predict_completion_time(self, date, time_str, task_id, debug=False):
        """
        Predicts service completion time in minutes using the trained ML model and real features from datasets.
        Inputs: date (YYYY-MM-DD), time (HH:MM), task_id (string)
        Returns (prediction, debug_info) if debug=True, else just prediction.
        """
        debug_info = {}
        try:
            debug_info['inputs'] = {'date': date, 'time': time_str, 'task_id': task_id}
            # Convert date to datetime
            date_dt = pd.to_datetime(date)
            hour = int(time_str.split(':')[0])
            weekday = date_dt.weekday()
            is_weekend = 1 if weekday >= 5 else 0
            month = date_dt.month
            debug_info['parsed'] = {'hour': hour, 'weekday': weekday, 'is_weekend': is_weekend, 'month': month}

            # Map human-readable task_id to code if needed
            original_task_id = task_id
            mapped = False
            if task_id not in self.task_df['task_id'].values:
                lookup = str(task_id).strip().upper().replace(' ', '').replace('_', '')
                if lookup in self.task_name_to_id:
                    task_id = self.task_name_to_id[lookup]
                    mapped = True
            debug_info['final_task_id'] = task_id
            debug_info['task_id_mapped'] = mapped

            # Encode task_id
            try:
                task_id_encoded = self.le_task.transform([str(task_id)])[0]
            except Exception as e:
                debug_info['error'] = f"Task ID encoding failed: {e}"
                if debug:
                    return 60, debug_info
                return 60
            debug_info['task_id_encoded'] = int(task_id_encoded)

            # Section id from task_df
            section_id = 0
            row = self.task_df.loc[self.task_df['task_id'] == task_id]
            if not row.empty:
                section_id = row['section_id'].values[0]
            debug_info['section_id'] = section_id
            try:
                section_id_encoded = self.le_section.transform([str(section_id)])[0]
            except Exception as e:
                debug_info['error'] = f"Section ID encoding failed: {e}"
                if debug:
                    return 60, debug_info
                return 60
            debug_info['section_id_encoded'] = int(section_id_encoded)

            # Staff features from staff_df (match by date and section_id)
            staff_row = self.staff_df[(self.staff_df['date'] == date_dt) & (self.staff_df['section_id'] == section_id)]
            if not staff_row.empty:
                employees_on_duty = staff_row['employees_on_duty'].values[0]
                if 'num_documents' in staff_row.columns:
                    num_documents = staff_row['num_documents'].values[0]
                elif 'total_task_time_minutes' in staff_row.columns:
                    num_documents = staff_row['total_task_time_minutes'].values[0]
                else:
                    num_documents = 5
                staff_load_ratio = num_documents / (employees_on_duty + 1)
                debug_info['staff_row_found'] = True
            else:
                debug_info['error'] = f"No staff row found for date={date_dt.date()}, section_id={section_id}"
                employees_on_duty = 5
                staff_load_ratio = 1.0
                debug_info['staff_row_found'] = False
            debug_info['employees_on_duty'] = employees_on_duty
            debug_info['staff_load_ratio'] = staff_load_ratio

            features_dict = {
                'appointment_hour': hour,
                'appointment_weekday': weekday,
                'is_weekend': is_weekend,
                'month': month,
                'staff_load_ratio': staff_load_ratio,
                'employees_on_duty': employees_on_duty,
                'task_id_encoded': task_id_encoded,
                'section_id_encoded': section_id_encoded
            }
            debug_info['features'] = features_dict
            input_df = pd.DataFrame([features_dict])
            input_df[self.num_features] = self.scaler.transform(input_df[self.num_features])
            predicted_minutes = self.model.predict(input_df)[0]
            debug_info['model_output'] = float(predicted_minutes)
            if debug:
                return round(float(predicted_minutes), 2), debug_info
            return round(float(predicted_minutes), 2)
        except Exception as e:
            import traceback
            debug_info['error'] = str(e)
            debug_info['trace'] = traceback.format_exc()
            if debug:
                return 60, debug_info
            return 60
