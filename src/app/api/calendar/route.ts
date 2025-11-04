import { NextResponse } from 'next/server'
import { getUserCalendarEvents } from '@/lib/user-calendar'

export async function GET() {
  try {
    const calendarId = '11214639e3e9e6a82fe52467d4413379ff174e7b588466601dbe856da7b2021f@group.calendar.google.com'
    
    // Fetch Google Calendar events
    const icalUrl = `https://calendar.google.com/calendar/ical/${encodeURIComponent(calendarId)}/public/basic.ics`
    let googleEvents: any[] = []
    
    try {
      const response = await fetch(icalUrl)
      const icalData = await response.text()
      googleEvents = parseICal(icalData)
    } catch (error) {
      console.error('Error fetching iCal data:', error)
    }
    
    // Fetch user calendar events
    let userEvents: any[] = []
    try {
      const userEventsData = await getUserCalendarEvents()
      userEvents = userEventsData.map(event => ({
        id: event.id,
        title: event.title,
        start: event.start,
        end: event.end,
        description: event.description || '',
        location: event.location || '',
        htmlLink: '',
        source: 'user'
      }))
    } catch (error) {
      console.error('Error fetching user calendar events:', error)
    }
    
    // Merge and sort events by start date
    const allEvents = [...googleEvents, ...userEvents]
    const sortedEvents = allEvents.sort((a, b) => {
      const dateA = new Date(a.start).getTime()
      const dateB = new Date(b.start).getTime()
      return dateA - dateB
    })
    
    return NextResponse.json(sortedEvents)
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
    let line = lines[i].trim()
    
    // Handle multi-line values (lines starting with space or tab)
    while (i + 1 < lines.length && (lines[i + 1].startsWith(' ') || lines[i + 1].startsWith('\t'))) {
      i++
      line += lines[i].substring(1) // Remove the leading space/tab
    }
    
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
          // Unescape iCal description and handle line breaks
          currentEvent.description = value
            .replace(/\\n/g, '\n')
            .replace(/\\,/g, ',')
            .replace(/\\;/g, ';')
            .replace(/\\\\/g, '\\')
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
  } else if (icalDate.length === 16 && icalDate.endsWith('Z')) {
    // UTC format: YYYYMMDDTHHMMSSZ
    const year = icalDate.substring(0, 4)
    const month = icalDate.substring(4, 6)
    const day = icalDate.substring(6, 8)
    const hour = icalDate.substring(9, 11)
    const minute = icalDate.substring(11, 13)
    const second = icalDate.substring(13, 15)
    return `${year}-${month}-${day}T${hour}:${minute}:${second}Z`
  }
  // If already in ISO format, return as is
  return icalDate
}
