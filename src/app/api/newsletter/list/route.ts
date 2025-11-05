import { NextResponse } from 'next/server'
import { getSupabase, validateSupabaseConfig } from '@/lib/supabase'

// GET: List all files from Supabase Storage (PDFs and images)
export async function GET() {
  try {
    validateSupabaseConfig()
    const supabase = getSupabase()
    
    // List files from Supabase Storage bucket 'newslettery'
    const { data, error } = await supabase
      .storage
      .from('newslettery')
      .list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      })

    if (error) {
      console.error('Error listing files from Supabase Storage:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      return NextResponse.json({ 
        error: 'Failed to list files', 
        details: error.message
      }, { status: 500 })
    }

    // Filter for PDF and image files and generate public URLs
    const files = (data || [])
      .filter(file => {
        const name = file.name.toLowerCase()
        return name.endsWith('.pdf') || 
               name.endsWith('.jpg') || 
               name.endsWith('.jpeg') || 
               name.endsWith('.png') || 
               name.endsWith('.gif') ||
               name.endsWith('.webp')
      })
      .map(file => {
        const { data: urlData } = supabase.storage
          .from('newslettery')
          .getPublicUrl(file.name)
        
        const name = file.name.toLowerCase()
        const isImage = name.endsWith('.jpg') || 
                       name.endsWith('.jpeg') || 
                       name.endsWith('.png') || 
                       name.endsWith('.gif') ||
                       name.endsWith('.webp')
        
        return {
          name: file.name,
          path: urlData.publicUrl,
          type: isImage ? 'image' : 'pdf'
        }
      })

    return NextResponse.json(files)
  } catch (error) {
    console.error('Error listing files:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ 
      error: 'Failed to list files',
      details: errorMessage
    }, { status: 500 })
  }
}

