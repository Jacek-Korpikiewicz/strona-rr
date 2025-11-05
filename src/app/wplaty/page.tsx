'use client'

import { useState, useEffect } from 'react'

interface PaymentEntry {
  class: string
  max: number
  wplacone: number
}

// Animated bar component that fills from 0% to target percentage
function AnimatedBar({ percentage, color, delay = 0 }: { percentage: number; color: string; delay?: number }) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0)

  useEffect(() => {
    // Reset to 0 when percentage changes
    setAnimatedPercentage(0)
    
    // Animation duration in milliseconds
    const duration = 1200
    let startTime: number | null = null
    const targetPercentage = Math.min(percentage, 100)

    const animate = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp
      }
      
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function for smooth animation (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentPercentage = easeOut * targetPercentage

      setAnimatedPercentage(currentPercentage)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setAnimatedPercentage(targetPercentage)
      }
    }

    // Start animation after delay
    const timeoutId = setTimeout(() => {
      requestAnimationFrame(animate)
    }, delay)

    return () => clearTimeout(timeoutId)
  }, [percentage, delay])

  return (
    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
      <div
        className={`h-4 rounded-full transition-all duration-75 ${color}`}
        style={{ width: `${animatedPercentage}%` }}
      />
    </div>
  )
}

export default function WplatyPage() {
  const [przedszkoleData, setPrzedszkoleData] = useState<PaymentEntry[]>([])
  const [szkolaData, setSzkolaData] = useState<PaymentEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [animationStarted, setAnimationStarted] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    // Start animation after data is loaded
    if (!loading && (przedszkoleData.length > 0 || szkolaData.length > 0)) {
      setAnimationStarted(true)
    }
  }, [loading, przedszkoleData.length, szkolaData.length])

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
                {animationStarted ? (
                  <AnimatedBar 
                    percentage={percentage} 
                    color={percentageColor} 
                    delay={index * 50} // Stagger animation by 50ms per item
                  />
                ) : (
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className="h-4 rounded-full bg-gray-300" style={{ width: '0%' }} />
                  </div>
                )}
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

