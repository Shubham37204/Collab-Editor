'use client'
import { UserButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../../app/layout'

const FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'owned', label: 'Owned' },
  { value: 'shared', label: 'Shared' },
  { value: 'starred', label: 'Starred' },
  { value: 'recent', label: 'Recent' },
]

function FilterMenu({ value, onChange, compact = false }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const selected = FILTER_OPTIONS.find((option) => option.value === value) || FILTER_OPTIONS[0]

  useEffect(() => {
    const handler = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`flex items-center justify-between gap-3 border border-border bg-background-secondary text-foreground font-sans text-sm outline-none cursor-pointer hover:bg-card transition-colors ${
          compact ? 'rounded-xl py-2 px-3 min-w-24' : 'rounded-xl py-2 px-3 min-w-32'
        }`}
      >
        <span>{selected.label}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 min-w-full rounded-xl border border-border bg-card p-1 shadow-xl animate-slide-down">
          {FILTER_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value)
                setOpen(false)
              }}
              className={`block w-full rounded-lg border-none px-3 py-2 text-left text-sm font-sans cursor-pointer transition-colors ${
                option.value === value
                  ? 'bg-primary text-white'
                  : 'bg-transparent text-foreground hover:bg-badge'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function DashboardHeader({
  user,
  search,
  onSearchChange,
  filter,
  onFilterChange,
}) {
  const { dark, setDark } = useTheme()
  const router = useRouter()

  return (
    <header className="sticky top-0 z-30 px-4 md:px-8 pt-5 pb-3 bg-background/80 backdrop-blur-xl transition-colors duration-300">
      <div className="editor-header mx-auto flex w-full max-w-6xl items-center justify-between gap-3 rounded-2xl px-4 py-2.5">
        <button
          type="button"
          className="flex items-center gap-3 min-w-0 bg-transparent border-none cursor-pointer hover:opacity-80 transition-opacity p-0"
          onClick={() => router.push('/')}
        >
          <span className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <line x1="10" y1="9" x2="8" y2="9" />
            </svg>
          </span>
          <span className="font-sans font-bold text-lg tracking-tight text-foreground whitespace-nowrap">
            CollabDocs
          </span>
        </button>

        <div className="hidden md:flex items-center gap-2 flex-1 justify-center min-w-0">
          <div className="editor-control-group w-full max-w-md">
            <input
              className="bg-transparent border-none text-foreground font-sans text-sm outline-none rounded-lg py-1.5 px-3 w-full placeholder:text-muted"
              placeholder="Search title, content, owner..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <FilterMenu value={filter} onChange={onFilterChange} />
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setDark(!dark)}
            className="w-9 h-9 flex items-center justify-center bg-transparent border-none rounded-xl text-muted hover:bg-badge hover:text-foreground cursor-pointer transition-colors"
            title="Toggle theme"
          >
            {dark ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>

          <div className="h-5 w-px bg-border shrink-0 hidden sm:block" />

          <span className="text-sm text-muted font-sans hidden lg:inline-block max-w-24 truncate">
            {user?.firstName}
          </span>
          <div className="flex items-center scale-95">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>

      <div className="mt-3 flex md:hidden gap-2">
        <input
          className="bg-badge border border-border/60 text-foreground font-sans text-sm outline-none rounded-xl py-2 px-4 flex-1 placeholder:text-muted focus:border-primary/50"
          placeholder="Search documents..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <FilterMenu value={filter} onChange={onFilterChange} compact />
      </div>
    </header>
  )
}
