'use client'

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

const LOADING_DURATION_MS = 700
const RESULT_DURATION_MS = 1200

export type ButtonOutcome = 'success' | 'error'
export type ButtonState = 'idle' | 'loading' | ButtonOutcome

export type StatefulSendButtonHandle = {
  run: (outcome: ButtonOutcome) => void
}

type StatefulSendButtonProps = {
  onStateChange: (state: ButtonState) => void
}

const buttonLabels: Record<ButtonState, string> = {
  idle: 'Send message',
  loading: 'Sending…',
  success: 'Sent',
  error: 'Try again',
}

export const StatefulSendButton = forwardRef<
  StatefulSendButtonHandle,
  StatefulSendButtonProps
>(function StatefulSendButton({ onStateChange }, ref) {
  const [state, setState] = useState<ButtonState>('idle')
  const stateRef = useRef<ButtonState>('idle')
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const updateState = useCallback((nextState: ButtonState) => {
    stateRef.current = nextState
    setState(nextState)
    onStateChange(nextState)
  }, [onStateChange])

  const clearPendingReset = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const run = useCallback((outcome: ButtonOutcome) => {
    if (stateRef.current !== 'idle') {
      return
    }

    updateState('loading')
    timeoutRef.current = setTimeout(() => {
      updateState(outcome)
      timeoutRef.current = setTimeout(() => {
        updateState('idle')
        timeoutRef.current = null
      }, RESULT_DURATION_MS)
    }, LOADING_DURATION_MS)
  }, [updateState])

  useImperativeHandle(
    ref,
    () => ({
      run,
    }),
    [run],
  )

  useEffect(() => clearPendingReset, [clearPendingReset])

  const isLocked = state !== 'idle'

  return (
    <button
      type="button"
      className="motion-send-button"
      data-state={state}
      disabled={isLocked}
      aria-busy={state === 'loading'}
      onClick={() => run('success')}
    >
      <span className="motion-send-button__label">{buttonLabels[state]}</span>
      <span className="motion-send-button__icon" aria-hidden="true">
        {state === 'idle' && '↑'}
        {state === 'loading' && <i />}
        {state === 'success' && '✓'}
        {state === 'error' && '↻'}
      </span>
    </button>
  )
})
