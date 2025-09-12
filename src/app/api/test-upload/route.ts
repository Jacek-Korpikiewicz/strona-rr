import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Create a simple test file
    const testContent = 'This is a test file'
    const testFile = new Blob([testContent], { type: 'text/plain' })
    
    const fileName = `test-${Date.now()}.txt`
    const filePath = `lesson-plans/${fileName}`

    console.log('Testing upload to:', filePath)

    // Try to upload a test file
    const { data, error } = await supabase.storage
      .from('announcements')
      .upload(filePath, testFile, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Upload test failed:', error)
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        details: error
      }, { status: 500 })
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('announcements')
      .getPublicUrl(filePath)

    // Clean up test file
    await supabase.storage
      .from('announcements')
      .remove([filePath])

    return NextResponse.json({ 
      success: true, 
      message: 'Upload test successful',
      testUrl: publicUrl
    })

  } catch (error) {
    console.error('Upload test error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Upload test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
