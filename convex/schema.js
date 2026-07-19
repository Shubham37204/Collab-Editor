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
    updatedAt: v.optional(v.number()),
    lastEditedBy: v.optional(v.string()),
    lastEditedByName: v.optional(v.string()),
  })
    .index('by_owner', ['ownerId'])
    .index('by_public', ['isPublic']),

  versions: defineTable({
    docId: v.string(),
    content: v.string(),
    title: v.string(),
    savedBy: v.string(),
    savedByName: v.string(),
    label: v.optional(v.string()),
    note: v.optional(v.string()),
    wordCount: v.optional(v.number()),
  })
    .index('by_doc', ['docId']),

  comments: defineTable({
    docId: v.string(),
    body: v.string(),
    selectedText: v.optional(v.string()),
    authorId: v.string(),
    authorName: v.string(),
    resolved: v.boolean(),
    mentions: v.array(v.string()),
    createdAt: v.number(),
  })
    .index('by_doc', ['docId']),

  activities: defineTable({
    docId: v.string(),
    type: v.string(),
    message: v.string(),
    actorId: v.string(),
    actorName: v.string(),
    createdAt: v.number(),
  })
    .index('by_doc', ['docId']),
})
