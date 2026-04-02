import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// GET all docs for the logged-in user
export const getMyDocs = query({
  args: { ownerId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("documents")
      .withIndex("by_owner", (q) => q.eq("ownerId", args.ownerId))
      .order("desc")
      .collect();
  },
});

// DELETE a document
export const deleteDoc = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// UPDATE title
export const updateTitle = mutation({
  args: { id: v.id("documents"), title: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { title: args.title });
  },
});

// Add this to your existing convex/documents.js

export const getDocById = query({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Also add this — saves content on every keystroke (debounced on frontend)
export const updateContent = mutation({
  args: { id: v.id("documents"), content: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { content: args.content });
  },
});

// Add to your existing convex/documents.js

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
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("versions", { ...args });
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
  },
  handler: async (ctx, args) => {
    const doc = await ctx.db.get(args.docId);
    const already = doc.collaborators.find((c) => c.userId === args.userId);
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
    });
  },
});



export const createDoc = mutation({
  args: {
    title: v.string(),
    ownerId: v.string(),
    ownerName: v.string(),
    content: v.optional(v.string()),  // ← add this
  },
  handler: async (ctx, args) => {
    const docId = await ctx.db.insert('documents', {
      title: args.title,
      // Use provided content OR default starter text
      content: args.content ?? ('# ' + args.title + '\n\nStart writing...'),
      ownerId: args.ownerId,
      ownerName: args.ownerName,
      collaborators: [],
      isPublic: false,
      starred: false,
    })
    return docId
  },
})