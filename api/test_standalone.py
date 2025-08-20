"""
Simple standalone test for model_predictor.py
This script tests the prediction functionality without requiring Flask or any web server.
"""

from model_predictor import ServiceCompletionTimePredictor

def test_predictor():
    """Test the model predictor standalone"""
    print("Testing the model predictor...")
    
    # Initialize predictor
    predictor = ServiceCompletionTimePredictor()
    
    # Test cases
    test_cases = [
        {"date": "2025-08-29", "time": "10:30", "task_id": "PASSPORT_RENEWAL"},
        {"date": "2025-09-15", "time": "14:15", "task_id": "VISA_APPLICATION"},
        {"date": "2025-08-25", "time": "09:00", "task_id": "ID_CARD"}
    ]
    
    # Run tests
    for i, case in enumerate(test_cases, 1):
        try:
            print(f"\nTest Case {i}:")
            print(f"Input: Date={case['date']}, Time={case['time']}, Task={case['task_id']}")
            
            # Make prediction
            prediction = predictor.predict_completion_time(
                case["date"], case["time"], case["task_id"]
            )
            
            print(f"Predicted completion time: {prediction} minutes")
            
        except Exception as e:
            print(f"Error in test case {i}: {e}")
    
    print("\nTesting complete!")

if __name__ == "__main__":
    test_predictor()
