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

type ChatRequestBody = {
  messages: UIMessage[]
}

type ChatTestScenario = 'rate-limit' | 'route-error' | 'mid-stream-error'

const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_REQUESTS = 12
const requestTimestampsByClient = new Map<string, number[]>()

function isChatRequestBody(value: unknown): value is ChatRequestBody {
  if (typeof value !== 'object' || value === null || !('messages' in value)) {
    return false
  }

  return Array.isArray(value.messages)
}

function getLatestUserText(messages: UIMessage[]) {
  const latestUserMessage = [...messages]
    .reverse()
    .find((message) => message.role === 'user')

  return (
    latestUserMessage?.parts
      .filter((part) => part.type === 'text')
      .map((part) => part.text)
      .join(' ')
      .trim() ?? ''
  )
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
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local'
}

function isRateLimited(request: Request) {
  const client = getClientIdentifier(request)
  const now = Date.now()
  const recentRequests = (requestTimestampsByClient.get(client) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  )

  if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    const retryAfterSeconds = Math.ceil(
      (RATE_LIMIT_WINDOW_MS - (now - recentRequests[0])) / 1000,
    )

    requestTimestampsByClient.set(client, recentRequests)

    return retryAfterSeconds
  }

  recentRequests.push(now)
  requestTimestampsByClient.set(client, recentRequests)

  return null
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

    const retryAfterSeconds = isRateLimited(request)
    if (retryAfterSeconds !== null) {
      return Response.json(
        {
          error:
            'Too many requests. Wait a moment before trying your message again.',
        },
        {
          status: 429,
          headers: { 'Retry-After': retryAfterSeconds.toString() },
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
