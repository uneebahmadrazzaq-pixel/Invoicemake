import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin, requireIdentity, getCurrentUser } from "./lib/auth";

const userRecord = v.object({
  _id: v.id("users"),
  _creationTime: v.number(),
  subject: v.string(),
  email: v.string(),
  name: v.string(),
  firstName: v.optional(v.string()),
  lastName: v.optional(v.string()),
  phoneNumber: v.optional(v.string()),
  imageUrl: v.optional(v.string()),
  role: v.union(v.literal("admin"), v.literal("user")),
  status: v.union(v.literal("pending"), v.literal("active"), v.literal("suspended")),
  templateAccess: v.union(v.literal("all"), v.literal("custom")),
  allowedTemplateIds: v.array(v.string()),
  createdAt: v.number(),
  updatedAt: v.number(),
});

export const ensureCurrentUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  returns: v.id("users"),
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const existing = await ctx.db
      .query("users")
      .withIndex("by_subject", (q) => q.eq("subject", identity.subject))
      .unique();
    const now = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, {
        email: args.email.toLowerCase(),
        name: args.name,
        ...(args.firstName ? { firstName: args.firstName } : {}),
        ...(args.lastName ? { lastName: args.lastName } : {}),
        ...(args.phoneNumber ? { phoneNumber: args.phoneNumber } : {}),
        imageUrl: args.imageUrl,
        updatedAt: now,
      });
      return existing._id;
    }

    const firstUser = (await ctx.db.query("users").take(1)).length === 0;
    const adminEmails = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);
    const isConfiguredAdmin = adminEmails.includes(args.email.toLowerCase());
    const isAdmin = firstUser || isConfiguredAdmin;
    const userId = await ctx.db.insert("users", {
      subject: identity.subject,
      email: args.email.toLowerCase(),
      name: args.name,
      firstName: args.firstName,
      lastName: args.lastName,
      phoneNumber: args.phoneNumber,
      imageUrl: args.imageUrl,
      role: isAdmin ? "admin" : "user",
      status: isAdmin ? "active" : "pending",
      templateAccess: isAdmin ? "all" : "custom",
      allowedTemplateIds: [],
      createdAt: now,
      updatedAt: now,
    });
    await ctx.db.insert("auditLogs", {
      actorUserId: userId,
      targetUserId: userId,
      action: isAdmin ? "bootstrap_admin_created" : "user_registered",
      createdAt: now,
    });
    return userId;
  },
});

export const me = query({
  args: {},
  returns: v.union(userRecord, v.null()),
  handler: async (ctx) => {
    const identity = await requireIdentity(ctx);
    return ctx.db
      .query("users")
      .withIndex("by_subject", (q) => q.eq("subject", identity.subject))
      .unique();
  },
});

export const listForAdmin = query({
  args: {},
  returns: v.array(userRecord),
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return ctx.db.query("users").take(200);
  },
});

export const updateAccess = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("user")),
    status: v.union(v.literal("pending"), v.literal("active"), v.literal("suspended")),
    templateAccess: v.union(v.literal("all"), v.literal("custom")),
    allowedTemplateIds: v.array(v.string()),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx);
    const target = await ctx.db.get(args.userId);
    if (!target) throw new Error("User not found.");
    if (target._id === admin._id && (args.role !== "admin" || args.status !== "active")) {
      throw new Error("You cannot remove or suspend your own administrator access.");
    }
    await ctx.db.patch(args.userId, {
      role: args.role,
      status: args.status,
      templateAccess: args.templateAccess,
      allowedTemplateIds: [...new Set(args.allowedTemplateIds)],
      updatedAt: Date.now(),
    });
    await ctx.db.insert("auditLogs", {
      actorUserId: admin._id,
      targetUserId: args.userId,
      action: "user_access_updated",
      details: {
        role: args.role,
        status: args.status,
        templateAccess: args.templateAccess,
        allowedTemplateIds: args.allowedTemplateIds,
      },
      createdAt: Date.now(),
    });
    return true;
  },
});
