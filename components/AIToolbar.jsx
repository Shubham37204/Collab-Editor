'use client'
import { useEffect, useRef } from 'react'

const ACTIONS = [
  { id: 'improve',   label: '✨ Improve',   title: 'Make it clearer and more engaging' },
  { id: 'grammar',   label: '✓ Fix grammar', title: 'Fix spelling and grammar errors' },
  { id: 'formal',    label: '🎩 Make formal', title: 'Rewrite in professional tone' },
  { id: 'shorter',   label: '✂ Shorten',    title: 'Make it more concise' },
  { id: 'summarise', label: '📋 Summarise',  title: 'Condense to 2-3 sentences' },
  { id: 'continue',  label: '→ Continue',   title: 'Continue writing from here' },
]

export default function AIToolbar({ position, onAction, loading, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  if (!position) return null

  return (
    <div
      ref={ref}
      className="fixed z-[200] flex items-center gap-1 bg-card border border-border rounded-xl px-2 py-1.5 shadow-lg animate-scale-in"
      style={{
        top: position.top - 52,
        left: Math.min(position.left, window.innerWidth - 440),
      }}
    >
      <span className="text-xs text-primary font-sans font-medium mr-1 tracking-wide">
        ✦ AI
      </span>

      <div className="w-px h-4 bg-border mr-1" />

      {loading ? (
        <div className="flex items-center gap-2 px-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-dot"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      ) : (
        ACTIONS.map((action) => (
          <button
            key={action.id}
            title={action.title}
            onClick={() => onAction(action.id)}
            className="bg-transparent border-none text-muted text-xs font-sans px-2 py-1 rounded-md cursor-pointer whitespace-nowrap hover:bg-badge hover:text-foreground transition-all duration-150"
          >
            {action.label}
          </button>
        ))
      )}
    </div>
  )
}