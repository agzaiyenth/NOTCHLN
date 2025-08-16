// lib/db.ts
import sql from "mssql/msnodesqlv8";

const config: sql.config = {
  server: process.env.DB_SERVER as string,   // e.g. "localhost\\SQLEXPRESS"
  database: process.env.DB_NAME as string,   // e.g. "AppointmentsDB"
  driver: "msnodesqlv8",
  options: {
    trustedConnection: true,  // Windows Authentication
  },
};

let pool: sql.ConnectionPool | null = null;

export async function getConnection() {
  if (!pool) {
    pool = await sql.connect(config);
  }
  return pool;
}
