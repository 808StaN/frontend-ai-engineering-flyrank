import { useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  settingsSchema,
  themeOptions,
  type SettingsFormValues,
} from '../schemas/settingsSchema'
import './SettingsForm.css'

const defaultValues: SettingsFormValues = {
  displayName: '',
  email: '',
  theme: 'system',
}

export default function SettingsForm() {
  const formId = useId()
  const [savedValues, setSavedValues] = useState<SettingsFormValues | null>(
    null,
  )

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues,
    mode: 'onSubmit',
  })

  const onSubmit = (values: SettingsFormValues) => {
    setSavedValues(values)
    reset(values)
  }

  const displayNameErrorId = `${formId}-displayName-error`
  const emailErrorId = `${formId}-email-error`
  const themeErrorId = `${formId}-theme-error`

  return (
    <section className="settings" aria-labelledby={`${formId}-title`}>
      <h1 id={`${formId}-title`}>User Settings</h1>
      <p className="settings__description">
        Update your profile details and preferred theme.
      </p>

      <form
        className="settings__form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="settings__field">
          <label htmlFor={`${formId}-displayName`}>Display name</label>
          <input
            id={`${formId}-displayName`}
            type="text"
            autoComplete="name"
            aria-invalid={errors.displayName ? 'true' : 'false'}
            aria-describedby={
              errors.displayName ? displayNameErrorId : undefined
            }
            {...register('displayName')}
          />
          {errors.displayName && (
            <p id={displayNameErrorId} className="settings__error" role="alert">
              {errors.displayName.message}
            </p>
          )}
        </div>

        <div className="settings__field">
          <label htmlFor={`${formId}-email`}>Email</label>
          <input
            id={`${formId}-email`}
            type="email"
            autoComplete="email"
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? emailErrorId : undefined}
            {...register('email')}
          />
          {errors.email && (
            <p id={emailErrorId} className="settings__error" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="settings__field">
          <label htmlFor={`${formId}-theme`}>Theme</label>
          <select
            id={`${formId}-theme`}
            aria-invalid={errors.theme ? 'true' : 'false'}
            aria-describedby={errors.theme ? themeErrorId : undefined}
            {...register('theme')}
          >
            {themeOptions.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
          {errors.theme && (
            <p id={themeErrorId} className="settings__error" role="alert">
              {errors.theme.message}
            </p>
          )}
        </div>

        <button type="submit" disabled={isSubmitting}>
          Save settings
        </button>
      </form>

      {savedValues && (
        <output className="settings__success" aria-live="polite">
          Settings saved for {savedValues.displayName} ({savedValues.email}) —
          theme: {savedValues.theme}
        </output>
      )}
    </section>
  )
}
