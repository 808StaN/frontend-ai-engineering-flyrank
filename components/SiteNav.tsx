'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navItems } from '@/lib/navigation'
import { MobileNavToggle } from '@/components/MobileNavToggle'

export function SiteNav() {
  const pathname = usePathname()

  return (
    <header className="relative z-20 h-20 border-b border-accent/20 bg-[#04091b]/35 backdrop-blur-md">
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
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(`${item.href}/`))

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`relative px-3 py-2 text-sm font-medium no-underline after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:origin-left after:bg-accent after:transition-transform after:duration-200 hover:text-accent hover:no-underline ${
                  isActive
                    ? 'text-accent after:scale-x-100'
                    : 'text-foreground after:scale-x-0 hover:after:scale-x-100'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <MobileNavToggle />
      </div>
    </header>
  )
}
