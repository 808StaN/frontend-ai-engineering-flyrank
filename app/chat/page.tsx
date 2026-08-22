import { ChatInterface } from '@/components/chat/ChatInterface'
import KineticGrid from '@/components/ui/kinetic-grid'

export const metadata = {
  title: 'AI Chat | FlyRank Capstone',
  description: 'Streaming AI conversation for capstone planning and review.',
}

export default function ChatPage() {
  return (
    <KineticGrid className="chat-page-shell">
      <div className="chat-page-shell__content">
        <ChatInterface />
      </div>
    </KineticGrid>
  )
}
