// Vercel Postgres Client
import { sql } from '@vercel/postgres'

export { sql }

// Helper function for querying
export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<T[]> {
  const result = await sql.query(text, params)
  return result.rows as T[]
}

// Helper for single row
export async function queryOne<T = any>(
  text: string,
  params?: any[]
): Promise<T | null> {
  const rows = await query<T>(text, params)
  return rows[0] || null
}
