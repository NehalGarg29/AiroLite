import type { Metadata } from 'next'
import Sidebar from '@/components/Sidebar'
import './globals.css'

export const metadata: Metadata = {
  title: 'AIRO Lite',
  description: 'AI Resource Optimization for Logistics — built for KW International',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{
          marginLeft: '240px',
          flex: 1,
          minHeight: '100vh',
          padding: '32px',
          backgroundColor: '#0f1117',
        }}>
          {children}
        </main>
      </body>
    </html>
  )
}