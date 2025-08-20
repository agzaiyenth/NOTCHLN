# Test the model predictor directly
from model_predictor import ServiceCompletionTimePredictor
import os
import joblib

def test_model_predictor():
    """Test the model predictor directly without the API"""
    
    print("Testing the model predictor directly...")
    
    # Check if model exists
    MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
                          'Model', 'Tast1')
    model_file = os.path.join(MODEL_PATH, 'model.pkl')
    
    if not os.path.exists(model_file):
        print(f"Model file not found at {model_file}")
        print("Running export_model.py to create the model...")
        import export_model
        export_model.export_trained_model()
    
    # Initialize predictor
    predictor = ServiceCompletionTimePredictor()
    
    # Test cases
    test_cases = [
        {
            "date": "2025-08-29",
            "time": "10:30",
            "task_id": "PASSPORT_RENEWAL"
        },
        {
            "date": "2025-09-15",
            "time": "14:15",
            "task_id": "VISA_APPLICATION"
        },
        {
            "date": "2025-08-25",
            "time": "09:00",
            "task_id": "ID_CARD"
        }
    ]
    
    # Test each case
    for i, case in enumerate(test_cases, 1):
        try:
            prediction = predictor.predict_completion_time(
                case["date"], case["time"], case["task_id"]
            )
            print(f"\nTest {i}:")
            print(f"  Input: Date={case['date']}, Time={case['time']}, Task={case['task_id']}")
            print(f"  Predicted completion time: {prediction} minutes")
        except Exception as e:
            print(f"\nTest {i} failed: {e}")
    
    print("\nModel predictor testing complete!")

if __name__ == "__main__":
    test_model_predictor()
