'use client'

import { useState, useEffect } from 'react'
import { Voting } from '@/lib/supabase'

export default function VotingPage() {
  const [votings, setVotings] = useState<Voting[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [voteStatuses, setVoteStatuses] = useState<Record<number, boolean>>({})

  useEffect(() => {
    loadVotings()
  }, [])

  const loadVotings = async () => {
    try {
      const response = await fetch('/api/votings')
      if (response.ok) {
        const data = await response.json()
        setVotings(data)
        
        // Check vote status for each active voting
        const statusChecks = data
          .filter((voting: Voting) => voting.status === 'active')
          .map(async (voting: Voting) => {
            try {
              const statusResponse = await fetch(`/api/votings/${voting.id}/check-vote`)
              if (statusResponse.ok) {
                const statusData = await statusResponse.json()
                return { votingId: voting.id, hasVoted: statusData.hasVoted }
              }
            } catch (error) {
              console.error(`Error checking vote status for voting ${voting.id}:`, error)
            }
            return { votingId: voting.id, hasVoted: false }
          })
        
        const results = await Promise.all(statusChecks)
        const statusMap: Record<number, boolean> = {}
        results.forEach(result => {
          statusMap[result.votingId] = result.hasVoted
        })
        setVoteStatuses(statusMap)
      }
    } catch (error) {
      console.error('Error loading votings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Aktywne'
      case 'upcoming':
        return 'Nadchodzące'
      case 'closed':
        return 'Zakończone'
      default:
        return ''
    }
  }

  const getParticipationPercentage = (totalVotes: number, totalStudents: number = 25) => {
    return Math.round((totalVotes / totalStudents) * 100)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Return Button */}
          <div className="mb-6">
            <a 
              href="/" 
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Powrót do strony głównej
            </a>
          </div>

          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Ładowanie głosowań...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Return Button */}
        <div className="mb-6">
          <a 
            href="/" 
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Powrót do strony głównej
          </a>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Głosowania</h1>
          <p className="text-lg text-gray-600">
            Weź udział w głosowaniach i decyzjach dotyczących klasy
          </p>
        </div>

        <div className="space-y-6">
          {votings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Brak głosowań</p>
            </div>
          ) : (
            votings.map((item) => (
              <div key={item.id} className="card">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 mb-3">{item.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Termin zakończenia: {new Date(item.endDate).toLocaleDateString('pl-PL')}</span>
                      <span>Głosów: {item.totalVotes}</span>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(item.status)}`}>
                      {getStatusText(item.status)}
                    </span>
                  </div>
                </div>
                
                {/* Participation bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Frekwencja</span>
                    <span>{getParticipationPercentage(item.totalVotes)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getParticipationPercentage(item.totalVotes)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  {item.status === 'active' && !voteStatuses[item.id] && (
                    <a
                      href={`/voting/${item.id}`}
                      className="btn-primary flex-1 text-center"
                    >
                      Weź udział w głosowaniu
                    </a>
                  )}
                  {item.status === 'active' && voteStatuses[item.id] && (
                    <button
                      disabled
                      className="btn-secondary flex-1 text-center opacity-50 cursor-not-allowed"
                    >
                      ✓ Już głosowałeś
                    </button>
                  )}
                  {item.status === 'upcoming' && (
                    <button
                      disabled
                      className="btn-secondary flex-1 text-center opacity-50 cursor-not-allowed"
                    >
                      Głosowanie wkrótce
                    </button>
                  )}
                  {item.status === 'closed' && (
                    <button
                      disabled
                      className="btn-secondary flex-1 text-center opacity-50 cursor-not-allowed"
                    >
                      Głosowanie zakończone
                    </button>
                  )}
                  <a
                    href={`/voting/${item.id}/results`}
                    className="btn-secondary flex-1 text-center"
                  >
                    Zobacz wyniki
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
