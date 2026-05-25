import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

let _ratelimit: Ratelimit | null = null

export function getRatelimit(): Ratelimit | null {
  if (_ratelimit) return _ratelimit

  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN. ' +
        'Rate limiting is required in production.'
      )
    }
    console.warn('[ratelimit] Upstash not configured — rate limiting disabled in dev.')
    return null
  }

  _ratelimit = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(5, '1 h'),
    prefix: 'resume-gen',
  })

  return _ratelimit
}
