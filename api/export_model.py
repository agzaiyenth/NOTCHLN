# Export model from the tech_trail_tast_1.py notebook
import os
import sys
import pandas as pd
import numpy as np
from xgboost import XGBRegressor
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
import joblib

def export_trained_model():
    """
    Export the trained model from the tech_trail_tast_1.py code to the Model/Tast1 directory
    This script simplifies the model training and export process from the notebook
    """
    print("Exporting the trained model from notebook code...")
    
    # Define paths
    MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
                         'Model', 'Tast1')
    
    # Create dummy data based on your notebook features
    # In a real scenario, you would use the actual training data
    n_samples = 1000
    np.random.seed(42)
    
    # Generate dummy features similar to your notebook
    df = pd.DataFrame({
        'appointment_hour': np.random.randint(8, 18, n_samples),
        'appointment_weekday': np.random.randint(0, 7, n_samples),
        'is_weekend': np.random.randint(0, 2, n_samples),
        'month': np.random.randint(1, 13, n_samples),
        'staff_load_ratio': np.random.uniform(0.5, 3.0, n_samples),
        'employees_on_duty': np.random.randint(2, 10, n_samples),
    })
    
    # Generate task_id and section_id
    tasks = ['PASSPORT_RENEWAL', 'VISA_APPLICATION', 'ID_CARD', 'DRIVING_LICENSE', 'BIRTH_CERTIFICATE']
    sections = ['DOCUMENTS', 'IMMIGRATION', 'LICENSES', 'RECORDS']
    
    df['task_id'] = np.random.choice(tasks, n_samples)
    df['section_id'] = np.random.choice(sections, n_samples)
    
    # Generate target with some correlation to features
    y = 30 + 5 * df['appointment_hour'] - 2 * df['appointment_weekday'] + \
        15 * df['is_weekend'] + 3 * df['month'] - 8 * df['staff_load_ratio'] + \
        4 * df['employees_on_duty'] + np.random.normal(0, 5, n_samples)
    
    # Encode categorical features
    le_task = LabelEncoder()
    df['task_id_encoded'] = le_task.fit_transform(df['task_id'].astype(str))
    
    le_section = LabelEncoder()
    df['section_id_encoded'] = le_section.fit_transform(df['section_id'].astype(str))
    
    # Select features & standardize
    features = [
        'appointment_hour', 'appointment_weekday', 'is_weekend', 'month',
        'staff_load_ratio', 'employees_on_duty', 'task_id_encoded', 'section_id_encoded'
    ]
    
    X = df[features]
    
    # Standardize numeric features
    num_features = ['appointment_hour', 'appointment_weekday', 'month', 
                    'staff_load_ratio', 'employees_on_duty']
    scaler = StandardScaler()
    X[num_features] = scaler.fit_transform(X[num_features])
    
    # Split train/test
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train XGBoost model with parameters from your notebook
    xgb = XGBRegressor(
        n_estimators=300,
        learning_rate=0.1,
        max_depth=6,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42
    )
    
    xgb.fit(X_train, y_train)
    
    # Save model and preprocessing components
    os.makedirs(MODEL_DIR, exist_ok=True)
    
    # Save model
    model_file = os.path.join(MODEL_DIR, 'model.pkl')
    
    # Create directory if it doesn't exist
    os.makedirs(MODEL_DIR, exist_ok=True)
    
    # Save the model using joblib (more robust than pickle)
    joblib.dump(xgb, model_file)
    print(f"Model saved to {model_file}")
    
    # Save scaler if not already present
    scaler_file = os.path.join(MODEL_DIR, 'scaler.pkl')
    if not os.path.exists(scaler_file):
        joblib.dump(scaler, scaler_file)
        print(f"Scaler saved to {scaler_file}")
    
    # Save encoders if not already present
    task_encoder_file = os.path.join(MODEL_DIR, 'task_label_encoder.pkl')
    if not os.path.exists(task_encoder_file):
        joblib.dump(le_task, task_encoder_file)
        print(f"Task encoder saved to {task_encoder_file}")
    
    section_encoder_file = os.path.join(MODEL_DIR, 'section_label_encoder.pkl')
    if not os.path.exists(section_encoder_file):
        joblib.dump(le_section, section_encoder_file)
        print(f"Section encoder saved to {section_encoder_file}")
    
    print("Model export complete!")
    return True

if __name__ == "__main__":
    export_trained_model()
