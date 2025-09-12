import { NextRequest, NextResponse } from 'next/server'
import { getVotingById, addVote, hasUserVoted, generateId } from '@/lib/votings-db'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { optionId, voterId } = body

    if (!optionId || !voterId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get client IP address
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const ipAddress = forwarded?.split(',')[0] || realIp || 'unknown'

    const voting = await getVotingById(parseInt(id))
    
    if (!voting) {
      return NextResponse.json({ error: 'Voting not found' }, { status: 404 })
    }

    // Check if voting is still active
    const now = new Date()
    const endDate = new Date(voting.endDate)
    if (endDate <= now) {
      return NextResponse.json({ error: 'Voting has ended' }, { status: 400 })
    }

    // Check if user already voted (by IP address)
    const alreadyVoted = await hasUserVoted(voting.id, ipAddress)
    if (alreadyVoted) {
      return NextResponse.json({ error: 'Już głosowałeś w tym głosowaniu' }, { status: 400 })
    }

    // Check if option exists
    const option = voting.options.find(o => o.id === optionId)
    if (!option) {
      return NextResponse.json({ error: 'Invalid option' }, { status: 400 })
    }

    // Add vote
    const newVote = {
      id: generateId(),
      votingId: voting.id,
      optionId,
      voterId,
      ipAddress
    }

    const createdVote = await addVote(newVote)
    
    if (createdVote) {
      return NextResponse.json({ success: true, vote: createdVote })
    } else {
      return NextResponse.json({ error: 'Failed to submit vote' }, { status: 500 })
    }
  } catch (error) {
    console.error('Error submitting vote:', error)
    return NextResponse.json({ error: 'Failed to submit vote' }, { status: 500 })
  }
}
