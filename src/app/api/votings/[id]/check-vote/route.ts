import { NextRequest, NextResponse } from 'next/server'
import { hasUserVoted } from '@/lib/votings-db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Get client IP address
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const ipAddress = forwarded?.split(',')[0] || realIp || 'unknown'

    // Check if this IP has already voted
    const alreadyVoted = await hasUserVoted(parseInt(id), ipAddress)
    
    return NextResponse.json({ 
      hasVoted: alreadyVoted,
      ipAddress: ipAddress 
    })
  } catch (error) {
    console.error('Error checking vote status:', error)
    return NextResponse.json({ 
      hasVoted: false,
      error: 'Failed to check vote status' 
    }, { status: 500 })
  }
}
