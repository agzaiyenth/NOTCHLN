import { getConnection } from "@/lib/db";
import { predictServiceCompletionTime } from "@/lib/prediction-service";

export async function createBooking(data: {
  userId: string;
  serviceName: string;
  date: string;
  time: string;
  officer: string;
  location: string;
  taskId?: string; // Optional task ID for prediction
}) {
  const pool = await getConnection();

  // Predict completion time if taskId is provided
  let predictedCompletionTime: number | null = null;
  if (data.taskId) {
    try {
      predictedCompletionTime = await predictServiceCompletionTime(
        data.date,
        data.time,
        data.taskId
      );
    } catch (error) {
      console.error("Failed to predict completion time:", error);
    }
  }

  const query = `
    INSERT INTO Bookings (
      UserId, ServiceName, Date, Time, Officer, Location, PredictedCompletionTime
    )
    OUTPUT INSERTED.*
    VALUES (
      @UserId, @ServiceName, @Date, @Time, @Officer, @Location, @PredictedCompletionTime
    )
  `;

  const result = await pool
    .request()
    .input("UserId", data.userId)
    .input("ServiceName", data.serviceName)
    .input("Date", data.date)
    .input("Time", data.time)
    .input("Officer", data.officer)
    .input("Location", data.location)
    .input("PredictedCompletionTime", predictedCompletionTime)
    .query(query);

  return result.recordset[0];
}

export async function getBookingsByUser(userId: string) {
  const pool = await getConnection();

  const result = await pool
    .request()
    .input("UserId", userId)
    .query("SELECT * FROM Bookings WHERE UserId = @UserId ORDER BY Date, Time");

  return result.recordset;
}
