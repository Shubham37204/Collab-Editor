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
      className="group flex items-center justify-between rounded-xl px-5 py-4 cursor-pointer transition-all duration-300 border border-border/60 bg-card/30 hover:border-primary/40 hover:bg-card hover:shadow-md hover:-translate-y-0.5"
    >
      {/* Left */}
      <div className="flex items-center gap-3.5">
        {/* Doc icon */}
        <div className="w-9 h-9 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
          <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
            <rect x="1" y="1" width="10" height="14" rx="2"
              stroke="currentColor" className="text-primary" strokeWidth="1.2"/>
            <path d="M4 5h6M4 8h6M4 11h4"
              stroke="currentColor" className="text-primary" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </div>

        <div>
          {/* Title row */}
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-sans text-base font-medium text-foreground tracking-tight m-0">
              {doc.title}
            </h3>

            {/* Starred */}
            {doc.starred && (
              <span className="text-primary text-sm leading-none">★</span>
            )}

            {/* Shared badge */}
            {doc.collaborators?.length > 0 && (
              <span className="text-[10px] bg-primary/10 text-primary py-0.5 px-2 rounded-full font-sans tracking-wide">
                👥 shared
              </span>
            )}
          </div>

          {/* Date + word count */}
          <p className="text-xs text-muted font-sans m-0">
            {new Date(doc._creationTime).toLocaleDateString('en-US', {
              month: 'long', day: 'numeric', year: 'numeric',
            })}
            <span className="mx-1.5 opacity-40">·</span>
            {wordCount} {wordCount === 1 ? 'word' : 'words'}
          </p>
        </div>
      </div>

      {/* Hover actions */}
      <div
        className="flex gap-1.5 items-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Star */}
        <button
          onClick={handleStar}
          className={`bg-transparent border border-border rounded-md px-2.5 py-1 text-sm cursor-pointer transition-all duration-150 hover:bg-badge ${
            doc.starred ? 'text-primary border-primary/40' : 'text-muted'
          }`}
        >
          {doc.starred ? '★' : '☆'}
        </button>

        {/* Share */}
        <button
          onClick={handleShare}
          className="bg-transparent border border-border text-muted rounded-md px-2.5 py-1 text-xs font-sans cursor-pointer hover:bg-badge hover:text-foreground transition-all duration-150"
        >
          Share
        </button>

        {/* Delete */}
        <button
          onClick={handleDelete}
          className="bg-transparent border border-danger/30 text-danger rounded-md px-2.5 py-1 text-xs font-sans cursor-pointer hover:bg-danger/10 transition-all duration-150 disabled:opacity-40"
          disabled={deleting}
        >
          {deleting ? '...' : 'Delete'}
        </button>
      </div>
    </div>
  )
}
