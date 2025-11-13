import { NextRequest, NextResponse } from 'next/server'
import { getAllPayments, getPaymentsByType, upsertPayments } from '@/lib/payments'
import { verifyPassword, getAdminPasswordHash } from '@/lib/auth'

// GET: Fetch payments data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'przedszkole' or 'szkola'

    if (type === 'przedszkole') {
      const data = await getPaymentsByType('przedszkole')
      return NextResponse.json(data)
    } else if (type === 'szkola') {
      const data = await getPaymentsByType('szkola')
      return NextResponse.json(data)
    } else {
      // Return both if no type specified
      const data = await getAllPayments()
      return NextResponse.json(data)
    }
  } catch (error) {
    console.error('Error reading payments data:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to read payments data'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// PUT: Update payments data (password protected)
export async function PUT(request: NextRequest) {
  try {
    const { password, type, data } = await request.json()

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 401 })
    }

    // Verify password
    const hashedPassword = getAdminPasswordHash()
    const isValidPassword = await verifyPassword(password, hashedPassword)

    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    if (!type || !data) {
      return NextResponse.json({ error: 'Type and data are required' }, { status: 400 })
    }

    if (type !== 'przedszkole' && type !== 'szkola') {
      return NextResponse.json({ error: 'Type must be przedszkole or szkola' }, { status: 400 })
    }

    // Validate data structure
    if (!Array.isArray(data)) {
      return NextResponse.json({ error: 'Data must be an array' }, { status: 400 })
    }

    // Validate each entry
    for (const entry of data) {
      if (!entry.class || typeof entry.max !== 'number' || typeof entry.wplacone !== 'number') {
        return NextResponse.json({ 
          error: 'Each entry must have class (string), max (number), and wplacone (number)' 
        }, { status: 400 })
      }
    }

    // Upsert to Supabase
    await upsertPayments(data, type)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating payments data:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to update payments data'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

