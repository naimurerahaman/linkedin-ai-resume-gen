import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ResumeProvider } from '@/context/ResumeContext'
import { Toaster } from '@/components/ui/sonner'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'ResumeAI — Generate Your Resume in Seconds',
  description:
    'Turn your LinkedIn profile into an ATS-friendly resume using AI. Free, no account required.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white">
        <ResumeProvider>
          {children}
        </ResumeProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
