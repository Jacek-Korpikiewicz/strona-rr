import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Klasa Ib SP398',
  description: 'Strona internetowa Klasa Ib SP398 - centralne miejsce informacji i głosowań dla rodziców',
  keywords: 'klasa Ib, szkoła, SP 398, informacje, głosowania',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl">
      <body className={inter.className}>
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
