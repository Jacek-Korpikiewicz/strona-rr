'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Voting } from '@/lib/supabase'

export default function VotingResultsPage() {
  const params = useParams()
  const votingId = parseInt(params.id as string)
  const [voting, setVoting] = useState<Voting | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadVoting()
  }, [votingId])

  const loadVoting = async () => {
    try {
      const response = await fetch(`/api/votings/${votingId}`)
      if (response.ok) {
        const data = await response.json()
        setVoting(data)
      }
    } catch (error) {
      console.error('Error loading voting:', error)
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
            <p className="mt-4 text-gray-600">Ładowanie wyników...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!voting) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Głosowanie nie znalezione</h1>
            <p className="text-gray-600 mb-8">Przepraszamy, ale to głosowanie nie istnieje.</p>
            <a href="/voting" className="btn-primary">Powrót do głosowań</a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="card">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{voting.title}</h1>
            <p className="text-lg text-gray-600 mb-4">{voting.description}</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Termin zakończenia: {new Date(voting.endDate).toLocaleDateString('pl-PL')}</span>
              <span>Głosów: {voting.totalVotes}</span>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Wyniki głosowania:</h2>
            {voting.options.map((option) => {
              const percentage = voting.totalVotes > 0 ? (option.votes / voting.totalVotes) * 100 : 0
              return (
                <div key={option.id} className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{option.text}</span>
                    <span>{option.votes} głosów ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-primary-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Łączna liczba głosów:</strong> {voting.totalVotes}
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <a href="/voting" className="btn-secondary">
              ← Powrót do wszystkich głosowań
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}