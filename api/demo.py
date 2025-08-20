"""
End-to-end demonstration of the service completion time prediction system.
This script:
1. Tests the standalone predictor
2. Starts the API server in the background
3. Tests the API with HTTP requests
4. Shows how to integrate with the frontend
"""

import subprocess
import time
import requests
import sys
import os
import webbrowser

def print_header(text):
    """Print a formatted header"""
    print("\n" + "=" * 80)
    print(f" {text} ".center(80, "="))
    print("=" * 80 + "\n")

def run_standalone_test():
    """Run the standalone model test"""
    print_header("Testing Standalone Model Predictor")
    try:
        from model_predictor import ServiceCompletionTimePredictor
        
        predictor = ServiceCompletionTimePredictor()
        
        # Test cases
        test_cases = [
            {"date": "2025-08-29", "time": "10:30", "task_id": "PASSPORT_RENEWAL"},
            {"date": "2025-09-15", "time": "14:15", "task_id": "VISA_APPLICATION"},
            {"date": "2025-08-25", "time": "09:00", "task_id": "ID_CARD"}
        ]
        
        for case in test_cases:
            prediction = predictor.predict_completion_time(
                case["date"], case["time"], case["task_id"]
            )
            print(f"Task: {case['task_id']}, Date: {case['date']}, Time: {case['time']}")
            print(f"Predicted completion time: {prediction} minutes\n")
            
        print("✅ Standalone test completed successfully")
        return True
    except Exception as e:
        print(f"❌ Standalone test failed: {e}")
        return False

def start_api_server():
    """Start the Flask API server in the background"""
    print_header("Starting API Server")
    try:
        # Create a detached process
        if os.name == 'nt':  # Windows
            process = subprocess.Popen(
                ["start", "cmd", "/c", "python", "-m", "flask", "--app", "app", "run", "--host=0.0.0.0", "--port=5000"],
                shell=True
            )
        else:  # Linux/Mac
            process = subprocess.Popen(
                ["python", "-m", "flask", "--app", "app", "run", "--host=0.0.0.0", "--port=5000"],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                preexec_fn=os.setpgrp
            )
        
        print("API server starting...")
        print("Waiting for server to initialize...")
        time.sleep(3)  # Give the server time to start
        
        # Check if server is running
        try:
            response = requests.get("http://localhost:5000/health")
            if response.status_code == 200:
                print("✅ API server started successfully")
                return True
            else:
                print(f"❌ API server health check failed: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Could not connect to API server: {e}")
            return False
            
    except Exception as e:
        print(f"❌ Failed to start API server: {e}")
        return False

def test_api():
    """Test the API with HTTP requests"""
    print_header("Testing API Endpoints")
    
    # Health check
    try:
        response = requests.get("http://localhost:5000/health")
        print(f"Health check: {response.json()}")
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False
        
    # Test predictions
    test_cases = [
        {"date": "2025-08-29", "time": "10:30", "task_id": "PASSPORT_RENEWAL"},
        {"date": "2025-09-15", "time": "14:15", "task_id": "VISA_APPLICATION"},
        {"date": "2025-08-25", "time": "09:00", "task_id": "ID_CARD"}
    ]
    
    success = True
    for case in test_cases:
        try:
            response = requests.post(
                "http://localhost:5000/predict",
                json=case
            )
            
            if response.status_code == 200:
                result = response.json()
                print(f"Task: {case['task_id']}, Date: {case['date']}, Time: {case['time']}")
                print(f"Predicted completion time: {result['expected_completion_time_minutes']} minutes\n")
            else:
                print(f"❌ API request failed: {response.status_code}")
                print(f"Response: {response.text}")
                success = False
                
        except Exception as e:
            print(f"❌ API request error: {e}")
            success = False
            
    if success:
        print("✅ API tests completed successfully")
    return success

def show_frontend_integration():
    """Show how to integrate with the frontend"""
    print_header("Frontend Integration Example")
    
    print("""
To integrate with the frontend, use the prediction-service.ts file:

```typescript
// Example usage in a Next.js component
import { predictServiceCompletionTime } from '../lib/prediction-service';

// Inside your component function
const handleBooking = async () => {
  const date = "2025-08-29";
  const time = "10:30";
  const taskId = "PASSPORT_RENEWAL";
  
  const completionTime = await predictServiceCompletionTime(date, time, taskId);
  
  console.log(`Expected completion time: ${completionTime} minutes`);
};
```
    """)

def open_documentation():
    """Open documentation files in browser if available"""
    try:
        # Create a simple HTML file with links to documentation
        html_content = """
        <!DOCTYPE html>
        <html>
        <head>
            <title>Service Completion Time Prediction System</title>
            <style>
                body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
                h1 { color: #333; }
                .card { border: 1px solid #ddd; padding: 20px; margin-bottom: 20px; border-radius: 5px; }
                .success { color: green; }
                pre { background: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto; }
            </style>
        </head>
        <body>
            <h1>Service Completion Time Prediction System</h1>
            
            <div class="card">
                <h2>System Architecture</h2>
                <p>The system consists of a Flask API backend and a Next.js frontend.</p>
                <p>See <a href="ARCHITECTURE.md">ARCHITECTURE.md</a> for detailed documentation.</p>
            </div>
            
            <div class="card">
                <h2>API Documentation</h2>
                <h3>Predict Service Completion Time</h3>
                <pre>
POST /predict
{
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "task_id": "TASK_NAME"
}

Response:
{
  "expected_completion_time_minutes": 45
}
                </pre>
            </div>
            
            <div class="card">
                <h2>Frontend Integration</h2>
                <pre>
// Example usage in a Next.js component
import { predictServiceCompletionTime } from '../lib/prediction-service';

// Inside your component function
const handleBooking = async () => {
  const date = "2025-08-29";
  const time = "10:30";
  const taskId = "PASSPORT_RENEWAL";
  
  const completionTime = await predictServiceCompletionTime(date, time, taskId);
  
  console.log(`Expected completion time: ${completionTime} minutes`);
};
                </pre>
            </div>
            
            <p class="success">✅ Demo completed successfully!</p>
        </body>
        </html>
        """
        
        # Write the HTML file
        with open("demo.html", "w") as f:
            f.write(html_content)
            
        # Open in browser
        webbrowser.open("file://" + os.path.abspath("demo.html"))
        
    except Exception as e:
        print(f"Could not open documentation: {e}")

def main():
    """Run the end-to-end demonstration"""
    print_header("Service Completion Time Prediction System Demo")
    
    # Run standalone test
    if not run_standalone_test():
        print("Standalone test failed. Fix errors before continuing.")
        if input("Continue anyway? (y/n): ").lower() != 'y':
            return
    
    # Start API server
    if not start_api_server():
        print("Failed to start API server. Fix errors before continuing.")
        if input("Continue anyway? (y/n): ").lower() != 'y':
            return
            
    # Give the server time to fully initialize
    time.sleep(2)
    
    # Test API
    if not test_api():
        print("API test failed. Fix errors before continuing.")
        if input("Continue anyway? (y/n): ").lower() != 'y':
            return
            
    # Show frontend integration
    show_frontend_integration()
    
    # Open documentation
    if input("Open documentation in browser? (y/n): ").lower() == 'y':
        open_documentation()
    
    print_header("Demonstration Complete")
    print("✅ The service completion time prediction system is working correctly.")
    print("Use 'run_api.bat' to start the API server for production use.")
    
    input("Press Enter to exit...")

if __name__ == "__main__":
    main()
