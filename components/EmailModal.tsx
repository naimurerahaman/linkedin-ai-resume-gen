'use client'

import { useState } from 'react'
import { Copy, Check, RefreshCw } from 'lucide-react'
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

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Cold Outreach Email</DialogTitle>
        </DialogHeader>

        <div className="mt-2">
          <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 rounded-lg p-4 leading-relaxed font-sans border">
            {email}
          </pre>
        </div>

        <div className="flex gap-2 mt-2">
          <Button onClick={handleCopy} className="flex-1 gap-2">
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? 'Copied!' : 'Copy to Clipboard'}
          </Button>
          {onRegenerate && (
            <Button
              variant="outline"
              onClick={handleRegenerate}
              disabled={regenerating}
              className="gap-2"
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
