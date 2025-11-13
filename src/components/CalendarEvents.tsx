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

// Detect all tags in an event (can return multiple tags)
function detectEventTags(event: CalendarEvent): EventTag[] {
  const text = `${event.title} ${event.description || ''}`
  const tags: EventTag[] = []
  
  // Check for all possible tags
  // Allow spaces inside brackets: [1 - 3], [1  -3], [1- 3], etc.
  if (/\[RR\]/i.test(text)) tags.push('RR')
  if (/\[P\]/i.test(text)) tags.push('P')
  // Match [1-3], [1 - 3], [1  -3], [1- 3], etc. (allows spaces around the dash)
  if (/\[\s*[1-3]\s*-\s*[1-3]\s*\]/i.test(text) || /\[[1-3]\]/.test(text)) tags.push('1-3')
  // Match [4-6], [4 - 6], [4  -6], [4- 6], etc.
  if (/\[\s*[4-6]\s*-\s*[4-6]\s*\]/i.test(text) || /\[[4-6]\]/.test(text)) tags.push('4-6')
  // Match [7-8], [7 - 8], [7  -8], [7- 8], etc.
  if (/\[\s*[78]\s*-\s*[78]\s*\]/i.test(text) || /\[[78]\]/.test(text)) tags.push('7-8')
  
  return tags.length > 0 ? tags : ['none']
}

// Get the primary tag for color (first tag found, or 'none')
function getPrimaryTag(tags: EventTag[]): EventTag {
  return tags[0] || 'none'
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
        accent: 'text-violet-700',
        gradientColor: '#a78bfa' // violet-400
      }
    case '1-3':
      // Green
      return {
        border: 'border-emerald-400',
        borderHover: 'hover:border-emerald-500',
        bg: 'bg-emerald-50',
        badge: 'bg-emerald-600 text-white',
        accent: 'text-emerald-700',
        gradientColor: '#34d399' // emerald-400
      }
    case '4-6':
      // Orange
      return {
        border: 'border-orange-400',
        borderHover: 'hover:border-orange-500',
        bg: 'bg-orange-50',
        badge: 'bg-orange-600 text-white',
        accent: 'text-orange-700',
        gradientColor: '#fb923c' // orange-400
      }
    case '7-8':
      // Yellow
      return {
        border: 'border-amber-400',
        borderHover: 'hover:border-amber-500',
        bg: 'bg-amber-50',
        badge: 'bg-amber-600 text-white',
        accent: 'text-amber-700',
        gradientColor: '#fbbf24' // amber-400
      }
    case 'RR':
      // Red
      return {
        border: 'border-red-400',
        borderHover: 'hover:border-red-500',
        bg: 'bg-red-50',
        badge: 'bg-red-600 text-white',
        accent: 'text-red-700',
        gradientColor: '#f87171' // red-400
      }
    case 'none':
    default:
      // Blue (default)
      return {
        border: 'border-blue-400',
        borderHover: 'hover:border-blue-500',
        bg: 'bg-blue-50',
        badge: 'bg-blue-600 text-white',
        accent: 'text-blue-700',
        gradientColor: '#60a5fa' // blue-400
      }
  }
}

// Generate gradient style for multiple tags
function getGradientStyle(tags: EventTag[]): string {
  if (tags.length === 0 || (tags.length === 1 && tags[0] === 'none')) {
    const colors = getTagColorClasses('none')
    return `linear-gradient(135deg, ${colors.gradientColor}, ${colors.gradientColor})`
  }
  
  // Filter out 'none' tags
  const activeTags = tags.filter(tag => tag !== 'none')
  
  if (activeTags.length === 0) {
    const colors = getTagColorClasses('none')
    return `linear-gradient(135deg, ${colors.gradientColor}, ${colors.gradientColor})`
  }
  
  if (activeTags.length === 1) {
    const colors = getTagColorClasses(activeTags[0])
    return `linear-gradient(135deg, ${colors.gradientColor}, ${colors.gradientColor})`
  }
  
  // Multiple tags: create gradient
  const gradientColors = activeTags.map(tag => getTagColorClasses(tag).gradientColor)
  
  // Create a smooth gradient with equal stops
  const stops = gradientColors.map((color, index) => {
    const percentage = (index / (gradientColors.length - 1)) * 100
    return `${color} ${percentage}%`
  }).join(', ')
  
  return `linear-gradient(135deg, ${stops})`
}

export default function CalendarEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [selectedTag, setSelectedTag] = useState<EventTag | 'all'>('all')

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
      day: 'numeric',
      timeZone: 'Europe/Warsaw'
    })
  }

  const formatTime = (dateString: string) => {
    const date = parseICalDate(dateString)
    return date.toLocaleTimeString('pl-PL', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Europe/Warsaw'
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
    // Find the event in the original events array
    const selectedEventIndex = events.findIndex(event => event.id === eventId)
    if (selectedEventIndex === -1 || eventId === events[0]?.id) return // Don't swap with itself
    
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

  // Filter events by selected tag (event shows if it has the selected tag)
  const filteredEvents = selectedTag === 'all' 
    ? events 
    : events.filter(event => {
        const eventTags = detectEventTags(event)
        return eventTags.includes(selectedTag)
      })

  // Get available tags from events (all unique tags across all events)
  const allAvailableTags = Array.from(new Set(
    events.flatMap(event => detectEventTags(event))
  ))
  const availableTags = allAvailableTags.filter(tag => tag !== 'none')

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
              style={{ display: 'none' }}
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
        
        {/* Tag Filter Buttons - Swipeable on mobile */}
        <div className="mb-6">
          <div 
            className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 lg:justify-center lg:flex-wrap lg:overflow-x-visible lg:mx-0 lg:px-0"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#cbd5e1 transparent',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <button
              onClick={() => setSelectedTag('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                selectedTag === 'all'
                  ? 'bg-gray-800 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Wszystkie
            </button>
            {availableTags.includes('P') && (
              <button
                onClick={() => setSelectedTag('P')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                  selectedTag === 'P'
                    ? 'bg-violet-600 text-white shadow-md'
                    : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
                }`}
              >
                [P]
              </button>
            )}
            {availableTags.includes('1-3') && (
              <button
                onClick={() => setSelectedTag('1-3')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                  selectedTag === '1-3'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                }`}
              >
                [1-3]
              </button>
            )}
            {availableTags.includes('4-6') && (
              <button
                onClick={() => setSelectedTag('4-6')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                  selectedTag === '4-6'
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                }`}
              >
                [4-6]
              </button>
            )}
            {availableTags.includes('7-8') && (
              <button
                onClick={() => setSelectedTag('7-8')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                  selectedTag === '7-8'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                }`}
              >
                [7-8]
              </button>
            )}
            {availableTags.includes('RR') && (
              <button
                onClick={() => setSelectedTag('RR')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                  selectedTag === 'RR'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
              >
                [RR]
              </button>
            )}
            {allAvailableTags.includes('none') && (
              <button
                onClick={() => setSelectedTag('none')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                  selectedTag === 'none'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                Bez tagu
              </button>
            )}
          </div>
        </div>
        
        {/* Special layout: Main event (1) + 6 smaller events (2-7) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Main event (1) - Large display */}
          {filteredEvents.length > 0 && (() => {
            const mainEvent = filteredEvents[0]
            const mainTags = detectEventTags(mainEvent)
            const mainPrimaryTag = getPrimaryTag(mainTags)
            const mainColors = getTagColorClasses(mainPrimaryTag)
            const gradientStyle = getGradientStyle(mainTags)
            
            return (
              <div key={mainEvent.id} className="lg:col-span-1">
                <div 
                  className="rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 h-full p-0.5"
                  style={{
                    background: gradientStyle
                  }}
                >
                  <div className="bg-white rounded-lg h-full">
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 flex-1 leading-tight">
                        {mainEvent.title}
                      </h3>
                      <div className="flex items-center space-x-3 flex-wrap">
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
                    
                    {/* Tag badges */}
                    {mainTags.length > 0 && mainTags[0] !== 'none' && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {mainTags.map((tag, idx) => {
                          const tagColors = getTagColorClasses(tag)
                          return (
                            <span
                              key={idx}
                              className={`px-2 py-1 ${tagColors.badge} text-xs font-medium rounded-full`}
                            >
                              {tag === '1-3' ? '[1-3]' : tag === '4-6' ? '[4-6]' : tag === '7-8' ? '[7-8]' : `[${tag}]`}
                            </span>
                          )
                        })}
                      </div>
                    )}
                    
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
              </div>
            )
          })()}

          {/* Next 6 events (2-7) - Smaller cards without descriptions */}
          <div className="lg:col-span-1 space-y-4">
            {filteredEvents.slice(1, 7).map((event, index) => {
              const eventTags = detectEventTags(event)
              const primaryTag = getPrimaryTag(eventTags)
              const colors = getTagColorClasses(primaryTag)
              const gradientStyle = getGradientStyle(eventTags)
              return (
              <div
                key={event.id}
                onClick={() => handleEventClick(event.id)}
                className={`rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-105 p-0.5 ${
                  selectedEventId === event.id 
                    ? 'scale-105' 
                    : ''
                }`}
                style={{
                  background: gradientStyle
                }}
              >
                <div className={`bg-white rounded-lg ${
                  selectedEventId === event.id 
                    ? colors.bg 
                    : ''
                }`}>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 flex-1 leading-tight">
                      {event.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {getDaysUntilEvent(event.start) && (
                        <span className={`px-3 py-1 ${colors.bg} ${colors.accent} text-sm font-medium rounded-full whitespace-nowrap`}>
                          {getDaysUntilEvent(event.start)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Tag badges */}
                  {eventTags.length > 0 && eventTags[0] !== 'none' && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {eventTags.map((tag, idx) => {
                        const tagColors = getTagColorClasses(tag)
                        return (
                          <span
                            key={idx}
                            className={`px-1.5 py-0.5 ${tagColors.badge} text-xs font-medium rounded`}
                          >
                            {tag === '1-3' ? '[1-3]' : tag === '4-6' ? '[4-6]' : tag === '7-8' ? '[7-8]' : `[${tag}]`}
                          </span>
                        )
                      })}
                    </div>
                  )}
                  
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
            style={{ display: 'none' }}
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            Subskrybuj kalendarz
          </a>
          
          {events.length > 7 && (
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
          
          {filteredEvents.length === 0 && selectedTag !== 'all' && (
            <div className="text-center py-6">
              <p className="text-gray-600">Brak wydarzeń z wybranym tagiem</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
