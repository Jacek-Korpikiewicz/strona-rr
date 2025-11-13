'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div 
          className="flex space-x-4 py-4 overflow-x-auto lg:justify-center lg:overflow-x-visible"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#cbd5e1 transparent',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <Link
            href="/"
            className={`px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
              pathname === '/'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Wydarzenia
          </Link>
          <Link
            href="/wplaty"
            className={`px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
              pathname === '/wplaty'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Wpłaty
          </Link>
          <Link
            href="/notatki"
            className={`px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
              pathname === '/notatki'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Notatki
          </Link>
          <Link
            href="/newsletter"
            className={`px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
              pathname === '/newsletter'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Newsletter
          </Link>
        </div>
      </div>
    </nav>
  )
}

