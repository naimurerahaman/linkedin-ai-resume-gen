'use client'

import { useState } from 'react'
import { Copy, Check, RefreshCw, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

interface Props {
  email: string
  open: boolean
  onClose: () => void
  onRegenerate?: () => Promise<void>
}

export function EmailModal({ email, open, onClose, onRegenerate }: Props) {
  const [copied, setCopied] = useState(false)
  const [regenerating, setRegenerating] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(email)
    setCopied(true)
    toast.success('Email copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleRegenerate() {
    if (!onRegenerate) return
    setRegenerating(true)
    try {
      await onRegenerate()
    } finally {
      setRegenerating(false)
    }
  }

  const lines = email.split('\n')
  const subjectLine = lines[0]?.startsWith('Subject:') ? lines[0] : null
  const body = subjectLine ? lines.slice(2).join('\n') : email

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="size-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Mail className="size-4 text-blue-600" />
            </div>
            Cold Outreach Email
          </DialogTitle>
        </DialogHeader>

        <div className="mt-1 space-y-2">
          {subjectLine && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg px-3.5 py-2.5">
              <span className="text-xs font-semibold text-blue-500 uppercase tracking-wide">Subject</span>
              <p className="text-sm font-medium text-gray-900 mt-0.5">
                {subjectLine.replace('Subject: ', '')}
              </p>
            </div>
          )}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-sans">
              {body}
            </pre>
          </div>
        </div>

        <div className="flex gap-2 mt-1">
          <Button
            onClick={handleCopy}
            className="flex-1 gap-2 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? 'Copied!' : 'Copy to Clipboard'}
          </Button>
          {onRegenerate && (
            <Button
              variant="outline"
              onClick={handleRegenerate}
              disabled={regenerating}
              className="gap-2 hover:border-blue-300 hover:text-blue-600 transition-all duration-200"
            >
              <RefreshCw className={`size-4 ${regenerating ? 'animate-spin' : ''}`} />
              Regenerate
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
