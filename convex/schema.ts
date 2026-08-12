import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    subject: v.string(),
    email: v.string(),
    name: v.string(),
    imageUrl: v.optional(v.string()),
    role: v.union(v.literal("admin"), v.literal("user")),
    status: v.union(v.literal("pending"), v.literal("active"), v.literal("suspended")),
    templateAccess: v.union(v.literal("all"), v.literal("custom")),
    allowedTemplateIds: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_subject", ["subject"])
    .index("by_email", ["email"]),

  userData: defineTable({
    userId: v.id("users"),
    storageKey: v.string(),
    storageId: v.id("_storage"),
    byteLength: v.number(),
    updatedAt: v.number(),
  }).index("by_user_storage_key", ["userId", "storageKey"]),

  auditLogs: defineTable({
    actorUserId: v.id("users"),
    targetUserId: v.optional(v.id("users")),
    action: v.string(),
    details: v.optional(v.any()),
    createdAt: v.number(),
  }).index("by_created_at", ["createdAt"]),
});
