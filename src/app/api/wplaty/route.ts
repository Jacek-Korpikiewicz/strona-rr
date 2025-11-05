import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const dataDir = path.join(process.cwd(), 'src', 'data')
const przedszkoleFile = path.join(dataDir, 'wplaty-przedszkole.json')
const szkolaFile = path.join(dataDir, 'wplaty-szkola.json')

// GET: Fetch payments data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'przedszkole' or 'szkola'

    let filePath: string
    if (type === 'przedszkole') {
      filePath = przedszkoleFile
    } else if (type === 'szkola') {
      filePath = szkolaFile
    } else {
      // Return both if no type specified
      const [przedszkoleData, szkolaData] = await Promise.all([
        fs.readFile(przedszkoleFile, 'utf-8'),
        fs.readFile(szkolaFile, 'utf-8')
      ])
      return NextResponse.json({
        przedszkole: JSON.parse(przedszkoleData),
        szkola: JSON.parse(szkolaData)
      })
    }

    const fileContent = await fs.readFile(filePath, 'utf-8')
    const data = JSON.parse(fileContent)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error reading payments data:', error)
    return NextResponse.json({ error: 'Failed to read payments data' }, { status: 500 })
  }
}

// PUT: Update payments data
export async function PUT(request: NextRequest) {
  try {
    const { type, data } = await request.json()

    if (!type || !data) {
      return NextResponse.json({ error: 'Type and data are required' }, { status: 400 })
    }

    if (type !== 'przedszkole' && type !== 'szkola') {
      return NextResponse.json({ error: 'Type must be przedszkole or szkola' }, { status: 400 })
    }

    const filePath = type === 'przedszkole' ? przedszkoleFile : szkolaFile

    // Validate data structure
    if (!Array.isArray(data)) {
      return NextResponse.json({ error: 'Data must be an array' }, { status: 400 })
    }

    // Write to file
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating payments data:', error)
    return NextResponse.json({ error: 'Failed to update payments data' }, { status: 500 })
  }
}

