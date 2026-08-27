type ChatErrorNoticeProps = {
  error: Error
  isRetrying: boolean
  onRetry: () => void
}

function getUserFacingErrorMessage(error: Error) {
  const message = error.message.toLowerCase()

  if (message.includes('too many requests')) {
    return 'You are sending messages too quickly. Wait a moment, then retry.'
  }

  if (
    message.includes('failed to fetch') ||
    message.includes('network') ||
    message.includes('offline')
  ) {
    return 'Your connection to the chat service was interrupted. Check your network, then retry.'
  }

  if (message.includes('interrupted')) {
    return 'The response was interrupted. Any partial answer remains available.'
  }

  if (message.includes('temporarily unavailable')) {
    return 'The chat service is temporarily unavailable. Try your message again in a moment.'
  }

  return 'The assistant could not complete this response. Your conversation is still available.'
}

export function ChatErrorNotice({
  error,
  isRetrying,
  onRetry,
}: ChatErrorNoticeProps) {
  return (
    <div className="chat-error" role="alert">
      <p>{getUserFacingErrorMessage(error)}</p>
      <button
        type="button"
        className="chat-error__retry"
        disabled={isRetrying}
        onClick={onRetry}
      >
        {isRetrying ? 'Retrying…' : 'Try again'}
      </button>
    </div>
  )
}
