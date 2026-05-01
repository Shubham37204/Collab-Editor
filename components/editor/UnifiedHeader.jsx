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
  onShare,
  saving,
  collaborators,
}) {
  const { dark, setDark } = useTheme()
  const router = useRouter()

  if (focusMode) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] glass-panel rounded-full px-4 py-2 flex items-center justify-between gap-4 shadow-[0_8px_32px_rgba(0,0,0,0.5)] w-11/12 max-w-4xl border border-white/10 backdrop-blur-xl transition-all duration-300">
      {/* Left: Back button & Title */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <button
          onClick={() => router.push('/dashboard')}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-muted hover:text-foreground transition-colors cursor-pointer shrink-0"
          title="Back to Dashboard"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Untitled"
          className="text-sm font-sans font-medium bg-transparent border-none outline-none text-foreground tracking-tight w-full max-w-[150px] placeholder:text-muted/50"
        />
        <span className={`text-[10px] font-sans font-medium tracking-wide uppercase whitespace-nowrap ml-2 ${saving ? 'text-primary animate-pulse drop-shadow-[0_0_5px_rgba(99,102,241,0.5)]' : 'text-muted'}`}>
          {saving ? "Saving" : "Saved"}
        </span>
      </div>

      {/* Center: Formatting tools */}
      <div className="flex items-center justify-center shrink-0 px-2">
        <div className="flex items-center gap-1 bg-black/20 p-1 rounded-full border border-white/5 shadow-inner">
          {FORMAT_BUTTONS.map((btn) => (
            <button
              key={btn.label}
              title={btn.title}
              onClick={() => onFormat(btn.val, btn.block)}
              className="bg-transparent border-none rounded-full min-w-[32px] h-8 px-2 flex items-center justify-center text-sm font-sans font-bold text-muted cursor-pointer hover:bg-white/10 hover:text-foreground transition-all duration-150"
            >
              {btn.label}
            </button>
          ))}
          <div className="w-px h-4 bg-white/10 mx-1" />
          <button
            onClick={onTogglePreview}
            className={`border-none rounded-full px-3 py-1 text-[11px] font-sans font-medium cursor-pointer transition-all duration-150 ${
              preview
                ? 'bg-primary text-white shadow-[0_0_10px_rgba(99,102,241,0.5)]'
                : 'bg-transparent text-muted hover:bg-white/10 hover:text-foreground'
            }`}
          >
            {preview ? 'Write' : 'Preview'}
          </button>
          <button
            onClick={onToggleVersions}
            className={`border-none rounded-full px-3 py-1 text-[11px] font-sans font-medium cursor-pointer transition-all duration-150 ${
              showVersions
                ? 'bg-primary text-white shadow-[0_0_10px_rgba(99,102,241,0.5)]'
                : 'bg-transparent text-muted hover:bg-white/10 hover:text-foreground'
            }`}
          >
            History
          </button>
        </div>
      </div>

      {/* Right: Actions & User */}
      <div className="flex items-center justify-end gap-3 flex-1 min-w-0">
        <div className="flex items-center gap-2 hidden sm:flex">
          {collaborators}
        </div>

        <div className="h-4 w-px bg-white/10 shrink-0 hidden sm:block" />

        <div className="relative">
          <button
            onClick={onToggleExport}
            className="w-8 h-8 flex items-center justify-center bg-transparent border-none rounded-full text-muted cursor-pointer hover:bg-white/10 hover:text-foreground transition-all duration-150"
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

        <button
          onClick={onShare}
          className="glow-border relative bg-primary text-white border-none rounded-full px-4 py-1.5 text-xs font-sans font-medium cursor-pointer hover:bg-primary-hover shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all duration-200 overflow-hidden"
        >
          <span className="relative z-10">Share</span>
        </button>

        <div className="h-4 w-px bg-white/10 shrink-0" />
        
        <button
          onClick={() => setDark(!dark)}
          className="w-8 h-8 flex items-center justify-center bg-transparent border-none rounded-full text-muted hover:bg-white/10 hover:text-foreground cursor-pointer transition-colors"
          title="Toggle Theme"
        >
          {dark ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          )}
        </button>

        <div className="ml-1 flex items-center">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  )
}
