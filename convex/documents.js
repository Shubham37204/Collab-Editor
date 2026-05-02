// Updated shared docs query to support email-based discovery
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";


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

// DELETE a document
export const deleteDoc = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const updateTitle = mutation({
  args: { id: v.id("documents"), title: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { title: args.title });
  },
});

export const getDocById = query({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const updateContent = mutation({
  args: { id: v.id("documents"), content: v.string() },
  handler: async (ctx, args) => {
    const sizeInBytes = new TextEncoder().encode(args.content).length
    if (sizeInBytes > 900_000) {
      throw new Error(`Content too large: ${Math.round(sizeInBytes / 1024)}KB. Maximum is 900KB.`)
    }
    await ctx.db.patch(args.id, { content: args.content })
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
    });
    return docId;
  },
});
