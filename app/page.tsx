import Link from 'next/link'
import { FullscreenShaderHero } from '@/components/shader/FullscreenShaderHero'

export default function DashboardPage() {
  return (
    <section className="shader-hero" aria-labelledby="dashboard-title">
      <FullscreenShaderHero />
      <div className="shader-hero__content">
        <div className="shader-hero__panel">
          <p className="shader-hero__eyebrow">Frontend AI Engineering</p>
          <h1 id="dashboard-title">Build the next signal.</h1>
          <p className="shader-hero__description">
            FlyRank turns a focused workflow into a polished capstone: stream
            AI guidance, validate the experience, and ship each iteration with
            confidence.
          </p>
          <div className="shader-hero__actions">
            <Link href="/chat" className="shader-hero__primary-action">
              Open AI chat
            </Link>
            <Link href="/viewer" className="shader-hero__secondary-action">
              Explore product viewer
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
