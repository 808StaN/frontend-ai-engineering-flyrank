import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import SettingsForm from './SettingsForm'

describe('SettingsForm', () => {
  it('shows validation errors on empty submit', async () => {
    const user = userEvent.setup()
    render(<SettingsForm />)

    await user.click(screen.getByRole('button', { name: /save settings/i }))

    expect(
      await screen.findByText(/display name must be at least 2 characters/i),
    ).toBeInTheDocument()
    expect(screen.getByText(/email is required/i)).toBeInTheDocument()
  })

  it('rejects an invalid email address', async () => {
    const user = userEvent.setup()
    render(<SettingsForm />)

    await user.type(screen.getByLabelText(/display name/i), 'Ada Lovelace')
    await user.type(screen.getByLabelText(/email/i), 'not-an-email')
    await user.click(screen.getByRole('button', { name: /save settings/i }))

    expect(
      await screen.findByText(/enter a valid email address/i),
    ).toBeInTheDocument()
  })

  it('trims whitespace before saving valid values', async () => {
    const user = userEvent.setup()
    render(<SettingsForm />)

    await user.type(screen.getByLabelText(/display name/i), '  Grace Hopper  ')
    await user.type(screen.getByLabelText(/email/i), '  grace@example.com  ')
    await user.selectOptions(screen.getByLabelText(/theme/i), 'dark')
    await user.click(screen.getByRole('button', { name: /save settings/i }))

    expect(
      await screen.findByText(
        /settings saved for grace hopper \(grace@example.com\) — theme: dark/i,
      ),
    ).toBeInTheDocument()
  })
})
