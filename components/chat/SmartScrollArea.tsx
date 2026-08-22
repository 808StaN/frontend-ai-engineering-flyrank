import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type UIEvent,
} from 'react'

type SmartScrollAreaProps = {
  children: ReactNode
  followStream: boolean
}

const BOTTOM_THRESHOLD = 32

export function SmartScrollArea({
  children,
  followStream,
}: SmartScrollAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPinnedToBottom, setIsPinnedToBottom] = useState(true)

  function scrollToLatest() {
    const container = scrollRef.current
    if (!container) {
      return
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    })
    setIsPinnedToBottom(true)
  }

  function handleScroll(event: UIEvent<HTMLDivElement>) {
    const container = event.currentTarget
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight

    setIsPinnedToBottom(distanceFromBottom <= BOTTOM_THRESHOLD)
  }

  useEffect(() => {
    const container = scrollRef.current

    if (!container || !isPinnedToBottom) {
      return
    }

    container.scrollTop = container.scrollHeight
  }, [children, followStream, isPinnedToBottom])

  return (
    <div className="chat-scroll-wrap">
      <div
        ref={scrollRef}
        className="chat-scroll-area"
        onScroll={handleScroll}
      >
        {children}
      </div>
      {!isPinnedToBottom && (
        <button
          type="button"
          className="chat-jump-button"
          onClick={scrollToLatest}
        >
          Jump to latest
        </button>
      )}
    </div>
  )
}
