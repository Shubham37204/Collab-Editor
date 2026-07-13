import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const now = () => Date.now();

function canEdit(doc, userId, email) {
  if (!doc || !userId) return false;
  if (doc.ownerId === userId) return true;
  return doc.collaborators?.some((c) => {
    const emailMatches = email && c.email?.toLowerCase() === email.toLowerCase();
    return c.role === "editor" && (c.userId === userId || emailMatches);
  });
}

async function logActivity(ctx, { docId, type, message, actorId, actorName }) {
  await ctx.db.insert("activities", {
    docId,
    type,
    message,
    actorId,
    actorName,
    createdAt: now(),
  });
}

export const getMyDocs = query({
  args: { ownerId: v.string(), email: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const allDocs = await ctx.db.query("documents").collect();
    return allDocs
      .filter((doc) => 
        doc.ownerId === args.ownerId || 
        (doc.collaborators && doc.collaborators.some((c) => 
          c.userId === args.ownerId || (args.email && c.email?.toLowerCase() === args.email.toLowerCase())
        ))
      )
      .sort((a, b) => b._creationTime - a._creationTime);
  },
});


export const deleteDoc = mutation({
  args: { id: v.id("documents"), userId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const doc = await ctx.db.get(args.id);
    if (args.userId && doc?.ownerId !== args.userId) {
      throw new Error("Only the owner can delete this document");
    }
    await ctx.db.delete(args.id);
  },
});

export const updateTitle = mutation({
  args: {
    id: v.id("documents"),
    title: v.string(),
    userId: v.optional(v.string()),
    userEmail: v.optional(v.string()),
    userName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const doc = await ctx.db.get(args.id);
    if (!doc) throw new Error("Document not found");
    if (args.userId && !canEdit(doc, args.userId, args.userEmail)) {
      throw new Error("You do not have permission to rename this document");
    }
    await ctx.db.patch(args.id, {
      title: args.title,
      updatedAt: now(),
      lastEditedBy: args.userId,
      lastEditedByName: args.userName,
    });
  },
});

export const getDocById = query({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const updateContent = mutation({
  args: {
    id: v.id("documents"),
    content: v.string(),
    userId: v.optional(v.string()),
    userEmail: v.optional(v.string()),
    userName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const doc = await ctx.db.get(args.id);
    if (!doc) throw new Error("Document not found");
    if (args.userId && !canEdit(doc, args.userId, args.userEmail)) {
      throw new Error("You do not have permission to edit this document");
    }
    const sizeInBytes = new TextEncoder().encode(args.content).length
    if (sizeInBytes > 900_000) {
      throw new Error(`Content too large: ${Math.round(sizeInBytes / 1024)}KB. Maximum is 900KB.`)
    }
    await ctx.db.patch(args.id, {
      content: args.content,
      updatedAt: now(),
      lastEditedBy: args.userId,
      lastEditedByName: args.userName,
    })
  },
})

export const toggleStar = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const doc = await ctx.db.get(args.id);
    if (!doc) throw new Error("Document not found");

    await ctx.db.patch(args.id, {
      starred: !doc.starred,
    });
  },
});

export const saveVersion = mutation({
  args: {
    docId: v.string(),
    content: v.string(),
    title: v.string(),
    savedBy: v.string(),
    savedByName: v.string(),
    label: v.optional(v.string()),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const wordCount = args.content.trim().split(/\s+/).filter(Boolean).length;
    await ctx.db.insert("versions", { ...args, wordCount });
    await logActivity(ctx, {
      docId: args.docId,
      type: "version_saved",
      message: `${args.savedByName} saved a version${args.label ? `: ${args.label}` : ""}`,
      actorId: args.savedBy,
      actorName: args.savedByName,
    });
  },
});

export const getVersions = query({
  args: { docId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("versions")
      .withIndex("by_doc", (q) => q.eq("docId", args.docId))
      .order("desc")
      .take(20);
  },
});

export const addCollaborator = mutation({
  args: {
    docId: v.id("documents"),
    userId: v.string(),
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("viewer"), v.literal("editor")),
    actorId: v.optional(v.string()),
    actorName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const doc = await ctx.db.get(args.docId);
    if (!doc) throw new Error("Document not found");
    if (args.actorId && doc.ownerId !== args.actorId) {
      throw new Error("Only the owner can share this document");
    }
    const already = doc.collaborators.find((c) =>
      c.userId === args.userId || c.email?.toLowerCase() === args.email.toLowerCase()
    );
    if (already) return;
    await ctx.db.patch(args.docId, {
      collaborators: [
        ...doc.collaborators,
        {
          userId: args.userId,
          email: args.email,
          name: args.name,
          role: args.role,
        },
      ],
      updatedAt: now(),
    });
    await logActivity(ctx, {
      docId: args.docId,
      type: "shared",
      message: `${args.actorName || "Someone"} invited ${args.email} as ${args.role}`,
      actorId: args.actorId || "unknown",
      actorName: args.actorName || "Unknown",
    });
  },
});

export const updateCollaboratorRole = mutation({
  args: {
    docId: v.id("documents"),
    email: v.string(),
    role: v.union(v.literal("viewer"), v.literal("editor")),
    actorId: v.string(),
    actorName: v.string(),
  },
  handler: async (ctx, args) => {
    const doc = await ctx.db.get(args.docId);
    if (!doc) throw new Error("Document not found");
    if (doc.ownerId !== args.actorId) throw new Error("Only the owner can change roles");
    await ctx.db.patch(args.docId, {
      collaborators: doc.collaborators.map((c) =>
        c.email?.toLowerCase() === args.email.toLowerCase() ? { ...c, role: args.role } : c
      ),
      updatedAt: now(),
    });
    await logActivity(ctx, {
      docId: args.docId,
      type: "role_changed",
      message: `${args.actorName} changed ${args.email} to ${args.role}`,
      actorId: args.actorId,
      actorName: args.actorName,
    });
  },
});

export const removeCollaborator = mutation({
  args: {
    docId: v.id("documents"),
    email: v.string(),
    actorId: v.string(),
    actorName: v.string(),
  },
  handler: async (ctx, args) => {
    const doc = await ctx.db.get(args.docId);
    if (!doc) throw new Error("Document not found");
    if (doc.ownerId !== args.actorId) throw new Error("Only the owner can remove collaborators");
    await ctx.db.patch(args.docId, {
      collaborators: doc.collaborators.filter((c) => c.email?.toLowerCase() !== args.email.toLowerCase()),
      updatedAt: now(),
    });
    await logActivity(ctx, {
      docId: args.docId,
      type: "collaborator_removed",
      message: `${args.actorName} removed ${args.email}`,
      actorId: args.actorId,
      actorName: args.actorName,
    });
  },
});

export const togglePublicAccess = mutation({
  args: {
    docId: v.id("documents"),
    isPublic: v.boolean(),
    actorId: v.string(),
    actorName: v.string(),
  },
  handler: async (ctx, args) => {
    const doc = await ctx.db.get(args.docId);
    if (!doc) throw new Error("Document not found");
    if (doc.ownerId !== args.actorId) throw new Error("Only the owner can change public access");
    await ctx.db.patch(args.docId, { isPublic: args.isPublic, updatedAt: now() });
    await logActivity(ctx, {
      docId: args.docId,
      type: "access_changed",
      message: `${args.actorName} made the document ${args.isPublic ? "public" : "private"}`,
      actorId: args.actorId,
      actorName: args.actorName,
    });
  },
});

export const createDoc = mutation({
  args: {
    title: v.string(),
    ownerId: v.string(),
    ownerName: v.string(),
    content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const docId = await ctx.db.insert("documents", {
      title: args.title,
      content: args.content ?? "",
      ownerId: args.ownerId,
      ownerName: args.ownerName,
      collaborators: [],
      isPublic: false,
      starred: false,
      updatedAt: now(),
      lastEditedBy: args.ownerId,
      lastEditedByName: args.ownerName,
    });
    await logActivity(ctx, {
      docId,
      type: "created",
      message: `${args.ownerName} created the document`,
      actorId: args.ownerId,
      actorName: args.ownerName,
    });
    return docId;
  },
});

export const addComment = mutation({
  args: {
    docId: v.string(),
    body: v.string(),
    selectedText: v.optional(v.string()),
    authorId: v.string(),
    authorName: v.string(),
    mentions: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.body.trim()) throw new Error("Comment cannot be empty");
    const doc = await ctx.db.get(args.docId);
    await ctx.db.insert("comments", {
      ...args,
      body: args.body.trim(),
      resolved: false,
      createdAt: now(),
    });
    await logActivity(ctx, {
      docId: args.docId,
      type: "comment_added",
      message: `${args.authorName} added a comment`,
      actorId: args.authorId,
      actorName: args.authorName,
    });
    await Promise.all(args.mentions.map((email) =>
      ctx.db.insert("notifications", {
        userId: email,
        message: `${args.authorName} mentioned you in a comment`,
        docId: args.docId,
        docTitle: doc?.title || "Document",
        read: false,
        fromName: args.authorName,
      })
    ));
  },
});

export const resolveComment = mutation({
  args: {
    id: v.id("comments"),
    docId: v.string(),
    resolved: v.boolean(),
    actorId: v.string(),
    actorName: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { resolved: args.resolved });
    await logActivity(ctx, {
      docId: args.docId,
      type: args.resolved ? "comment_resolved" : "comment_reopened",
      message: `${args.actorName} ${args.resolved ? "resolved" : "reopened"} a comment`,
      actorId: args.actorId,
      actorName: args.actorName,
    });
  },
});

export const getComments = query({
  args: { docId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("comments")
      .withIndex("by_doc", (q) => q.eq("docId", args.docId))
      .order("desc")
      .take(50);
  },
});

export const getActivity = query({
  args: { docId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("activities")
      .withIndex("by_doc", (q) => q.eq("docId", args.docId))
      .order("desc")
      .take(30);
  },
});
