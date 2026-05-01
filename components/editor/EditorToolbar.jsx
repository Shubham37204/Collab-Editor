'use client'
import { useTheme } from '../../app/layout'

const FORMAT_BUTTONS = [
  { label: 'B', val: '**', block: false, title: 'Bold' },
  { label: 'I', val: '_', block: false, title: 'Italic' },
  { label: 'H1', val: '# ', block: true, title: 'Heading 1' },
  { label: 'H2', val: '## ', block: true, title: 'Heading 2' },
  { label: '</>', val: '`', block: false, title: 'Inline code' },
]

export default function EditorToolbar({
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
  collaboratorCount,
}) {
  const { dark } = useTheme()

  return (
    <div className="flex items-center gap-1 px-4 py-1.5 border-b border-border bg-surface shrink-0 flex-wrap" data-no-print>
      {/* Format buttons */}
      {FORMAT_BUTTONS.map((btn) => (
        <button
          key={btn.label}
          title={btn.title}
          onClick={() => onFormat(btn.val, btn.block)}
          className="bg-transparent border border-border rounded px-2.5 py-1 text-xs font-mono text-muted cursor-pointer hover:bg-badge hover:text-foreground transition-all duration-150"
        >
          {btn.label}
        </button>
      ))}

      {/* Divider */}
      <div className="w-px h-4 bg-border shrink-0 mx-1" />

      {/* View buttons */}
      <button
        onClick={onTogglePreview}
        className={`border rounded px-2.5 py-1 text-xs font-mono cursor-pointer transition-all duration-150 ${
          preview
            ? 'bg-primary/10 border-primary/40 text-primary'
            : 'bg-transparent border-border text-muted hover:bg-badge hover:text-foreground'
        }`}
      >
        {preview ? 'Hide Preview' : 'Preview'}
      </button>
      <button
        onClick={onToggleFocusMode}
        className="bg-transparent border border-border rounded px-2.5 py-1 text-xs font-mono text-muted cursor-pointer hover:bg-badge hover:text-foreground transition-all duration-150"
      >
        Focus
      </button>
      <button
        onClick={onToggleVersions}
        className={`border rounded px-2.5 py-1 text-xs font-mono cursor-pointer transition-all duration-150 ${
          showVersions
            ? 'bg-primary/10 border-primary/40 text-primary'
            : 'bg-transparent border-border text-muted hover:bg-badge hover:text-foreground'
        }`}
      >
        History
      </button>

      <div className="w-px h-4 bg-border shrink-0 mx-1" />
      <div className="flex-1" />

      {/* Collaborator badge */}
      {collaboratorCount > 0 && (
        <span className="text-xs text-muted font-sans bg-badge py-0.5 px-2 rounded-full border border-border">
          {collaboratorCount} collaborating
        </span>
      )}

      {/* Export dropdown */}
      <div className="relative">
        <button
          onClick={onToggleExport}
          className={`border rounded px-2.5 py-1 text-xs font-mono cursor-pointer transition-all duration-150 ${
            showExport
              ? 'bg-primary/10 border-primary/40 text-primary'
              : 'bg-transparent border-border text-muted hover:bg-badge hover:text-foreground'
          }`}
        >
          Export ↓
        </button>
        {showExport && (
          <div className="absolute right-0 top-[calc(100%+6px)] bg-card border border-border rounded-lg overflow-hidden z-50 min-w-[170px] shadow-lg animate-slide-down">
            <button
              onClick={onExportMD}
              className="block w-full px-4 py-2.5 text-left bg-transparent border-none text-foreground font-sans text-sm cursor-pointer border-b border-border hover:bg-badge transition-colors duration-150"
            >
              ⬇ Download .md
            </button>
            <button
              onClick={onExportPDF}
              className="block w-full px-4 py-2.5 text-left bg-transparent border-none text-foreground font-sans text-sm cursor-pointer hover:bg-badge transition-colors duration-150"
            >
              🖨 Export PDF
            </button>
          </div>
        )}
      </div>

      {/* Save button */}
      <button
        onClick={onSave}
        disabled={saving}
        className="bg-primary text-white border-none rounded-md px-3.5 py-1 text-xs font-sans font-medium cursor-pointer hover:bg-primary-hover transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {saving ? 'Saving...' : '💾 Save'}
      </button>
    </div>
  )
}
