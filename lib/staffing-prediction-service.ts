// Services for interacting with the staffing prediction API

/**
 * Predicts the required number of employees for a section on a given date
 * @param date Date in YYYY-MM-DD format
 * @param sectionId Section ID from the Tasks/Staffing Dataset
 * @returns Promise resolving to the predicted employee count
 */
export async function predictStaffingNeeds(
  date: string,
  sectionId: string
): Promise<number> {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_PREDICTION_API_URL || "http://localhost:5000";

    const response = await fetch(`${apiUrl}/predict_staffing`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date,
        section_id: sectionId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Staffing Prediction API error:", errorData);
      return 3; // fallback
    }

    const data = await response.json();
    return data.predicted_employee_count;
  } catch (error) {
    console.error("Error predicting staffing needs:", error);
    return 3; // fallback
  }
}
