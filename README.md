# CollabDocs — Real-Time Collaborative Document Editor

A production-grade collaborative document editor built with **Next.js**, **Convex**, **Liveblocks**, **Clerk**, and **Groq**. Enables teams to co-edit documents simultaneously with live cursor presence, conflict-free sync, AI-powered writing assistance, and version history — all backed by a reactive serverless architecture.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Next.js)                     │
│  Tiptap Editor ─── Liveblocks Provider ─── Convex Client   │
└────────────┬───────────────────┬──────────────────┬─────────┘
             │                   │                  │
    ┌────────▼──────┐   ┌────────▼──────┐  ┌───────▼────────┐
    │  Liveblocks   │   │  Convex DB    │  │  Clerk Auth    │
    │  (WebSocket / │   │  (Serverless  │  │  (JWT / OAuth) │
    │   Y.js CRDT)  │   │   Queries +   │  └────────────────┘
    └───────────────┘   │   Mutations)  │
                        └───────┬───────┘
                                │
                       ┌────────▼──────┐
                       │  Groq API     │
                       │  (LLaMA 3     │
                       │   Streaming)  │
                       └───────────────┘
```

**Sync model:** Liveblocks manages real-time document state via Y.js CRDT over WebSocket. Convex handles persistent storage — document metadata, versions, collaborator roles, and notifications — via reactive subscriptions. These two layers are intentionally decoupled: presence and conflict resolution live in Liveblocks; durability and access control live in Convex.

---

## Features

### Real-Time Collaboration
- Simultaneous multi-user editing with conflict-free merge via **Y.js CRDT**
- Live cursor presence with per-user color identity
- WebSocket-based sync with automatic reconnection

### AI Writing Assistant (Groq LLaMA 3)
- Inline AI panel triggered via slash command or selection
- **6 context-aware actions:** Summarize, Continue, Rewrite, Simplify, Fix Grammar, Translate
- Streaming response rendered token-by-token in the editor

### Document Management
- Create, rename, delete, and organize documents
- Public / private access control per document
- Star / favorite documents for quick access
- Full-text document listing with search

### Collaboration & Roles
- Invite collaborators by email
- Role-based access: `viewer` / `editor`
- Notification system for collaboration events (invite, edit, restore)

### Rich Editor Experience
- Slash commands (`/`) for blocks: headings, lists, code, dividers, images
- Table of Contents with scroll-spy
- PDF and Markdown export
- Auto-save on every change via Convex mutations

### Version History
- Snapshot-based version saving
- Version restore with diff preview
- Timestamped history log per document

---

## Tech Stack

| Layer | Technology | Role |
|---|---|---|
| Frontend | Next.js 14 (App Router) | Routing, SSR, UI |
| Editor | Tiptap | Rich text + extension system |
| Real-time Sync | Liveblocks + Y.js | CRDT conflict resolution, presence |
| Database | Convex | Serverless DB + reactive queries |
| Auth | Clerk | JWT auth, OAuth, session management |
| AI | Groq (LLaMA 3) | Streaming AI writing assistant |
| Styling | Tailwind CSS | Utility-first styling |
| Deployment | Vercel | Frontend hosting |

---

## Project Structure

```
collab-editor/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Sign-in / sign-up routes (Clerk)
│   ├── (root)/                 # Main app layout
│   │   ├── documents/          # Document listing + management
│   │   └── documents/[id]/     # Document editor page
│   └── api/                    # API routes (Groq streaming endpoint)
│       └── ai/route.ts
│
├── components/
│   ├── editor/                 # Tiptap editor + extensions
│   │   ├── Editor.tsx          # Core editor component
│   │   ├── AIPanel.tsx         # Groq inline assistant
│   │   ├── Toolbar.tsx         # Formatting toolbar
│   │   └── TOC.tsx             # Table of contents + scroll-spy
│   ├── collaboration/
│   │   ├── ActiveUsers.tsx     # Live cursor presence
│   │   └── ShareModal.tsx      # Collaborator invite + role assign
│   ├── documents/
│   │   ├── DocumentList.tsx    # Document grid / list
│   │   ├── VersionHistory.tsx  # Version log + restore UI
│   │   └── ExportMenu.tsx      # PDF / MD export
│   └── ui/                     # Shared UI primitives
│
├── convex/
│   ├── schema.ts               # DB schema (documents, collaborators, versions, notifications)
│   ├── documents.ts            # CRUD queries + mutations
│   ├── collaborators.ts        # Role management
│   ├── versions.ts             # Version save + restore
│   └── notifications.ts        # Notification fan-out logic
│
├── lib/
│   ├── liveblocks.ts           # Liveblocks client config
│   ├── groq.ts                 # Groq client + prompt templates
│   └── export.ts               # PDF / Markdown export utilities
│
└── public/                     # Static assets
```

---

## Local Setup

### Prerequisites
- Node.js 18+
- Convex account
- Clerk account
- Liveblocks account
- Groq API key

### 1. Clone

```bash
git clone https://github.com/Shubham37204/collab-editor.git
cd collab-editor
npm install
```

### 2. Environment Variables

Create `.env.local`:

```env
# Convex
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Liveblocks
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=
LIVEBLOCKS_SECRET_KEY=

# Groq
GROQ_API_KEY=
```

### 3. Start Convex backend

```bash
npx convex dev
```

### 4. Start frontend

```bash
npm run dev
```

App runs at `http://localhost:3000`

---

## AI Assistant — How It Works

The AI panel uses **Groq's LLaMA 3** via a Next.js streaming API route (`/api/ai`). When a user triggers an action:

1. Selected text + document context are sent to `/api/ai`
2. Server streams tokens via `ReadableStream` back to the client
3. Tokens are rendered progressively into the editor

Each action uses a distinct system prompt:

| Action | Behavior |
|---|---|
| Summarize | Condense selected text into key points |
| Continue | Generate coherent continuation of selection |
| Rewrite | Rephrase with same meaning, improved clarity |
| Simplify | Reduce complexity for a general audience |
| Fix Grammar | Correct grammar and punctuation |
| Translate | Translate to a specified language |

---

## Collaboration Model — How It Works

Liveblocks creates a **room** per document (`room-{documentId}`). Each connected client:

- Joins via a server-authenticated Liveblocks token (validated against Clerk session)
- Shares Y.js document state via Liveblocks' CRDT layer
- Broadcasts cursor position + selection as **awareness state**

Convex stores the authoritative document snapshot independently. On session end or explicit save, the editor content is persisted to Convex via a `updateDocument` mutation.

This dual-layer design ensures:
- **Real-time edits** don't block on DB writes
- **Persistence** is decoupled from sync latency
- **Access control** is enforced at the Convex layer (role check before mutation)

---

