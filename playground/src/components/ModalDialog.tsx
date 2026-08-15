import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter((element) => {
    return (
      !element.hasAttribute('disabled') &&
      element.getAttribute('aria-hidden') !== 'true'
    )
  })
}

export type ModalDialogProps = {
  triggerLabel: string
  title: string
  description?: string
  children: ReactNode
}

export function ModalDialog({
  triggerLabel,
  title,
  description,
  children,
}: ModalDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const titleId = useId()
  const descriptionId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const dialog = dialogRef.current
    if (!dialog) {
      return
    }

    const opener = triggerRef.current
    const focusable = getFocusableElements(dialog)
    const initialFocus = focusable[0] ?? dialog
    initialFocus.focus()

    const root = document.getElementById('root')
    const previousInert = root?.inert ?? false
    if (root) {
      root.inert = true
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) {
        return
      }

      const elements = getFocusableElements(dialogRef.current)
      if (elements.length === 0) {
        event.preventDefault()
        dialogRef.current.focus()
        return
      }

      const first = elements[0]
      const last = elements[elements.length - 1]
      if (!first || !last) {
        return
      }

      const active = document.activeElement

      if (event.shiftKey) {
        if (active === first || !dialogRef.current.contains(active)) {
          event.preventDefault()
          last.focus()
        }
        return
      }

      if (active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      if (root) {
        root.inert = previousInert
      }
      opener?.focus()
    }
  }, [isOpen, close])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="fe05-button"
        onClick={() => setIsOpen(true)}
      >
        {triggerLabel}
      </button>
      {isOpen
        ? createPortal(
            <div className="fe05-modal-root">
              <div className="fe05-modal-backdrop" onClick={close} />
              <div
                ref={dialogRef}
                className="fe05-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={description ? descriptionId : undefined}
                tabIndex={-1}
              >
                <div className="fe05-modal__header">
                  <h3 id={titleId} className="fe05-modal__title">
                    {title}
                  </h3>
                  <button
                    type="button"
                    className="fe05-button fe05-button--ghost"
                    aria-label="Close dialog"
                    onClick={close}
                  >
                    Close
                  </button>
                </div>
                {description ? (
                  <p id={descriptionId} className="fe05-modal__description">
                    {description}
                  </p>
                ) : null}
                <div className="fe05-modal__body">{children}</div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
