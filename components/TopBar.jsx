'use client'
import { useTheme } from '../app/layout'
import { UserButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function TopBar({
  showBack = false,
  backLabel = '← Dashboard',
  rightContent
}) {
  const { dark, setDark } = useTheme()
  const router = useRouter()

  return (
    <header className="flex justify-between items-center px-8 h-[52px] border-b border-border bg-card transition-colors duration-300 sticky top-0 z-50 shrink-0">
      {/* Left */}
      {showBack ? (
        <button
          onClick={() => router.push('/dashboard')}
          className="bg-transparent border-none text-sm text-muted cursor-pointer font-sans py-1.5 tracking-wide flex items-center gap-1 hover:text-foreground transition-colors duration-200"
        >
          ← Dashboard
        </button>
      ) : (
        <div
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => router.push('/')}
        >
          <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <line x1="10" y1="9" x2="8" y2="9" />
            </svg>
          </div>
          <span className="font-serif font-bold text-[17px] text-foreground tracking-tight">
            CollabDocs
          </span>
        </div>
      )}

      {/* Right */}
      <div className="flex items-center gap-3">
        {rightContent}

        <button
          onClick={() => setDark(!dark)}
          className="bg-badge border border-border rounded-full px-3.5 py-1 text-xs text-muted font-sans tracking-wide whitespace-nowrap cursor-pointer hover:text-foreground hover:border-muted transition-all duration-200"
        >
          {dark ? '☀ Light' : '☾ Dark'}
        </button>

        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  )
}