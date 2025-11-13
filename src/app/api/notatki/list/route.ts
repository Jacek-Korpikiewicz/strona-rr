import { NextResponse } from 'next/server'
import { getSupabase, validateSupabaseConfig } from '@/lib/supabase'

// GET: List all PDF files from Supabase Storage
export async function GET() {
  try {
    validateSupabaseConfig()
    const supabase = getSupabase()
    
    // List files from Supabase Storage bucket 'notatki'
    const { data, error } = await supabase
      .storage
      .from('notatki')
      .list('', {
        limit: 100,
        offset: 0
      })

    if (error) {
      console.error('Error listing files from Supabase Storage:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      return NextResponse.json({ 
        error: 'Failed to list PDF files', 
        details: error.message
      }, { status: 500 })
    }

    // Filter for PDF files and generate public URLs
    const pdfFiles = (data || [])
      .filter(file => file.name.toLowerCase().endsWith('.pdf'))
      .map(file => {
        const { data: urlData } = supabase.storage
          .from('notatki')
          .getPublicUrl(file.name)
        
        // Get added_on from metadata if available, otherwise use created_at
        const addedOn = file.metadata?.added_on || file.created_at
        
        return {
          name: file.name,
          path: urlData.publicUrl,
          added_on: addedOn,
          created_at: file.created_at
        }
      })
      // Sort by added_on (or created_at as fallback) in descending order (latest first)
      .sort((a, b) => {
        const dateA = a.added_on ? new Date(a.added_on).getTime() : (a.created_at ? new Date(a.created_at).getTime() : 0)
        const dateB = b.added_on ? new Date(b.added_on).getTime() : (b.created_at ? new Date(b.created_at).getTime() : 0)
        return dateB - dateA // Descending order (latest first)
      })
      // Remove the date fields from the response to keep the interface clean
      .map(({ added_on, created_at, ...file }) => file)

    return NextResponse.json(pdfFiles)
  } catch (error) {
    console.error('Error listing PDF files:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ 
      error: 'Failed to list PDF files',
      details: errorMessage
    }, { status: 500 })
  }
}

