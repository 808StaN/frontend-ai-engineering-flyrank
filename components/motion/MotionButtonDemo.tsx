'use client'

import { useRef, useState } from 'react'
import {
  StatefulSendButton,
  type ButtonOutcome,
  type ButtonState,
  type StatefulSendButtonHandle,
} from '@/components/motion/StatefulSendButton'

const stateDescriptions: Record<ButtonState, string> = {
  idle: 'Idle: ready to send a message.',
  loading: 'Loading: the message is being sent.',
  success: 'Success: the message was sent. Returning to idle shortly.',
  error: 'Error: the message could not be sent. Returning to idle shortly.',
}

export function MotionButtonDemo() {
  const buttonRef = useRef<StatefulSendButtonHandle>(null)
  const [state, setState] = useState<ButtonState>('idle')
  const isLocked = state !== 'idle'

  function trigger(outcome: ButtonOutcome) {
    buttonRef.current?.run(outcome)
  }

  return (
    <section className="motion-demo glass-card" aria-labelledby="motion-demo-title">
      <div>
        <p className="motion-demo__eyebrow">State-aware interaction</p>
        <h2 id="motion-demo-title">Send message button</h2>
        <p className="motion-demo__description">
          Choose a deterministic outcome to watch the whole button lifecycle.
          The main button runs the success flow.
        </p>
      </div>

      <div className="motion-demo__stage">
        <StatefulSendButton ref={buttonRef} onStateChange={setState} />
        <p className="motion-demo__status" aria-live="polite" aria-atomic="true">
          {stateDescriptions[state]}
        </p>
      </div>

      <div className="motion-demo__controls" aria-label="Demo outcome controls">
        <button
          type="button"
          className="motion-demo__trigger motion-demo__trigger--success"
          disabled={isLocked}
          onClick={() => trigger('success')}
        >
          Trigger success
        </button>
        <button
          type="button"
          className="motion-demo__trigger motion-demo__trigger--error"
          disabled={isLocked}
          onClick={() => trigger('error')}
        >
          Trigger error
        </button>
      </div>

      <p className="motion-demo__hint">
        Use Tab to focus a control and Enter or Space to run it. Controls lock
        until the current sequence finishes.
      </p>
    </section>
  )
}
