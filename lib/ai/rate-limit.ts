import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const WINDOW_SECONDS = 60
const MAX_REQUESTS_PER_WINDOW = 10

type ChatRateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number }

let rateLimiter: Ratelimit | null | undefined

function getRateLimiter() {
  if (rateLimiter !== undefined) {
    return rateLimiter
  }

  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    rateLimiter = null
    return rateLimiter
  }

  rateLimiter = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(MAX_REQUESTS_PER_WINDOW, `${WINDOW_SECONDS} s`),
    prefix: 'flyrank:chat',
    analytics: false,
  })

  return rateLimiter
}

export async function limitChatRequests(
  clientIdentifier: string,
): Promise<ChatRateLimitResult> {
  const limiter = getRateLimiter()

  if (!limiter) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be configured in production.',
      )
    }

    return { allowed: true }
  }

  const result = await limiter.limit(clientIdentifier)

  if (result.success) {
    return { allowed: true }
  }

  return {
    allowed: false,
    retryAfterSeconds: Math.max(1, Math.ceil((result.reset - Date.now()) / 1000)),
  }
}
