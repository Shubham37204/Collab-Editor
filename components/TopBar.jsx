'use client'
import { useTheme } from '../app/layout'
import { UserButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function TopBar({
  showBack = false,
  backLabel = '← Dashboard',
  rightContent
}) {
  const { dark, setDark, theme } = useTheme()
  const router = useRouter()

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 32px',
      height: '52px',
      borderBottom: `1px solid ${theme.border}`,
      background: dark ? '#0a0a0a' : '#ffffff',
      transition: 'background 0.25s ease',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      flexShrink: 0,
    }}>
      {/* Left */}
      {showBack ? (
        <button
          onClick={() => router.push('/dashboard')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '13px',
            color: theme.muted,
            cursor: 'pointer',
            fontFamily: theme.sans,
            padding: '6px 0',
            letterSpacing: '0.2px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
          onMouseEnter={e => e.target.style.color = theme.text}
          onMouseLeave={e => e.target.style.color = theme.muted}
        >
          ← Dashboard
        </button>
      ) : (
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          onClick={() => router.push('/')}
        >
          <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
            <rect x="4" y="2" width="16" height="20" rx="3"
              fill={theme.accent + '33'} stroke={theme.accent} strokeWidth="1.5"/>
            <path d="M8 8h8M8 12h8M8 16h5"
              stroke={theme.accent} strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="21" cy="21" r="5" fill={theme.accent}/>
            <path d="M19.5 21.5l1 1 2-2" stroke="#fff"
              strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{
            fontFamily: theme.serif,
            fontWeight: '700',
            fontSize: '17px',
            color: theme.text,
            letterSpacing: '-0.3px',
          }}>
            CollabDocs
          </span>
        </div>
      )}

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {rightContent}

        <button
          onClick={() => setDark(!dark)}
          style={{
            background: theme.badge,
            border: `1px solid ${theme.border}`,
            borderRadius: '20px',
            padding: '5px 13px',
            fontSize: '12px',
            cursor: 'pointer',
            color: theme.muted,
            fontFamily: theme.sans,
            letterSpacing: '0.3px',
            whiteSpace: 'nowrap',
          }}
        >
          {dark ? '☀ Light' : '☾ Dark'}
        </button>

        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  )
}