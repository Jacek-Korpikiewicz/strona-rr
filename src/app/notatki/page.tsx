'use client'

import { useState, useEffect } from 'react'

interface PdfFile {
  name: string
  path: string
}

export default function NotatkiPage() {
  const [pdfFiles, setPdfFiles] = useState<PdfFile[]>([])
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPdfList()
  }, [])

  const fetchPdfList = async () => {
    try {
      const response = await fetch('/api/notatki/list')
      const data = await response.json()
      
      if (response.ok) {
        console.log('PDF files received:', data)
        setPdfFiles(data)
      } else {
        console.error('Error response from API:', data)
        console.error('Status:', response.status)
      }
    } catch (error) {
      console.error('Error fetching PDF list:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePdfClick = (pdfPath: string) => {
    setSelectedPdf(pdfPath)
  }

  const handleClosePdf = () => {
    setSelectedPdf(null)
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
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Notatki</h1>
          
          <div className={`flex gap-6 transition-all duration-300 ${
            selectedPdf ? 'flex-row' : 'flex-col'
          }`}>
            {/* PDF List */}
            <div className={`bg-white rounded-lg shadow-md p-4 lg:p-6 transition-all duration-300 ${
              selectedPdf ? 'w-full lg:w-1/5' : 'w-full'
            }`}>
              <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4">Lista notatek</h2>
              
              {pdfFiles.length === 0 ? (
                <p className="text-gray-600 text-sm lg:text-base">Brak dostępnych notatek.</p>
              ) : (
                <div className="space-y-2 max-h-[calc(100vh-200px)] lg:max-h-[calc(100vh-250px)] overflow-y-auto">
                  {pdfFiles.map((pdf, index) => (
                    <button
                      key={index}
                      onClick={() => handlePdfClick(pdf.path)}
                      className={`w-full text-left p-3 lg:p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                        selectedPdf === pdf.path
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2 lg:space-x-3">
                        <svg className="w-5 h-5 lg:w-6 lg:h-6 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm lg:text-base text-gray-900 font-medium truncate">{pdf.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* PDF Viewer */}
            {selectedPdf && (
              <div className="w-full lg:w-4/5 bg-white rounded-lg shadow-md p-4 lg:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Podgląd</h2>
                  <button
                    onClick={handleClosePdf}
                    className="text-gray-500 hover:text-gray-700 transition-colors p-1"
                    aria-label="Zamknij podgląd"
                  >
                    <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="border border-gray-200 rounded-lg overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
                  <iframe
                    src={selectedPdf}
                    className="w-full h-full"
                    title="PDF Viewer"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

