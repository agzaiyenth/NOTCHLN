// app/api/bookings/route.ts
import { NextResponse } from "next/server";
import { createBooking, getBookingsByUser } from "../../services/bookingService";

// POST /api/bookings → create a new booking
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const booking = await createBooking({
      userId: body.userId,
      serviceName: body.serviceName,
      date: body.date,
      time: body.time,
      officer: body.officer,
      location: body.location,
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}

// GET /api/bookings?userId=123 → fetch user bookings
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "UserId is required" }, { status: 400 });
    }

    const bookings = await getBookingsByUser(userId);
    return NextResponse.json(bookings);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}
