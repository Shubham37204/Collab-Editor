import { createClient } from '@liveblocks/client'
import { createRoomContext } from '@liveblocks/react'

const client = createClient({
  authEndpoint: async (room) => {
    const response = await fetch('/api/liveblocks-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ room }),
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`Auth failed: ${text}`)
    }

    return response.json()
  },
})

export const {
  RoomProvider,
  useOthers,
  useMyPresence,
  useRoom,
  useSelf,
} = createRoomContext(client)

// Suppress dev overlay
if (typeof window !== 'undefined') {
  const observer = new MutationObserver(() => {
    document.querySelectorAll('[data-liveblocks-portal], .lb-root, .lb-portal, .lb-branding, [class*="lb-badge"], [href*="liveblocks.io"]').forEach(el => {
      el.style.display = 'none'
      el.style.visibility = 'hidden'
    })
  })
  observer.observe(document.body, { childList: true, subtree: true })
}

