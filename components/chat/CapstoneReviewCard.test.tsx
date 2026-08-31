import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CapstoneReviewCard } from '@/components/chat/CapstoneReviewCard'
import type { CapstoneReviewResult } from '@/lib/ai/capstone-review'

const reviewResult: CapstoneReviewResult = {
  score: 82,
  verdict: 'Ready for implementation',
  strengths: ['Clear target user'],
  risks: ['Define the evaluation metric'],
  nextSteps: ['Create the first milestone'],
}

describe('CapstoneReviewCard', () => {
  it('announces a streamed tool call as in progress', () => {
    render(<CapstoneReviewCard state="input-streaming" />)

    expect(screen.getByRole('status')).toHaveTextContent(
      'Preparing a typed capstone review',
    )
  })

  it('announces the plan title while the tool input is ready', () => {
    render(
      <CapstoneReviewCard
        state="input-available"
        input={{ title: 'Study planner' }}
      />,
    )

    expect(screen.getByRole('status')).toHaveTextContent(
      'Reviewing “Study planner”…',
    )
  })

  it('renders structured output as a labelled review result', () => {
    render(<CapstoneReviewCard state="output-available" output={reviewResult} />)

    expect(
      screen.getByRole('region', { name: 'Capstone review result' }),
    ).toHaveTextContent('Ready for implementation')
    expect(screen.getByText('82')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Strengths' })).toBeInTheDocument()
    expect(screen.getByText('Define the evaluation metric')).toBeInTheDocument()
  })

  it('shows an accessible alert when the tool output is invalid', () => {
    render(
      <CapstoneReviewCard
        state="output-available"
        output={{ score: 'not a number' }}
      />,
    )

    expect(screen.getByRole('alert')).toHaveTextContent(
      'The review tool returned an invalid result.',
    )
  })

  it('shows the supplied tool failure reason', () => {
    render(
      <CapstoneReviewCard
        state="output-error"
        errorText="The review connection timed out."
      />,
    )

    expect(screen.getByRole('alert')).toHaveTextContent(
      'The review connection timed out.',
    )
  })
})
