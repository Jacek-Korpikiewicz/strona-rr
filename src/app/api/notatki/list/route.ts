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
      return NextResponse.json({ error: 'Failed to list PDF files' }, { status: 500 })
    }

    // Filter for PDF files and generate public URLs
    const pdfFiles = (data || [])
      .filter(file => file.name.toLowerCase().endsWith('.pdf'))
      .map(file => {
        const { data: urlData } = supabase.storage
          .from('notatki')
          .getPublicUrl(file.name)
        
        return {
          name: file.name,
          path: urlData.publicUrl
        }
      })

    return NextResponse.json(pdfFiles)
  } catch (error) {
    console.error('Error listing PDF files:', error)
    return NextResponse.json({ error: 'Failed to list PDF files' }, { status: 500 })
  }
}

