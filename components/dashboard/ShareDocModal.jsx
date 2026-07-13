'use client'
import { useState } from 'react'
import { useUser } from '@clerk/nextjs'

export default function ShareDocModal({
  open,
  onClose,
  doc,
  onShare,
  onUpdateRole,
  onRemoveCollaborator,
  onTogglePublic,
}) {
  const { user } = useUser()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('editor')
  const [error, setError] = useState('')

  if (!open || !doc) return null

  const shareUrl = typeof window !== 'undefined' && doc?._id
    ? `${window.location.origin}/editor/${doc._id}`
    : ''

  const handleInvite = async () => {
    if (!email.trim()) return
    setError('')
    try {
      await onShare(email, role)
      setEmail('')
    } catch (err) {
      setError(err.message || 'Unable to invite collaborator')
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="glass-panel border border-border/50 rounded-2xl p-8 w-full max-w-md animate-scale-in shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none -z-10" />
        
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="font-sans text-2xl font-bold tracking-tight m-0 text-foreground">
              Share Document
            </h3>
            <p className="font-sans text-sm text-muted mt-1 m-0">
              Invite collaborators to this document
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-transparent hover:bg-badge text-muted hover:text-foreground text-lg cursor-pointer border-none transition-colors"
          >
            ×
          </button>
        </div>

        {/* Invite row */}
        <div className="my-6 rounded-xl border border-border/50 bg-background/60 p-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-sans font-bold text-foreground m-0">Public link</p>
              <p className="text-xs font-sans text-muted m-0">
                {doc.isPublic ? 'Anyone with the link can view this document.' : 'Only invited collaborators can open it.'}
              </p>
            </div>
            <button
              onClick={() => onTogglePublic?.(!doc.isPublic)}
              className={`border rounded-full px-3 py-1.5 text-xs font-sans font-bold cursor-pointer ${
                doc.isPublic
                  ? 'bg-primary text-white border-primary'
                  : 'bg-badge text-muted border-border'
              }`}
            >
              {doc.isPublic ? 'Public' : 'Private'}
            </button>
          </div>
          {doc.isPublic && (
            <div className="mt-3 flex gap-2">
              <input
                value={shareUrl}
                readOnly
                className="flex-1 py-2 px-3 rounded-lg border border-border/50 bg-background text-muted font-sans text-xs outline-none"
              />
              <button
                onClick={() => navigator.clipboard?.writeText(shareUrl)}
                className="bg-badge border border-border text-foreground rounded-lg px-3 text-xs font-sans cursor-pointer hover:bg-surface"
              >
                Copy
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-2 my-6">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
            placeholder="Email address..."
            className="flex-1 py-2.5 px-4 rounded-xl border border-border/50 bg-background text-foreground font-sans text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all duration-200 placeholder:text-muted/50 shadow-inner"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="bg-background border border-border/50 text-foreground font-sans text-xs rounded-xl px-3 cursor-pointer outline-none focus:border-primary/50 transition-colors shadow-inner"
          >
            <option value="editor">Can edit</option>
            <option value="viewer">Can view</option>
          </select>
          <button
            onClick={handleInvite}
            className="glow-border relative bg-primary text-white border-none py-2 px-5 rounded-xl font-sans text-sm font-bold cursor-pointer hover:bg-primary-hover shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all duration-200 whitespace-nowrap overflow-hidden"
          >
            <span className="relative z-10">Invite</span>
          </button>
        </div>
        {error && <p className="text-xs text-danger font-sans -mt-4 mb-4">{error}</p>}

        {/* Collaborator list */}
        <div className="border-t border-border/50 pt-5">
          {/* Owner */}
          <div className="flex items-center justify-between py-2.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-base text-primary font-bold shadow-inner">
                {user?.firstName?.[0] || user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-sm font-sans font-bold text-foreground m-0 tracking-tight">
                  {user?.fullName || 'Current User'}
                </p>
                <p className="text-xs font-sans text-muted m-0">
                  {user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || 'Owner'}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-sans font-bold tracking-wider uppercase text-muted py-1 px-3 rounded-full bg-badge border border-border/50">
              Owner
            </span>
          </div>

          {/* Other collaborators */}
          {doc.collaborators?.map((c, i) => (
            <div key={i} className="flex items-center justify-between py-2.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-badge border border-border/50 flex items-center justify-center text-base text-muted font-bold shadow-inner">
                  {c.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <p className="text-sm font-sans font-bold text-foreground m-0 tracking-tight">{c.name}</p>
                  <p className="text-xs font-sans text-muted m-0">{c.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={c.role}
                  onChange={(e) => onUpdateRole?.(c.email, e.target.value)}
                  className="bg-background border border-border/50 text-foreground font-sans text-[10px] rounded-lg px-2 py-1 cursor-pointer outline-none"
                >
                  <option value="editor">Can edit</option>
                  <option value="viewer">Can view</option>
                </select>
                <button
                  onClick={() => onRemoveCollaborator?.(c.email)}
                  className="bg-transparent border border-danger/30 text-danger rounded-lg px-2 py-1 text-[10px] font-sans cursor-pointer hover:bg-danger/10"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
