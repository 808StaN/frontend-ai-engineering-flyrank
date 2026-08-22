type ThinkingIndicatorProps = {
  visible: boolean
}

export function ThinkingIndicator({ visible }: ThinkingIndicatorProps) {
  if (!visible) {
    return null
  }

  return (
    <div className="chat-thinking" role="status" aria-live="polite">
      <span className="chat-thinking__dots" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      FlyRank Advisor is thinking
    </div>
  )
}
