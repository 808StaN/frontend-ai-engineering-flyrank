import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { VariantPicker } from '@/components/viewer/VariantPicker'
import {
  DEFAULT_VARIANT_ID,
  type ProductVariantId,
} from '@/lib/viewer/config'

function VariantPickerHarness() {
  const [selectedVariantId, setSelectedVariantId] =
    useState<ProductVariantId>(DEFAULT_VARIANT_ID)

  return (
    <VariantPicker
      selectedVariantId={selectedVariantId}
      onSelect={setSelectedVariantId}
    />
  )
}

describe('VariantPicker', () => {
  it('exposes material choices as an accessible radio group', () => {
    render(<VariantPickerHarness />)

    expect(screen.getByRole('group', { name: 'Finish' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Accent' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Success' })).not.toBeChecked()
  })

  it('updates the selected finish after keyboard or pointer input', async () => {
    const user = userEvent.setup()
    render(<VariantPickerHarness />)

    await user.click(screen.getByRole('radio', { name: 'Success' }))

    expect(screen.getByRole('radio', { name: 'Success' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Accent' })).not.toBeChecked()
  })
})
