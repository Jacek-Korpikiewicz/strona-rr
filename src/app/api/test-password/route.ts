import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, getAdminPasswordHash } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    
    const hashedPassword = getAdminPasswordHash()
    const isValid = await verifyPassword(password, hashedPassword)
    
    return NextResponse.json({
      passwordProvided: password || 'empty',
      hashInUse: hashedPassword.substring(0, 30) + '...',
      hashLength: hashedPassword.length,
      isValid,
      envVarSet: !!process.env.ADMIN_PASSWORD_HASH
    })
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 })
  }
}

