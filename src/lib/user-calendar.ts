import { supabase } from './supabase'

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
  return {
    title: event.title,
    start_time: event.start,
    end_time: event.end,
    description: event.description || null,
    location: event.location || null
  }
}

// Read user calendar events from Supabase
export async function getUserCalendarEvents(): Promise<UserCalendarEvent[]> {
  try {
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
    throw new Error(`Failed to save event: ${error.message}`)
  }

  return dbToAppEvent(data)
}

// Delete user calendar event from Supabase
export async function deleteUserCalendarEvent(id: string): Promise<boolean> {
  try {
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
