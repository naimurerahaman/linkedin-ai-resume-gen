import { FileText } from 'lucide-react'
import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors">
            <FileText className="size-5 text-blue-600" />
            <span className="font-semibold">ResumeAI</span>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-500 text-sm mb-10">Last updated: May 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700">

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Overview</h2>
            <p>
              ResumeAI is a free tool that helps you generate a resume from your LinkedIn
              profile text. We are committed to keeping your data private. This policy explains
              exactly what happens to your data when you use this service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">What data we process</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>LinkedIn profile text</strong> — the text you paste into the input field.
              </li>
              <li>
                <strong>Job description</strong> — if you optionally provide one to tailor your resume.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">How your data is used</h2>
            <p>
              Your profile text (and optional job description) is sent to{' '}
              <strong>Groq API</strong> for the sole purpose of generating your resume.
              This is a one-way, one-time transmission per session. We do not store, log, index,
              or retain this data on our servers.
            </p>
            <p className="mt-2">
              Groq API processes your data according to{' '}
              <a
                href="https://groq.com/privacy-policy/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Groq's privacy policy
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">What we do NOT store</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Your name, email, phone number, or any personal information</li>
              <li>Your LinkedIn profile text</li>
              <li>Your generated resume content</li>
              <li>Any job descriptions you provide</li>
              <li>Browser cookies (we set none)</li>
              <li>User accounts or session history</li>
            </ul>
            <p className="mt-2">
              All data lives in your browser memory only and is permanently lost when you
              close or refresh the page.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Rate limiting</h2>
            <p>
              To prevent abuse, we limit resume generation to 5 requests per IP address per hour.
              This requires temporarily storing your IP address in memory via Upstash Redis,
              which automatically expires after 1 hour. No other data is associated with your IP.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Third-party services</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Groq API</strong> — AI processing of your input text.
              </li>
              <li>
                <strong>Upstash Redis</strong> — Temporary IP-based rate limit counters only.
              </li>
              <li>
                <strong>Vercel</strong> — Hosting provider. Standard access logs may be kept
                per Vercel's policy.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Contact</h2>
            <p>
              If you have questions about this privacy policy, please open an issue or contact
              us via the repository. We will respond promptly.
            </p>
          </section>

        </div>
      </main>

      <footer className="border-t border-gray-100 mt-16">
        <div className="max-w-3xl mx-auto px-4 py-6 text-center text-xs text-gray-400">
          <Link href="/" className="hover:text-gray-600 transition-colors">← Back to ResumeAI</Link>
        </div>
      </footer>
    </div>
  )
}
