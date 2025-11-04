'use client'

import { useState, useEffect } from 'react'
import { useToast } from '@/components/ToastContainer'
import ToastContainer from '@/components/ToastContainer'

interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  description?: string
  location?: string
  source?: string
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(false)
  const { showToast, removeToast, toasts } = useToast()
  
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: '',
    end: '',
    description: '',
    location: ''
  })

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserEvents()
    }
  }, [isAuthenticated])

  const fetchUserEvents = async () => {
    try {
      const response = await fetch('/api/user-calendar')
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
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
        showToast('Nieprawidłowe hasło', 'error')
      }
    } catch (error) {
      console.error('Login error:', error)
      showToast('Błąd podczas logowania', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch('/api/user-calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password,
          ...newEvent
        }),
      })
      
      if (response.ok) {
        const event = await response.json()
        setEvents([...events, event])
        setNewEvent({
          title: '',
          start: '',
          end: '',
          description: '',
          location: ''
        })
        showToast('Wydarzenie dodane pomyślnie!', 'success')
      } else {
        const error = await response.json()
        showToast(error.error || 'Błąd podczas dodawania wydarzenia', 'error')
      }
    } catch (error) {
      console.error('Error adding event:', error)
      showToast('Błąd podczas dodawania wydarzenia', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/user-calendar?id=${id}&password=${encodeURIComponent(password)}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setEvents(events.filter(e => e.id !== id))
        showToast('Wydarzenie usunięte pomyślnie!', 'success')
      } else {
        const error = await response.json()
        showToast(error.error || 'Błąd podczas usuwania wydarzenia', 'error')
      }
    } catch (error) {
      console.error('Error deleting event:', error)
      showToast('Błąd podczas usuwania wydarzenia', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <>
        <ToastContainer toasts={toasts} onRemove={removeToast} />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8">
          <div>
            <h2 className="text-3xl font-bold text-center text-gray-900">
              Panel administracyjny
            </h2>
            <p className="mt-2 text-center text-gray-600">
              Zaloguj się, aby zarządzać kalendarzem
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
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? 'Logowanie...' : 'Zaloguj się'}
            </button>
          </form>
        </div>
      </div>
      </>
    )
  }

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Zarządzanie kalendarzem</h1>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="btn-secondary"
              disabled={loading}
            >
              Wyloguj się
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Dodaj nowe wydarzenie</h2>
          <form onSubmit={handleAddEvent} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tytuł *
              </label>
              <input
                type="text"
                required
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data rozpoczęcia *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={newEvent.start}
                  onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data zakończenia
                </label>
                <input
                  type="datetime-local"
                  value={newEvent.end}
                  onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lokalizacja
              </label>
              <input
                type="text"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opis
              </label>
              <textarea
                rows={4}
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="Opcjonalny opis wydarzenia..."
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Dodawanie...' : 'Dodaj wydarzenie'}
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Twoje wydarzenia</h2>
          {events.length === 0 ? (
            <p className="text-gray-600">Brak wydarzeń. Dodaj pierwsze wydarzenie powyżej.</p>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="card">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {event.title}
                      </h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>
                          <strong>Rozpoczęcie:</strong> {new Date(event.start).toLocaleString('pl-PL')}
                        </p>
                        {event.end && (
                          <p>
                            <strong>Zakończenie:</strong> {new Date(event.end).toLocaleString('pl-PL')}
                          </p>
                        )}
                        {event.location && (
                          <p>
                            <strong>Lokalizacja:</strong> {event.location}
                          </p>
                        )}
                        {event.description && (
                          <p className="mt-2">
                            <strong>Opis:</strong> {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm ml-4"
                      disabled={loading}
                    >
                      Usuń
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  )
}

