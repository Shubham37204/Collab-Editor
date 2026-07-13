'use client'
import { useTheme } from '../../app/layout'
import { UserButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

const FORMAT_BUTTONS = [
  { label: 'B', val: '**', block: false, title: 'Bold', className: 'font-black' },
  { label: 'I', val: '_', block: false, title: 'Italic', className: 'italic font-semibold' },
  { label: 'H1', val: '# ', block: true, title: 'Heading 1', className: 'font-black' },
  { label: 'H2', val: '## ', block: true, title: 'Heading 2', className: 'font-bold' },
  { label: '</>', val: '`', block: false, title: 'Inline code', className: 'font-mono font-bold' },
]

const panelButtonClass = (active) =>
  `border-none rounded-lg px-3 py-1.5 text-[11px] font-sans font-semibold cursor-pointer transition-all duration-150 ${
    active
      ? 'bg-primary text-white shadow-sm'
      : 'bg-transparent text-muted hover:bg-background hover:text-foreground'
  }`

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
  showComments,
  onToggleComments,
  showActivity,
  onToggleActivity,
  showExport,
  onToggleExport,
  onExportMD,
  onExportPDF,
  onSave,
  onShare,
  saving,
  collaborators,
  isReadOnly,
}) {
  const { dark, setDark } = useTheme()
  const router = useRouter()

  if (focusMode) return null;

  return (
    <div className="editor-header fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-[100] rounded-2xl px-3 py-2 flex items-center justify-between gap-3 w-[95%] max-w-5xl transition-all duration-300">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <button
          onClick={() => router.push('/dashboard')}
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-badge text-muted hover:text-foreground transition-colors cursor-pointer shrink-0"
          title="Back to Dashboard"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Untitled"
          readOnly={isReadOnly}
          className={`text-sm md:text-base font-sans font-semibold bg-transparent border-none outline-none text-foreground tracking-tight w-full max-w-[110px] md:max-w-[190px] placeholder:text-muted/50 ${isReadOnly ? 'cursor-default' : ''}`}
        />
        {isReadOnly ? (
          <span className="text-[9px] md:text-[10px] font-sans font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-white/5 text-muted border border-white/10 ml-2">
            View Only
          </span>
        ) : (
          <span className={`text-[10px] font-sans font-bold tracking-wide uppercase whitespace-nowrap rounded-full px-2 py-1 ${saving ? 'bg-primary/10 text-primary animate-pulse' : 'bg-success/10 text-muted'}`}>
            {saving ? "..." : "Saved"}
          </span>
        )}
      </div>

      {!isReadOnly && (
        <div className="hidden lg:flex items-center justify-center shrink-0 gap-2">
          <div className="editor-control-group">
            {FORMAT_BUTTONS.map((btn) => (
              <button
                key={btn.label}
                title={btn.title}
                onClick={() => onFormat(btn.val, btn.block)}
                className={`editor-tool-button ${btn.className}`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <div className="editor-control-group">
            <button
              onClick={onTogglePreview}
              className={panelButtonClass(preview)}
            >
              {preview ? 'Write' : 'Preview'}
            </button>
            <button
              onClick={onToggleVersions}
              className={panelButtonClass(showVersions)}
            >
              History
            </button>
            <button
              onClick={onToggleComments}
              className={panelButtonClass(showComments)}
            >
              Comments
            </button>
            <button
              onClick={onToggleActivity}
              className={panelButtonClass(showActivity)}
            >
              Activity
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-end gap-2 md:gap-3 flex-1 min-w-0">
        <div className="flex items-center gap-1 hidden md:flex">
          {collaborators}
        </div>

        <div className="h-5 w-px bg-border shrink-0 hidden md:block" />

        <div className="relative">
          <button
            onClick={onToggleExport}
            className="w-9 h-9 flex items-center justify-center bg-transparent border-none rounded-xl text-muted cursor-pointer hover:bg-badge hover:text-foreground transition-all duration-150"
            title="Export"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </button>
          {showExport && (
            <div className="absolute right-0 top-[calc(100%+12px)] glass-panel rounded-xl overflow-hidden z-50 min-w-[150px] shadow-2xl animate-slide-down">
              <button
                onClick={onExportMD}
                className="block w-full px-4 py-2.5 text-left bg-transparent border-none text-foreground font-sans text-sm cursor-pointer border-b border-white/10 hover:bg-white/5 transition-colors"
              >
                Download .md
              </button>
              <button
                onClick={onExportPDF}
                className="block w-full px-4 py-2.5 text-left bg-transparent border-none text-foreground font-sans text-sm cursor-pointer hover:bg-white/5 transition-colors"
              >
                Export PDF
              </button>
            </div>
          )}
        </div>

        {!isReadOnly && (
          <button
            onClick={onShare}
            className="bg-primary text-white border-none rounded-xl px-4 py-2 text-xs font-sans font-bold cursor-pointer hover:bg-primary-hover transition-all duration-200 shadow-lg shadow-primary/20"
          >
            Share
          </button>
        )}

        <div className="h-5 w-px bg-border shrink-0 hidden sm:block" />
        
        <button
          onClick={() => setDark(!dark)}
          className="w-9 h-9 flex items-center justify-center bg-transparent border-none rounded-xl text-muted hover:bg-badge hover:text-foreground cursor-pointer transition-colors hidden sm:flex"
          title="Toggle Theme"
        >
          {dark ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          )}
        </button>

        <div className="flex items-center scale-90 md:scale-100">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  )
}
