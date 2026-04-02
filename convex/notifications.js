import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const getMyNotifications = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('notifications')
      .withIndex('by_user', q => q.eq('userId', args.userId))
      .order('desc')
      .take(20)
  },
})

export const markAllRead = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const notifs = await ctx.db
      .query('notifications')
      .withIndex('by_user', q => q.eq('userId', args.userId))
      .collect()

    await Promise.all(
      notifs.map(n => ctx.db.patch(n._id, { read: true }))
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