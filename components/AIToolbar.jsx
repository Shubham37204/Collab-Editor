// ═══════════════════════════════════════════════════
// Floating AI toolbar — appears above selected text
// Props:
//   position: { top, left } — where to render
//   onAction: (action) => void — called when user picks an action
//   loading: bool — shows spinner while AI is responding
//   onClose: () => void
// ═══════════════════════════════════════════════════

'use client'
import { useTheme } from '../app/layout'
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
  const { theme } = useTheme()
  const ref = useRef(null)

  // Close when clicking outside
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
      style={{
        position: 'fixed',
        top: position.top - 52,
        left: Math.min(position.left, window.innerWidth - 440),
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        background: theme.card,
        border: `1px solid ${theme.border}`,
        borderRadius: '10px',
        padding: '6px 8px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        transition: 'opacity 0.15s',
      }}
    >
      {/* AI sparkle label */}
      <span style={{
        fontSize: '11px', color: theme.accent, fontFamily: theme.sans,
        fontWeight: '500', marginRight: '4px', letterSpacing: '0.2px',
      }}>
        ✦ AI
      </span>

      <div style={{ width: '1px', height: '16px', background: theme.border, marginRight: '4px' }} />

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '2px 8px' }}>
          {/* Animated dots */}
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: '5px', height: '5px', borderRadius: '50%',
              background: theme.accent,
              animation: `pulse 1s ease-in-out ${i * 0.2}s infinite`,
            }} />
          ))}
          <style>{`
            @keyframes pulse {
              0%, 100% { opacity: 0.3; transform: scale(0.8); }
              50% { opacity: 1; transform: scale(1.1); }
            }
          `}</style>
        </div>
      ) : (
        ACTIONS.map(action => (
          <button
            key={action.id}
            title={action.title}
            onClick={() => onAction(action.id)}
            style={{
              background: 'none',
              border: 'none',
              color: theme.muted,
              fontSize: '12px',
              fontFamily: theme.sans,
              padding: '4px 8px',
              borderRadius: '6px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.12s',
            }}
            onMouseEnter={e => {
              e.target.style.background = theme.badge
              e.target.style.color = theme.text
            }}
            onMouseLeave={e => {
              e.target.style.background = 'none'
              e.target.style.color = theme.muted
            }}
          >
            {action.label}
          </button>
        ))
      )}
    </div>
  )
}