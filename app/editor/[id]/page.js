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

  /* Loading state */
  if (!isLoaded || doc === undefined) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      <span className="text-sm text-muted font-sans mt-3">Loading document...</span>
    </div>
  )

  /* Not found state */
  if (doc === null) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center animate-fade-in">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-danger/10 border border-danger/20 mb-5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-danger" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <p className="text-muted font-sans mb-4">Document not found</p>
        <button
          onClick={() => router.push('/dashboard')}
          className="text-primary bg-transparent border-none cursor-pointer font-sans text-sm hover:underline"
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
      <ClientSideSuspense fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-background">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-muted font-sans mt-3">Connecting to room...</span>
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
