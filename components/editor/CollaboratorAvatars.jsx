'use client'

export default function CollaboratorAvatars({ others, currentUser }) {
  const currentUserId = currentUser?.id
  const currentEmail = currentUser?.emailAddresses?.[0]?.emailAddress?.toLowerCase()
  const visibleOthers = (others || []).filter((other) => {
    const presence = other.presence || {}
    const nestedUser = presence.user || {}
    const otherUserId = presence.userId || nestedUser.userId || other.id
    const otherEmail = (presence.email || nestedUser.email || '').toLowerCase()

    if (currentUserId && otherUserId === currentUserId) return false
    if (currentEmail && otherEmail === currentEmail) return false
    return true
  })

  if (visibleOthers.length === 0) return null

  return (
    <div className="flex items-center">
      {visibleOthers.slice(0, 4).map((other, i) => {
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
        {visibleOthers.length} online
      </span>
    </div>
  )
}
