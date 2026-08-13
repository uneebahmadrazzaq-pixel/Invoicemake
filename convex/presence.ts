import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

async function signedInUser(ctx: { auth: { getUserIdentity: () => Promise<{ name?: string; email?: string; subject: string } | null> } }) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("You must be signed in.");
  return {
    sessionId: identity.subject,
    name: identity.name?.trim() || identity.email?.trim() || "Team member",
  };
}

export const heartbeat = mutation({
  args: { color: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await signedInUser(ctx);
    const existing = await ctx.db
      .query("presence")
      .withIndex("by_session_id", (q) => q.eq("sessionId", user.sessionId))
      .unique();
    const value = {
      name: user.name.slice(0, 40),
      color: args.color,
      lastSeen: Date.now(),
    };
    if (existing) {
      await ctx.db.patch(existing._id, value);
    } else {
      await ctx.db.insert("presence", { sessionId: user.sessionId, ...value });
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
    await signedInUser(ctx);
    return await ctx.db
      .query("presence")
      .withIndex("by_last_seen", (q) => q.gte("lastSeen", args.since))
      .order("desc")
      .take(20);
  },
});
