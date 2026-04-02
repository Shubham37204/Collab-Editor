'use client'
import { useParams, useRouter } from 'next/navigation'
import { useQuery } from 'convex/react'
import { useUser } from '@clerk/nextjs'
import { api } from '../../../convex/_generated/api'
import { RoomProvider } from '../../../liveblocks.config'
import { ClientSideSuspense } from '@liveblocks/react'
import dynamic from 'next/dynamic'

const Editor = dynamic(() => import('../../../components/Editor'), { ssr: false })

export default function EditorPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user, isLoaded } = useUser()

  const doc = useQuery(api.documents.getDocById, { id })

  if (!isLoaded || doc === undefined) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: '13px', fontFamily: 'sans-serif' }}>Loading document...</span>
    </div>
  )

  if (doc === null) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ marginBottom: '16px' }}>Document not found</p>
        <button onClick={() => router.push('/dashboard')}>← Back to dashboard</button>
      </div>
    </div>
  )

  return (
    // RoomProvider creates the collaborative session
    // id prop = unique room name — using doc ID means each doc has its own room
    // initialPresence = what we broadcast about ourselves before first update
    <RoomProvider
      id={`doc-${id}`}
      initialPresence={{
        name: user?.firstName || 'Anonymous',
        cursor: null,   // will update as user moves cursor in editor
      }}
    >
      {/* ClientSideSuspense handles the loading state while Liveblocks connects */}
      <ClientSideSuspense fallback={
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Connecting...
        </div>
      }>
        {() => (
          <Editor
            docId={id}
            initialContent={doc.content}
            title={doc.title}
            currentUserId={user?.id}
          />
        )}
      </ClientSideSuspense>
    </RoomProvider>
  )
}
