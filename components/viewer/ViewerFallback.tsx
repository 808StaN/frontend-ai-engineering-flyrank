type ViewerFallbackProps = {
  unavailable?: boolean
}

export function ViewerFallback({ unavailable = false }: ViewerFallbackProps) {
  return (
    <div
      className="viewer-fallback"
      role={unavailable ? 'status' : undefined}
      aria-live={unavailable ? 'polite' : undefined}
    >
      <div className="viewer-fallback__shape" aria-hidden="true" />
      <p>
        {unavailable
          ? '3D preview is unavailable in this browser. Product details and finish controls remain available.'
          : 'Loading 3D product preview…'}
      </p>
    </div>
  )
}
