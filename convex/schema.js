import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    content: v.string(),
    ownerId: v.string(),
    ownerName: v.string(),
    collaborators: v.array(v.object({
      userId: v.string(),
      email: v.string(),
      name: v.string(),
      role: v.union(v.literal('viewer'), v.literal('editor')),
    })),
    isPublic: v.boolean(),
    starred: v.boolean(),
  })
    .index('by_owner', ['ownerId'])
    .index('by_public', ['isPublic']),

  notifications: defineTable({
    userId: v.string(),       // who receives it
    message: v.string(),
    docId: v.string(),
    docTitle: v.string(),
    read: v.boolean(),
    fromName: v.string(),
  })
    .index('by_user', ['userId']),

  versions: defineTable({
    docId: v.string(),
    content: v.string(),
    title: v.string(),
    savedBy: v.string(),
    savedByName: v.string(),
  })
    .index('by_doc', ['docId']),
})