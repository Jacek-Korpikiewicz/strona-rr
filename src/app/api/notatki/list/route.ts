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
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      })

    if (error) {
      console.error('Error listing files from Supabase Storage:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      return NextResponse.json({ 
        error: 'Failed to list PDF files', 
        details: error.message,
        code: error.statusCode 
      }, { status: 500 })
    }

    console.log('Files found in Supabase:', data?.length || 0)
    console.log('All files:', data)

    // Filter for PDF files and generate public URLs
    const pdfFiles = (data || [])
      .filter(file => {
        const isPdf = file.name.toLowerCase().endsWith('.pdf')
        console.log(`File: ${file.name}, is PDF: ${isPdf}`)
        return isPdf
      })
      .map(file => {
        const { data: urlData } = supabase.storage
          .from('notatki')
          .getPublicUrl(file.name)
        
        console.log(`Generated URL for ${file.name}:`, urlData.publicUrl)
        
        return {
          name: file.name,
          path: urlData.publicUrl
        }
      })

    console.log('PDF files found:', pdfFiles.length)
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

