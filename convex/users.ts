import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { requireAdmin, requireIdentity, getCurrentUser } from "./lib/auth";

const featureId = v.union(
  v.literal("bulkInvoiceGenerator"),
  v.literal("dataCleaning"),
  v.literal("manualDataCleaning"),
  v.literal("metadataRemover"),
  v.literal("pdfCompressor"),
);

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
  featureAccess: v.optional(v.array(featureId)),
  accessStartsAt: v.optional(v.number()),
  accessEndsAt: v.optional(v.number()),
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
      featureAccess: isAdmin ? [
        "bulkInvoiceGenerator",
        "dataCleaning",
        "manualDataCleaning",
        "metadataRemover",
        "pdfCompressor",
      ] : [],
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
    featureAccess: v.array(featureId),
    accessStartsAt: v.union(v.number(), v.null()),
    accessEndsAt: v.union(v.number(), v.null()),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx);
    const target = await ctx.db.get(args.userId);
    if (!target) throw new Error("User not found.");
    if (target._id === admin._id && (args.role !== "admin" || args.status !== "active")) {
      throw new Error("You cannot remove or suspend your own administrator access.");
    }
    const now = Date.now();
    if (target._id === admin._id && ((args.accessStartsAt && args.accessStartsAt > now) || (args.accessEndsAt && args.accessEndsAt < now))) {
      throw new Error("You cannot schedule or expire your own current administrator access.");
    }
    if (args.accessStartsAt && args.accessEndsAt && args.accessEndsAt < args.accessStartsAt) {
      throw new Error("The access end date cannot be before the start date.");
    }
    await ctx.db.patch(args.userId, {
      role: args.role,
      status: args.status,
      templateAccess: args.templateAccess,
      allowedTemplateIds: [...new Set(args.allowedTemplateIds)],
      featureAccess: [...new Set(args.featureAccess)],
      accessStartsAt: args.accessStartsAt ?? undefined,
      accessEndsAt: args.accessEndsAt ?? undefined,
      updatedAt: now,
    });
    if (args.accessEndsAt) {
      await ctx.scheduler.runAt(args.accessEndsAt + 1, internal.users.expireAccess, {
        userId: args.userId,
        expectedAccessEndsAt: args.accessEndsAt,
      });
    }
    await ctx.db.insert("auditLogs", {
      actorUserId: admin._id,
      targetUserId: args.userId,
      action: "user_access_updated",
      details: {
        role: args.role,
        status: args.status,
        templateAccess: args.templateAccess,
        allowedTemplateIds: args.allowedTemplateIds,
        featureAccess: args.featureAccess,
        accessStartsAt: args.accessStartsAt,
        accessEndsAt: args.accessEndsAt,
      },
      createdAt: now,
    });
    return true;
  },
});

export const expireAccess = internalMutation({
  args: {
    userId: v.id("users"),
    expectedAccessEndsAt: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user || user.accessEndsAt !== args.expectedAccessEndsAt || user.status !== "active") {
      return null;
    }
    await ctx.db.patch(args.userId, {
      status: "pending",
      updatedAt: args.expectedAccessEndsAt,
    });
    await ctx.db.insert("auditLogs", {
      actorUserId: user._id,
      targetUserId: user._id,
      action: "user_access_expired",
      details: { accessEndsAt: args.expectedAccessEndsAt },
      createdAt: args.expectedAccessEndsAt,
    });
    return null;
  },
});
