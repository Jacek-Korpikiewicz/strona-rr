import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, getAdminPasswordHash } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    
    // Get the hashed password
    const hashedPassword = getAdminPasswordHash()
    
    // Verify the provided password against the hash
    const isValidPassword = await verifyPassword(password, hashedPassword)
    
    if (isValidPassword) {
      // Create a simple session token (in production, use proper JWT)
      const token = Buffer.from('admin-session').toString('base64')
      
      const response = NextResponse.json({ success: true })
      response.cookies.set('admin-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 // 24 hours
      })
      
      return response
    } else {
      return NextResponse.json({ success: false }, { status: 401 })
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
