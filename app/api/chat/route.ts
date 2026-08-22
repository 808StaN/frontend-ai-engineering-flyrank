import {
  convertToModelMessages,
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

function isChatRequestBody(value: unknown): value is ChatRequestBody {
  if (typeof value !== 'object' || value === null || !('messages' in value)) {
    return false
  }

  return Array.isArray(value.messages)
}

function shouldRequireCapstoneReviewTool(messages: UIMessage[]) {
  const latestUserMessage = [...messages]
    .reverse()
    .find((message) => message.role === 'user')

  const latestUserText =
    latestUserMessage?.parts
      .filter((part) => part.type === 'text')
      .map((part) => part.text)
      .join(' ') ?? ''

  return (
    /\b(review|score|evaluate|assess|ocen|oceń|ocena|zrecenzuj|przeanalizuj)\b/i.test(
      latestUserText,
    ) && /\b(capstone|plan)\b/i.test(latestUserText)
  )
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

    return result.toUIMessageStreamResponse()
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'The chat service could not start a response.'

    return Response.json({ error: message }, { status: 500 })
  }
}
