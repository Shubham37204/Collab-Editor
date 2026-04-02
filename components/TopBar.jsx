'use client'
import { useTheme } from '../app/layout'
import { UserButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function TopBar({ showBack = false, backLabel = '← Dashboard', rightContent }) {
  const { dark, setDark, theme } = useTheme()
  const router = useRouter()

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 48px',
      borderBottom: `1px solid ${theme.border}`,
      background: theme.bg,
      transition: 'background 0.3s ease',
    }}>
      {/* Left — logo or back button */}
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
            letterSpacing: '0.2px',
            padding: 0,
          }}
        >
          {backLabel}
        </button>
      ) : (
        <span style={{
          fontFamily: theme.serif,
          fontWeight: '700',
          fontSize: '18px',
          letterSpacing: '-0.3px',
          color: theme.text,
        }}>
          CollabDocs
        </span>
      )}

      {/* Right — custom content + theme toggle + avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {rightContent}

        <button
          onClick={() => setDark(!dark)}
          style={{
            background: theme.badge,
            border: `1px solid ${theme.border}`,
            borderRadius: '20px',
            padding: '6px 14px',
            fontSize: '12px',
            cursor: 'pointer',
            color: theme.muted,
            fontFamily: theme.sans,
            letterSpacing: '0.5px',
            transition: 'all 0.2s ease',
          }}
        >
          {dark ? '☀ Light' : '☾ Dark'}
        </button>

        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  )
}