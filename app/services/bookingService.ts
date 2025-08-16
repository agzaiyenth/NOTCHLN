import { getConnection } from "@/lib/db";

export async function createBooking(data: {
  userId: string;
  serviceName: string;
  date: string;
  time: string;
  officer: string;
  location: string;
}) {
  const pool = await getConnection();

  const result = await pool
    .request()
    .input("UserId", data.userId)
    .input("ServiceName", data.serviceName)
    .input("Date", data.date)
    .input("Time", data.time)
    .input("Officer", data.officer)
    .input("Location", data.location)
    .query(`
      INSERT INTO Bookings (UserId, ServiceName, Date, Time, Officer, Location)
      OUTPUT INSERTED.*
      VALUES (@UserId, @ServiceName, @Date, @Time, @Officer, @Location)
    `);

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
