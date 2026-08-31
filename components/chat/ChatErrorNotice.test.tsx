import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ChatErrorNotice } from '@/components/chat/ChatErrorNotice'

describe('ChatErrorNotice', () => {
  it('explains rate limiting and lets the user retry', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()
    render(
      <ChatErrorNotice
        error={new Error('Too many requests')}
        isRetrying={false}
        onRetry={onRetry}
      />,
    )

    expect(screen.getByRole('alert')).toHaveTextContent(
      'You are sending messages too quickly.',
    )

    await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('disables retry while another response is starting', () => {
    render(
      <ChatErrorNotice
        error={new Error('The response was interrupted.')}
        isRetrying
        onRetry={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: 'Retrying…' })).toBeDisabled()
  })
})
