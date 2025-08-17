import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db"; // your db.ts file

export async function GET() {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT GETDATE() AS CurrentTime");

    return NextResponse.json({
      success: true,
      message: "✅ Database connection successful!",
      serverTime: result.recordset[0].CurrentTime,
    });
  } catch (err: any) {
    console.error("DB Connection Error:", err);
    return NextResponse.json({
      success: false,
      message: "❌ Database connection failed",
      error: err.message,
    }, { status: 500 });
  }
}
