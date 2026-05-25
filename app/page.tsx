'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, Sparkles, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useResume } from '@/context/ResumeContext'
import { Template } from '@/types/resume'
import { toast } from 'sonner'

const TEMPLATES: { id: Template; label: string; desc: string; atsNote?: string }[] = [
  { id: 'classic', label: 'Classic', desc: 'Single column, traditional' },
  { id: 'modern', label: 'Modern', desc: 'Sidebar with accent color', atsNote: 'May reduce ATS score' },
  { id: 'minimal', label: 'Minimal', desc: 'Clean, lots of whitespace' },
]

export default function Home() {
  const [profileText, setProfileText] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [showJD, setShowJD] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<Template>('classic')
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const { setResumeData, setTemplate, setOutreachEmail, setOriginalInput } = useResume()

  const canGenerate = !loading && profileText.trim().length >= 100

  async function handleGenerate() {
    if (!canGenerate) return
    setLoading(true)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileText: profileText.trim(),
          jobDescription: showJD && jobDescription.trim() ? jobDescription.trim() : undefined,
          template: selectedTemplate,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error ?? 'Something went wrong. Please try again.')
        return
      }

      setResumeData(data.resume)
      setTemplate(selectedTemplate)
      setOutreachEmail(data.email || null)
      setOriginalInput({
        profileText: profileText.trim(),
        jobDescription: showJD && jobDescription.trim() ? jobDescription.trim() : undefined,
      })
      router.push('/resume')
    } catch {
      toast.error('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 no-print">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="size-5 text-blue-600" />
            <span className="font-semibold text-gray-900">ResumeAI</span>
          </div>
          <a href="/privacy" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
            Privacy
          </a>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-start justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Hero */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full mb-4">
              <Sparkles className="size-3" />
              Powered by Groq AI — 100% Free
            </div>
            <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-3">
              Turn Your LinkedIn Profile<br />Into a Resume in Seconds
            </h1>
            <p className="text-gray-500 text-lg">
              Paste your profile, pick a style, get an ATS-friendly resume instantly.
              No sign-up required.
            </p>
          </div>

          {/* Form card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
            {/* LinkedIn text */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                LinkedIn Profile Text <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-400 mb-2">
                Go to your LinkedIn profile → select all text (Ctrl+A) → copy → paste below.
              </p>
              <Textarea
                placeholder="Paste your full LinkedIn profile text here..."
                value={profileText}
                onChange={(e) => setProfileText(e.target.value)}
                rows={8}
                className="resize-none text-sm"
              />
              <div className="flex justify-between mt-1">
                {profileText.length > 0 && profileText.length < 100 ? (
                  <p className="text-xs text-amber-600">Need at least 100 characters</p>
                ) : (
                  <span />
                )}
                <p className={`text-xs ml-auto ${profileText.length >= 100 ? 'text-green-600' : 'text-gray-400'}`}>
                  {profileText.length.toLocaleString()} chars
                </p>
              </div>
            </div>

            {/* Job description toggle */}
            <div>
              <button
                type="button"
                onClick={() => setShowJD(!showJD)}
                className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                {showJD ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                {showJD ? 'Remove' : 'Add'} job description
                <span className="text-gray-400 font-normal">(optional — enables tailoring + outreach email)</span>
              </button>

              {showJD && (
                <div className="mt-3">
                  <Textarea
                    placeholder="Paste the full job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={5}
                    className="resize-none text-sm"
                  />
                </div>
              )}
            </div>

            {/* Template selector */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Choose a Template
              </label>
              <div className="grid grid-cols-3 gap-3">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTemplate(t.id)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      selectedTemplate === t.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="font-semibold text-sm text-gray-900">{t.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{t.desc}</div>
                    {t.atsNote && (
                      <div className="text-[10px] text-amber-600 mt-0.5">{t.atsNote}</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate button */}
            <Button
              onClick={handleGenerate}
              disabled={!canGenerate}
              size="lg"
              className="w-full gap-2 text-base h-12"
            >
              {loading ? (
                <>
                  <svg className="animate-spin size-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Generating your resume...
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  Generate Resume
                </>
              )}
            </Button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            Your data is sent to Groq AI for processing only — nothing is stored on our servers.{' '}
            <a href="/privacy" className="underline hover:text-gray-600">Privacy policy</a>
          </p>
        </div>
      </main>
    </div>
  )
}
