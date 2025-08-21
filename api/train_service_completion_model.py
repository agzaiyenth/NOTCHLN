import os
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler
from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
import joblib

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'datasets')
MODEL_DIR = os.path.join(BASE_DIR, '../Model/Tast1')
os.makedirs(MODEL_DIR, exist_ok=True)

# Load datasets
booking = pd.read_csv(os.path.join(DATA_DIR, 'bookings_train.csv'), parse_dates=['booking_date','appointment_date','check_in_time','check_out_time'])
task = pd.read_csv(os.path.join(DATA_DIR, 'tasks.csv'))
staff = pd.read_csv(os.path.join(DATA_DIR, 'staffing_train.csv'), parse_dates=['date'])

# Merge datasets
# Booking + Task
booking = booking.merge(task[['task_id','section_id']], on='task_id', how='left')
# Booking + Staff (via date and section_id)
df = booking.merge(staff, left_on=['appointment_date','section_id'], right_on=['date','section_id'], how='left')

# Compute target
df['completion_time_minutes'] = (df['check_out_time'] - df['check_in_time']).dt.total_seconds() / 60
df = df.dropna(subset=['completion_time_minutes'])
df = df[df['completion_time_minutes'] > 0]

# Feature engineering
df['appointment_hour'] = df['appointment_time'].str.split(':').str[0].astype(int)
df['appointment_weekday'] = df['appointment_date'].dt.weekday
df['month'] = df['appointment_date'].dt.month

# Encode categorical features
le_task = LabelEncoder()
df['task_id_encoded'] = le_task.fit_transform(df['task_id'])
le_section = LabelEncoder()
df['section_id_encoded'] = le_section.fit_transform(df['section_id'])

# Staff load ratio (total_task_time_minutes / employees_on_duty)
df['staff_load_ratio'] = df['total_task_time_minutes'] / df['employees_on_duty']
df['staff_load_ratio'] = df['staff_load_ratio'].fillna(df['staff_load_ratio'].mean())
df['employees_on_duty'] = df['employees_on_duty'].fillna(df['employees_on_duty'].mean())

# Features and target
features = [
    'appointment_hour',
    'appointment_weekday',
    'month',
    'task_id_encoded',
    'section_id_encoded',
    'staff_load_ratio',
    'employees_on_duty',
]
X = df[features]
y = df['completion_time_minutes']

# Scale features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# Train XGBoost regressor
model = XGBRegressor(n_estimators=100, max_depth=5, random_state=42)
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
mae = mean_absolute_error(y_test, y_pred)
print(f"Test MAE: {mae:.2f} minutes")

# Save model and encoders
joblib.dump(model, os.path.join(MODEL_DIR, 'xgb_service_completion_model.pkl'))
joblib.dump(scaler, os.path.join(MODEL_DIR, 'scaler.pkl'))
joblib.dump(le_task, os.path.join(MODEL_DIR, 'task_label_encoder.pkl'))
joblib.dump(le_section, os.path.join(MODEL_DIR, 'section_label_encoder.pkl'))
print(f"Model and encoders saved to {MODEL_DIR}")
