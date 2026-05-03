import { Sparkles } from 'lucide-react'
import ThemeToggle from '../ui/ThemeToggle'

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen dark:bg-surface-950 bg-surface-50 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent-500 flex items-center justify-center">
            <Sparkles size={14} className="text-white" />
          </div>
         <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent">
          AskLY
        </span>
        </div>
        <ThemeToggle />
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          {/* Glow */}
          <div className="absolute pointer-events-none inset-0 overflow-hidden">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
          </div>

          <div className="relative dark:bg-surface-900 bg-white border dark:border-white/8 border-gray-200 rounded-2xl p-8 shadow-2xl dark:shadow-black/40">
            <div className="mb-7">
              <h1 className="text-2xl font-bold dark:text-white text-gray-900 mb-1">{title}</h1>
              {subtitle && <p className="text-sm dark:text-white/40 text-gray-500">{subtitle}</p>}
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
