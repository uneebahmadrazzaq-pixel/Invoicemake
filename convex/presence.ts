import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const heartbeat = mutation({
  args: {
    sessionId: v.string(),
    name: v.string(),
    color: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("presence")
      .withIndex("by_session_id", (q) => q.eq("sessionId", args.sessionId))
      .unique();
    const value = {
      name: args.name.trim().slice(0, 40) || "Anonymous",
      color: args.color,
      lastSeen: Date.now(),
    };
    if (existing) {
      await ctx.db.patch(existing._id, value);
    } else {
      await ctx.db.insert("presence", { sessionId: args.sessionId, ...value });
    }
    return null;
  },
});

export const active = query({
  args: { since: v.number() },
  returns: v.array(
    v.object({
      _id: v.id("presence"),
      _creationTime: v.number(),
      sessionId: v.string(),
      name: v.string(),
      color: v.string(),
      lastSeen: v.number(),
    }),
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("presence")
      .withIndex("by_last_seen", (q) => q.gte("lastSeen", args.since))
      .order("desc")
      .take(20);
  },
});
