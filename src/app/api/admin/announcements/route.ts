import { NextRequest, NextResponse } from 'next/server'
import { loadAnnouncements, addAnnouncement } from '@/lib/announcements-db'

export async function GET() {
  try {
    const announcements = await loadAnnouncements()
    return NextResponse.json(announcements)
  } catch (error) {
    console.error('Error fetching announcements:', error)
    return NextResponse.json({ error: 'Failed to fetch announcements' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const announcement = await addAnnouncement(body)
    if (announcement) {
      return NextResponse.json(announcement)
    } else {
      return NextResponse.json({ error: 'Failed to create announcement' }, { status: 500 })
    }
  } catch (error) {
    console.error('Error creating announcement:', error)
    return NextResponse.json({ error: 'Failed to create announcement' }, { status: 500 })
  }
}
