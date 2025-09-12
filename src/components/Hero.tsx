'use client'

import { useState } from 'react'

export default function Hero() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-primary-600 font-bold text-lg">Ib</span>
            </div>
            <h1 className="text-xl font-bold">Klasa Ib SP398</h1>
          </div>

          {/* Desktop Quick Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <a 
              href="/announcements" 
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              Ogłoszenia
            </a>
            <a 
              href="/lesson-plan" 
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              Plan lekcji
            </a>
            <a 
              href="#voting" 
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              Głosowania
            </a>
            <a 
              href="/admin" 
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              Admin
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/20 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            <div className="flex flex-col space-y-2">
              <a 
                href="/announcements" 
                className="px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Ogłoszenia
              </a>
              <a 
                href="/lesson-plan" 
                className="px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Plan lekcji
              </a>
              <a 
                href="#voting" 
                className="px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Głosowania
              </a>
              <a 
                href="/admin" 
                className="px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
