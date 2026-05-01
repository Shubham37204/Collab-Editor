'use client'
import { useState } from 'react'

export default function ShareDocModal({
  open,
  onClose,
  doc,
  user,
  onShare,
}) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('editor')

  if (!open || !doc) return null

  const handleInvite = () => {
    if (!email.trim()) return
    onShare(email, role)
    setEmail('')
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-card border border-border rounded-2xl p-8 w-full max-w-md animate-scale-in">
        {/* Header */}
        <div className="flex justify-between items-start mb-1">
          <div>
            <h3 className="font-serif text-lg font-normal m-0 text-foreground">
              Share document
            </h3>
            <p className="font-sans text-xs text-muted mt-1 m-0">
              Invite collaborators by email
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-foreground text-lg cursor-pointer bg-transparent border-none p-1"
          >
            ×
          </button>
        </div>

        {/* Invite row */}
        <div className="flex gap-2 my-5">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
            placeholder="Enter email address"
            className="flex-1 py-2.5 px-3.5 rounded-lg border border-border bg-background text-foreground font-sans text-sm outline-none focus:border-primary/50 transition-colors duration-200"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="bg-badge border border-border text-foreground font-sans text-xs rounded-lg px-2.5 cursor-pointer outline-none"
          >
            <option value="editor">can edit</option>
            <option value="viewer">can view</option>
          </select>
          <button
            onClick={handleInvite}
            className="bg-primary text-white border-none py-2 px-4 rounded-lg font-sans text-sm cursor-pointer hover:bg-primary-hover transition-colors duration-200 whitespace-nowrap"
          >
            Invite
          </button>
        </div>

        {/* Collaborator list */}
        <div className="border-t border-border pt-4">
          {/* Owner */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary flex items-center justify-center text-sm text-primary font-medium">
                {user?.firstName?.[0]}
              </div>
              <div>
                <p className="text-sm font-sans text-foreground m-0">{user?.fullName}</p>
                <p className="text-xs font-sans text-muted m-0">
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </div>
            <span className="text-xs text-muted font-sans">Owner</span>
          </div>

          {/* Other collaborators */}
          {doc.collaborators?.map((c, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-badge border border-border flex items-center justify-center text-sm text-muted">
                  {c.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <p className="text-sm font-sans text-foreground m-0">{c.name}</p>
                  <p className="text-xs font-sans text-muted m-0">{c.email}</p>
                </div>
              </div>
              <span className="text-xs py-0.5 px-2 rounded-full bg-primary/10 text-primary font-sans">
                {c.role === 'editor' ? 'can edit' : 'can view'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
