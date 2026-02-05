// Vercel Postgres Client for Direct Connections
import { createClient } from '@vercel/postgres'

// Helper function for querying with direct connection
export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<T[]> {
  const client = createClient({
    connectionString: process.env.POSTGRES_URL,
  })
  await client.connect()
  try {
    const result = await client.query(text, params)
    return result.rows as T[]
  } finally {
    await client.end()
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
