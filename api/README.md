# Service Completion Time Prediction API

This API predicts the processing time for a booked service before the citizen arrives at the office. It uses a machine learning model trained on historical data.

## Setup and Installation

### Prerequisites

- Python 3.8+ installed
- pip package manager

### Installation

#### Windows

1. Navigate to the API directory
2. Run the setup script:
   ```
   run_api.bat
   ```

#### Linux/Mac

1. Navigate to the API directory
2. Make the script executable:
   ```bash
   chmod +x run_api.sh
   ```
3. Run the setup script:
   ```bash
   ./run_api.sh
   ```

## API Endpoints

### Predict Service Completion Time

- **Endpoint**: `/predict`
- **Method**: POST
- **Content Type**: application/json

#### Request Body

```json
{
  "date": "2025-08-29",
  "time": "14:30",
  "task_id": "PASSPORT_RENEWAL"
}
```

#### Parameters

1. `date` (string, format: YYYY-MM-DD) — Appointment date
2. `time` (string, format: HH:MM, 24h local office time) — Appointment start time
3. `task_id` (string) — Task ID from the Tasks Dataset

#### Response

```json
{
  "expected_completion_time_minutes": 75
}
```

### Health Check

- **Endpoint**: `/health`
- **Method**: GET

#### Response

```json
{
  "status": "healthy"
}
```

## Testing the API

You can use the included `test_api.py` script to test the API:

```bash
python test_api.py
```

## Integration with Frontend

To integrate this API with your frontend, you can make HTTP requests to the prediction endpoint. Here's an example using JavaScript fetch:

```javascript
async function predictCompletionTime(date, time, taskId) {
  try {
    const response = await fetch("http://localhost:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: date,
        time: time,
        task_id: taskId,
      }),
    });

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const data = await response.json();
    return data.expected_completion_time_minutes;
  } catch (error) {
    console.error("Error predicting completion time:", error);
    return null;
  }
}
```

## Next.js Integration Example

Since your project is using Next.js, here's how you can integrate this API in your services:

1. Add this function to your `lib/utils.ts` file:

```typescript
export async function predictServiceTime(
  date: string,
  time: string,
  taskId: string
): Promise<number | null> {
  try {
    const response = await fetch("http://localhost:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date,
        time,
        task_id: taskId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Prediction API error:", errorData);
      return null;
    }

    const data = await response.json();
    return data.expected_completion_time_minutes;
  } catch (error) {
    console.error("Error predicting completion time:", error);
    return null;
  }
}
```

2. You can then use this function in your components or page files.
