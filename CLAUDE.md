@AGENTS.md

# ResumeAI — Project Intelligence

## What this project is
A free, anonymous, one-shot web app that generates ATS-friendly resumes from pasted LinkedIn profile text using AI. No login, no database, no persistence — all state lives in React Context for the duration of the browser session.

## Docs-first rule (context7)
**Before writing or editing any code that touches a library, framework, or SDK, always fetch current documentation using context7.** Training data lags behind releases. This project uses several fast-moving packages.

```
# Resolve a library ID first
mcp__context7__resolve-library-id  libraryName="Next.js"

# Then query specific docs
mcp__context7__query-docs  libraryId="/vercel/next.js"  query="your question"
```

Always use context7 for:
- Next.js App Router patterns (routing, API routes, layout, metadata)
- shadcn/ui component usage and props (`/llmstxt/ui_shadcn_llms_txt`)
- Groq SDK (`/groq/groq-typescript`) — model names, response_format, parameters
- Upstash ratelimit (`/websites/upstash_redis_sdks_ratelimit-`) — sliding window, Redis.fromEnv()
- Tailwind CSS v4 — this is NOT v3. Syntax has changed.

---

## Tech stack (quick reference)

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 16 (App Router) | See AGENTS.md — breaking changes from v13/14 |
| Language | TypeScript 5, strict mode | |
| Styling | Tailwind CSS **v4** | `@import "tailwindcss"` not directives. No tailwind.config.ts |
| UI Components | shadcn/ui (base-nova style) | Uses `@base-ui/react`, not Radix UI |
| State | React Context | `context/ResumeContext.tsx` — wraps the whole app |
| AI | Groq `llama-3.3-70b-versatile` | `lib/ai.ts` — JSON mode via `response_format` |
| Rate limiting | Upstash Redis + `@upstash/ratelimit` | `lib/ratelimit.ts` — 5 req/IP/hour |
| PDF export | `window.print()` + print CSS | No react-pdf. Print CSS in `app/globals.css` |
| Deployment | Vercel | |

---

## Project structure

```
app/
  page.tsx              # Landing page (input form, template picker)
  resume/page.tsx       # Resume editor + PDF download
  privacy/page.tsx      # Privacy policy
  api/generate/route.ts # POST — calls Groq, rate-limited
  globals.css           # Tailwind v4 + @media print styles
  layout.tsx            # Root layout — wraps with ResumeProvider + Toaster

components/
  templates/
    ClassicTemplate.tsx # Single column, serif, max ATS compatibility
    ModernTemplate.tsx  # Sidebar layout, slate accent
    MinimalTemplate.tsx # Single column, whitespace-first
  EmailModal.tsx        # Cold outreach email dialog
  ui/                   # shadcn components (do not edit manually)

context/
  ResumeContext.tsx     # resumeData, template, outreachEmail, originalInput

lib/
  ai.ts                 # Groq client + generateResume() function
  ratelimit.ts          # Upstash sliding window rate limiter
  utils.ts              # shadcn cn() utility

types/
  resume.ts             # All TypeScript interfaces (ResumeData, etc.)
```

---

## Key conventions

**No database.** Never add database calls, Prisma, or persistence. State is session-only.

**No auth.** Never add authentication. The app is anonymous by design.

**Groq JSON mode.** The AI returns structured JSON via `response_format: { type: 'json_object' }`. The full expected schema is defined in the system prompt inside `lib/ai.ts`. If you change `ResumeData` in `types/resume.ts`, update the schema description in the system prompt too.

**Print CSS, not a PDF library.** PDF export uses `window.print()`. Resume-specific print styles live in `app/globals.css` under `@media print`. The `#resume-print-area` div is the only element that should be visible on print. Add `no-print` class to hide UI chrome.

**Tailwind v4 syntax.** There is no `tailwind.config.ts`. Configuration goes in `app/globals.css` using `@theme inline { ... }`. Use `@import "tailwindcss"` at the top of CSS files, not `@tailwind base/components/utilities`.

**shadcn components.** Add via `npx shadcn@latest add <component>`. Do not hand-edit files in `components/ui/`. They use `@base-ui/react` (not `@radix-ui`).

**Environment variables.**
```
GROQ_API_KEY              — Groq API (free at console.groq.com)
UPSTASH_REDIS_REST_URL    — Upstash Redis REST endpoint
UPSTASH_REDIS_REST_TOKEN  — Upstash Redis token
```

---

## Resume data shape

All resume state flows through `ResumeData` (defined in `types/resume.ts`):
```
contact: { name, email, phone, location, linkedin, website }
summary: string
experience: [{ title, company, dates, bullets[] }]
education:  [{ degree, school, dates, notes }]
skills:     string[]
projects:   [{ name, description, tech[], link }]
certifications: [{ name, issuer, date }]
volunteer:  [{ role, org, dates, description }]
languages:  string[]
```

---

## Dev commands
```bash
npm run dev     # Start dev server at localhost:3000
npm run build   # Production build
npx tsc --noEmit  # Type-check only
```
