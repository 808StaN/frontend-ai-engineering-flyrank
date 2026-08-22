import Link from 'next/link'
import { navItems } from '@/lib/navigation'
import { MobileNavToggle } from '@/components/MobileNavToggle'

export function SiteNav() {
  return (
    <header className="relative z-20 border-b border-white/10 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <Link
            href="/"
            className="text-lg font-semibold text-foreground no-underline hover:no-underline"
          >
            FlyRank Capstone
          </Link>
          <p className="text-sm text-muted">Frontend AI Engineering</p>
        </div>

        <nav
          id="site-navigation"
          className="hidden items-center gap-1 md:flex"
          aria-label="Main navigation"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground no-underline hover:bg-white/10 hover:no-underline"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <MobileNavToggle />
      </div>
    </header>
  )
}
