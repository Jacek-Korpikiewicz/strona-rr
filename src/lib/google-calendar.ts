// Google Calendar integration utilities
export interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  description?: string
  location?: string
  htmlLink?: string
}

export interface GoogleCalendarConfig {
  calendarId: string
  apiKey: string
  maxResults?: number
  timeMin?: string
  timeMax?: string
}

// Convert Google Calendar event to our format
export function transformGoogleEvent(event: any): CalendarEvent {
  return {
    id: event.id,
    title: event.summary || 'Bez tytułu',
    start: event.start?.dateTime || event.start?.date || '',
    end: event.end?.dateTime || event.end?.date || '',
    description: event.description || '',
    location: event.location || '',
    htmlLink: event.htmlLink || ''
  }
}

// Fetch events from Google Calendar public feed
export async function fetchGoogleCalendarEvents(config: GoogleCalendarConfig): Promise<CalendarEvent[]> {
  const {
    calendarId,
    apiKey,
    maxResults = 10,
    timeMin = new Date().toISOString(),
    timeMax
  } = config

  const baseUrl = 'https://www.googleapis.com/calendar/v3/calendars'
  const params = new URLSearchParams({
    key: apiKey,
    maxResults: maxResults.toString(),
    timeMin,
    singleEvents: 'true',
    orderBy: 'startTime'
  })

  if (timeMax) {
    params.append('timeMax', timeMax)
  }

  try {
    const response = await fetch(`${baseUrl}/${encodeURIComponent(calendarId)}/events?${params}`)
    
    if (!response.ok) {
      throw new Error(`Google Calendar API error: ${response.status}`)
    }

    const data = await response.json()
    return data.items?.map(transformGoogleEvent) || []
  } catch (error) {
    console.error('Error fetching Google Calendar events:', error)
    return []
  }
}

// Alternative: Simple iCal feed parser (no API key needed)
export async function fetchICalEvents(calendarUrl: string): Promise<CalendarEvent[]> {
  try {
    // For now, return empty array - iCal parsing requires server-side implementation
    console.warn('iCal parsing requires server-side implementation')
    return []
  } catch (error) {
    console.error('Error fetching iCal events:', error)
    return []
  }
}
