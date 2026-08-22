import {
  convertToModelMessages,
  streamText,
  type UIMessage,
} from 'ai'
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

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json()

    if (!isChatRequestBody(body)) {
      return Response.json(
        { error: 'Request body must contain a messages array.' },
        { status: 400 },
      )
    }

    const result = streamText({
      model: getCapstoneChatModel(),
      system: capstoneSystemPrompt,
      messages: await convertToModelMessages(body.messages),
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
