import { z } from 'zod'

export const themeOptions = ['light', 'dark', 'system'] as const

export const settingsSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, 'Display name must be at least 2 characters')
    .max(50, 'Display name must be at most 50 characters'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  theme: z.enum(themeOptions),
})

export type SettingsFormValues = z.infer<typeof settingsSchema>
