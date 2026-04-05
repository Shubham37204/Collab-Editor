'use client'
import { useTheme } from '../app/layout'
import { useState } from 'react'

export default function DocCard({ doc, onClick, onDelete, onStar, onShare }) {
  const { theme } = useTheme()
  const [hovered, setHovered] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async (e) => {
    e.stopPropagation()
    setDeleting(true)
    await onDelete(doc._id)
  }

  const handleStar  = (e) => { e.stopPropagation(); onStar() }
  const handleShare = (e) => { e.stopPropagation(); onShare() }

  //FEATURE 4 Word count
  const wordCount = doc.content
    ? doc.content.trim().split(/\s+/).filter(Boolean).length
    : 0

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? theme.card : 'transparent',
        border: `1px solid ${hovered ? theme.accent + '50' : theme.border}`,
        borderRadius: '8px',
        padding: '14px 20px',
        cursor: 'pointer',
        transition: 'all 0.18s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transform: hovered ? 'translateX(3px)' : 'none',
      }}
    >
      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>

        {/* Doc icon */}
        <div style={{
          width: '36px', height: '36px', borderRadius: '6px',
          background: theme.accent + '18',
          border: `1px solid ${theme.accent + '33'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
            <rect x="1" y="1" width="10" height="14" rx="2"
              stroke={theme.accent} strokeWidth="1.2"/>
            <path d="M4 5h6M4 8h6M4 11h4"
              stroke={theme.accent} strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </div>

        <div>
          {/* Title row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
            <h3 style={{
              fontFamily: theme.serif, fontSize: '15px',
              fontWeight: '400', color: theme.text, margin: 0,
            }}>
              {doc.title}
            </h3>

            {/*FEATURE 2 Starred */}
            {doc.starred && (
              <span style={{ color: theme.accent, fontSize: '13px', lineHeight: 1 }}>★</span>
            )}

            {/* [FEATURE 3] Shared badge */}
            {doc.collaborators?.length > 0 && (
              <span style={{
                fontSize: '10px', background: theme.accent + '18',
                color: theme.accent, padding: '2px 7px',
                borderRadius: '10px', fontFamily: theme.sans, letterSpacing: '0.2px',
              }}>
                👥 shared
              </span>
            )}
          </div>

          {/*FEATURE 4 Date + word count */}
          <p style={{
            fontSize: '12px', color: theme.muted,
            fontFamily: theme.sans, margin: 0,
          }}>
            {new Date(doc._creationTime).toLocaleDateString('en-US', {
              month: 'long', day: 'numeric', year: 'numeric',
            })}
            <span style={{ margin: '0 6px', opacity: 0.4 }}>·</span>
            {wordCount} {wordCount === 1 ? 'word' : 'words'}
          </p>
        </div>
      </div>

      {/* FEATURE 1 Hover actions */}
      {hovered && (
        <div
          style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Star */}
          <button onClick={handleStar} style={{
            background: 'none', border: `1px solid ${theme.border}`,
            color: doc.starred ? theme.accent : theme.muted,
            borderRadius: '6px', padding: '4px 10px', fontSize: '13px',
            cursor: 'pointer', transition: 'all 0.15s',
          }}>
            {doc.starred ? '★' : '☆'}
          </button>

          {/* Share */}
          <button onClick={handleShare} style={{
            background: 'none', border: `1px solid ${theme.border}`,
            color: theme.muted, borderRadius: '6px', padding: '4px 10px',
            fontSize: '12px', fontFamily: theme.sans, cursor: 'pointer',
          }}>
            Share
          </button>

          {/* Delete */}
          <button onClick={handleDelete} style={{
            background: 'none', border: '1px solid #e8555544',
            color: '#e85555', borderRadius: '6px', padding: '4px 10px',
            fontSize: '12px', fontFamily: theme.sans, cursor: 'pointer',
            opacity: deleting ? 0.4 : 1,
          }}>
            {deleting ? '...' : 'Delete'}
          </button>
        </div>
      )}
    </div>
  )
}
