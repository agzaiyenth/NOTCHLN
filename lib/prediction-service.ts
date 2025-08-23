// Services for interacting with the completion time prediction API

/**
 * Predicts the service completion time for a booking
 * @param date Appointment date in YYYY-MM-DD format
 * @param time Appointment time in HH:MM format (24h)
 * @param taskId Task ID from the Tasks Dataset
 * @returns Promise resolving to the predicted completion time in minutes
 */
export async function predictServiceCompletionTime(
  date: string,
  time: string,
  taskId: string
): Promise<number> {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_PREDICTION_API_URL || "http://localhost:5000";

    const response = await fetch(`${apiUrl}/predict`, {
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
      // Use fallback prediction instead of returning null
      return getFallbackPrediction(taskId);
    }

    const data = await response.json();
    return data.expected_completion_time_minutes;
  } catch (error) {
    console.error("Error predicting service completion time:", error);
    // Use fallback prediction instead of returning null
    return getFallbackPrediction(taskId);
  }
}

/**
 * Provides a fallback prediction based on task type
 * This matches the fallback logic in the backend
 * @param taskId The task identifier
 * @returns A reasonable prediction in minutes
 */
function getFallbackPrediction(taskId: string): number {
  const taskIdUpper = taskId.toUpperCase();
  const fallbackTimes: Record<string, number> = {
    PASSPORT_RENEWAL: 60,
    VISA_APPLICATION: 75,
    ID_CARD: 30,
    DRIVING_LICENSE: 45,
    BIRTH_CERTIFICATE: 35,
    MARRIAGE_CERTIFICATE: 40,
    POLICE_CLEARANCE: 50,
    TAX_FILING: 65,
    BUSINESS_REGISTRATION: 80,
    PROPERTY_TRANSFER: 90,
  };

  // Find a matching task or similar one
  for (const [key, value] of Object.entries(fallbackTimes)) {
    if (key.includes(taskIdUpper) || taskIdUpper.includes(key)) {
      return value;
    }
  }

  // Default fallback
  return 45;
}

/**
 * Checks if the prediction API is available
 * @returns Promise resolving to a boolean indicating if the API is healthy
 */
export async function isPredictionApiHealthy(): Promise<boolean> {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_PREDICTION_API_URL || "http://localhost:5000";

    const response = await fetch(`${apiUrl}/health`, {
      method: "GET",
    });

    return response.ok;
  } catch (error) {
    console.error("Error checking prediction API health:", error);
    return false;
  }
}
