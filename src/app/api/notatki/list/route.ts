import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const notesDir = path.join(process.cwd(), 'src', 'notes')

// GET: List all PDF files in the notes directory
export async function GET() {
  try {
    const files = await fs.readdir(notesDir)
    const pdfFiles = files
      .filter(file => file.toLowerCase().endsWith('.pdf'))
      .map(file => ({
        name: file,
        path: `/api/notatki/file?filename=${encodeURIComponent(file)}`
      }))
      .sort((a, b) => a.name.localeCompare(b.name))

    return NextResponse.json(pdfFiles)
  } catch (error) {
    console.error('Error listing PDF files:', error)
    return NextResponse.json({ error: 'Failed to list PDF files' }, { status: 500 })
  }
}

