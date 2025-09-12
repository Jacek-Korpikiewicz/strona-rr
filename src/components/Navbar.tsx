'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">Ib</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Klasa Ib SP398</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            <Link href="/" className="nav-link">
              Strona główna
            </Link>
            <Link href="/announcements" className="nav-link">
              Ogłoszenia
            </Link>
            <Link href="/lesson-plan" className="nav-link">
              Plan lekcji
            </Link>
            <Link href="/voting" className="nav-link">
              Głosowania
            </Link>
            <Link href="/admin" className="nav-link text-primary-600">
              Admin
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              <Link href="/" className="px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-md transition-colors">
                Strona główna
              </Link>
              <Link href="/announcements" className="px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-md transition-colors">
                Ogłoszenia
              </Link>
              <Link href="/lesson-plan" className="px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-md transition-colors">
                Plan lekcji
              </Link>
              <Link href="/voting" className="px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-md transition-colors">
                Głosowania
              </Link>
              <Link href="/admin" className="px-4 py-3 text-primary-600 hover:text-primary-800 hover:bg-gray-100 rounded-md transition-colors">
                Admin
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
