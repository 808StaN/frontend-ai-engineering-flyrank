import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
  tool,
  type UIMessage,
} from 'ai'
import {
  capstoneReviewInputSchema,
  reviewCapstonePlan,
} from '@/lib/ai/capstone-review'
import {
  capstoneSystemPrompt,
  chatGenerationConfig,
  getCapstoneChatModel,
} from '@/lib/ai/config'
import { limitChatRequests } from '@/lib/ai/rate-limit'

type ChatRequestBody = {
  messages: UIMessage[]
}

type ChatTestScenario = 'rate-limit' | 'route-error' | 'mid-stream-error'

export const maxDuration = 30

const MAX_MESSAGES_PER_REQUEST = 20
const MAX_LATEST_USER_MESSAGE_LENGTH = 2_000
const MAX_TOTAL_TEXT_LENGTH = 12_000
const MAX_REQUEST_BYTES = 64_000

function isChatRequestBody(value: unknown): value is ChatRequestBody {
  if (typeof value !== 'object' || value === null || !('messages' in value)) {
    return false
  }

  return (
    Array.isArray(value.messages) &&
    value.messages.every(
      (message) =>
        typeof message === 'object' &&
        message !== null &&
        'role' in message &&
        'parts' in message &&
        Array.isArray(message.parts),
    )
  )
}

function getMessageText(message: UIMessage) {
  return message.parts
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join(' ')
    .trim()
}

function getLatestUserText(messages: UIMessage[]) {
  const latestUserMessage = [...messages]
    .reverse()
    .find((message) => message.role === 'user')

  return latestUserMessage ? getMessageText(latestUserMessage) : ''
}

function validateChatRequest(messages: UIMessage[]) {
  if (messages.length > MAX_MESSAGES_PER_REQUEST) {
    return `A chat request can contain at most ${MAX_MESSAGES_PER_REQUEST} messages.`
  }

  const totalTextLength = messages.reduce(
    (total, message) => total + getMessageText(message).length,
    0,
  )

  if (totalTextLength > MAX_TOTAL_TEXT_LENGTH) {
    return `The chat history cannot exceed ${MAX_TOTAL_TEXT_LENGTH} characters.`
  }

  const latestUserText = getLatestUserText(messages)

  if (latestUserText.length > MAX_LATEST_USER_MESSAGE_LENGTH) {
    return `A message cannot exceed ${MAX_LATEST_USER_MESSAGE_LENGTH} characters.`
  }

  if (new TextEncoder().encode(JSON.stringify(messages)).length > MAX_REQUEST_BYTES) {
    return 'The chat request is too large.'
  }

  return null
}

function shouldRequireCapstoneReviewTool(messages: UIMessage[]) {
  const latestUserText = getLatestUserText(messages)

  return (
    /\b(review|score|evaluate|assess|ocen|oceń|ocena|zrecenzuj|przeanalizuj)\b/i.test(
      latestUserText,
    ) && /\b(capstone|plan)\b/i.test(latestUserText)
  )
}

function getChatTestScenario(messages: UIMessage[]): ChatTestScenario | null {
  const latestUserText = getLatestUserText(messages).toLowerCase()

  if (latestUserText.includes('[[simulate:rate-limit]]')) {
    return 'rate-limit'
  }

  if (latestUserText.includes('[[simulate:route-error]]')) {
    return 'route-error'
  }

  if (latestUserText.includes('[[simulate:mid-stream-error]]')) {
    return 'mid-stream-error'
  }

  return null
}

function getClientIdentifier(request: Request) {
  return (
    request.headers.get('x-vercel-forwarded-for') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'local'
  )
}

function createMidStreamErrorResponse(messages: UIMessage[]) {
  const stream = createUIMessageStream({
    originalMessages: messages,
    async execute({ writer }) {
      writer.write({ type: 'text-start', id: 'resilience-demo' })
      writer.write({
        type: 'text-delta',
        id: 'resilience-demo',
        delta:
          'Your request started successfully. The connection will now be interrupted to demonstrate recovery.',
      })
      writer.write({ type: 'text-end', id: 'resilience-demo' })

      await new Promise((resolve) => setTimeout(resolve, 350))
      throw new Error('The response stream was interrupted.')
    },
    onError: () =>
      'The response was interrupted. Your partial answer was kept so you can retry it.',
  })

  return createUIMessageStreamResponse({ stream })
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json()

    if (!isChatRequestBody(body)) {
      return Response.json(
        { error: 'Request body must contain a messages array.' },
        { status: 400 },
      )
    }

    const requestError = validateChatRequest(body.messages)

    if (requestError) {
      return Response.json({ error: requestError }, { status: 400 })
    }

    const latestUserText = getLatestUserText(body.messages)
    if (!latestUserText) {
      return Response.json(
        { error: 'Send a message before starting a chat response.' },
        { status: 400 },
      )
    }

    const testScenario = getChatTestScenario(body.messages)
    if (testScenario === 'rate-limit') {
      return Response.json(
        {
          error:
            'Too many requests. Wait a moment before trying your message again.',
        },
        { status: 429, headers: { 'Retry-After': '10' } },
      )
    }

    if (testScenario === 'route-error') {
      return Response.json(
        {
          error:
            'The chat service is temporarily unavailable. Please try again.',
        },
        { status: 503 },
      )
    }

    if (testScenario === 'mid-stream-error') {
      return createMidStreamErrorResponse(body.messages)
    }

    const rateLimit = await limitChatRequests(getClientIdentifier(request))
    if (!rateLimit.allowed) {
      return Response.json(
        {
          error:
            'Too many requests. Wait a moment before trying your message again.',
        },
        {
          status: 429,
          headers: { 'Retry-After': rateLimit.retryAfterSeconds.toString() },
        },
      )
    }

    const requiresCapstoneReview = shouldRequireCapstoneReviewTool(
      body.messages,
    )
    const result = streamText({
      model: getCapstoneChatModel(),
      system: capstoneSystemPrompt,
      messages: await convertToModelMessages(body.messages),
      tools: {
        reviewCapstonePlan: tool({
          description:
            'Evaluate a frontend AI capstone plan and return a structured readiness review.',
          inputSchema: capstoneReviewInputSchema,
          execute: reviewCapstonePlan,
        }),
      },
      stopWhen: stepCountIs(requiresCapstoneReview ? 1 : 2),
      ...(requiresCapstoneReview
        ? {
            toolChoice: {
              type: 'tool' as const,
              toolName: 'reviewCapstonePlan',
            },
          }
        : {}),
      ...chatGenerationConfig,
    })

    return result.toUIMessageStreamResponse({
      onError: () =>
        'The response was interrupted. Your partial answer was kept so you can retry it.',
    })
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'The chat service could not start a response.'

    return Response.json({ error: message }, { status: 500 })
  }
}
