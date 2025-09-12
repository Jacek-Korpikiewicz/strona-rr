import { NextRequest, NextResponse } from 'next/server'
import { loadVotings, addVoting, generateId } from '@/lib/votings-db'

export async function GET() {
  try {
    const votings = await loadVotings()
    return NextResponse.json(votings)
  } catch (error) {
    console.error('Error loading votings:', error)
    return NextResponse.json({ error: 'Failed to load votings' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, options, endDate } = body

    if (!title || !description || !options || !endDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (options.length < 2) {
      return NextResponse.json({ error: 'At least 2 options required' }, { status: 400 })
    }

    const newVoting = {
      title,
      description,
      options: options.map((text: string, index: number) => ({
        id: generateId(),
        text,
        votes: 0
      })),
      endDate
    }

    const createdVoting = await addVoting(newVoting)
    
    if (createdVoting) {
      return NextResponse.json(createdVoting, { status: 201 })
    } else {
      return NextResponse.json({ error: 'Failed to create voting' }, { status: 500 })
    }
  } catch (error) {
    console.error('Error creating voting:', error)
    return NextResponse.json({ error: 'Failed to create voting' }, { status: 500 })
  }
}
