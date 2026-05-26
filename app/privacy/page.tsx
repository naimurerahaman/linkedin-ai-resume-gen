import { FileText, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3.5 flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors duration-200 group"
          >
            <div className="size-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow transition-shadow duration-200">
              <FileText className="size-4 text-white" />
            </div>
            <span className="font-bold tracking-tight">ResumeAI</span>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Privacy Policy</h1>
          <p className="text-gray-400 text-sm">Last updated: May 2026</p>
        </div>

        <div className="space-y-4">
          <Section title="Overview">
            <p className="text-gray-600 leading-relaxed">
              ResumeAI is a free tool that helps you generate a resume from your LinkedIn profile
              text. We are committed to keeping your data private. This policy explains exactly
              what happens to your data when you use this service.
            </p>
          </Section>

          <Section title="What data we process">
            <ul className="space-y-2 text-gray-600">
              <li className="flex gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong className="text-gray-800">LinkedIn profile text</strong> — the text you paste into the input field.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong className="text-gray-800">Job description</strong> — if you optionally provide one to tailor your resume.</span>
              </li>
            </ul>
          </Section>

          <Section title="How your data is used">
            <p className="text-gray-600 leading-relaxed">
              Your profile text (and optional job description) is sent to{' '}
              <strong className="text-gray-800">Groq API</strong> for the sole purpose of generating
              your resume. This is a one-way, one-time transmission per session. We do not store,
              log, index, or retain this data on our servers.
            </p>
            <p className="text-gray-600 leading-relaxed mt-3">
              Groq API processes your data according to{' '}
              <a
                href="https://groq.com/privacy-policy/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 underline transition-colors duration-150"
              >
                Groq&apos;s privacy policy
              </a>
              .
            </p>
          </Section>

          <Section title="What we do NOT store">
            <ul className="space-y-2 text-gray-600">
              {[
                'Your name, email, phone number, or any personal information',
                'Your LinkedIn profile text',
                'Your generated resume content',
                'Any job descriptions you provide',
                'Browser cookies (we set none)',
                'User accounts or session history',
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              All data lives in your browser memory only and is permanently lost when you close or
              refresh the page.
            </p>
          </Section>

          <Section title="Rate limiting">
            <p className="text-gray-600 leading-relaxed">
              To prevent abuse, we limit resume generation to 5 requests per IP address per hour.
              This requires temporarily storing your IP address in memory via Upstash Redis, which
              automatically expires after 1 hour. No other data is associated with your IP.
            </p>
          </Section>

          <Section title="Third-party services">
            <ul className="space-y-2 text-gray-600">
              {[
                { name: 'Groq API', desc: 'AI processing of your input text.' },
                { name: 'Upstash Redis', desc: 'Temporary IP-based rate limit counters only.' },
                { name: 'Vercel', desc: 'Hosting provider. Standard access logs may be kept per Vercel\'s policy.' },
              ].map((s) => (
                <li key={s.name} className="flex gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>
                    <strong className="text-gray-800">{s.name}</strong> — {s.desc}
                  </span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Contact">
            <p className="text-gray-600 leading-relaxed">
              If you have questions about this privacy policy, please open an issue or contact us
              via the repository. We will respond promptly. Or mail us at <a href="mailto:mdnaimurerahamanemon@gmail.com" className="text-blue-600 hover:text-blue-700 underline transition-colors duration-150">
                mdnaimurerahamanemon@gmail.com
              </a>
            </p>
          </Section>
        </div>
      </main>

      <footer className="border-t border-gray-200 mt-12">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors duration-200 group"
          >
            <ArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
            Back to ResumeAI
          </Link>
        </div>
      </footer>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      <h2 className="text-base font-semibold text-gray-900 mb-3">{title}</h2>
      {children}
    </div>
  )
}
