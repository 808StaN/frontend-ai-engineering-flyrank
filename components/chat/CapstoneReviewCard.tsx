import {
  capstoneReviewResultSchema,
  type CapstoneReviewResult,
} from '@/lib/ai/capstone-review'

type ToolState =
  | 'input-streaming'
  | 'input-available'
  | 'output-available'
  | 'output-error'

type CapstoneReviewCardProps = {
  state: ToolState
  input?: unknown
  output?: unknown
  errorText?: string
}

function getReviewTitle(input: unknown) {
  if (
    typeof input === 'object' &&
    input !== null &&
    'title' in input &&
    typeof input.title === 'string'
  ) {
    return input.title
  }

  return null
}

function ReviewList({
  title,
  items,
}: {
  title: string
  items: string[]
}) {
  return (
    <section className="tool-review__section">
      <h4>{title}</h4>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  )
}

function ReviewResult({ result }: { result: CapstoneReviewResult }) {
  return (
    <section className="tool-review tool-review--result" aria-label="Capstone review result">
      <div className="tool-review__summary">
        <div>
          <p className="tool-review__eyebrow">Capstone review</p>
          <h3>{result.verdict}</h3>
        </div>
        <p className="tool-review__score">
          {result.score}
          <span>/100</span>
        </p>
      </div>

      <div className="tool-review__sections">
        <ReviewList title="Strengths" items={result.strengths} />
        <ReviewList title="Risks" items={result.risks} />
        <ReviewList title="Next steps" items={result.nextSteps} />
      </div>
    </section>
  )
}

export function CapstoneReviewCard({
  state,
  input,
  output,
  errorText,
}: CapstoneReviewCardProps) {
  if (state === 'input-streaming') {
    return (
      <div className="tool-review tool-review--pending" role="status">
        <span className="tool-review__pulse" aria-hidden="true" />
        Preparing a typed capstone review…
      </div>
    )
  }

  if (state === 'input-available') {
    const title = getReviewTitle(input)

    return (
      <div className="tool-review tool-review--pending" role="status">
        <span className="tool-review__pulse" aria-hidden="true" />
        Reviewing {title ? `“${title}”` : 'your capstone plan'}…
      </div>
    )
  }

  if (state === 'output-error') {
    return (
      <div className="tool-review tool-review--error" role="alert">
        <p className="tool-review__eyebrow">Capstone review unavailable</p>
        <p>{errorText ?? 'The review tool could not complete this request.'}</p>
      </div>
    )
  }

  const parsedOutput = capstoneReviewResultSchema.safeParse(output)

  if (!parsedOutput.success) {
    return (
      <div className="tool-review tool-review--error" role="alert">
        <p className="tool-review__eyebrow">Capstone review unavailable</p>
        <p>The review tool returned an invalid result.</p>
      </div>
    )
  }

  return <ReviewResult result={parsedOutput.data} />
}
