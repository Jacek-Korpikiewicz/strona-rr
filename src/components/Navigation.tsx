'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-center space-x-4 py-4">
          <Link
            href="/"
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              pathname === '/'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Wydarzenia
          </Link>
          <Link
            href="/wplaty"
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              pathname === '/wplaty'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Wpłaty
          </Link>
          <Link
            href="/notatki"
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              pathname === '/notatki'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Notatki
          </Link>
        </div>
      </div>
    </nav>
  )
}

