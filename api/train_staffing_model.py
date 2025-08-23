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
MODEL_DIR = os.path.join(BASE_DIR, '../Model/Task2')
os.makedirs(MODEL_DIR, exist_ok=True)

# Load datasets
staff = pd.read_csv(os.path.join(DATA_DIR, 'staffing_train.csv'), parse_dates=['date'])
task = pd.read_csv(os.path.join(DATA_DIR, 'tasks.csv'))

# Merge section info if needed
# (section_id is already in staff)

# Feature engineering
staff['date'] = pd.to_datetime(staff['date'])
staff['month'] = staff['date'].dt.month
staff['weekday'] = staff['date'].dt.weekday
le_section = LabelEncoder()
staff['section_id_encoded'] = le_section.fit_transform(staff['section_id'])

features = [
    'month',
    'weekday',
    'section_id_encoded',
]
X = staff[features]
y = staff['employees_on_duty']
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)
model = XGBRegressor(n_estimators=100, max_depth=5, random_state=42)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)
mae = mean_absolute_error(y_test, y_pred)
with open(os.path.join(MODEL_DIR, 'model_metrics.txt'), 'w') as f:
    f.write(f"Test MAE: {mae:.2f} employees\n")
joblib.dump(model, os.path.join(MODEL_DIR, 'xgb_staffing_model.pkl'))
joblib.dump(scaler, os.path.join(MODEL_DIR, 'scaler.pkl'))
joblib.dump(le_section, os.path.join(MODEL_DIR, 'section_label_encoder.pkl'))
print(f"Staffing model and encoders saved to {MODEL_DIR}")
