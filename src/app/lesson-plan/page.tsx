'use client'

import { useEffect, useState } from 'react'
import { supabase, Announcement } from '@/lib/supabase'

export default function LessonPlanPage() {
  const [currentPlan, setCurrentPlan] = useState<Announcement | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadCurrentPlan()
  }, [])

  const loadCurrentPlan = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('category', 'Plan')
        .order('created_at', { ascending: false })
        .limit(1)

      if (error) {
        console.error('Error loading lesson plan:', error)
        return
      }

      if (data && data.length > 0) {
        setCurrentPlan(data[0])
      }
    } catch (error) {
      console.error('Error loading lesson plan:', error)
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
            <p className="mt-4 text-gray-600">Ładowanie planu lekcji...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!currentPlan) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Plan lekcji</h1>
            <p className="text-gray-600 mb-8">Aktualnie nie ma dostępnego planu lekcji.</p>
            <a href="/announcements" className="btn-primary">Zobacz ogłoszenia</a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Plan lekcji</h1>
          <p className="text-gray-600">
            Ostatnia aktualizacja: {new Date(currentPlan.date).toLocaleDateString('pl-PL')}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {currentPlan.image_url ? (
            <div className="p-4">
              <img
                src={currentPlan.image_url}
                alt={currentPlan.title}
                className="w-full h-auto rounded-lg shadow-sm"
                style={{ maxHeight: '80vh', objectFit: 'contain' }}
              />
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500">Brak obrazu planu lekcji</p>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <a href="/announcements" className="btn-secondary">
            ← Powrót do ogłoszeń
          </a>
        </div>
      </div>
    </div>
  )
}
