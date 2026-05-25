'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Download, Mail, RefreshCw, ArrowLeft, Check, Pencil, Eye, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ClassicTemplate } from '@/components/templates/ClassicTemplate'
import { ModernTemplate } from '@/components/templates/ModernTemplate'
import { MinimalTemplate } from '@/components/templates/MinimalTemplate'
import { TemplateThumbnail } from '@/components/TemplateThumbnail'
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
  const [downloading, setDownloading] = useState(false)
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

  async function handleDownload() {
    if (!printRef.current || downloading) return
    adjustFontSize()
    setDownloading(true)
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ])
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      })
      const imgData = canvas.toDataURL('image/jpeg', 0.95)
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const w = pdf.internal.pageSize.getWidth()
      const h = pdf.internal.pageSize.getHeight()
      pdf.addImage(imgData, 'JPEG', 0, 0, w, h)
      const name = resumeData?.contact?.name?.trim() || 'resume'
      const safe = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      pdf.save(`${safe}-resume.pdf`)
    } catch {
      toast.error('Failed to generate PDF. Please try again.')
    } finally {
      setDownloading(false)
    }
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
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10 no-print">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors duration-200 group"
          >
            <ArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
            Back
          </button>

          <div className="flex items-center gap-2.5">
            <div className="size-6 bg-blue-600 rounded-md flex items-center justify-center">
              <FileText className="size-3.5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-sm tracking-tight hidden sm:block">
              ResumeAI
            </span>
          </div>

          <div className="flex items-center gap-2">
            {outreachEmail && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEmailOpen(true)}
                className="gap-1.5 hover:border-blue-300 hover:text-blue-600 transition-all duration-200"
              >
                <Mail className="size-4" />
                View Email
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRegenerate}
              disabled={regenerating}
              className="gap-1.5 hover:border-blue-300 hover:text-blue-600 transition-all duration-200"
            >
              <RefreshCw className={`size-4 ${regenerating ? 'animate-spin' : ''}`} />
              Regenerate
            </Button>
            <Button
              size="sm"
              onClick={handleDownload}
              disabled={downloading}
              className="gap-1.5 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              {downloading ? (
                <svg className="animate-spin size-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                <Download className="size-4" />
              )}
              {downloading ? 'Preparing…' : 'Download PDF'}
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
            className="bg-white shadow-xl rounded-xl overflow-hidden ring-1 ring-gray-200"
            style={{ minHeight: '1056px' }}
          >
            <TemplateComponent data={resumeData} />
          </div>
          <p className="text-xs text-gray-400 text-center mt-3 no-print">
            Click &ldquo;Download PDF&rdquo; to save your resume directly.
          </p>
        </div>

        {/* Sidebar */}
        <div className="w-80 shrink-0 no-print">
          <div
            className="bg-white rounded-xl border border-gray-200 sticky top-20 flex flex-col shadow-sm"
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
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2.5">
                      Template
                    </p>
                    <div className="space-y-2">
                      {TEMPLATES.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setTemplate(t.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200 group ${
                            template === t.id
                              ? 'bg-blue-50 text-blue-700 font-medium ring-1 ring-blue-200'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <div className="w-12 h-8 rounded overflow-hidden border border-gray-200 shrink-0 group-hover:border-blue-200 transition-colors duration-200">
                            <TemplateThumbnail id={t.id} className="h-full scale-[0.85] origin-top-left w-[118%]" />
                          </div>
                          <span className="flex-1 text-left">{t.label}</span>
                          {template === t.id && <Check className="size-3.5 shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-gray-100 space-y-2">
                    <Button
                      onClick={handleDownload}
                      disabled={downloading}
                      className="w-full gap-2 text-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                      size="sm"
                    >
                      {downloading ? (
                        <svg className="animate-spin size-3.5" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                      ) : (
                        <Download className="size-3.5" />
                      )}
                      {downloading ? 'Preparing…' : 'Download PDF'}
                    </Button>
                    {outreachEmail && (
                      <Button
                        variant="outline"
                        onClick={() => setEmailOpen(true)}
                        className="w-full gap-2 text-sm hover:border-blue-300 hover:text-blue-600 transition-all duration-200"
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
                      className="w-full gap-2 text-sm hover:border-blue-300 hover:text-blue-600 transition-all duration-200"
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
      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 ${
        active
          ? 'text-blue-600 border-blue-500'
          : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50/50 border-transparent'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}
