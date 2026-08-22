import type { UIMessage } from 'ai'
import { MessageBubble } from '@/components/chat/MessageBubble'

type MessageListProps = {
  messages: UIMessage[]
}

export function MessageList({ messages }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="chat-empty-state">
        <p className="text-sm font-medium text-foreground">Start a capstone conversation</p>
        <p className="mt-1 text-sm text-muted">
          Ask for help with architecture, implementation, testing, or an AI workflow review.
        </p>
      </div>
    )
  }

  return (
    <ol className="chat-message-list" aria-label="Conversation messages">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
    </ol>
  )
}
