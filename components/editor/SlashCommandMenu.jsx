'use client'

const SLASH_COMMANDS = [
  { icon: 'H1', label: 'Heading 1', filter: 'h1', insert: '# ' },
  { icon: 'H2', label: 'Heading 2', filter: 'h2', insert: '## ' },
  { icon: 'H3', label: 'Heading 3', filter: 'h3', insert: '### ' },
  { icon: '❝', label: 'Quote', filter: 'quote', insert: '> ' },
  { icon: '</>', label: 'Code block', filter: 'code', insert: '```\n\n```' },
  { icon: '•', label: 'Bullet list', filter: 'list', insert: '- ' },
  { icon: '☐', label: 'Task list', filter: 'task', insert: '- [ ] ' },
  { icon: '—', label: 'Divider', filter: 'divider', insert: '\n---\n' },
  {
    icon: '⊞',
    label: 'Table',
    filter: 'table',
    insert: '| Col 1 | Col 2 |\n|-------|-------|\n| | |',
  },
]

export { SLASH_COMMANDS }

export default function SlashCommandMenu({ position, filter, onSelect }) {
  if (!position) return null

  const filtered = SLASH_COMMANDS.filter(
    (c) => c.filter.includes(filter.toLowerCase()) || filter === ''
  )

  return (
    <div
      className="fixed bg-card border border-border rounded-xl overflow-hidden z-[200] min-w-[210px] shadow-lg animate-slide-down"
      style={{
        top: position.top + 28,
        left: Math.min(position.left, window.innerWidth - 220),
      }}
    >
      {/* Header */}
      <div className="px-3 py-1.5 text-[10px] text-muted font-sans tracking-wider uppercase border-b border-border">
        Insert block
      </div>

      {/* Commands */}
      {filtered.map((cmd) => (
        <button
          key={cmd.label}
          onClick={() => onSelect(cmd)}
          className="flex items-center gap-2.5 w-full px-3.5 py-2 text-left bg-transparent border-none text-foreground font-sans text-sm cursor-pointer border-b border-border hover:bg-badge transition-colors duration-150"
        >
          <span className="font-mono text-primary text-xs bg-primary/10 py-0.5 px-1.5 rounded min-w-[32px] text-center inline-block">
            {cmd.icon}
          </span>
          <span className="text-sm text-foreground">{cmd.label}</span>
        </button>
      ))}
    </div>
  )
}
