import { supabase, Announcement } from './supabase'

// Load announcements from Supabase
export async function loadAnnouncements(): Promise<Announcement[]> {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('date', { ascending: false })

    if (error) {
      console.error('Error loading announcements:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error loading announcements:', error)
    return []
  }
}

// Get announcement by ID
export async function getAnnouncementById(id: number): Promise<Announcement | null> {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error loading announcement:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error loading announcement:', error)
    return null
  }
}

// Add new announcement
export async function addAnnouncement(announcement: Omit<Announcement, 'id' | 'created_at' | 'updated_at'>): Promise<Announcement | null> {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .insert([announcement])
      .select()
      .single()

    if (error) {
      console.error('Error adding announcement:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error adding announcement:', error)
    return null
  }
}

// Update announcement
export async function updateAnnouncement(id: number, updates: Partial<Omit<Announcement, 'id' | 'created_at' | 'updated_at'>>): Promise<Announcement | null> {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating announcement:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error updating announcement:', error)
    return null
  }
}

// Delete announcement
export async function deleteAnnouncement(id: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting announcement:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting announcement:', error)
    return false
  }
}
