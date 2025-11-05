import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const notesDir = path.join(process.cwd(), 'src', 'notes')

// GET: Serve a PDF file
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get('filename')

    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 })
    }

    // Security: prevent path traversal
    const safeFilename = path.basename(filename)
    if (!safeFilename.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    const filePath = path.join(notesDir, safeFilename)
    
    // Check if file exists
    try {
      await fs.access(filePath)
    } catch {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    const fileBuffer = await fs.readFile(filePath)
    
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${safeFilename}"`,
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    })
  } catch (error) {
    console.error('Error serving PDF file:', error)
    return NextResponse.json({ error: 'Failed to serve PDF file' }, { status: 500 })
  }
}

