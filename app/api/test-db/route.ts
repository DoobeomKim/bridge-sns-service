// Test API to check database connection
import { NextResponse } from 'next/server'
import { createClient } from '@vercel/postgres'

export async function GET() {
  try {
    // Check if POSTGRES_URL exists
    if (!process.env.POSTGRES_URL) {
      return NextResponse.json({
        error: 'POSTGRES_URL not found in environment',
        env: Object.keys(process.env).filter(k => k.includes('POSTGRES'))
      }, { status: 500 })
    }

    // Try to connect
    const client = createClient({
      connectionString: process.env.POSTGRES_URL,
    })

    await client.connect()

    // Try a simple query
    const result = await client.query('SELECT COUNT(*) as count FROM users')

    await client.end()

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      userCount: result.rows[0].count,
      postgresUrl: process.env.POSTGRES_URL?.substring(0, 30) + '...'
    })
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack,
      code: error.code,
      name: error.name,
      postgresUrl: process.env.POSTGRES_URL ? 'exists' : 'missing'
    }, { status: 500 })
  }
}
