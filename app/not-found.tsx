import Link from 'next/link'
import { FileText, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-3.5">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="size-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow transition-shadow duration-200">
              <FileText className="size-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 tracking-tight">ResumeAI</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-8xl font-bold text-blue-600 mb-4 tabular-nums">404</p>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Page not found</h1>
          <p className="text-gray-500 mb-8">The page you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <ArrowLeft className="size-4" />
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}
