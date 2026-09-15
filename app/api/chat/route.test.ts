import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/ai/rate-limit', () => ({
  limitChatRequests: vi.fn(),
}))

import { POST } from '@/app/api/chat/route'
import { limitChatRequests } from '@/lib/ai/rate-limit'

const mockedLimitChatRequests = vi.mocked(limitChatRequests)

function createRequest(messages: unknown[]) {
  return new Request('http://localhost/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  })
}

function userMessage(text: string) {
  return {
    id: 'user-message',
    role: 'user',
    parts: [{ type: 'text', text }],
  }
}

describe('/api/chat request protection', () => {
  beforeEach(() => {
    mockedLimitChatRequests.mockReset()
  })

  it('rejects a latest user message above the server-side limit', async () => {
    const response = await POST(createRequest([userMessage('a'.repeat(2_001))]))

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error: 'A message cannot exceed 2000 characters.',
    })
    expect(mockedLimitChatRequests).not.toHaveBeenCalled()
  })

  it('returns Retry-After when the distributed limiter rejects a request', async () => {
    mockedLimitChatRequests.mockResolvedValueOnce({
      allowed: false,
      retryAfterSeconds: 42,
    })

    const response = await POST(createRequest([userMessage('Help me plan a project.')]))

    expect(response.status).toBe(429)
    expect(response.headers.get('Retry-After')).toBe('42')
    await expect(response.json()).resolves.toEqual({
      error: 'Too many requests. Wait a moment before trying your message again.',
    })
  })
})
