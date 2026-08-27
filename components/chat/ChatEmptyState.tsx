type ChatEmptyStateProps = {
  onUseExample: () => void
}

export function ChatEmptyState({ onUseExample }: ChatEmptyStateProps) {
  return (
    <div className="chat-empty-state">
      <p className="text-sm font-medium text-foreground">
        Start a capstone conversation
      </p>
      <p className="mt-1 max-w-md text-sm text-muted">
        Ask for help with architecture, implementation, testing, or an AI
        workflow review.
      </p>
      <button
        type="button"
        className="chat-empty-state__example"
        onClick={onUseExample}
      >
        Try an example question
      </button>
    </div>
  )
}
