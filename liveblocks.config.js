import { createClient } from '@liveblocks/client'
import { createRoomContext } from '@liveblocks/react'

const client = createClient({
  authEndpoint: '/api/liveblocks-auth',
})

// Presence = data each user broadcasts live (cursor position, name)
// Storage = shared persistent data (the Y.js document content)
export const {
  RoomProvider,
  useOthers,          // hook: get list of other users in the room
  useMyPresence,      // hook: read/update your own presence
  useRoom,            // hook: get the raw room object (needed for Y.js)
  useSelf,            // hook: your own user info
} = createRoomContext(client)