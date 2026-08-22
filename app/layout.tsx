import type { Metadata } from 'next'
import { SiteNav } from '@/components/SiteNav'
import KineticGrid from '@/components/ui/kinetic-grid'
import './globals.css'

export const metadata: Metadata = {
  title: 'FlyRank Capstone',
  description: 'Frontend AI Engineering capstone skeleton',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <KineticGrid>
          <div className="relative flex min-h-screen flex-col">
            <SiteNav />
            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
              {children}
            </main>
          </div>
        </KineticGrid>
      </body>
    </html>
  )
}
