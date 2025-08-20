import requests
import json
from datetime import datetime, timedelta

def test_api(url="http://localhost:5000"):
    """Test the prediction API with various inputs"""
    
    # Health check
    try:
        response = requests.get(f"{url}/health")
        print(f"Health check: {response.json()}")
    except Exception as e:
        print(f"Error connecting to API: {e}")
        return
    
    # Test cases
    test_cases = [
        {
            "date": (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%d"),
            "time": "10:30",
            "task_id": "PASSPORT_RENEWAL"
        },
        {
            "date": (datetime.now() + timedelta(days=14)).strftime("%Y-%m-%d"),
            "time": "14:15",
            "task_id": "VISA_APPLICATION"
        },
        {
            "date": (datetime.now() + timedelta(days=3)).strftime("%Y-%m-%d"),
            "time": "09:00",
            "task_id": "ID_CARD_RENEWAL"
        }
    ]
    
    # Run tests
    for i, test_case in enumerate(test_cases, 1):
        try:
            print(f"\nTest Case {i}:")
            print(f"Input: {json.dumps(test_case, indent=2)}")
            
            response = requests.post(
                f"{url}/predict",
                json=test_case,
                headers={"Content-Type": "application/json"}
            )
            
            print(f"Status Code: {response.status_code}")
            print(f"Response: {json.dumps(response.json(), indent=2)}")
            
        except Exception as e:
            print(f"Error in test case {i}: {e}")
    
if __name__ == "__main__":
    test_api()
