import { NextRequest, NextResponse } from 'next/server'
import { getVotingById, deleteVoting } from '@/lib/votings-db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const voting = await getVotingById(parseInt(id))
    
    if (!voting) {
      return NextResponse.json({ error: 'Voting not found' }, { status: 404 })
    }

    return NextResponse.json(voting)
  } catch (error) {
    console.error('Error loading voting:', error)
    return NextResponse.json({ error: 'Failed to load voting' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const success = await deleteVoting(parseInt(id))
    
    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: 'Voting not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('Error deleting voting:', error)
    return NextResponse.json({ error: 'Failed to delete voting' }, { status: 500 })
  }
}
