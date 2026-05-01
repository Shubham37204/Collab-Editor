'use client'
import { useState } from 'react'
import { TEMPLATES } from '../../lib/templates'

export default function CreateDocModal({ open, onClose, onCreate, creating }) {
  const [title, setTitle] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('blank')

  if (!open) return null

  const handleCreate = () => {
    const template = TEMPLATES.find((t) => t.id === selectedTemplate)
    onCreate(title, template?.content || '')
    setTitle('')
    setSelectedTemplate('blank')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleCreate()
    if (e.key === 'Escape') onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
          setTitle('')
        }
      }}
    >
      <div className="bg-card border border-border rounded-2xl p-8 w-full max-w-lg animate-scale-in">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-serif text-xl font-normal text-foreground m-0">
            New document
          </h3>
          <button
            onClick={onClose}
            className="text-muted hover:text-foreground text-lg cursor-pointer bg-transparent border-none"
          >
            ×
          </button>
        </div>

        {/* Title input */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Document title..."
          className="w-full py-2.5 px-3.5 rounded-lg border border-border bg-background text-foreground font-sans text-sm outline-none transition-colors duration-200 focus:border-primary/50 mb-5"
          autoFocus
        />

        {/* Template selection */}
        <div className="mb-6">
          <p className="text-xs font-sans text-muted uppercase tracking-wider font-medium mb-3">
            Choose a template
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTemplate(t.id)}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-all duration-200 ${
                  selectedTemplate === t.id
                    ? 'border-primary bg-primary/10 ring-1 ring-primary/30'
                    : 'border-border bg-surface hover:border-primary/30 hover:bg-badge'
                }`}
              >
                <span className="text-lg block mb-1">{t.icon}</span>
                <span className="text-xs font-sans font-medium text-foreground block leading-tight">
                  {t.label}
                </span>
                <span className="text-[10px] font-sans text-muted leading-tight block mt-0.5">
                  {t.description}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2.5">
          <button
            onClick={() => { onClose(); setTitle('') }}
            className="bg-badge text-foreground border border-border py-2 px-5 rounded-lg font-sans text-sm cursor-pointer hover:bg-surface transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={creating}
            className="bg-primary text-white border-none py-2 px-5 rounded-lg font-sans text-sm cursor-pointer hover:bg-primary-hover transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {creating ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  )
}
