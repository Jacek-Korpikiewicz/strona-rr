import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Your actual Google Calendar ID
    const calendarId = '11214639e3e9e6a82fe52467d4413379ff174e7b588466601dbe856da7b2021f@group.calendar.google.com'
    
    // For now, we'll use the public iCal feed approach
    // This doesn't require an API key and works with public calendars
    const icalUrl = `https://calendar.google.com/calendar/ical/${encodeURIComponent(calendarId)}/public/basic.ics`
    
    try {
      // Fetch the iCal feed
      const response = await fetch(icalUrl)
      const icalData = await response.text()
      
      // Parse iCal data (simplified parser)
      const events = parseICal(icalData)
      
      return NextResponse.json(events)
    } catch (error) {
      console.error('Error fetching iCal data:', error)
      
      // Fallback: return empty array if calendar is not public
      return NextResponse.json([])
    }
  } catch (error) {
    console.error('Error in calendar API:', error)
    return NextResponse.json({ error: 'Failed to fetch calendar events' }, { status: 500 })
  }
}

// Simple iCal parser
function parseICal(icalData: string) {
  const events = []
  const lines = icalData.split('\n')
  let currentEvent: {
    summary?: string
    dtstart?: string
    dtend?: string
    description?: string
    location?: string
    uid?: string
  } | null = null
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    if (line === 'BEGIN:VEVENT') {
      currentEvent = {}
    } else if (line === 'END:VEVENT' && currentEvent) {
      if (currentEvent.summary && currentEvent.dtstart) {
        events.push({
          id: currentEvent.uid || Math.random().toString(),
          title: currentEvent.summary,
          start: formatDate(currentEvent.dtstart),
          end: formatDate(currentEvent.dtend || currentEvent.dtstart),
          description: currentEvent.description || '',
          location: currentEvent.location || '',
          htmlLink: `https://calendar.google.com/calendar/u/1?cid=11214639e3e9e6a82fe52467d4413379ff174e7b588466601dbe856da7b2021f@group.calendar.google.com`
        })
      }
      currentEvent = null
    } else if (currentEvent) {
      const [key, ...valueParts] = line.split(':')
      const value = valueParts.join(':')
      
      switch (key) {
        case 'SUMMARY':
          currentEvent.summary = value
          break
        case 'DTSTART':
          currentEvent.dtstart = value
          break
        case 'DTEND':
          currentEvent.dtend = value
          break
        case 'DESCRIPTION':
          currentEvent.description = value
          break
        case 'LOCATION':
          currentEvent.location = value
          break
        case 'UID':
          currentEvent.uid = value
          break
      }
    }
  }
  
  return events.slice(0, 10) // Limit to 10 events
}

// Format iCal date to ISO string
function formatDate(icalDate: string) {
  // iCal dates are in format YYYYMMDDTHHMMSSZ or YYYYMMDD
  if (icalDate.length === 8) {
    // All-day event: YYYYMMDD
    const year = icalDate.substring(0, 4)
    const month = icalDate.substring(4, 6)
    const day = icalDate.substring(6, 8)
    return `${year}-${month}-${day}T00:00:00`
  } else if (icalDate.length === 15) {
    // Timed event: YYYYMMDDTHHMMSS
    const year = icalDate.substring(0, 4)
    const month = icalDate.substring(4, 6)
    const day = icalDate.substring(6, 8)
    const hour = icalDate.substring(9, 11)
    const minute = icalDate.substring(11, 13)
    const second = icalDate.substring(13, 15)
    return `${year}-${month}-${day}T${hour}:${minute}:${second}`
  }
  return icalDate
}
