'use client'
import { UserButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useTheme } from '../../app/layout'
import NotificationDropdown from './NotificationDropdown'

export default function DashboardHeader({
  user,
  search,
  onSearchChange,
  notifications,
  unreadCount,
  onMarkAllRead,
}) {
  const { dark, setDark } = useTheme()
  const router = useRouter()

  return (
    <header className="flex items-center justify-between px-6 md:px-12 py-3 border-b border-border bg-background sticky top-0 z-20 transition-colors duration-300">
      {/* Logo */}
      <div
        className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => router.push('/')}
      >
        <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <line x1="10" y1="9" x2="8" y2="9" />
          </svg>
        </div>
        <span className="font-sans font-bold text-lg tracking-tight text-foreground">
          CollabDocs
        </span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <input
          className="bg-badge border border-border/60 text-foreground font-sans text-sm outline-none rounded-full py-1.5 px-5 w-64 placeholder:text-muted focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-200"
          placeholder="Search documents..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />

        {/* Notifications */}
        <NotificationDropdown
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAllRead={onMarkAllRead}
        />

        {/* Theme toggle */}
        <button
          onClick={() => setDark(!dark)}
          className="bg-badge border border-border rounded-full px-3.5 py-1.5 text-xs font-sans text-muted hover:text-foreground hover:border-muted transition-all duration-200 cursor-pointer"
        >
          {dark ? '☀ Light' : '☾ Dark'}
        </button>

        {/* User */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted font-sans hidden sm:inline-block">
            {user?.firstName}
          </span>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  )
}
