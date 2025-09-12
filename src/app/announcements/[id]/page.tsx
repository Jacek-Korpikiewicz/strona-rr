'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { marked } from 'marked'

// Configure marked for client-side rendering
marked.setOptions({
  breaks: true,
  gfm: true
})

interface Announcement {
  id: number
  title: string
  content: string
  date: string
  priority: 'high' | 'medium' | 'low'
  author: string
  category: string
}

export default function AnnouncementPage({ params }: { params: Promise<{ id: string }> }) {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [announcementId, setAnnouncementId] = useState<number | null>(null)

  useEffect(() => {
    // Resolve params and set announcementId
    params.then((resolvedParams) => {
      setAnnouncementId(parseInt(resolvedParams.id))
    })
  }, [params])

  useEffect(() => {
    if (announcementId) {
      loadAnnouncement()
    }
  }, [announcementId])

  const loadAnnouncement = async () => {
    if (!announcementId) return
    
    try {
      const response = await fetch('/api/announcements')
      if (response.ok) {
        const announcements = await response.json()
        const found = announcements.find((a: Announcement) => a.id === announcementId)
        setAnnouncement(found || null)
      }
    } catch (error) {
      console.error('Error loading announcement:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Ładowanie ogłoszenia...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!announcement) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Ogłoszenie nie znalezione</h1>
            <p className="text-gray-600 mb-8">Przepraszamy, ale to ogłoszenie nie istnieje.</p>
            <a href="/announcements" className="btn-primary">Powrót do ogłoszeń</a>
          </div>
        </div>
      </div>
    )
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="card">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(announcement.priority)}`}>
                {getPriorityText(announcement.priority)}
              </span>
              <span className="text-sm text-gray-500">
                {new Date(announcement.date).toLocaleDateString('pl-PL')}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{announcement.title}</h1>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
              <span><strong>Kategoria:</strong> {announcement.category}</span>
              <span><strong>Autor:</strong> {announcement.author}</span>
            </div>
          </div>

          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: marked(announcement.content || '') 
            }}
          />

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link href="/announcements" className="btn-secondary">
              ← Powrót do wszystkich ogłoszeń
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
