'use client'

export default function EmptyState({ onCreateNew }) {
  return (
    <div className="text-center mt-24 animate-fade-in">
      {/* Icon */}
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-6">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-primary" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" y1="18" x2="12" y2="12" />
          <line x1="9" y1="15" x2="15" y2="15" />
        </svg>
      </div>

      <h3 className="font-serif text-2xl font-normal mb-2 text-foreground">
        No documents yet
      </h3>
      <p className="text-muted text-sm font-sans mb-6 max-w-xs mx-auto">
        Create your first document to start writing and collaborating in real time.
      </p>
      <button
        onClick={onCreateNew}
        className="bg-primary text-white border-none px-6 py-2.5 text-sm font-sans font-medium rounded-xl cursor-pointer hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 shadow-md shadow-primary/20"
      >
        + New document
      </button>
    </div>
  )
}
