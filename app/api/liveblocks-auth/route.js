import { Liveblocks } from '@liveblocks/node'
import { auth, currentUser } from '@clerk/nextjs/server'

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY,
})

export async function POST(request) {
  try {
    const { userId } = await auth()
    if (!userId) return new Response('Unauthorized', { status: 401 })

    const user = await currentUser()
    if (!user) return new Response('Unauthorized', { status: 401 })

    const body = await request.json()
    const { room } = body
    if (!room) return new Response('Room ID required', { status: 400 })

    const session = liveblocks.prepareSession(userId, {
      userInfo: {
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Anonymous',
        color: generateColor(userId),
        avatar: user.imageUrl || '',
      },
    })

    session.allow(room, session.FULL_ACCESS)

    const { status, body: responseBody } = await session.authorize()
    return new Response(responseBody, { status })

  } catch (err) {
    console.error('Liveblocks auth error:', err)
    return new Response('Auth failed: ' + err.message, { status: 500 })
  }
}

function generateColor(userId) {
  const colors = [
    '#E57373', '#64B5F6', '#81C784',
    '#FFB74D', '#BA68C8', '#4DB6AC',
    '#F06292', '#7986CB', '#A1887F',
  ]
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}
