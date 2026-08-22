import type { UIMessage } from 'ai'
import { CapstoneReviewCard } from '@/components/chat/CapstoneReviewCard'

type MessageBubbleProps = {
  message: UIMessage
}

type CapstoneReviewToolPart = {
  type: 'tool-reviewCapstonePlan'
  toolCallId: string
  state:
    | 'input-streaming'
    | 'input-available'
    | 'output-available'
    | 'output-error'
  input?: unknown
  output?: unknown
  errorText?: string
}

function getTextParts(message: UIMessage): string {
  return message.parts
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('')
}

function isCapstoneReviewToolPart(
  part: UIMessage['parts'][number],
): part is UIMessage['parts'][number] & CapstoneReviewToolPart {
  return part.type === 'tool-reviewCapstonePlan' && 'state' in part
}

export function MessageBubble({ message }: MessageBubbleProps) {
  if (message.role === 'system') {
    return null
  }

  const text = getTextParts(message)
  const isUser = message.role === 'user'
  const reviewParts = message.parts.filter(isCapstoneReviewToolPart)

  return (
    <li className={`chat-message ${isUser ? 'chat-message--user' : 'chat-message--assistant'}`}>
      <article className="chat-message__bubble">
        <p className="chat-message__role">{isUser ? 'You' : 'FlyRank Advisor'}</p>
        {text && <div className="chat-message__text">{text}</div>}
        {reviewParts.map((part) => (
          <CapstoneReviewCard
            key={`${part.toolCallId}-${part.state}`}
            state={part.state}
            input={part.input}
            output={part.output}
            errorText={part.errorText}
          />
        ))}
        {!text && reviewParts.length === 0 && (
          <div className="chat-message__text">…</div>
        )}
      </article>
    </li>
  )
}
