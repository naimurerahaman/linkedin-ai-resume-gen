'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, Sparkles, ChevronDown, ChevronUp, Zap, Shield, Target, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { TemplateThumbnail } from '@/components/TemplateThumbnail'
import { useResume } from '@/context/ResumeContext'
import { Template } from '@/types/resume'
import { toast } from 'sonner'

const TEMPLATES: { id: Template; label: string; desc: string; atsNote?: string }[] = [
  { id: 'classic', label: 'Classic', desc: 'Traditional single column' },
  { id: 'modern', label: 'Modern', desc: 'Sidebar with accent', atsNote: 'May reduce ATS score' },
  { id: 'minimal', label: 'Minimal', desc: 'Clean & whitespace-first' },
]

const FEATURES = [
  { icon: <Zap className="size-3.5" />, label: 'Instant generation' },
  { icon: <Shield className="size-3.5" />, label: 'Completely anonymous' },
  { icon: <Target className="size-3.5" />, label: 'ATS-optimized' },
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
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 no-print">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
              <FileText className="size-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 tracking-tight">ResumeAI</span>
          </div>
          <a
            href="/privacy"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-200"
          >
            Privacy
          </a>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 pt-14 pb-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 bg-white/10 text-blue-200 text-xs font-medium px-3.5 py-1.5 rounded-full mb-5 border border-white/10">
            <Sparkles className="size-3" />
            Powered by Groq AI — 100% Free
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">
            Turn Your LinkedIn Profile
            <br />
            <span className="text-blue-300">Into a Resume in Seconds</span>
          </h1>
          <p className="text-blue-200/80 text-lg mb-8">
            Paste your profile, pick a style, get an ATS-friendly resume instantly.
            <br />
            No sign-up required.
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {FEATURES.map((f) => (
              <div
                key={f.label}
                className="inline-flex items-center gap-1.5 bg-white/10 text-blue-100 text-xs px-3.5 py-1.5 rounded-full border border-white/10"
              >
                {f.icon}
                {f.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form — overlaps hero */}
      <div className="px-4 pb-16 -mt-12 flex-1 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 space-y-5">
            {/* LinkedIn text */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
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
                className="resize-none text-sm transition-shadow duration-200 focus:shadow-sm"
              />
              <div className="flex justify-between mt-1.5">
                {profileText.length > 0 && profileText.length < 100 ? (
                  <p className="text-xs text-amber-600">Need at least 100 characters</p>
                ) : (
                  <span />
                )}
                <p
                  className={`text-xs ml-auto tabular-nums transition-colors duration-300 ${
                    profileText.length >= 100 ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  {profileText.length.toLocaleString()} chars
                </p>
              </div>
            </div>

            {/* Job description toggle */}
            <div>
              <button
                type="button"
                onClick={() => setShowJD(!showJD)}
                className="group flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-150"
              >
                <span className="size-5 rounded-full bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors duration-150">
                  {showJD ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
                </span>
                {showJD ? 'Remove' : 'Add'} job description
                <span className="text-gray-400 font-normal text-xs">
                  (optional — enables tailoring + outreach email)
                </span>
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
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Choose a Template
              </label>
              <div className="grid grid-cols-3 gap-3">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTemplate(t.id)}
                    className={`rounded-xl border-2 text-left transition-all duration-200 group overflow-hidden ${
                      selectedTemplate === t.id
                        ? 'border-blue-500 shadow-md shadow-blue-100 ring-1 ring-blue-500/20'
                        : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                    }`}
                  >
                    <div
                      className={`transition-colors duration-200 ${
                        selectedTemplate === t.id ? 'bg-blue-50/50' : 'group-hover:bg-gray-50/50'
                      }`}
                    >
                      <TemplateThumbnail id={t.id} className="h-[72px]" />
                    </div>
                    <div className="p-2.5 pt-2">
                      <div className="font-semibold text-sm text-gray-900">{t.label}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{t.desc}</div>
                      {t.atsNote && (
                        <div className="text-[10px] text-amber-600 mt-0.5">{t.atsNote}</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate button */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={!canGenerate}
              className={`
                relative w-full h-14 rounded-xl font-semibold text-base
                overflow-hidden group transition-all duration-300 outline-none
                focus-visible:ring-4 focus-visible:ring-blue-400/50
                ${canGenerate
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white cursor-pointer hover:shadow-2xl hover:shadow-blue-400/40 hover:-translate-y-1 active:translate-y-0 active:shadow-md'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {/* Shimmer sweep on hover */}
              {canGenerate && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"
                />
              )}

              {/* Label */}
              <span className="relative flex items-center justify-center gap-2.5">
                {loading ? (
                  <>
                    <svg className="animate-spin size-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Generating your resume…
                  </>
                ) : (
                  <>
                    <Sparkles className="size-5" />
                    Generate Resume
                    <ArrowRight className="size-5 transition-transform duration-200 group-hover:translate-x-1" />
                  </>
                )}
              </span>
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-5 pb-2">
            Your data is sent to Groq AI for processing only — nothing is stored on our servers. <br></br>
            This website is developed by MD Naimure Rahaman Emon .
            <a href="/privacy" className="underline hover:text-gray-600 transition-colors duration-150">
              Privacy policy
            </a>
            
          </p>
        </div>
      </div>
    </div>
  )
}
