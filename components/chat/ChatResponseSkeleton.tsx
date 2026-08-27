type ChatResponseSkeletonProps = {
  visible: boolean
}

export function ChatResponseSkeleton({
  visible,
}: ChatResponseSkeletonProps) {
  if (!visible) {
    return null
  }

  return (
    <div className="chat-response-skeleton" role="status" aria-live="polite">
      <span className="sr-only">Preparing the assistant response</span>
      <span />
      <span />
      <span />
    </div>
  )
}
