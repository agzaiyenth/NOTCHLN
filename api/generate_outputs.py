import pandas as pd
import joblib
import os

# --- Service Completion Time Prediction ---
service_test_file = os.path.join('datasets', 'task1_test_inputs.csv')
service_tasks_file = os.path.join('datasets', 'tasks.csv')
service_model_dir = os.path.join('..', 'Model', 'Tast1')
service_output_file = 'task1_output.csv'

service_test_df = pd.read_csv(service_test_file)
service_tasks_df = pd.read_csv(service_tasks_file)
service_model = joblib.load(os.path.join(service_model_dir, 'xgb_service_completion_model.pkl'))
service_scaler = joblib.load(os.path.join(service_model_dir, 'scaler.pkl'))
service_le_task = joblib.load(os.path.join(service_model_dir, 'task_label_encoder.pkl'))
service_le_section = joblib.load(os.path.join(service_model_dir, 'section_label_encoder.pkl'))

feature_names = ['appointment_hour', 'appointment_weekday', 'month', 'task_id_encoded', 'section_id_encoded', 'staff_load_ratio', 'employees_on_duty']

service_outputs = []
for i, row in enumerate(service_test_df.iterrows()):
    _, row = row
    task_id = row['task_id']
    date = row['date']
    time_str = row['time']
    row_id = row['row_id']
    section_row = service_tasks_df[service_tasks_df['task_id'] == task_id]
    try:
        if section_row.empty:
            if i < 10:
                print(f"Row {row_id}: No section_id found for task_id {task_id}")
            pred = None
        else:
            section_id = section_row.iloc[0]['section_id']
            date_dt = pd.to_datetime(date, errors='coerce')
            if pd.isnull(date_dt):
                if i < 10:
                    print(f"Row {row_id}: Invalid date format: {date}")
                pred = None
            else:
                hour = int(time_str.split(':')[0])
                weekday = date_dt.weekday()
                month = date_dt.month
                # Check if task_id and section_id are in encoder classes
                if task_id not in service_le_task.classes_:
                    if i < 10:
                        print(f"Row {row_id}: task_id {task_id} not in label encoder classes")
                    pred = None
                elif section_id not in service_le_section.classes_:
                    if i < 10:
                        print(f"Row {row_id}: section_id {section_id} not in label encoder classes")
                    pred = None
                else:
                    task_id_encoded = service_le_task.transform([task_id])[0]
                    section_id_encoded = service_le_section.transform([section_id])[0]
                    staff_load_ratio = 1.0
                    employees_on_duty = 1.0
                    X_df = pd.DataFrame([[hour, weekday, month, task_id_encoded, section_id_encoded, staff_load_ratio, employees_on_duty]],
                        columns=['appointment_hour', 'appointment_weekday', 'month', 'task_id_encoded', 'section_id_encoded', 'staff_load_ratio', 'employees_on_duty'])
                    if i < 10:
                        print(f"Row {row_id} features: {X_df.values}")
                        X_scaled = service_scaler.transform(X_df)
                        print(f"Row {row_id} scaled features: {X_scaled}")
                    else:
                        X_scaled = service_scaler.transform(X_df)
                    pred = service_model.predict(X_scaled)[0]
        service_outputs.append({'row_id': row_id, 'true_processing_time_minutes': max(1, round(pred)) if pred is not None else 'ERROR'})
    except Exception as e:
        if i < 10:
            print(f"Error in row {row_id}: {e}")
        service_outputs.append({'row_id': row_id, 'true_processing_time_minutes': 'ERROR'})

pd.DataFrame(service_outputs).to_csv(service_output_file, index=False)

# --- Staffing Prediction ---
staffing_test_file = os.path.join('datasets', 'task2_test_inputs.csv')
staffing_model_dir = os.path.join('..', 'Model', 'Task2')
staffing_output_file = 'task2_output.csv'

staffing_test_df = pd.read_csv(staffing_test_file)
staffing_model = joblib.load(os.path.join(staffing_model_dir, 'xgb_staffing_model.pkl'))
staffing_scaler = joblib.load(os.path.join(staffing_model_dir, 'scaler.pkl'))
staffing_le_section = joblib.load(os.path.join(staffing_model_dir, 'section_label_encoder.pkl'))

staffing_outputs = []
for i, row in enumerate(staffing_test_df.iterrows()):
    _, row = row
    section_id = row['section_id'].upper()
    date = row['date']
    row_id = row['row_id']
    date_dt = pd.to_datetime(date)
    month = date_dt.month
    weekday = date_dt.weekday()
    try:
        section_id_encoded = staffing_le_section.transform([section_id])[0]
        X = [[month, weekday, section_id_encoded]]
        if i < 10:
            print(f"Staffing row {row_id} features: {X}")
            X_scaled = staffing_scaler.transform(X)
            print(f"Staffing row {row_id} scaled features: {X_scaled}")
        else:
            X_scaled = staffing_scaler.transform(X)
        pred = staffing_model.predict(X_scaled)[0]
        staffing_outputs.append({'row_id': row_id, 'true_required_employees': max(1, round(pred))})
    except Exception as e:
        if i < 10:
            print(f"Error in staffing row {row_id}: {e}")
        staffing_outputs.append({'row_id': row_id, 'true_required_employees': 'ERROR'})

pd.DataFrame(staffing_outputs).to_csv(staffing_output_file, index=False)

print('Output files generated for all rows: task1_output.csv, task2_output.csv')
