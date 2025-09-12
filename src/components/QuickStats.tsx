'use client'

import { useState, useEffect } from 'react'

interface QuickStatsData {
  activeVotings: number
  upcomingEvents: number
}

// Parse iCal date format (same logic as CalendarEvents component)
function parseICalDate(dateString: string): Date {
  // Handle different iCal date formats
  if (dateString.includes('T')) {
    // ISO format or iCal format with time
    return new Date(dateString)
  } else if (dateString.length === 8) {
    // iCal all-day format: YYYYMMDD
    const year = dateString.substring(0, 4)
    const month = dateString.substring(4, 6)
    const day = dateString.substring(6, 8)
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  } else if (dateString.length === 15) {
    // iCal timed format: YYYYMMDDTHHMMSS
    const year = dateString.substring(0, 4)
    const month = dateString.substring(4, 6)
    const day = dateString.substring(6, 8)
    const hour = dateString.substring(9, 11)
    const minute = dateString.substring(11, 13)
    const second = dateString.substring(13, 15)
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute), parseInt(second))
  }
  
  // Fallback to regular Date parsing
  return new Date(dateString)
}

export default function QuickStats() {
  const [stats, setStats] = useState<QuickStatsData>({ activeVotings: 0, upcomingEvents: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch votings and calendar data in parallel
        const [votingsResponse, calendarResponse] = await Promise.all([
          fetch('/api/votings'),
          fetch('/api/calendar')
        ])

        const votings = await votingsResponse.json()
        const calendar = await calendarResponse.json()

        // Count active votings
        const activeVotings = votings.filter((voting: any) => voting.status === 'active').length

        // Count upcoming events (next 30 days)
        const now = new Date()
        const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
        
        console.log('Calendar data:', calendar)
        console.log('Now:', now)
        console.log('Thirty days from now:', thirtyDaysFromNow)
        
        const upcomingEvents = calendar.filter((event: any) => {
          // Use the same date parsing logic as CalendarEvents component
          const eventDate = parseICalDate(event.start)
          const isValidDate = !isNaN(eventDate.getTime())
          const isUpcoming = eventDate >= now
          const isWithin30Days = eventDate <= thirtyDaysFromNow
          
          console.log('Event:', event.title, 'Date:', eventDate, 'Is valid:', isValidDate, 'Is upcoming:', isUpcoming, 'Within 30 days:', isWithin30Days)
          
          return isValidDate && isUpcoming && isWithin30Days
        }).length
        
        console.log('Upcoming events count:', upcomingEvents)

        setStats({ activeVotings, upcomingEvents })
      } catch (error) {
        console.error('Error fetching stats:', error)
        // Set fallback values
        setStats({ activeVotings: 0, upcomingEvents: 0 })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center text-sm text-gray-500">
            Ładowanie statystyk...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap items-center justify-center text-sm text-gray-600">
          <div className="flex items-center space-x-6">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              <span className="font-medium">
                {stats.activeVotings} {stats.activeVotings === 1 ? 'aktywne głosowanie' : 'aktywnych głosowań'}
              </span>
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              <span className="font-medium">
                {stats.upcomingEvents} {stats.upcomingEvents === 1 ? 'nadchodzące wydarzenie' : 'nadchodzących wydarzeń'}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
