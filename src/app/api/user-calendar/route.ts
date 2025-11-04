import { NextRequest, NextResponse } from 'next/server'
import { getUserCalendarEvents, saveUserCalendarEvent, deleteUserCalendarEvent } from '@/lib/user-calendar'
import { verifyPassword, getAdminPasswordHash } from '@/lib/auth'

// GET: Fetch all user calendar events
export async function GET() {
  try {
    const events = await getUserCalendarEvents()
    return NextResponse.json(events)
  } catch (error) {
    console.error('Error fetching user calendar events:', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

// POST: Create a new user calendar event (password protected)
export async function POST(request: NextRequest) {
  try {
    const { password, ...eventData } = await request.json()
    
    // Verify password
    const hashedPassword = getAdminPasswordHash()
    const isValidPassword = await verifyPassword(password, hashedPassword)
    
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }
    
    // Validate event data
    if (!eventData.title || !eventData.start) {
      return NextResponse.json({ error: 'Title and start date are required' }, { status: 400 })
    }
    
    // If no end date provided, use start date
    if (!eventData.end) {
      eventData.end = eventData.start
    }
    
    const event = await saveUserCalendarEvent(eventData)
    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Error creating user calendar event:', error)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}

// DELETE: Delete a user calendar event (password protected)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const password = searchParams.get('password')
    
    if (!id || !password) {
      return NextResponse.json({ error: 'ID and password are required' }, { status: 400 })
    }
    
    // Verify password
    const hashedPassword = getAdminPasswordHash()
    const isValidPassword = await verifyPassword(password, hashedPassword)
    
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }
    
    const deleted = await deleteUserCalendarEvent(id)
    
    if (!deleted) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting user calendar event:', error)
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 })
  }
}

