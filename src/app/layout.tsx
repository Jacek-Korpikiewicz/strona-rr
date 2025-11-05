import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Kalendarz',
  description: 'Kalendarz wydarzeń - połączony z Google Calendar',
  keywords: 'kalendarz, wydarzenia',
}

import Navigation from '@/components/Navigation'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl">
      <body className={inter.className}>
        <div className="min-h-screen">
          <Navigation />
          {children}
        </div>
      </body>
    </html>
  )
}
