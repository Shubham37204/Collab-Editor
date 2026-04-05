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
  const { id }   = useParams()
  const router   = useRouter()
  const { user, isLoaded } = useUser()
  const doc      = useQuery(api.documents.getDocById, { id })

  if (!isLoaded || doc === undefined) return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: '#0f0f0f', color: '#5a5550',
      fontFamily: 'sans-serif', fontSize: '13px',
    }}>
      Loading...
    </div>
  )

  if (doc === null) return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#0f0f0f',
    }}>
      <div style={{ textAlign: 'center', color: '#5a5550', fontFamily: 'sans-serif' }}>
        <p style={{ marginBottom: '16px' }}>Document not found</p>
        <button
          onClick={() => router.push('/dashboard')}
          style={{ color: '#c9a96e', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          ← Back to dashboard
        </button>
      </div>
    </div>
  )

  return (
    <RoomProvider
      id={`doc-${id}`}
      initialPresence={{ name: user?.firstName || 'Anonymous', cursor: null }}
    >
      <ClientSideSuspense fallback={null}>
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

