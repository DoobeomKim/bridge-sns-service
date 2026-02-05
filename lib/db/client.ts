// Vercel Postgres Client (Neon)
import { sql } from '@vercel/postgres'

// Helper function for querying with pooled connection
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
