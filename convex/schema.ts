import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
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
    featureAccess: v.optional(v.array(v.union(
      v.literal("bulkInvoiceGenerator"),
      v.literal("dataCleaning"),
      v.literal("manualDataCleaning"),
      v.literal("metadataRemover"),
      v.literal("pdfCompressor"),
    ))),
    accessStartsAt: v.optional(v.number()),
    accessEndsAt: v.optional(v.number()),
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

  tasks: defineTable({
    title: v.string(),
    description: v.string(),
    status: v.union(
      v.literal("backlog"),
      v.literal("in_progress"),
      v.literal("review"),
      v.literal("done"),
    ),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent"),
    ),
    assignee: v.string(),
    dueDate: v.optional(v.string()),
    labels: v.array(v.string()),
    createdBy: v.string(),
    updatedBy: v.string(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_updated_at", ["updatedAt"]),

  presence: defineTable({
    sessionId: v.string(),
    name: v.string(),
    color: v.string(),
    lastSeen: v.number(),
  })
    .index("by_session_id", ["sessionId"])
    .index("by_last_seen", ["lastSeen"]),
});
