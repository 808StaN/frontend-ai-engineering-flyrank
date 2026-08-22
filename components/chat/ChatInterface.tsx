'use client'

import { DefaultChatTransport } from 'ai'
import { useChat } from '@ai-sdk/react'
import { useMemo, useState } from 'react'
import { ChatComposer } from '@/components/chat/ChatComposer'
import { MessageList } from '@/components/chat/MessageList'
import { SmartScrollArea } from '@/components/chat/SmartScrollArea'
import { ThinkingIndicator } from '@/components/chat/ThinkingIndicator'

export function ChatInterface() {
  const [input, setInput] = useState('')
  const transport = useMemo(
    () => new DefaultChatTransport({ api: '/api/chat' }),
    [],
  )
  const { messages, sendMessage, status, stop, error, clearError } = useChat({
    transport,
  })

  const isGenerating = status === 'submitted' || status === 'streaming'
  const latestMessage = messages.at(-1)
  const latestAssistantHasText =
    latestMessage?.role === 'assistant' &&
    latestMessage.parts.some(
      (part) => part.type === 'text' && part.text.length > 0,
    )
  const isThinking = isGenerating && !latestAssistantHasText

  function sendCurrentMessage() {
    const text = input.trim()

    if (!text || isGenerating) {
      return
    }

    clearError()
    setInput('')
    void sendMessage({ text })
  }

  function stopGeneration() {
    stop()
  }

  return (
    <section className="chat-interface" aria-labelledby="chat-title">
      <header className="chat-interface__header">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-accent">
            Central AI interaction
          </p>
          <h1 id="chat-title" className="mt-1 text-2xl font-semibold sm:text-3xl">
            FlyRank Capstone Advisor
          </h1>
        </div>
        <p className="max-w-2xl text-sm text-muted sm:text-base">
          Hold a streaming conversation about planning, implementing, testing,
          or reviewing your frontend AI capstone.
        </p>
      </header>

      <SmartScrollArea followStream={isGenerating}>
        <MessageList messages={messages} />
        <ThinkingIndicator visible={isThinking} />
      </SmartScrollArea>

      <div className="min-h-6" aria-live="polite">
        {error && (
          <p className="chat-error" role="alert">
            {error.message} You can edit your message and try again.
          </p>
        )}
      </div>

      <ChatComposer
        input={input}
        status={status}
        onInputChange={setInput}
        onSend={sendCurrentMessage}
        onStop={stopGeneration}
      />
    </section>
  )
}
