'use client'
import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function NotificationDropdown({
  notifications,
  unreadCount,
  onMarkAllRead,
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const router = useRouter()

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleToggle = () => {
    setOpen((v) => !v)
    if (!open) onMarkAllRead?.()
  }

  return (
    <div ref={ref} className="relative">
      {/* Bell button */}
      <button
        onClick={handleToggle}
        className={`relative p-1.5 border rounded-lg text-muted hover:text-foreground transition-all duration-200 cursor-pointer ${
          open ? 'bg-badge border-border' : 'bg-transparent border-border'
        }`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-danger text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-11 bg-card border border-border rounded-xl w-72 max-h-80 overflow-auto z-50 shadow-lg animate-slide-down">
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 border-b border-border">
            <span className="text-sm font-medium text-foreground font-sans">
              Notifications
            </span>
            {unreadCount > 0 && (
              <span className="text-xs text-primary font-sans">
                {unreadCount} unread
              </span>
            )}
          </div>

          {/* Items */}
          {!notifications || notifications.length === 0 ? (
            <div className="py-8 text-center text-muted text-sm font-sans">
              No notifications yet
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => {
                  router.push(`/editor/${n.docId}`)
                  setOpen(false)
                }}
                className={`px-4 py-3 border-b border-border cursor-pointer hover:bg-badge transition-colors duration-150 ${
                  !n.read ? 'bg-primary/5' : ''
                }`}
              >
                <p className="text-sm text-foreground font-sans m-0">{n.message}</p>
                <p className="text-xs text-muted font-sans mt-0.5 m-0">{n.docTitle}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
