import { getSupabase, validateSupabaseConfig } from './supabase'

export interface UserCalendarEvent {
  id: string
  title: string
  start: string
  end: string
  description?: string
  location?: string
  createdAt: string
}

// Database interface (matches Supabase table structure)
interface DatabaseEvent {
  id: string
  title: string
  start_time: string
  end_time: string
  description?: string | null
  location?: string | null
  created_at: string
}

// Convert database event to application format
function dbToAppEvent(dbEvent: DatabaseEvent): UserCalendarEvent {
  return {
    id: dbEvent.id,
    title: dbEvent.title,
    start: dbEvent.start_time,
    end: dbEvent.end_time,
    description: dbEvent.description || undefined,
    location: dbEvent.location || undefined,
    createdAt: dbEvent.created_at
  }
}

// Convert application event to database format
function appToDbEvent(event: Omit<UserCalendarEvent, 'id' | 'createdAt'>): Omit<DatabaseEvent, 'id' | 'created_at'> {
  // Convert datetime-local format (YYYY-MM-DDTHH:mm) to ISO string for Poland timezone
  // datetime-local gives local time without timezone, we treat it as Poland time (Europe/Warsaw)
  function convertToPolandISO(dateTimeString: string): string {
    if (!dateTimeString) return dateTimeString
    
    // If already has timezone info, return as is
    if (dateTimeString.includes('Z') || dateTimeString.match(/[+-]\d{2}:\d{2}$/)) {
      return dateTimeString
    }
    
    // datetime-local format: YYYY-MM-DDTHH:mm
    // Parse as Poland timezone (Europe/Warsaw) and convert to ISO
    try {
      const [datePart, timePart] = dateTimeString.split('T')
      const [year, month, day] = datePart.split('-').map(Number)
      const [hour, minute] = timePart.split(':').map(Number)
      
      // Create a date representing this time in Poland timezone
      // We need to find what UTC time would display as this time in Poland
      // Method: create a date string with Poland timezone, then convert to UTC
      
      // Create a test UTC date to determine Poland's offset on this date
      const testUTC = new Date(Date.UTC(year, month - 1, day, 12, 0, 0))
      
      // Get what 12:00 UTC is in Poland timezone
      const polandTimeAtNoon = testUTC.toLocaleString('en-US', { 
        timeZone: 'Europe/Warsaw',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
      
      // Calculate offset: if UTC 12:00 shows as 13:00 or 14:00 in Poland, we know the offset
      const [polandHour] = polandTimeAtNoon.split(':').map(Number)
      const polandOffsetHours = polandHour - 12 // +1 for CET, +2 for CEST
      
      // Now create the UTC date that represents our input time in Poland
      // If user enters 14:30 in Poland, and Poland is UTC+2, then UTC is 12:30
      const utcHour = hour - polandOffsetHours
      const utcDate = new Date(Date.UTC(year, month - 1, day, utcHour, minute, 0))
      
      return utcDate.toISOString()
    } catch (e) {
      console.error('Error converting date to Poland timezone:', e)
      // Fallback: treat as local time and convert to ISO
      try {
        const date = new Date(dateTimeString)
        return date.toISOString()
      } catch {
        return dateTimeString
      }
    }
  }
  
  return {
    title: event.title,
    start_time: convertToPolandISO(event.start),
    end_time: event.end ? convertToPolandISO(event.end) : convertToPolandISO(event.start),
    description: event.description || null,
    location: event.location || null
  }
}

// Read user calendar events from Supabase
export async function getUserCalendarEvents(): Promise<UserCalendarEvent[]> {
  try {
    validateSupabaseConfig()
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('user_calendar_events')
      .select('*')
      .order('start_time', { ascending: true })

    if (error) {
      console.error('Error fetching events from Supabase:', error)
      return []
    }

    return (data || []).map(dbToAppEvent)
  } catch (error) {
    console.error('Error fetching user calendar events:', error)
    return []
  }
}

// Save user calendar event to Supabase
export async function saveUserCalendarEvent(event: Omit<UserCalendarEvent, 'id' | 'createdAt'>): Promise<UserCalendarEvent> {
  validateSupabaseConfig()
  const supabase = getSupabase()
  const eventId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const dbEvent = appToDbEvent(event)

  const { data, error } = await supabase
    .from('user_calendar_events')
    .insert({
      id: eventId,
      ...dbEvent
    })
    .select()
    .single()

  if (error) {
    console.error('Error saving event to Supabase:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    throw new Error(`Failed to save event to Supabase: ${error.message} (Code: ${error.code || 'unknown'})`)
  }
  
  if (!data) {
    throw new Error('No data returned from Supabase insert')
  }

  return dbToAppEvent(data)
}

// Update user calendar event in Supabase
export async function updateUserCalendarEvent(id: string, event: Omit<UserCalendarEvent, 'id' | 'createdAt'>): Promise<UserCalendarEvent> {
  validateSupabaseConfig()
  const supabase = getSupabase()
  const dbEvent = appToDbEvent(event)

  const { data, error } = await supabase
    .from('user_calendar_events')
    .update({
      ...dbEvent
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating event in Supabase:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    throw new Error(`Failed to update event in Supabase: ${error.message} (Code: ${error.code || 'unknown'})`)
  }
  
  if (!data) {
    throw new Error('No data returned from Supabase update')
  }

  return dbToAppEvent(data)
}

// Delete user calendar event from Supabase
export async function deleteUserCalendarEvent(id: string): Promise<boolean> {
  try {
    validateSupabaseConfig()
    const supabase = getSupabase()
    const { error } = await supabase
      .from('user_calendar_events')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting event from Supabase:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting user calendar event:', error)
    return false
  }
}
