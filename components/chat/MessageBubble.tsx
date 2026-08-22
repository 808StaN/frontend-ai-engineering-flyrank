import type { UIMessage } from 'ai'

type MessageBubbleProps = {
  message: UIMessage
}

function getTextParts(message: UIMessage): string {
  return message.parts
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('')
}

export function MessageBubble({ message }: MessageBubbleProps) {
  if (message.role === 'system') {
    return null
  }

  const text = getTextParts(message)
  const isUser = message.role === 'user'

  return (
    <li className={`chat-message ${isUser ? 'chat-message--user' : 'chat-message--assistant'}`}>
      <article className="chat-message__bubble">
        <p className="chat-message__role">{isUser ? 'You' : 'FlyRank Advisor'}</p>
        <div className="chat-message__text">{text || '…'}</div>
      </article>
    </li>
  )
}
