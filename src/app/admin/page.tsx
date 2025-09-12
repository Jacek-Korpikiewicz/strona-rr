'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Announcement } from '@/lib/supabase'
import { Voting } from '@/lib/supabase'

export default function AdminPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [votings, setVotings] = useState<Voting[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'announcements' | 'votings'>('announcements')
  const [showAddForm, setShowAddForm] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    loadAnnouncements()
    loadVotings()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/check')
      if (!response.ok) {
        router.push('/admin/login')
      }
    } catch (error) {
      router.push('/admin/login')
    }
  }

  const loadAnnouncements = async () => {
    try {
      const response = await fetch('/api/admin/announcements')
      if (response.ok) {
        const data = await response.json()
        setAnnouncements(data)
      }
    } catch (error) {
      console.error('Error loading announcements:', error)
    }
  }

  const loadVotings = async () => {
    try {
      const response = await fetch('/api/votings')
      if (response.ok) {
        const data = await response.json()
        setVotings(data)
      }
    } catch (error) {
      console.error('Error loading votings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAnnouncement = async (id: number) => {
    if (!confirm('Czy na pewno chcesz usunąć to ogłoszenie?')) return

    try {
      const response = await fetch(`/api/admin/announcements/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        loadAnnouncements()
      }
    } catch (error) {
      console.error('Error deleting announcement:', error)
    }
  }

  const handleDeleteVoting = async (id: number) => {
    if (!confirm('Czy na pewno chcesz usunąć to głosowanie?')) return

    try {
      const response = await fetch(`/api/votings/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        loadVotings()
      }
    } catch (error) {
      console.error('Error deleting voting:', error)
    }
  }

  const handleLogout = () => {
    document.cookie = 'admin-token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
    router.push('/admin/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Ładowanie...</p>
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
            <div className="flex space-x-4">
              <Link href="/" className="btn-secondary">
                ← Powrót do strony
              </Link>
              <button onClick={handleLogout} className="btn-secondary">
                Wyloguj się
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('announcements')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'announcements'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Ogłoszenia
            </button>
            <button
              onClick={() => setActiveTab('votings')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'votings'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Głosowania
            </button>
          </nav>
        </div>

        {/* Announcements Tab */}
        {activeTab === 'announcements' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Ogłoszenia</h2>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="btn-primary"
              >
                {showAddForm ? 'Anuluj' : '+ Dodaj ogłoszenie'}
              </button>
            </div>

            {showAddForm && (
              <AddAnnouncementForm 
                onSuccess={() => {
                  setShowAddForm(false)
                  loadAnnouncements()
                }}
              />
            )}

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
                      <p className="text-gray-700 text-sm line-clamp-2">
                        {announcement.content.replace(/[#*`]/g, '').substring(0, 150)}...
                      </p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Link
                        href={`/admin/announcements/${announcement.id}/edit`}
                        className="btn-secondary text-sm"
                      >
                        Edytuj
                      </Link>
                      <button
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Usuń
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Votings Tab */}
        {activeTab === 'votings' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Głosowania</h2>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="btn-primary"
              >
                {showAddForm ? 'Anuluj' : '+ Dodaj głosowanie'}
              </button>
            </div>

            {showAddForm && (
              <AddVotingForm 
                onSuccess={() => {
                  setShowAddForm(false)
                  loadVotings()
                }}
              />
            )}

            <div className="space-y-4">
              {votings.map((voting) => (
                <div key={voting.id} className="card">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {voting.title}
                      </h3>
                      <p className="text-gray-600 mb-3">{voting.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <span>Status: {voting.status}</span>
                        <span>Data zakończenia: {new Date(voting.endDate).toLocaleDateString('pl-PL')}</span>
                        <span>Głosów: {voting.totalVotes}</span>
                        <span>Opcji: {voting.options.length}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleDeleteVoting(voting.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Usuń
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function AddAnnouncementForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    author: '',
    category: '',
    content: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          date: new Date().toISOString().split('T')[0]
        }),
      })

      if (response.ok) {
        onSuccess()
        setFormData({
          title: '',
          priority: 'medium',
          author: '',
          category: '',
          content: ''
        })
      }
    } catch (error) {
      console.error('Error creating announcement:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="card mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Dodaj nowe ogłoszenie</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tytuł *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priorytet
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'high' | 'medium' | 'low' })}
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
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
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
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
            rows={8}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            placeholder="Wpisz treść ogłoszenia w formacie Markdown..."
          />
          <p className="text-xs text-gray-500 mt-1">
            Możesz używać Markdown: **pogrubienie**, *kursywa*, # nagłówki, - listy, itp.
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => onSuccess()}
            className="btn-secondary"
          >
            Anuluj
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary disabled:opacity-50"
          >
            {isSubmitting ? 'Zapisywanie...' : 'Zapisz ogłoszenie'}
          </button>
        </div>
      </form>
    </div>
  )
}

function AddVotingForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    endDate: '',
    options: ['', '']
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, '']
    })
  }

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      setFormData({
        ...formData,
        options: formData.options.filter((_, i) => i !== index)
      })
    }
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options]
    newOptions[index] = value
    setFormData({
      ...formData,
      options: newOptions
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const validOptions = formData.options.filter(option => option.trim() !== '')
      
      if (validOptions.length < 2) {
        alert('Musisz podać co najmniej 2 opcje')
        setIsSubmitting(false)
        return
      }

      const response = await fetch('/api/votings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          endDate: formData.endDate,
          options: validOptions
        }),
      })

      if (response.ok) {
        onSuccess()
        setFormData({
          title: '',
          description: '',
          endDate: '',
          options: ['', '']
        })
      } else {
        const error = await response.json()
        alert(error.error || 'Błąd podczas tworzenia głosowania')
      }
    } catch (error) {
      console.error('Error creating voting:', error)
      alert('Błąd podczas tworzenia głosowania')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="card mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Dodaj nowe głosowanie</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pytanie głosowania *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            placeholder="np. Wybór terminu wycieczki klasowej"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Opis głosowania *
          </label>
          <textarea
            required
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            placeholder="Dodatkowe informacje o głosowaniu..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data zakończenia głosowania *
          </label>
          <input
            type="datetime-local"
            required
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            min={new Date().toISOString().slice(0, 16)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Opcje głosowania *
          </label>
          <div className="space-y-2">
            {formData.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  required
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder={`Opcja ${index + 1}`}
                />
                {formData.options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="px-3 py-2 text-red-600 hover:text-red-800"
                  >
                    Usuń
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addOption}
              className="text-primary-600 hover:text-primary-800 text-sm font-medium"
            >
              + Dodaj opcję
            </button>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => onSuccess()}
            className="btn-secondary"
          >
            Anuluj
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary disabled:opacity-50"
          >
            {isSubmitting ? 'Zapisywanie...' : 'Zapisz głosowanie'}
          </button>
        </div>
      </form>
    </div>
  )
}
