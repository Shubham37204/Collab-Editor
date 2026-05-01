'use client'
import { useTheme } from '../../app/layout'
import { UserButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

const FORMAT_BUTTONS = [
  { label: 'B', val: '**', block: false, title: 'Bold' },
  { label: 'I', val: '_', block: false, title: 'Italic' },
  { label: 'H1', val: '# ', block: true, title: 'Heading 1' },
  { label: 'H2', val: '## ', block: true, title: 'Heading 2' },
  { label: '</>', val: '`', block: false, title: 'Inline code' },
]

export default function UnifiedHeader({
  title,
  onTitleChange,
  onFormat,
  preview,
  onTogglePreview,
  focusMode,
  onToggleFocusMode,
  showVersions,
  onToggleVersions,
  showExport,
  onToggleExport,
  onExportMD,
  onExportPDF,
  onSave,
  saving,
  collaborators,
}) {
  const { dark, setDark } = useTheme()
  const router = useRouter()

  if (focusMode) return null;

  return (
    <header className="flex items-center justify-between px-4 py-2 border-b border-border bg-background shrink-0 sticky top-0 z-50">
      {/* Left: Back button & Title */}
      <div className="flex items-center gap-3 w-1/3">
        <button
          onClick={() => router.push('/dashboard')}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-badge text-muted hover:text-foreground transition-colors cursor-pointer"
          title="Back to Dashboard"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Untitled document"
          className="text-lg font-sans font-semibold bg-transparent border-none outline-none text-foreground tracking-tight w-full"
        />
      </div>

      {/* Center: Formatting tools */}
      <div className="flex items-center justify-center gap-1.5 w-1/3">
        <div className="flex items-center gap-1 bg-badge/50 p-1 rounded-lg border border-border/50 shadow-sm">
          {FORMAT_BUTTONS.map((btn) => (
            <button
              key={btn.label}
              title={btn.title}
              onClick={() => onFormat(btn.val, btn.block)}
              className="bg-transparent border-none rounded px-2.5 py-1 text-xs font-mono font-medium text-muted cursor-pointer hover:bg-background hover:text-foreground hover:shadow-sm transition-all duration-150"
            >
              {btn.label}
            </button>
          ))}
          <div className="w-px h-4 bg-border/80 mx-1" />
          <button
            onClick={onTogglePreview}
            className={`border-none rounded px-2.5 py-1 text-xs font-sans font-medium cursor-pointer transition-all duration-150 ${
              preview
                ? 'bg-primary/10 text-primary shadow-sm'
                : 'bg-transparent text-muted hover:bg-background hover:text-foreground hover:shadow-sm'
            }`}
          >
            {preview ? 'Hide Preview' : 'Preview'}
          </button>
          <button
            onClick={onToggleVersions}
            className={`border-none rounded px-2.5 py-1 text-xs font-sans font-medium cursor-pointer transition-all duration-150 ${
              showVersions
                ? 'bg-primary/10 text-primary shadow-sm'
                : 'bg-transparent text-muted hover:bg-background hover:text-foreground hover:shadow-sm'
            }`}
          >
            History
          </button>
        </div>
      </div>

      {/* Right: Actions & User */}
      <div className="flex items-center justify-end gap-3 w-1/3">
        <div className="flex items-center gap-2">
          {collaborators}
          <span className={`text-[11px] font-sans font-medium tracking-wide min-w-14 ${saving ? 'text-primary animate-pulse' : 'text-muted'}`}>
            {saving ? "Saving..." : "Saved"}
          </span>
        </div>

        <div className="h-4 w-px bg-border shrink-0" />

        <div className="relative">
          <button
            onClick={onToggleExport}
            className="bg-transparent border-none rounded text-xs font-sans font-medium text-muted cursor-pointer hover:text-foreground transition-all duration-150"
          >
            Export ↓
          </button>
          {showExport && (
            <div className="absolute right-0 top-[calc(100%+8px)] bg-card border border-border rounded-xl overflow-hidden z-50 min-w-[150px] shadow-lg animate-slide-down">
              <button
                onClick={onExportMD}
                className="block w-full px-4 py-2.5 text-left bg-transparent border-none text-foreground font-sans text-sm cursor-pointer border-b border-border/50 hover:bg-badge transition-colors"
              >
                Download .md
              </button>
              <button
                onClick={onExportPDF}
                className="block w-full px-4 py-2.5 text-left bg-transparent border-none text-foreground font-sans text-sm cursor-pointer hover:bg-badge transition-colors"
              >
                Export PDF
              </button>
            </div>
          )}
        </div>

        <button
          onClick={onSave}
          disabled={saving}
          className="bg-primary text-white border-none rounded-lg px-4 py-1.5 text-xs font-sans font-medium cursor-pointer hover:bg-primary-hover shadow-sm hover:shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Share
        </button>

        <div className="h-4 w-px bg-border shrink-0" />
        
        <button
          onClick={() => setDark(!dark)}
          className="bg-transparent border-none text-muted hover:text-foreground cursor-pointer text-lg leading-none"
          title="Toggle Theme"
        >
          {dark ? '☀' : '☾'}
        </button>

        <div className="ml-1 flex items-center">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  )
}
