/**
 * PDF download end-to-end test using Playwright request interception.
 * Mocks /api/generate so no Groq API call is made (no rate limits).
 * Run: node test-pdf-download.mjs   (requires dev server on localhost:3000)
 */
import { chromium } from 'playwright'
import { existsSync, statSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'

const BASE_URL = 'http://localhost:3000'
const DOWNLOAD_DIR = tmpdir()

const MOCK_RESPONSE = {
  resume: {
    contact: { name: 'Jane Smith', email: 'jane@example.com', phone: '+1 555-0100', location: 'New York, NY', linkedin: 'https://linkedin.com/in/janesmith', website: '' },
    summary: 'Full-stack engineer with 5 years building scalable web applications in TypeScript and React.',
    experience: [
      { title: 'Senior Software Engineer', company: 'Acme Corp', dates: 'Jan 2020 – Present', bullets: ['Built REST APIs serving 1M+ daily requests', 'Reduced page load time by 35% via lazy loading', 'Mentored 3 junior engineers'] },
      { title: 'Software Engineer', company: 'Startup Inc', dates: 'Jun 2018 – Dec 2019', bullets: ['Developed React dashboard used by 500+ clients', 'Migrated monolith to microservices architecture'] },
    ],
    education: [{ degree: 'B.S. Computer Science', school: 'MIT', dates: '2014 – 2018', notes: 'GPA 3.9, Dean\'s List' }],
    skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker'],
    projects: [{ name: 'OpenDash', description: 'Open-source analytics dashboard', tech: ['React', 'D3'], link: 'https://github.com/janesmith/opendash' }],
    certifications: [], volunteer: [], languages: ['English (Native)', 'Spanish (Conversational)'],
  },
  email: '',
}

const SAMPLE_PROFILE = 'Jane Smith — Senior Software Engineer with 5 years experience in TypeScript, React, Node.js. Previously at Acme Corp and Startup Inc. MIT Computer Science graduate. Built REST APIs, React dashboards, migrated monoliths to microservices. Skills: TypeScript, React, Node.js, PostgreSQL, AWS, Docker. Open source contributor.'

async function run() {
  console.log('🚀 PDF download test (API intercepted — no Groq call)\n')
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ acceptDownloads: true, downloadsPath: DOWNLOAD_DIR })
  const page = await context.newPage()

  page.on('console', m => {
    if (m.type() === 'error') console.log('  [browser error]', m.text().slice(0, 300))
  })

  try {
    // ── Intercept /api/generate and return mock data instantly ──
    await page.route('**/api/generate', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_RESPONSE) })
    })

    // ── 1. Land on homepage ─────────────────────────────────────
    console.log('1/4  Loading homepage...')
    await page.goto(BASE_URL, { waitUntil: 'networkidle' })
    console.log('     ✓')

    // ── 2. Fill profile text and generate ──────────────────────
    console.log('2/4  Filling form and clicking Generate...')
    await page.fill('textarea', SAMPLE_PROFILE)
    await page.waitForTimeout(200)
    await page.locator('button', { hasText: 'Generate Resume' }).click()
    await page.waitForURL('**/resume', { timeout: 15_000 })
    console.log('     Navigated to /resume ✓')

    // Verify resume rendered
    const hasName = await page.locator('text=Jane Smith').first().isVisible().catch(() => false)
    console.log(`     Resume content rendered: ${hasName ? '✓' : '✗'}`)
    if (!hasName) throw new Error('Resume did not render on /resume page')

    // ── 3. Click Download PDF ────────────────────────────────────
    console.log('3/4  Clicking Download PDF...')
    const dlPromise = page.waitForEvent('download', { timeout: 30_000 })
    await page.locator('header button', { hasText: /Download PDF|Preparing/ }).click()

    // Confirm spinner shows
    const spinnerShown = await page.locator('header button:has-text("Preparing")').isVisible({ timeout: 5_000 }).catch(() => false)
    console.log(`     Spinner shown: ${spinnerShown ? '✓' : '(too fast)'}`)

    const download = await dlPromise
    const filename = download.suggestedFilename()
    const savePath = join(DOWNLOAD_DIR, filename)
    await download.saveAs(savePath)

    // ── 4. Verify file ───────────────────────────────────────────
    console.log('4/4  Verifying downloaded file...')
    if (!existsSync(savePath)) throw new Error('File was not saved to disk')
    const { size } = statSync(savePath)
    const kb = (size / 1024).toFixed(1)
    console.log(`     Filename : ${filename}`)
    console.log(`     Size     : ${kb} KB`)
    if (size < 10_000) throw new Error(`File too small (${size} bytes) — likely corrupt or empty`)
    const isPdf = filename.endsWith('.pdf')
    console.log(`     Is .pdf  : ${isPdf ? '✓' : '✗'}`)
    if (!isPdf) throw new Error('Downloaded file is not a PDF')

    console.log('\n✅  PDF DOWNLOAD TEST PASSED\n')
  } catch (err) {
    console.error('\n❌  TEST FAILED:', err.message, '\n')
    process.exitCode = 1
  } finally {
    await browser.close()
  }
}

run()
