import {
  useEffect,
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

  useEffect(() => {
    const textarea = textareaRef.current

    if (!textarea) {
      return
    }

    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`
  }, [input])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSend()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()

      if (!isGenerating && input.trim()) {
        onSend()
      }
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
        rows={1}
        onChange={(event) => onInputChange(event.currentTarget.value)}
        onKeyDown={handleKeyDown}
      />
      <div className="chat-composer__actions">
        {isGenerating ? (
          <button
            type="button"
            className="chat-stop-button"
            aria-label="Stop generating"
            title="Stop generating"
            onClick={onStop}
          >
            <span aria-hidden="true">■</span>
          </button>
        ) : (
          <button
            type="submit"
            className="chat-send-button"
            aria-label="Send message"
            title="Send message"
            disabled={input.trim().length === 0}
          >
            <span aria-hidden="true">↑</span>
          </button>
        )}
      </div>
    </form>
  )
}
