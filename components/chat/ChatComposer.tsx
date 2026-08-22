import {
  useRef,
  type FormEvent,
  type KeyboardEvent,
} from 'react'

type ChatComposerProps = {
  input: string
  status: 'submitted' | 'streaming' | 'ready' | 'error'
  onInputChange: (value: string) => void
  onSend: () => void
  onStop: () => void
}

export function ChatComposer({
  input,
  status,
  onInputChange,
  onSend,
  onStop,
}: ChatComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isGenerating = status === 'submitted' || status === 'streaming'

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSend()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      onSend()
    }
  }

  return (
    <form className="chat-composer" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="chat-message">
        Message FlyRank Advisor
      </label>
      <textarea
        ref={textareaRef}
        id="chat-message"
        className="chat-composer__textarea"
        placeholder="Ask about your capstone…"
        value={input}
        disabled={isGenerating}
        rows={3}
        onChange={(event) => onInputChange(event.currentTarget.value)}
        onKeyDown={handleKeyDown}
      />
      <div className="chat-composer__actions">
        <p className="text-xs text-muted">Enter to send · Shift + Enter for a new line</p>
        {isGenerating ? (
          <button type="button" className="chat-stop-button" onClick={onStop}>
            Stop generating
          </button>
        ) : (
          <button
            type="submit"
            className="chat-send-button"
            disabled={input.trim().length === 0}
          >
            Send message
          </button>
        )}
      </div>
    </form>
  )
}
