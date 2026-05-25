'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Download, Mail, RefreshCw, ArrowLeft, Check, Pencil, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ClassicTemplate } from '@/components/templates/ClassicTemplate'
import { ModernTemplate } from '@/components/templates/ModernTemplate'
import { MinimalTemplate } from '@/components/templates/MinimalTemplate'
import { EmailModal } from '@/components/EmailModal'
import { EditPanel } from '@/components/EditPanel'
import { useResume } from '@/context/ResumeContext'
import { Template } from '@/types/resume'
import { toast } from 'sonner'

const TEMPLATES: { id: Template; label: string }[] = [
  { id: 'classic', label: 'Classic' },
  { id: 'modern', label: 'Modern' },
  { id: 'minimal', label: 'Minimal' },
]

export default function ResumePage() {
  const router = useRouter()
  const {
    resumeData,
    template,
    outreachEmail,
    originalInput,
    setTemplate,
    setResumeData,
    setOutreachEmail,
  } = useResume()

  const [tab, setTab] = useState<'design' | 'edit'>('design')
  const [emailOpen, setEmailOpen] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!resumeData) router.replace('/')
  }, [resumeData, router])

  if (!resumeData) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-[600px] w-full" />
        </div>
      </div>
    )
  }

  function adjustFontSize() {
    const el = printRef.current
    if (!el) return
    el.style.fontSize = ''
    const A4_HEIGHT = 1056
    if (el.scrollHeight <= A4_HEIGHT) return
    const current = parseFloat(window.getComputedStyle(el).fontSize) || 13
    const scale = A4_HEIGHT / el.scrollHeight
    const next = Math.max(current * scale, 8)
    el.style.fontSize = `${next}px`
  }

  function handlePrint() {
    adjustFontSize()
    setTimeout(() => window.print(), 50)
  }

  async function handleRegenerate() {
    if (!originalInput) return
    const confirmed = window.confirm('Regenerating will overwrite your edits. Continue?')
    if (!confirmed) return

    setRegenerating(true)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(originalInput),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? 'Regeneration failed. Please try again.')
        return
      }
      setResumeData(data.resume)
      setOutreachEmail(data.email || null)
      toast.success('Resume regenerated')
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setRegenerating(false)
    }
  }

  async function handleRegenerateEmail() {
    if (!originalInput?.jobDescription) return
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(originalInput),
    })
    const data = await res.json()
    if (res.ok && data.email) {
      setOutreachEmail(data.email)
      toast.success('Email regenerated')
    }
  }

  const TemplateComponent =
    template === 'classic'
      ? ClassicTemplate
      : template === 'modern'
      ? ModernTemplate
      : MinimalTemplate

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 no-print">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back
          </button>

          <div className="flex items-center gap-2">
            {outreachEmail && (
              <Button variant="outline" size="sm" onClick={() => setEmailOpen(true)} className="gap-1.5">
                <Mail className="size-4" />
                View Email
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRegenerate}
              disabled={regenerating}
              className="gap-1.5"
            >
              <RefreshCw className={`size-4 ${regenerating ? 'animate-spin' : ''}`} />
              Regenerate
            </Button>
            <Button size="sm" onClick={handlePrint} className="gap-1.5">
              <Download className="size-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        {/* Resume preview */}
        <div className="flex-1 min-w-0">
          <div
            id="resume-print-area"
            ref={printRef}
            className="bg-white shadow-lg rounded-lg overflow-hidden"
            style={{ minHeight: '1056px' }}
          >
            <TemplateComponent data={resumeData} />
          </div>
          <p className="text-xs text-gray-400 text-center mt-3 no-print">
            Click &ldquo;Download PDF&rdquo; → browser print dialog → Save as PDF.
          </p>
        </div>

        {/* Sidebar */}
        <div className="w-80 shrink-0 no-print">
          <div
            className="bg-white rounded-xl border border-gray-200 sticky top-20 flex flex-col"
            style={{ maxHeight: 'calc(100vh - 96px)' }}
          >
            {/* Tabs */}
            <div className="flex border-b border-gray-200 shrink-0">
              <TabButton
                active={tab === 'design'}
                onClick={() => setTab('design')}
                icon={<Eye className="size-3.5" />}
                label="Design"
              />
              <TabButton
                active={tab === 'edit'}
                onClick={() => setTab('edit')}
                icon={<Pencil className="size-3.5" />}
                label="Edit"
              />
            </div>

            {/* Tab content */}
            <div className="overflow-y-auto flex-1 p-4">
              {tab === 'design' ? (
                <div className="space-y-4">
                  {/* Template switcher */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Template
                    </p>
                    <div className="space-y-1">
                      {TEMPLATES.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setTemplate(t.id)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                            template === t.id
                              ? 'bg-blue-50 text-blue-700 font-medium'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {t.label}
                          {template === t.id && <Check className="size-3.5" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-gray-100 space-y-2">
                    <Button onClick={handlePrint} className="w-full gap-2 text-sm" size="sm">
                      <Download className="size-3.5" />
                      Download PDF
                    </Button>
                    {outreachEmail && (
                      <Button
                        variant="outline"
                        onClick={() => setEmailOpen(true)}
                        className="w-full gap-2 text-sm"
                        size="sm"
                      >
                        <Mail className="size-3.5" />
                        View Email
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={handleRegenerate}
                      disabled={regenerating}
                      className="w-full gap-2 text-sm"
                      size="sm"
                    >
                      <RefreshCw className={`size-3.5 ${regenerating ? 'animate-spin' : ''}`} />
                      Regenerate
                    </Button>
                  </div>
                </div>
              ) : (
                <EditPanel data={resumeData} onChange={setResumeData} />
              )}
            </div>
          </div>
        </div>
      </div>

      {outreachEmail && (
        <EmailModal
          email={outreachEmail}
          open={emailOpen}
          onClose={() => setEmailOpen(false)}
          onRegenerate={originalInput?.jobDescription ? handleRegenerateEmail : undefined}
        />
      )}
    </div>
  )
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium transition-colors border-b-2 ${
        active
          ? 'text-blue-600 border-blue-500'
          : 'text-gray-500 hover:text-gray-700 border-transparent'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}
