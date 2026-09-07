import mysql from 'mysql2/promise';

/**
 * Shared MySQL connection pool.
 * Credentials come from environment variables (see .env.example).
 */
export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  // Remote Hostinger MySQL requires TLS unless disabled explicitly.
  ssl: process.env.DB_SSL === 'false' ? undefined : { rejectUnauthorized: false },
  charset: 'utf8mb4_general_ci',
});

export async function query<T = mysql.RowDataPacket>(
  sql: string,
  params: unknown[] = []
): Promise<T[]> {
  const [rows] = await pool.query<T[]>(sql, params);
  return rows;
}
