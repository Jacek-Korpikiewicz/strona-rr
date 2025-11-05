import { NextResponse } from 'next/server'
import { getSupabase, validateSupabaseConfig } from '@/lib/supabase'

// GET: Test Supabase Storage connection and list files
export async function GET() {
  try {
    validateSupabaseConfig()
    const supabase = getSupabase()
    
    // Test listing files from Supabase Storage bucket 'notatki'
    const { data, error } = await supabase
      .storage
      .from('notatki')
      .list('', {
        limit: 100,
        offset: 0
      })

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        statusCode: error.statusCode,
        errorDetails: error
      }, { status: 500 })
    }

    // Also try to list with folders
    const { data: allData } = await supabase
      .storage
      .from('notatki')
      .list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      })

    return NextResponse.json({
      success: true,
      filesFound: data?.length || 0,
      allFiles: data || [],
      allDataFiles: allData || [],
      bucketInfo: {
        name: 'notatki',
        note: 'Make sure the bucket name matches exactly (case-sensitive)'
      }
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({
      success: false,
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}

