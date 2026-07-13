import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const getMyNotifications = query({
  args: { userId: v.string(), email: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const byUser = await ctx.db
      .query('notifications')
      .withIndex('by_user', q => q.eq('userId', args.userId))
      .order('desc')
      .take(20)
    if (!args.email) return byUser
    const byEmail = await ctx.db
      .query('notifications')
      .withIndex('by_user', q => q.eq('userId', args.email.toLowerCase()))
      .order('desc')
      .take(20)
    return [...byUser, ...byEmail]
      .sort((a, b) => b._creationTime - a._creationTime)
      .slice(0, 20)
  },
})

export const markAllRead = mutation({
  args: { userId: v.string(), email: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const byUser = await ctx.db
      .query('notifications')
      .withIndex('by_user', q => q.eq('userId', args.userId))
      .collect()
    const byEmail = args.email
      ? await ctx.db
        .query('notifications')
        .withIndex('by_user', q => q.eq('userId', args.email.toLowerCase()))
        .collect()
      : []

    await Promise.all(
      [...byUser, ...byEmail].map(n => ctx.db.patch(n._id, { read: true }))
    )
  },
})

export const createNotification = mutation({
  args: {
    userId: v.string(),
    message: v.string(),
    docId: v.string(),
    docTitle: v.string(),
    fromName: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('notifications', {
      ...args,
      read: false,
    })
  },
})
