'use client'

import { useState, useEffect } from 'react'

interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  description: string
  location: string
  htmlLink: string
}

// Tag-based color system
type EventTag = 'P' | '1-3' | '4-6' | '7-8' | 'RR' | 'none'

function detectEventTag(event: CalendarEvent): EventTag {
  const text = `${event.title} ${event.description || ''}`.toUpperCase()
  
  // Use regex to find tags in brackets
  // Priority: RR > P > numbers
  if (/\[RR\]/.test(text)) return 'RR'
  if (/\[P\]/.test(text)) return 'P'
  if (/\[[1-3]\]/.test(text)) return '1-3'
  if (/\[[4-6]\]/.test(text)) return '4-6'
  if (/\[[78]\]/.test(text)) return '7-8'
  
  // Default: no tag
  return 'none'
}

function getTagColorClasses(tag: EventTag) {
  switch (tag) {
    case 'P':
      // Violet
      return {
        border: 'border-violet-400',
        borderHover: 'hover:border-violet-500',
        bg: 'bg-violet-50',
        badge: 'bg-violet-600 text-white',
        accent: 'text-violet-700'
      }
    case '1-3':
      // Green
      return {
        border: 'border-emerald-400',
        borderHover: 'hover:border-emerald-500',
        bg: 'bg-emerald-50',
        badge: 'bg-emerald-600 text-white',
        accent: 'text-emerald-700'
      }
    case '4-6':
      // Orange
      return {
        border: 'border-orange-400',
        borderHover: 'hover:border-orange-500',
        bg: 'bg-orange-50',
        badge: 'bg-orange-600 text-white',
        accent: 'text-orange-700'
      }
    case '7-8':
      // Yellow
      return {
        border: 'border-amber-400',
        borderHover: 'hover:border-amber-500',
        bg: 'bg-amber-50',
        badge: 'bg-amber-600 text-white',
        accent: 'text-amber-700'
      }
    case 'RR':
      // Red
      return {
        border: 'border-red-400',
        borderHover: 'hover:border-red-500',
        bg: 'bg-red-50',
        badge: 'bg-red-600 text-white',
        accent: 'text-red-700'
      }
    case 'none':
    default:
      // Blue (default)
      return {
        border: 'border-blue-400',
        borderHover: 'hover:border-blue-500',
        bg: 'bg-blue-50',
        badge: 'bg-blue-600 text-white',
        accent: 'text-blue-700'
      }
  }
}

export default function CalendarEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/calendar')
        if (!response.ok) {
          throw new Error('Failed to fetch events')
        }
        const data = await response.json()
        // Filter out past events and sort by date (nearest first)
        const now = new Date()
        const filteredEvents = data.filter((event: CalendarEvent) => {
          const eventDate = parseICalDate(event.start)
          return eventDate >= now
        })
        const sortedEvents = filteredEvents.sort((a: CalendarEvent, b: CalendarEvent) => {
          const dateA = parseICalDate(a.start)
          const dateB = parseICalDate(b.start)
          return dateA.getTime() - dateB.getTime()
        })
        setEvents(sortedEvents)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch events')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const parseICalDate = (dateString: string) => {
    // iCal dates are in format YYYYMMDDTHHMMSSZ or YYYYMMDD
    if (dateString.length === 8) {
      // All-day event: YYYYMMDD
      const year = dateString.substring(0, 4)
      const month = dateString.substring(4, 6)
      const day = dateString.substring(6, 8)
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    } else if (dateString.length === 15) {
      // Timed event: YYYYMMDDTHHMMSS
      const year = dateString.substring(0, 4)
      const month = dateString.substring(4, 6)
      const day = dateString.substring(6, 8)
      const hour = dateString.substring(9, 11)
      const minute = dateString.substring(11, 13)
      const second = dateString.substring(13, 15)
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute), parseInt(second))
    } else if (dateString.endsWith('Z')) {
      // UTC format: YYYYMMDDTHHMMSSZ
      const year = dateString.substring(0, 4)
      const month = dateString.substring(4, 6)
      const day = dateString.substring(6, 8)
      const hour = dateString.substring(9, 11)
      const minute = dateString.substring(11, 13)
      const second = dateString.substring(13, 15)
      return new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute), parseInt(second)))
    }
    // Fallback to regular Date parsing
    return new Date(dateString)
  }

  const formatDate = (dateString: string) => {
    const date = parseICalDate(dateString)
    return date.toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    const date = parseICalDate(dateString)
    return date.toLocaleTimeString('pl-PL', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  const getDaysUntilEvent = (dateString: string) => {
    const eventDate = parseICalDate(dateString)
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time to start of day
    eventDate.setHours(0, 0, 0, 0) // Reset time to start of day
    
    const diffTime = eventDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return null // Event is in the past
    if (diffDays === 0) return 'Dzisiaj'
    if (diffDays === 1) return 'Jutro'
    if (diffDays < 7) return `Za ${diffDays} d.`
    if (diffDays < 30) return `Za ${Math.ceil(diffDays / 7)} tyg.`
    return `Za ${Math.ceil(diffDays / 30)} m.`
  }

  const isAllDay = (start: string, end: string) => {
    const startDate = parseICalDate(start)
    const endDate = parseICalDate(end)
    const diffHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)
    return diffHours >= 24 || (startDate.getHours() === 0 && startDate.getMinutes() === 0)
  }

  const handleEventClick = (eventId: string) => {
    if (eventId === events[0]?.id) return // Don't swap with itself
    
    const selectedEventIndex = events.findIndex(event => event.id === eventId)
    if (selectedEventIndex === -1) return
    
    // Create new array with selected event moved to position 0
    const newEvents = [...events]
    const [selectedEvent] = newEvents.splice(selectedEventIndex, 1)
    newEvents.unshift(selectedEvent)
    
    setEvents(newEvents)
    setSelectedEventId(eventId)
    
    // Clear selection after a short delay for visual feedback
    setTimeout(() => setSelectedEventId(null), 500)
  }

  if (loading) {
    return (
      <section id="calendar">
        <div>
          <h2 className="section-title">Nadchodzące wydarzenia</h2>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="calendar">
        <div>
          <h2 className="section-title">Nadchodzące wydarzenia</h2>
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">Błąd ładowania wydarzeń: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn-primary"
            >
              Spróbuj ponownie
            </button>
          </div>
        </div>
      </section>
    )
  }

  if (events.length === 0) {
    return (
      <section id="calendar">
        <div>
          <h2 className="section-title">Nadchodzące wydarzenia</h2>
          <div className="text-center py-12">
            <p className="text-gray-600 mb-6">Brak nadchodzących wydarzeń</p>
            <a 
              href="https://calendar.google.com/calendar/u/1?cid=11214639e3e9e6a82fe52467d4413379ff174e7b588466601dbe856da7b2021f@group.calendar.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full text-center block inline-flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              Subskrybuj kalendarz
            </a>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="calendar">
      <div>
        <h2 className="section-title">Nadchodzące wydarzenia</h2>
        <p className="text-gray-600 text-center mb-6">
          Kliknij na dowolne wydarzenie po prawej stronie, aby uczynić je głównym
        </p>
        
        {/* Special layout: Main event (1) + 3 smaller events (2-4) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Main event (1) - Large display */}
          {events.length > 0 && (() => {
            const mainEvent = events[0]
            const mainTag = detectEventTag(mainEvent)
            const mainColors = getTagColorClasses(mainTag)
            
            return (
              <div key={mainEvent.id} className="lg:col-span-1">
                <div className={`bg-white rounded-lg shadow-lg border-2 ${mainColors.border} ${mainColors.borderHover} hover:shadow-xl transition-all duration-300 h-full`}>
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 flex-1 leading-tight">
                        {mainEvent.title}
                      </h3>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 ${mainColors.badge} text-sm font-medium rounded-full`}>
                          GŁÓWNE
                        </span>
                        {getDaysUntilEvent(mainEvent.start) && (
                          <span className={`px-4 py-2 ${mainColors.bg} ${mainColors.accent} text-lg font-medium rounded-full whitespace-nowrap`}>
                            {getDaysUntilEvent(mainEvent.start)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-gray-600">
                        <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span className="text-lg font-medium">
                          {formatDate(mainEvent.start)}
                        </span>
                      </div>
                      
                      {!isAllDay(mainEvent.start, mainEvent.end) && (
                        <div className="flex items-center text-gray-600">
                          <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          <span className="text-lg">
                            {formatTime(mainEvent.start)} - {formatTime(mainEvent.end)}
                          </span>
                        </div>
                      )}
                      
                      {mainEvent.location && (
                        <div className="flex items-center text-gray-600">
                          <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-lg">{mainEvent.location}</span>
                        </div>
                      )}
                    </div>
                    
                    {mainEvent.description && (
                      <div className="text-gray-600 text-base mt-6">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="min-h-[10rem] overflow-visible">
                            <div className="whitespace-pre-line font-sans leading-relaxed">
                              {mainEvent.description
                                .replace(/\\n/g, '\n')
                                .replace(/\\,/g, ',')
                                .replace(/\\;/g, ';')
                                .replace(/\\\\/g, '\\')
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })()}

          {/* Next 3 events (2-4) - Smaller cards without descriptions */}
          <div className="lg:col-span-1 space-y-4">
            {events.slice(1, 4).map((event, index) => {
              const tag = detectEventTag(event)
              const colors = getTagColorClasses(tag)
              return (
              <div
                key={event.id}
                onClick={() => handleEventClick(event.id)}
                className={`bg-white rounded-lg shadow-lg border-2 ${colors.border} hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-105 ${
                  selectedEventId === event.id 
                    ? `${colors.border} ${colors.bg} scale-105` 
                    : colors.borderHover
                }`}
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 flex-1 leading-tight">
                      {event.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 ${colors.bg} ${colors.accent} text-xs font-medium rounded-full`}>
                        Kliknij
                      </span>
                      {getDaysUntilEvent(event.start) && (
                        <span className={`ml-3 px-3 py-1 ${colors.bg} ${colors.accent} text-sm font-medium rounded-full whitespace-nowrap`}>
                          {getDaysUntilEvent(event.start)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium">
                        {formatDate(event.start)}
                      </span>
                    </div>
                    
                    {!isAllDay(event.start, event.end) && (
                      <div className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">
                          {formatTime(event.start)} - {formatTime(event.end)}
                        </span>
                      </div>
                    )}
                    
                    {event.location && (
                      <div className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">{event.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              )
            })}
          </div>
        </div>
        
        {/* Subscribe button and show more events */}
        <div className="text-center space-y-4">
          <a
            href="https://calendar.google.com/calendar/u/1?cid=11214639e3e9e6a82fe52467d4413379ff174e7b588466601dbe856da7b2021f@group.calendar.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full text-center block inline-flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            Subskrybuj kalendarz
          </a>
          
          {events.length > 6 && (
            <div>
              <a
                href="https://calendar.google.com/calendar/u/1?cid=11214639e3e9e6a82fe52467d4413379ff174e7b588466601dbe856da7b2021f@group.calendar.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                Zobacz wszystkie wydarzenia ({events.length})
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
