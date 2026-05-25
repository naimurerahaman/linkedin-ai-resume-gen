import { NextRequest } from 'next/server'
import { generateResume } from '@/lib/ai'
import { getRatelimit } from '@/lib/ratelimit'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'anonymous'

  const ratelimit = getRatelimit()
  if (ratelimit) {
    const { success } = await ratelimit.limit(ip)
    if (!success) {
      return Response.json(
        { error: 'Too many requests. You can generate 5 resumes per hour. Please try again later.' },
        { status: 429 }
      )
    }
  }

  try {
    const body = await req.json()
    const { profileText, jobDescription } = body as {
      profileText: string
      jobDescription?: string
    }

    if (!profileText || profileText.trim().length < 100) {
      return Response.json(
        { error: 'Profile text is too short. Please paste your full LinkedIn profile text.' },
        { status: 400 }
      )
    }

    const result = await generateResume(profileText.trim(), jobDescription?.trim())
    return Response.json(result)
  } catch (err) {
    console.error('[/api/generate]', err)
    return Response.json(
      { error: 'Failed to generate resume. Please try again.' },
      { status: 500 }
    )
  }
}
