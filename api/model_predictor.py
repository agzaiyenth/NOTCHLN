import pandas as pd
import os
from datetime import datetime
import random

class ServiceCompletionTimePredictor:
    # Define the numeric features list as a class attribute
    num_features = ['appointment_hour', 'appointment_weekday', 'month', 
                   'staff_load_ratio', 'employees_on_duty']
                   
    def __init__(self):
        """Initialize the predictor with fallback logic since model loading has issues"""
        # Initialize default attributes
        self.model = None
        self.scaler = None
        self.le_task = None
        self.le_section = None
        
        # Set up task mappings for fallback prediction
        self.task_times = {
            "PASSPORT_RENEWAL": 60,
            "VISA_APPLICATION": 75,
            "ID_CARD": 30,
            "DRIVING_LICENSE": 45,
            "BIRTH_CERTIFICATE": 35,
            "MARRIAGE_CERTIFICATE": 40,
            "POLICE_CLEARANCE": 50,
            "TAX_FILING": 65,
            "BUSINESS_REGISTRATION": 80,
            "PROPERTY_TRANSFER": 90
        }
        
        print("Predictor initialized with fallback logic")
                   
    def predict_completion_time(self, date, time_str, task_id):
        """
        Predicts service completion time in minutes using fallback logic.
        Inputs: 
            date (YYYY-MM-DD)
            time (HH:MM)
            task_id (string)
        """
        try:
            # Convert date to datetime
            date = pd.to_datetime(date)
            
            # Extract features
            hour = int(time_str.split(':')[0])
            minute = int(time_str.split(':')[1])
            weekday = date.weekday()
            is_weekend = 1 if weekday >= 5 else 0
            month = date.month
            
            # Fallback prediction logic - rule-based estimation
            # Start with base time for the task or default to 45 minutes
            task_id_upper = task_id.upper()
            
            # Find the matching task or closest match
            matching_task = None
            for known_task in self.task_times:
                if known_task.upper() in task_id_upper or task_id_upper in known_task.upper():
                    matching_task = known_task
                    break
            
            # Use the matching task time or default
            if matching_task:
                base_time = self.task_times[matching_task]
            else:
                # No match found, use default
                base_time = 45  # Default base time in minutes
            
            # Add slight randomness (±10%)
            variation = random.uniform(-0.1, 0.1) * base_time
            base_time += variation
            
            # Adjust based on time of day
            if hour < 10:  # Early morning
                base_time -= 5
            elif hour >= 12 and hour < 14:  # Lunch hour
                base_time += 10
            elif hour >= 16:  # Late afternoon
                base_time += 5
                
            # Adjust based on weekday
            if weekday >= 5:  # Weekend
                base_time += 15
            elif weekday == 0:  # Monday
                base_time += 8  # Busier on Mondays
            elif weekday == 4:  # Friday
                base_time += 5  # Busier on Fridays
                
            # Adjust for month (busier during summer months)
            if month >= 6 and month <= 8:
                base_time += 7
                
            return round(base_time)
                
        except Exception as e:
            print(f"Error during prediction: {e}")
            # Return a reasonable default if all else fails
            return 60
    
if __name__ == "__main__":
    # Test the predictor
    predictor = ServiceCompletionTimePredictor()
    
    # Example predictions
    test_cases = [
        {"date": "2025-08-29", "time": "10:30", "task_id": "PASSPORT_RENEWAL"},
        {"date": "2025-09-15", "time": "14:15", "task_id": "VISA_APPLICATION"},
        {"date": "2025-08-25", "time": "09:00", "task_id": "ID_CARD"}
    ]
    
    for case in test_cases:
        try:
            prediction = predictor.predict_completion_time(case["date"], case["time"], case["task_id"])
            print(f"\nPredicted completion time for {case['task_id']} on {case['date']} at {case['time']}: {prediction} minutes")
        except Exception as e:
            print(f"Prediction failed: {e}")
