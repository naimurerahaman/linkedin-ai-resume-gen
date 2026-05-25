'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { ResumeData, Template } from '@/types/resume'

interface ResumeContextType {
  resumeData: ResumeData | null
  template: Template
  outreachEmail: string | null
  originalInput: { profileText: string; jobDescription?: string } | null
  setResumeData: (data: ResumeData) => void
  setTemplate: (t: Template) => void
  setOutreachEmail: (email: string | null) => void
  setOriginalInput: (input: { profileText: string; jobDescription?: string }) => void
  updateSection: <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => void
  reset: () => void
}

const ResumeContext = createContext<ResumeContextType | null>(null)

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [template, setTemplate] = useState<Template>('classic')
  const [outreachEmail, setOutreachEmail] = useState<string | null>(null)
  const [originalInput, setOriginalInput] = useState<{
    profileText: string
    jobDescription?: string
  } | null>(null)

  function updateSection<K extends keyof ResumeData>(key: K, value: ResumeData[K]) {
    if (!resumeData) return
    setResumeData({ ...resumeData, [key]: value })
  }

  function reset() {
    setResumeData(null)
    setOutreachEmail(null)
    setOriginalInput(null)
    setTemplate('classic')
  }

  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        template,
        outreachEmail,
        originalInput,
        setResumeData,
        setTemplate,
        setOutreachEmail,
        setOriginalInput,
        updateSection,
        reset,
      }}
    >
      {children}
    </ResumeContext.Provider>
  )
}

export function useResume() {
  const ctx = useContext(ResumeContext)
  if (!ctx) throw new Error('useResume must be used within ResumeProvider')
  return ctx
}
