'use client'

import { useState } from 'react'

interface Announcement {
  id: number
  title: string
  content: string
  date: string
  priority: 'high' | 'medium' | 'low'
  author: string
  category: string
}

export default function SimpleAdminPage() {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('announcements')
      return saved ? JSON.parse(saved) : [
        {
          id: 1,
          title: 'Zebranie Rady Rodziców - 15 stycznia 2024',
          priority: 'high',
          date: '2024-01-10',
          author: 'Anna Kowalska',
          category: 'Zebrania',
          content: '# Zebranie Rady Rodziców\n\nSerdecznie zapraszamy na zebranie...'
        },
        {
          id: 2,
          title: 'Zmiana terminu wycieczki klasowej',
          priority: 'medium',
          date: '2024-01-08',
          author: 'Jan Nowak',
          category: 'Wycieczki',
          content: '# Zmiana terminu wycieczki\n\nWycieczka klasowa została przeniesiona...'
        }
      ]
    }
    return []
  })

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    author: '',
    category: '',
    content: ''
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        setIsAuthenticated(true)
      } else {
        alert('Nieprawidłowe hasło')
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('Błąd podczas logowania')
    }
  }

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault()
    const announcement = {
      ...newAnnouncement,
      id: Math.max(...announcements.map(a => a.id), 0) + 1,
      date: new Date().toISOString().split('T')[0]
    }
    const updatedAnnouncements = [...announcements, announcement]
    setAnnouncements(updatedAnnouncements)
    localStorage.setItem('announcements', JSON.stringify(updatedAnnouncements))
    setNewAnnouncement({
      title: '',
      priority: 'medium' as 'high' | 'medium' | 'low',
      author: '',
      category: '',
      content: ''
    })
  }

  const handleDelete = (id: number) => {
    if (confirm('Czy na pewno chcesz usunąć to ogłoszenie?')) {
      const updatedAnnouncements = announcements.filter(a => a.id !== id)
      setAnnouncements(updatedAnnouncements)
      localStorage.setItem('announcements', JSON.stringify(updatedAnnouncements))
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8">
          <div>
            <h2 className="text-3xl font-bold text-center text-gray-900">
              Panel administracyjny
            </h2>
            <p className="mt-2 text-center text-gray-600">
              Zaloguj się, aby zarządzać ogłoszeniami
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Hasło
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Zaloguj się
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Panel administracyjny</h1>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="btn-secondary"
            >
              Wyloguj się
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Dodaj nowe ogłoszenie</h2>
          <form onSubmit={handleAddAnnouncement} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tytuł *
                </label>
                <input
                  type="text"
                  required
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priorytet
                </label>
                <select
                  value={newAnnouncement.priority}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, priority: e.target.value as 'high' | 'medium' | 'low' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="low">Niski</option>
                  <option value="medium">Średni</option>
                  <option value="high">Wysoki</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Autor *
                </label>
                <input
                  type="text"
                  required
                  value={newAnnouncement.author}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, author: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategoria *
                </label>
                <input
                  type="text"
                  required
                  value={newAnnouncement.category}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Treść (Markdown) *
              </label>
              <textarea
                required
                rows={6}
                value={newAnnouncement.content}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="Wpisz treść ogłoszenia w formacie Markdown..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Możesz używać Markdown: **pogrubienie**, *kursywa*, # nagłówki, - listy, itp.
              </p>
            </div>

            <button
              type="submit"
              className="btn-primary"
            >
              Dodaj ogłoszenie
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Wszystkie ogłoszenia</h2>
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="card">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {announcement.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <span>Priorytet: {announcement.priority}</span>
                      <span>Data: {new Date(announcement.date).toLocaleDateString('pl-PL')}</span>
                      <span>Autor: {announcement.author}</span>
                      <span>Kategoria: {announcement.category}</span>
                    </div>
                    <p className="text-gray-700 text-sm">
                      {announcement.content.replace(/[#*`]/g, '').substring(0, 150)}...
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(announcement.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm ml-4"
                  >
                    Usuń
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
