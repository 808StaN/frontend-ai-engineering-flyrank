'use client'

type ChatErrorBoundaryProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ChatErrorBoundary({
  error,
  reset,
}: ChatErrorBoundaryProps) {
  return (
    <section className="chat-page-shell" aria-labelledby="chat-page-error-title">
      <div className="chat-page-shell__content">
        <div className="chat-route-error" role="alert">
          <p className="text-sm font-medium uppercase tracking-wide text-accent">
            Chat unavailable
          </p>
          <h1 id="chat-page-error-title">The chat page could not load.</h1>
          <p>
            Refresh this part of the page to try again. Your saved work is not
            affected.
          </p>
          <button type="button" onClick={reset}>
            Reload chat
          </button>
          {error.digest && <span className="sr-only">Error reference: {error.digest}</span>}
        </div>
      </div>
    </section>
  )
}
