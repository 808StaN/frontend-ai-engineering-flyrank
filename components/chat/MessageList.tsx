import type { UIMessage } from 'ai'
import { ChatEmptyState } from '@/components/chat/ChatEmptyState'
import { MessageBubble } from '@/components/chat/MessageBubble'

type MessageListProps = {
  messages: UIMessage[]
  onUseExample: () => void
}

export function MessageList({ messages, onUseExample }: MessageListProps) {
  if (messages.length === 0) {
    return <ChatEmptyState onUseExample={onUseExample} />
  }

  return (
    <ol className="chat-message-list" aria-label="Conversation messages">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
    </ol>
  )
}
