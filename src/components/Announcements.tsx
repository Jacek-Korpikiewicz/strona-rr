'use client'

import { useEffect, useState } from 'react'
import { Announcement } from '@/lib/supabase'

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadAnnouncements()
  }, [])

  const loadAnnouncements = async () => {
    try {
      const response = await fetch('/api/announcements')
      if (response.ok) {
        const data = await response.json()
        setAnnouncements(data)
      }
    } catch (error) {
      console.error('Error loading announcements:', error)
    } finally {
      setIsLoading(false)
    }
  }
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50'
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50'
      case 'low':
        return 'border-l-green-500 bg-green-50'
      default:
        return 'border-l-gray-500 bg-gray-50'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Wysoki priorytet'
      case 'medium':
        return 'Średni priorytet'
      case 'low':
        return 'Niski priorytet'
      default:
        return ''
    }
  }

  if (isLoading) {
    return (
      <section id="announcements" className="py-8">
        <h2 className="section-title">Najnowsze ogłoszenia</h2>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Ładowanie ogłoszeń...</p>
        </div>
      </section>
    )
  }

  return (
    <section id="announcements" className="py-8">
      <h2 className="section-title">Najnowsze ogłoszenia</h2>
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Brak ogłoszeń do wyświetlenia.</p>
          </div>
        ) : (
          announcements.map((announcement) => (
          <div
            key={announcement.id}
            className={`card border-l-4 ${getPriorityColor(announcement.priority)}`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {announcement.title}
              </h3>
              <span className="text-sm text-gray-500">
                {new Date(announcement.date).toLocaleDateString('pl-PL')}
              </span>
            </div>
            <p className="text-gray-700 mb-3">
              {announcement.content.replace(/[#*`]/g, '').substring(0, 200)}...
            </p>
            <div className="flex justify-between items-center">
              <span className={`text-xs px-2 py-1 rounded-full ${
                announcement.priority === 'high' ? 'bg-red-100 text-red-800' :
                announcement.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {getPriorityText(announcement.priority)}
              </span>
              <a 
                href={`/announcements/${announcement.id}`}
                className="text-primary-600 hover:text-primary-800 text-sm font-medium"
              >
                Czytaj więcej →
              </a>
            </div>
          </div>
          ))
        )}
      </div>
      <div className="text-center mt-6">
        <a href="/announcements" className="btn-primary">
          Zobacz wszystkie ogłoszenia
        </a>
      </div>
    </section>
  )
}
