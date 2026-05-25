import { Template } from '@/types/resume'

export function TemplateThumbnail({ id, className = '' }: { id: Template; className?: string }) {
  if (id === 'modern') {
    return (
      <div className={`flex overflow-hidden ${className}`}>
        <div className="w-[38%] bg-slate-700 p-1.5">
          <div className="h-1.5 bg-slate-500 rounded w-full mb-1" />
          <div className="h-1 bg-slate-500 rounded w-3/4 mb-1.5" />
          <div className="space-y-0.5">
            <div className="h-0.5 bg-slate-500 rounded" />
            <div className="h-0.5 bg-slate-500 rounded w-5/6" />
            <div className="h-0.5 bg-slate-600 rounded w-4/5" />
            <div className="h-0.5 bg-slate-500 rounded w-3/4" />
          </div>
        </div>
        <div className="flex-1 bg-white p-1.5">
          <div className="h-1.5 bg-gray-700 rounded w-3/4 mb-1" />
          <div className="space-y-0.5">
            <div className="h-0.5 bg-gray-300 rounded" />
            <div className="h-0.5 bg-gray-200 rounded w-5/6" />
            <div className="h-0.5 bg-gray-300 rounded" />
            <div className="h-0.5 bg-gray-200 rounded w-4/5" />
            <div className="h-0.5 bg-gray-200 rounded w-2/3" />
          </div>
        </div>
      </div>
    )
  }
  if (id === 'minimal') {
    return (
      <div className={`bg-white p-2.5 ${className}`}>
        <div className="h-2.5 bg-gray-900 rounded-sm w-2/3 mb-0.5" />
        <div className="h-1 bg-gray-400 rounded-sm w-1/3 mb-2" />
        <div className="space-y-0.5">
          <div className="h-0.5 bg-gray-200 rounded" />
          <div className="h-0.5 bg-gray-200 rounded w-11/12" />
          <div className="h-0.5 bg-gray-200 rounded w-4/5" />
          <div className="h-0.5 bg-gray-200 rounded" />
          <div className="h-0.5 bg-gray-200 rounded w-3/4" />
        </div>
      </div>
    )
  }
  return (
    <div className={`bg-white p-2 ${className}`}>
      <div className="h-2 bg-gray-800 rounded-sm w-3/4 mx-auto mb-1" />
      <div className="h-1 bg-gray-400 rounded-sm w-1/2 mx-auto mb-1.5" />
      <div className="border-t border-gray-200 mb-1.5" />
      <div className="space-y-0.5">
        <div className="h-0.5 bg-gray-300 rounded" />
        <div className="h-0.5 bg-gray-200 rounded w-5/6" />
        <div className="h-0.5 bg-gray-300 rounded w-4/5" />
        <div className="h-0.5 bg-gray-200 rounded" />
        <div className="h-0.5 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  )
}
