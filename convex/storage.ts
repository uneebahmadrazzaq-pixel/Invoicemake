import { mutationGeneric as mutation, queryGeneric as query } from "convex/server";
import { v } from "convex/values";
import { hasTemplateAccess, requireActiveUser } from "./lib/auth";

const ALLOWED_STORAGE_KEYS = new Set([
  "mc011-invoice-editor-v1",
  "mc011-data-splitter-projects-v1",
  "mc011-supplier-profile-overrides-v1",
]);

function assertStorageKey(storageKey: string) {
  if (!ALLOWED_STORAGE_KEYS.has(storageKey)) throw new Error("Unsupported data store.");
}

export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireActiveUser(ctx);
    const rows = await ctx.db
      .query("userData")
      .withIndex("by_user_storage_key", (q) => q.eq("userId", user._id))
      .collect();
    return Promise.all(rows.map(async (row) => ({
      storageKey: row.storageKey,
      url: await ctx.storage.getUrl(row.storageId),
      byteLength: row.byteLength,
      updatedAt: row.updatedAt,
    })));
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireActiveUser(ctx);
    return ctx.storage.generateUploadUrl();
  },
});

export const commitMine = mutation({
  args: {
    storageKey: v.string(),
    storageId: v.id("_storage"),
    byteLength: v.number(),
    activeTemplateId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await requireActiveUser(ctx);
    assertStorageKey(args.storageKey);
    if (args.activeTemplateId && !hasTemplateAccess(user, args.activeTemplateId)) {
      throw new Error("This invoice template has not been authorized for your account.");
    }
    const rows = await ctx.db
      .query("userData")
      .withIndex("by_user_storage_key", (q) => q.eq("userId", user._id))
      .collect();
    const existing = rows.find((row) => row.storageKey === args.storageKey);
    if (existing) {
      const previousStorageId = existing.storageId;
      await ctx.db.patch(existing._id, { storageId: args.storageId, byteLength: args.byteLength, updatedAt: Date.now() });
      await ctx.storage.delete(previousStorageId);
      return existing._id;
    }
    return ctx.db.insert("userData", {
      userId: user._id,
      storageKey: args.storageKey,
      storageId: args.storageId,
      byteLength: args.byteLength,
      updatedAt: Date.now(),
    });
  },
});
