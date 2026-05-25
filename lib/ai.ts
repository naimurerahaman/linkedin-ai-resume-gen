import Groq from 'groq-sdk'
import { ResumeData } from '@/types/resume'
import { requireEnv } from '@/lib/env'

const SYSTEM_PROMPT = `You are a professional resume writer. You MUST respond with valid JSON only — no markdown, no code fences, no explanation.

Your response must match this exact JSON structure:
{
  "resume": {
    "contact": {
      "name": "string",
      "email": "string",
      "phone": "string",
      "location": "string",
      "linkedin": "string (full URL or empty string)",
      "website": "string (full URL or empty string)"
    },
    "summary": "string (2-3 sentences)",
    "experience": [
      {
        "title": "string",
        "company": "string",
        "dates": "string (e.g. Jan 2020 – Present)",
        "bullets": ["string", "string"]
      }
    ],
    "education": [
      {
        "degree": "string",
        "school": "string",
        "dates": "string",
        "notes": "string (GPA, honors, etc. or empty string)"
      }
    ],
    "skills": ["string"],
    "projects": [
      {
        "name": "string",
        "description": "string",
        "tech": ["string"],
        "link": "string (URL or empty string)"
      }
    ],
    "certifications": [
      {
        "name": "string",
        "issuer": "string",
        "date": "string"
      }
    ],
    "volunteer": [
      {
        "role": "string",
        "org": "string",
        "dates": "string",
        "description": "string"
      }
    ],
    "languages": ["string"]
  },
  "email": "string (cold outreach email or empty string)"
}`

export async function generateResume(profileText: string, jobDescription?: string) {
  const tailoringBlock = jobDescription
    ? `JOB DESCRIPTION — tailor the resume to match this role and generate a cold outreach email:
${jobDescription}

Tailoring rules:
- Prioritize skills and keywords from the job description
- Rewrite bullet points to highlight experience most relevant to this role
- Mirror terminology from the job description where accurate

For the "email" field, write a cold outreach email:
- 100-120 words maximum
- First line: "Subject: [compelling subject line]"
- Blank line, then the email body
- Reference the specific role from the job description
- Professional but direct — not stiff or overly formal`
    : 'Set the "email" field to an empty string "".'

  const userPrompt = `Extract data from the LinkedIn profile text below and generate an ATS-friendly resume.

LINKEDIN PROFILE TEXT:
${profileText}

${tailoringBlock}

Resume rules:
- Write 3-4 bullet points per job, each starting with a strong action verb (Led, Built, Designed, Increased, Reduced, Launched, Managed, etc.)
- Quantify achievements where data exists in the profile (%, $, team sizes, time saved)
- Summary: 2-3 sentences — years of experience, core skills, unique value proposition
- Extract ALL skills mentioned anywhere in the profile
- Return empty arrays [] for sections with no data — never return null
- Date format: "Jan 2020 – Present" or "2018 – 2021"`

  const groq = new Groq({ apiKey: requireEnv('GROQ_API_KEY') })
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,
  })

  const content = completion.choices[0].message.content
  if (!content) throw new Error('Empty response from Groq')

  const parsed = JSON.parse(content) as { resume: ResumeData; email: string }
  return parsed
}
