'use client'

import { DefaultChatTransport } from 'ai'
import { useChat } from '@ai-sdk/react'
import { useMemo, useState } from 'react'
import { ChatComposer } from '@/components/chat/ChatComposer'
import { ChatErrorNotice } from '@/components/chat/ChatErrorNotice'
import { MessageList } from '@/components/chat/MessageList'
import { ChatResponseSkeleton } from '@/components/chat/ChatResponseSkeleton'
import { SmartScrollArea } from '@/components/chat/SmartScrollArea'
import { ThinkingIndicator } from '@/components/chat/ThinkingIndicator'

const EXAMPLE_MESSAGE =
  'Help me define the first milestone for an AI-powered study planner.'

function getServerErrorMessage(payload: unknown) {
  if (
    typeof payload === 'object' &&
    payload !== null &&
    'error' in payload &&
    typeof payload.error === 'string'
  ) {
    return payload.error
  }

  return 'The chat service is temporarily unavailable. Please try again.'
}

const chatFetch: typeof fetch = async (...args) => {
  const response = await fetch(...args)

  if (response.ok) {
    return response
  }

  const payload: unknown = await response.json().catch(() => null)
  throw new Error(getServerErrorMessage(payload))
}

export function ChatInterface() {
  const [input, setInput] = useState('')
  const transport = useMemo(
    () => new DefaultChatTransport({ api: '/api/chat', fetch: chatFetch }),
    [],
  )
  const { messages, sendMessage, status, stop, error, clearError, regenerate } =
    useChat({
      transport,
    })

  const isGenerating = status === 'submitted' || status === 'streaming'
  const latestMessage = messages.at(-1)
  const latestAssistantHasContent =
    latestMessage?.role === 'assistant' &&
    latestMessage.parts.some(
      (part) =>
        (part.type === 'text' && part.text.length > 0) ||
        part.type.startsWith('tool-'),
    )
  const isThinking = status === 'streaming' && !latestAssistantHasContent

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

  function retryLastResponse() {
    if (isGenerating) {
      return
    }

    clearError()
    void regenerate()
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

      <div className="chat-conversation">
        <SmartScrollArea followStream={isGenerating}>
          <MessageList
            messages={messages}
            onUseExample={() => setInput(EXAMPLE_MESSAGE)}
          />
          <ChatResponseSkeleton visible={status === 'submitted'} />
          <ThinkingIndicator visible={isThinking} />
        </SmartScrollArea>

        {error && (
          <ChatErrorNotice
            error={error}
            isRetrying={isGenerating}
            onRetry={retryLastResponse}
          />
        )}

        <ChatComposer
          input={input}
          status={status}
          onInputChange={setInput}
          onSend={sendCurrentMessage}
          onStop={stopGeneration}
        />
      </div>
    </section>
  )
}
