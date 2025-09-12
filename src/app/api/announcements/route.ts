import { NextResponse } from 'next/server'
import { loadAnnouncements } from '@/lib/announcements-db'

export async function GET() {
  try {
    const announcements = await loadAnnouncements()
    return NextResponse.json(announcements)
  } catch (error) {
    console.error('Error fetching announcements:', error)
    return NextResponse.json({ error: 'Failed to fetch announcements' }, { status: 500 })
  }
}
