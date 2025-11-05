'use client'

import { useState, useEffect } from 'react'

interface PaymentEntry {
  class: string
  max: number
  wplacone: number
}

export default function WplatyPage() {
  const [przedszkoleData, setPrzedszkoleData] = useState<PaymentEntry[]>([])
  const [szkolaData, setSzkolaData] = useState<PaymentEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch('/api/wplaty')
      if (response.ok) {
        const data = await response.json()
        setPrzedszkoleData(data.przedszkole || [])
        setSzkolaData(data.szkola || [])
      }
    } catch (error) {
      console.error('Error fetching payments data:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderPaymentList = (data: PaymentEntry[], title: string) => {
    // Sort by wplacone/max ratio descending (highest percentage first)
    const sortedData = [...data].sort((a, b) => {
      const ratioA = a.wplacone / a.max
      const ratioB = b.wplacone / b.max
      return ratioB - ratioA
    })

    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
        <div className="space-y-4">
          {sortedData.map((item, index) => {
            const percentage = (item.wplacone / item.max) * 100
            const percentageColor = percentage >= 100 
              ? 'bg-green-500' 
              : percentage >= 50 
                ? 'bg-yellow-500' 
                : 'bg-red-500'
            
            return (
              <div key={index} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-semibold text-gray-900">{item.class}</span>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {item.wplacone} / {item.max} zł
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full transition-all duration-300 ${percentageColor}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Wpłaty na Radę Rodziców</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {renderPaymentList(przedszkoleData, 'Przedszkole')}
            {renderPaymentList(szkolaData, 'Szkoła')}
          </div>
        </div>
      </div>
    </div>
  )
}

