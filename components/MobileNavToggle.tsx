'use client'

import Link from 'next/link'
import { useState } from 'react'
import { navItems } from '@/lib/navigation'

export function MobileNavToggle() {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen((current) => !current)}
      >
        {open ? 'Close menu' : 'Open menu'}
      </button>

      {open && (
        <nav
          id="mobile-navigation"
          className="absolute left-0 right-0 top-[4.5rem] z-10 border-b border-border bg-surface px-4 py-3 shadow-sm"
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-foreground no-underline hover:bg-surface-muted hover:no-underline"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  )
}
