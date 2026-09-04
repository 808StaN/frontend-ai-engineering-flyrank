'use client'

import dynamic from 'next/dynamic'
import { useEffect, useMemo, useState } from 'react'
import { VariantPicker } from '@/components/viewer/VariantPicker'
import { ViewerControls } from '@/components/viewer/ViewerControls'
import { ViewerFallback } from '@/components/viewer/ViewerFallback'
import {
  DEFAULT_VARIANT_ID,
  PRODUCT_NAME,
  productVariants,
  type ProductVariantId,
} from '@/lib/viewer/config'

const ProductViewerCanvas = dynamic(
  () =>
    import('@/components/viewer/ProductViewerCanvas').then(
      (module) => module.ProductViewerCanvas,
    ),
  {
    ssr: false,
    loading: () => <ViewerFallback />,
  },
)

function supportsWebGL() {
  const canvas = document.createElement('canvas')

  return Boolean(
    canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl'),
  )
}

export function ProductViewer() {
  const [selectedVariantId, setSelectedVariantId] =
    useState<ProductVariantId>(DEFAULT_VARIANT_ID)
  const [resetToken, setResetToken] = useState(0)
  const [webGLAvailable, setWebGLAvailable] = useState<boolean | null>(null)

  useEffect(() => {
    setWebGLAvailable(supportsWebGL())
  }, [])

  const selectedVariant = useMemo(
    () =>
      productVariants.find((variant) => variant.id === selectedVariantId) ??
      productVariants[0],
    [selectedVariantId],
  )

  return (
    <section className="viewer-shell" aria-labelledby="viewer-title">
      <div className="viewer-stage" aria-label={`${PRODUCT_NAME} preview`}>
        {webGLAvailable === false ? (
          <ViewerFallback unavailable />
        ) : webGLAvailable === null ? (
          <ViewerFallback />
        ) : (
          <ProductViewerCanvas
            resetToken={resetToken}
            variant={selectedVariant}
          />
        )}
      </div>

      <aside className="viewer-panel">
        <p className="viewer-panel__eyebrow">Interactive product preview</p>
        <h2 id="viewer-title">{PRODUCT_NAME}</h2>
        <p>
          A focused desk light with an adjustable arm, warm bulb, and three
          material finishes.
        </p>

        <VariantPicker
          selectedVariantId={selectedVariantId}
          onSelect={setSelectedVariantId}
        />
        <ViewerControls onReset={() => setResetToken((token) => token + 1)} />
        <p className="viewer-status" aria-live="polite">
          {selectedVariant.label} finish selected.
        </p>
      </aside>
    </section>
  )
}
