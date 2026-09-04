'use client'

import {
  productVariants,
  type ProductVariantId,
} from '@/lib/viewer/config'

type VariantPickerProps = {
  selectedVariantId: ProductVariantId
  onSelect: (variantId: ProductVariantId) => void
}

export function VariantPicker({
  selectedVariantId,
  onSelect,
}: VariantPickerProps) {
  return (
    <fieldset className="viewer-variants">
      <legend>Finish</legend>
      <p>Select a material finish for the desk lamp.</p>
      <div className="viewer-variants__options">
        {productVariants.map((variant) => {
          const inputId = `viewer-finish-${variant.id}`

          return (
            <div className="viewer-variant" key={variant.id}>
              <input
                checked={selectedVariantId === variant.id}
                className="viewer-variant__input"
                id={inputId}
                name="product-finish"
                type="radio"
                value={variant.id}
                onChange={() => onSelect(variant.id)}
              />
              <label htmlFor={inputId}>
                <span
                  aria-hidden="true"
                  className="viewer-variant__swatch"
                  style={{ backgroundColor: variant.color }}
                />
                <span>{variant.label}</span>
              </label>
            </div>
          )
        })}
      </div>
    </fieldset>
  )
}
