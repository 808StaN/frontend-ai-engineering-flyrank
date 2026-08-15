import { useId, useState, type ReactNode } from 'react'

export type DisclosureProps = {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}

export function Disclosure({
  title,
  children,
  defaultOpen = false,
}: DisclosureProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const contentId = useId()

  return (
    <div className="fe05-disclosure">
      <button
        type="button"
        className="fe05-disclosure__trigger"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span aria-hidden="true">{isOpen ? '▾' : '▸'}</span>
        {title}
      </button>
      <div id={contentId} className="fe05-disclosure__content" hidden={!isOpen}>
        {children}
      </div>
    </div>
  )
}
