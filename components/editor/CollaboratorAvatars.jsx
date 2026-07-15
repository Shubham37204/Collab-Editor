'use client'

export default function CollaboratorAvatars({ others }) {
  if (!others || others.length === 0) return null

  return (
    <div className="flex items-center">
      {others.slice(0, 4).map((other, i) => {
        const presence = other.presence || {};
        // Support both direct presence fields and nested `user` field (from Yjs awareness)
        const name = presence.name || (presence.user && presence.user.name) || 'Collaborator';
        const avatar = presence.avatar || (presence.user && presence.user.avatar);

        return (
          <div
            key={i}
            title={name}
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 cursor-default overflow-hidden bg-background"
            style={{
              borderColor: 'var(--primary-color)',
              marginLeft: i === 0 ? 0 : '-8px',
              position: 'relative',
              zIndex: 4 - i,
            }}
          >
            {avatar ? (
              <img src={avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <span style={{ color: 'var(--primary-color)' }}>
                {(name?.[0] || '?').toUpperCase()}
              </span>
            )}
          </div>
        )
      })}
      <span className="text-xs text-muted font-sans ml-2">
        {others.length} online
      </span>
    </div>
  )
}
