import type { GenericMutationCtx, GenericQueryCtx } from "convex/server";
import type { DataModelFromSchemaDefinition } from "convex/server";
import schema from "../schema";

type DataModel = DataModelFromSchemaDefinition<typeof schema>;
type AnyCtx = GenericQueryCtx<DataModel> | GenericMutationCtx<DataModel>;

export async function requireIdentity(ctx: AnyCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("You must be signed in.");
  return identity;
}

export async function getCurrentUser(ctx: AnyCtx) {
  const identity = await requireIdentity(ctx);
  const user = await ctx.db
    .query("users")
    .withIndex("by_subject", (q) => q.eq("subject", identity.subject))
    .unique();
  if (!user) throw new Error("Your account has not been registered yet.");
  return user;
}

export async function requireActiveUser(ctx: AnyCtx) {
  const user = await getCurrentUser(ctx);
  if (user.status !== "active") {
    throw new Error(user.status === "suspended" ? "This account is suspended." : "This account is waiting for administrator approval.");
  }
  return user;
}

export async function requireAdmin(ctx: AnyCtx) {
  const user = await requireActiveUser(ctx);
  if (user.role !== "admin") throw new Error("Administrator access is required.");
  return user;
}

export function hasTemplateAccess(user: {
  role: "admin" | "user";
  templateAccess: "all" | "custom";
  allowedTemplateIds: string[];
}, templateId: string) {
  return user.role === "admin" || user.templateAccess === "all" || user.allowedTemplateIds.includes(templateId);
}
