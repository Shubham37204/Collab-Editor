'use client'
import { useState } from 'react'

export default function DocCard({ doc, onClick, onDelete, onStar, onShare }) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async (e) => {
    e.stopPropagation()
    setDeleting(true)
    await onDelete(doc._id)
  }

  const handleStar  = (e) => { e.stopPropagation(); onStar() }
  const handleShare = (e) => { e.stopPropagation(); onShare() }

  const wordCount = doc.content
    ? doc.content.trim().split(/\s+/).filter(Boolean).length
    : 0

  return (
    <div
      onClick={onClick}
      className="glass-panel group relative flex flex-col justify-between rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)] min-h-[160px] overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Top Section */}
      <div className="flex items-start justify-between relative z-10">
        {/* Doc icon */}
        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
          <svg width="18" height="20" viewBox="0 0 16 18" fill="none">
            <rect x="1" y="1" width="10" height="14" rx="2"
              stroke="currentColor" className="text-primary" strokeWidth="1.2"/>
            <path d="M4 5h6M4 8h6M4 11h4"
              stroke="currentColor" className="text-primary" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Hover actions */}
        <div
          className="flex gap-1.5 items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleStar}
            className={`bg-transparent border border-border/50 rounded-lg px-2 py-1 text-sm cursor-pointer transition-all duration-150 hover:bg-card hover:border-primary/50 ${
              doc.starred ? 'text-primary drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'text-muted'
            }`}
          >
            {doc.starred ? '★' : '☆'}
          </button>
          <button
            onClick={handleShare}
            className="bg-transparent border border-border/50 text-muted rounded-lg px-2 py-1 text-xs font-sans cursor-pointer hover:bg-card hover:text-foreground transition-all duration-150"
          >
            Share
          </button>
          <button
            onClick={handleDelete}
            className="bg-transparent border border-danger/30 text-danger rounded-lg px-2 py-1 text-xs font-sans cursor-pointer hover:bg-danger/10 transition-all duration-150 disabled:opacity-40"
            disabled={deleting}
          >
            {deleting ? '...' : 'Del'}
          </button>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-8 relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-sans text-lg font-bold text-foreground tracking-tight m-0 truncate">
            {doc.title}
          </h3>
          {doc.starred && (
            <span className="text-primary text-sm leading-none drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]">★</span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <p className="text-[10px] text-muted/60 font-sans font-medium m-0">
              {doc.ownerName || 'Unknown'}
            </p>
            <p className="text-xs text-muted font-sans m-0">
              {new Date(doc._creationTime).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric',
              })}
              <span className="mx-1.5 opacity-40">·</span>
              {wordCount} {wordCount === 1 ? 'word' : 'words'}
            </p>
          </div>

          {doc.collaborators?.length > 0 && (
            <span className="text-[10px] bg-primary/20 text-primary py-0.5 px-2 rounded-full font-sans font-bold tracking-wider uppercase border border-primary/20 drop-shadow-sm">
              Shared
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
