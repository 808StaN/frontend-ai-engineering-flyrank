import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ChatComposer } from '@/components/chat/ChatComposer'

type ChatStatus = 'submitted' | 'streaming' | 'ready' | 'error'

function ComposerHarness({
  initialInput = '',
  status = 'ready',
  onSend = vi.fn(),
  onStop = vi.fn(),
}: {
  initialInput?: string
  status?: ChatStatus
  onSend?: () => void
  onStop?: () => void
}) {
  const [input, setInput] = useState(initialInput)

  return (
    <ChatComposer
      input={input}
      status={status}
      onInputChange={setInput}
      onSend={onSend}
      onStop={onStop}
    />
  )
}

describe('ChatComposer', () => {
  it('links the message label to the chat textbox', () => {
    render(<ComposerHarness />)

    expect(
      screen.getByRole('textbox', { name: 'Message FlyRank Advisor' }),
    ).toBeInTheDocument()
  })

  it('keeps Send message disabled for an empty or whitespace-only message', async () => {
    const user = userEvent.setup()
    render(<ComposerHarness />)

    const textbox = screen.getByRole('textbox', {
      name: 'Message FlyRank Advisor',
    })
    const sendButton = screen.getByRole('button', { name: 'Send message' })

    expect(sendButton).toBeDisabled()
    await user.type(textbox, '   ')

    expect(sendButton).toBeDisabled()
  })

  it('sends a valid message by pressing Enter but preserves Shift+Enter', async () => {
    const user = userEvent.setup()
    const onSend = vi.fn()
    render(<ComposerHarness onSend={onSend} />)

    const textbox = screen.getByRole('textbox', {
      name: 'Message FlyRank Advisor',
    })

    await user.type(textbox, 'Test the capstone{enter}')
    await user.keyboard('{Shift>}{Enter}{/Shift}')

    expect(onSend).toHaveBeenCalledTimes(1)
  })

  it('shows an enabled Stop generating control while streaming', async () => {
    const user = userEvent.setup()
    const onStop = vi.fn()
    render(
      <ComposerHarness
        initialInput="Draft a capstone plan"
        status="streaming"
        onStop={onStop}
      />,
    )

    expect(
      screen.getByRole('textbox', { name: 'Message FlyRank Advisor' }),
    ).toBeDisabled()

    const stopButton = screen.getByRole('button', {
      name: 'Stop generating',
    })
    expect(stopButton).toBeEnabled()

    await user.click(stopButton)
    expect(onStop).toHaveBeenCalledOnce()
  })
})
