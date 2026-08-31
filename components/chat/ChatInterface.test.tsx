import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  useChat: vi.fn(),
}))

vi.mock('@ai-sdk/react', () => ({
  useChat: mocks.useChat,
}))

vi.mock('ai', () => ({
  DefaultChatTransport: class DefaultChatTransport {},
}))

import { ChatInterface } from '@/components/chat/ChatInterface'

function mockChatState({
  status,
  error,
}: {
  status: 'submitted' | 'streaming' | 'ready' | 'error'
  error?: Error
}) {
  mocks.useChat.mockReturnValue({
    messages: [],
    sendMessage: vi.fn(),
    status,
    stop: vi.fn(),
    error,
    clearError: vi.fn(),
    regenerate: vi.fn(),
  })
}

describe('ChatInterface states', () => {
  it('shows a skeleton while a response is pending', () => {
    mockChatState({ status: 'submitted' })

    render(<ChatInterface />)

    expect(screen.getByRole('status')).toHaveTextContent(
      'Preparing the assistant response',
    )
  })

  it('announces thinking while a stream has no assistant content yet', () => {
    mockChatState({ status: 'streaming' })

    render(<ChatInterface />)

    expect(screen.getByRole('status')).toHaveTextContent(
      'FlyRank Advisor is thinking',
    )
  })

  it('renders an error alert and retries the latest response', async () => {
    const regenerate = vi.fn()
    mocks.useChat.mockReturnValue({
      messages: [],
      sendMessage: vi.fn(),
      status: 'error',
      stop: vi.fn(),
      error: new Error('The chat service is temporarily unavailable.'),
      clearError: vi.fn(),
      regenerate,
    })

    render(<ChatInterface />)

    expect(screen.getByRole('alert')).toHaveTextContent(
      'The chat service is temporarily unavailable.',
    )

    await screen.getByRole('button', { name: 'Try again' }).click()
    expect(regenerate).toHaveBeenCalledOnce()
  })
})
