import { NextRequest, NextResponse } from 'next/server'
import { getAnnouncementById, deleteAnnouncement, updateAnnouncement } from '@/lib/announcements-db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const id = parseInt(resolvedParams.id)
    const announcement = await getAnnouncementById(id)
    
    if (announcement) {
      return NextResponse.json(announcement)
    } else {
      return NextResponse.json({ error: 'Announcement not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('Error fetching announcement:', error)
    return NextResponse.json({ error: 'Failed to fetch announcement' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const id = parseInt(resolvedParams.id)
    const success = await deleteAnnouncement(id)
    
    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: 'Announcement not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('Error deleting announcement:', error)
    return NextResponse.json({ error: 'Failed to delete announcement' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const id = parseInt(resolvedParams.id)
    const body = await request.json()
    const announcement = await updateAnnouncement(id, body)
    
    if (announcement) {
      return NextResponse.json(announcement)
    } else {
      return NextResponse.json({ error: 'Announcement not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('Error updating announcement:', error)
    return NextResponse.json({ error: 'Failed to update announcement' }, { status: 500 })
  }
}