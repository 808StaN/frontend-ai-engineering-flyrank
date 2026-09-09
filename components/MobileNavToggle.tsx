'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { navItems } from '@/lib/navigation'

export function MobileNavToggle() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="rounded-md border border-white/10 bg-[#071126]/65 px-3 py-2 text-sm font-medium text-foreground backdrop-blur-md hover:bg-accent/10"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen((current) => !current)}
      >
        {open ? 'Close menu' : 'Open menu'}
      </button>

      {open && (
        <nav
          id="mobile-navigation"
          className="absolute left-0 right-0 top-[4.5rem] z-20 border-b border-white/10 bg-background/95 px-4 py-3 shadow-lg shadow-black/30 backdrop-blur-md"
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(`${item.href}/`))

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={`relative block px-3 py-2 text-sm font-medium no-underline after:absolute after:bottom-1 after:left-3 after:right-3 after:h-0.5 after:origin-left after:bg-accent after:transition-transform after:duration-200 hover:text-accent hover:no-underline ${
                      isActive
                        ? 'text-accent after:scale-x-100'
                        : 'text-foreground after:scale-x-0 hover:after:scale-x-100'
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      )}
    </div>
  )
}
