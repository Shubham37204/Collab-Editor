'use client'

export default function CollaboratorAvatars({ others }) {
  if (!others || others.length === 0) return null

  return (
    <div className="flex items-center">
      {others.slice(0, 4).map((other, i) => (
        <div
          key={i}
          title={other.info?.name || 'Collaborator'}
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 cursor-default"
          style={{
            background: (other.info?.color || '#888') + '33',
            borderColor: other.info?.color || '#888',
            color: other.info?.color || 'inherit',
            marginLeft: i === 0 ? 0 : '-8px',
            position: 'relative',
            zIndex: 4 - i,
          }}
        >
          {(other.info?.name?.[0] || '?').toUpperCase()}
        </div>
      ))}
      <span className="text-xs text-muted font-sans ml-2">
        {others.length} online
      </span>
    </div>
  )
}
