import fs from 'fs'
import path from 'path'

export interface Announcement {
  id: number
  title: string
  priority: 'high' | 'medium' | 'low'
  date: string
  author: string
  category: string
  content: string
}

const dataPath = path.join(process.cwd(), 'src/data/announcements.json')

export function getAnnouncements(): Announcement[] {
  try {
    const fileContents = fs.readFileSync(dataPath, 'utf8')
    return JSON.parse(fileContents)
  } catch (error) {
    console.error('Error reading announcements:', error)
    return []
  }
}

export function getAnnouncementById(id: number): Announcement | null {
  const announcements = getAnnouncements()
  return announcements.find(announcement => announcement.id === id) || null
}

export function addAnnouncement(announcement: Omit<Announcement, 'id'>): Announcement {
  const announcements = getAnnouncements()
  const newId = Math.max(...announcements.map(a => a.id), 0) + 1
  const newAnnouncement: Announcement = {
    ...announcement,
    id: newId
  }
  
  const updatedAnnouncements = [...announcements, newAnnouncement]
  
  try {
    fs.writeFileSync(dataPath, JSON.stringify(updatedAnnouncements, null, 2))
    return newAnnouncement
  } catch (error) {
    console.error('Error saving announcement:', error)
    throw new Error('Failed to save announcement')
  }
}

export function updateAnnouncement(id: number, updates: Partial<Omit<Announcement, 'id'>>): Announcement | null {
  const announcements = getAnnouncements()
  const index = announcements.findIndex(a => a.id === id)
  
  if (index === -1) return null
  
  const updatedAnnouncement = { ...announcements[index], ...updates }
  announcements[index] = updatedAnnouncement
  
  try {
    fs.writeFileSync(dataPath, JSON.stringify(announcements, null, 2))
    return updatedAnnouncement
  } catch (error) {
    console.error('Error updating announcement:', error)
    throw new Error('Failed to update announcement')
  }
}

export function deleteAnnouncement(id: number): boolean {
  const announcements = getAnnouncements()
  const filteredAnnouncements = announcements.filter(a => a.id !== id)
  
  if (filteredAnnouncements.length === announcements.length) return false
  
  try {
    fs.writeFileSync(dataPath, JSON.stringify(filteredAnnouncements, null, 2))
    return true
  } catch (error) {
    console.error('Error deleting announcement:', error)
    throw new Error('Failed to delete announcement')
  }
}
