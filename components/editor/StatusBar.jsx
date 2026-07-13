'use client'

export default function StatusBar({ wordCount, onShowShortcuts, connectionStatus, onlineCount, lastError }) {
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
    <div className="border-t border-border bg-card/90 px-6 py-2 flex justify-between items-center text-xs text-muted font-sans shrink-0 shadow-[0_-8px_24px_rgba(0,0,0,0.04)]" data-no-print>
      <div className="flex gap-4 items-center">
        <span>{wordCount} words</span>
        <span>{readTime} min read</span>

        {connectionStatus && (
          <span className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${statusColor[connectionStatus] || 'bg-muted'}`} />
            {statusLabel[connectionStatus] || connectionStatus}
          </span>
        )}
        <span>{onlineCount || 1} online</span>
        {lastError && <span className="text-danger">Last error: {lastError}</span>}
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
