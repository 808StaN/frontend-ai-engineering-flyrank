'use client'

type ViewerControlsProps = {
  onReset: () => void
}

export function ViewerControls({ onReset }: ViewerControlsProps) {
  return (
    <div className="viewer-controls">
      <button type="button" onClick={onReset}>
        Reset view
      </button>
      <p>
        Drag to rotate. Use the scroll wheel or pinch to zoom.
      </p>
    </div>
  )
}
