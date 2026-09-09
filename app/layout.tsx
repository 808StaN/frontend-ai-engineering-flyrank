import type { Metadata } from 'next'
import { SiteNav } from '@/components/SiteNav'
import { FullscreenShaderHero } from '@/components/shader/FullscreenShaderHero'
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
        <div className="shader-app-background" aria-hidden="true">
          <FullscreenShaderHero />
        </div>
        <div className="relative z-10 flex min-h-screen flex-col">
          <a
            href="#main-content"
            className="sr-only fixed left-4 top-4 z-50 rounded-md bg-accent px-4 py-2 font-semibold text-accent-foreground focus:not-sr-only"
          >
            Skip to main content
          </a>
          <SiteNav />
          <main
            id="main-content"
            tabIndex={-1}
            className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8"
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
