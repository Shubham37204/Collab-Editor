'use client'

export default function StatusBar({ wordCount, onShowShortcuts, connectionStatus }) {
  const readTime = Math.max(1, Math.ceil(wordCount / 200))

  const statusColor = {
    connected: 'bg-success',
    reconnecting: 'bg-yellow-500',
    offline: 'bg-danger',
  }

  const statusLabel = {
    connected: 'Connected',
    reconnecting: 'Reconnecting…',
    offline: 'Offline',
  }

  return (
    <div className="border-t border-border bg-background-secondary px-6 py-1 flex justify-between items-center text-xs text-muted font-sans shrink-0" data-no-print>
      <div className="flex gap-4 items-center">
        <span>{wordCount} words</span>
        <span>{readTime} min read</span>

        {/* Connection status indicator */}
        {connectionStatus && (
          <span className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${statusColor[connectionStatus] || 'bg-muted'}`} />
            {statusLabel[connectionStatus] || connectionStatus}
          </span>
        )}
      </div>
      <span
        className="cursor-pointer tracking-wide hover:text-foreground transition-colors duration-150"
        onClick={onShowShortcuts}
        title="Keyboard shortcuts"
      >
        Press ? for shortcuts
      </span>
    </div>
  )
}
