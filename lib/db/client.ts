// Vercel Postgres Client
import { createPool } from '@vercel/postgres'

// Create a pool for direct connections
const pool = createPool({
  connectionString: process.env.POSTGRES_URL,
})

// Helper function for querying
export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<T[]> {
  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result.rows as T[]
  } finally {
    client.release()
  }
}

// Helper for single row
export async function queryOne<T = any>(
  text: string,
  params?: any[]
): Promise<T | null> {
  const rows = await query<T>(text, params)
  return rows[0] || null
}
