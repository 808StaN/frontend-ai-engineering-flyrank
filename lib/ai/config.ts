import { createOpenRouter } from '@openrouter/ai-sdk-provider'

/**
 * FE-06 keeps all provider choices and system instructions in this one
 * server-only module so later AI features can reuse the same configuration.
 */
export const AI_ENVIRONMENT_VARIABLE = 'OPENROUTER_API_KEY'

export const capstoneSystemPrompt = `
You are FlyRank Capstone Advisor, a concise AI assistant for frontend engineers.
Help users plan, implement, test, and review an AI-assisted frontend capstone.
Give practical, structured advice. Ask a clarifying question when the user's
goal is ambiguous. Do not claim you ran code, visited links, or changed files.
When the user asks to review, score, evaluate, or assess a capstone plan and
provides its title, description, technology stack, and stage, call
reviewCapstonePlan. Use the tool result to give a concise follow-up. If any
required review input is missing, ask one focused clarifying question instead.
`.trim()

export const chatGenerationConfig = {
  maxOutputTokens: 700,
  temperature: 0.4,
} as const

/**
 * OpenRouter's free router selects a currently available free text model.
 * Replacing this single model factory with Claude later does not affect the
 * route handler or the chat UI.
 */
export function getCapstoneChatModel() {
  const apiKey = process.env[AI_ENVIRONMENT_VARIABLE]

  if (!apiKey) {
    throw new Error(`${AI_ENVIRONMENT_VARIABLE} is not configured on the server.`)
  }

  const openrouter = createOpenRouter({
    apiKey,
    appName: 'FlyRank Capstone',
  })

  return openrouter('openrouter/free')
}
