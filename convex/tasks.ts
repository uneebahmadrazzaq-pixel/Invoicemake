import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const statusValidator = v.union(
  v.literal("backlog"),
  v.literal("in_progress"),
  v.literal("review"),
  v.literal("done"),
);

const priorityValidator = v.union(
  v.literal("low"),
  v.literal("medium"),
  v.literal("high"),
  v.literal("urgent"),
);

const taskValidator = v.object({
  _id: v.id("tasks"),
  _creationTime: v.number(),
  title: v.string(),
  description: v.string(),
  status: statusValidator,
  priority: priorityValidator,
  assignee: v.string(),
  dueDate: v.optional(v.string()),
  labels: v.array(v.string()),
  createdBy: v.string(),
  updatedBy: v.string(),
  updatedAt: v.number(),
});

export const list = query({
  args: {},
  returns: v.array(taskValidator),
  handler: async (ctx) => {
    return await ctx.db
      .query("tasks")
      .withIndex("by_updated_at")
      .order("desc")
      .take(200);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    status: statusValidator,
    priority: priorityValidator,
    assignee: v.string(),
    dueDate: v.optional(v.string()),
    labels: v.array(v.string()),
    actor: v.string(),
  },
  returns: v.id("tasks"),
  handler: async (ctx, args) => {
    const title = args.title.trim();
    if (!title) throw new Error("Task title is required");
    const now = Date.now();
    return await ctx.db.insert("tasks", {
      title,
      description: args.description.trim(),
      status: args.status,
      priority: args.priority,
      assignee: args.assignee.trim() || "Unassigned",
      dueDate: args.dueDate || undefined,
      labels: args.labels.map((label) => label.trim()).filter(Boolean).slice(0, 4),
      createdBy: args.actor,
      updatedBy: args.actor,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(statusValidator),
    priority: v.optional(priorityValidator),
    assignee: v.optional(v.string()),
    dueDate: v.optional(v.union(v.string(), v.null())),
    labels: v.optional(v.array(v.string())),
    actor: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id);
    if (!task) throw new Error("Task not found");
    const patch: {
      title?: string;
      description?: string;
      status?: "backlog" | "in_progress" | "review" | "done";
      priority?: "low" | "medium" | "high" | "urgent";
      assignee?: string;
      dueDate?: string | undefined;
      labels?: string[];
      updatedBy: string;
      updatedAt: number;
    } = { updatedBy: args.actor, updatedAt: Date.now() };
    if (args.title !== undefined) {
      const title = args.title.trim();
      if (!title) throw new Error("Task title is required");
      patch.title = title;
    }
    if (args.description !== undefined) patch.description = args.description.trim();
    if (args.status !== undefined) patch.status = args.status;
    if (args.priority !== undefined) patch.priority = args.priority;
    if (args.assignee !== undefined) patch.assignee = args.assignee.trim() || "Unassigned";
    if (args.dueDate !== undefined) patch.dueDate = args.dueDate ?? undefined;
    if (args.labels !== undefined) {
      patch.labels = args.labels.map((label) => label.trim()).filter(Boolean).slice(0, 4);
    }
    await ctx.db.patch(args.id, patch);
    return null;
  },
});

export const remove = mutation({
  args: { id: v.id("tasks") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return null;
  },
});

export const seed = mutation({
  args: { actor: v.string() },
  returns: v.number(),
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("tasks").withIndex("by_updated_at").take(1);
    if (existing.length > 0) return 0;
    const now = Date.now();
    const samples = [
      { title: "Map the onboarding journey", description: "Capture the key moments from invite to first completed task.", status: "backlog" as const, priority: "medium" as const, assignee: "Maya Chen", dueDate: "2026-08-18", labels: ["Research"] },
      { title: "Build command palette", description: "Add keyboard-first navigation for core board actions.", status: "in_progress" as const, priority: "high" as const, assignee: "Noah Kim", dueDate: "2026-08-15", labels: ["Frontend", "Sprint 12"] },
      { title: "Review mobile board gestures", description: "Validate horizontal scrolling and card actions on touch devices.", status: "review" as const, priority: "urgent" as const, assignee: "Sofia Reyes", dueDate: "2026-08-13", labels: ["Mobile"] },
      { title: "Ship notification preferences", description: "Release digest controls and mention alerts.", status: "done" as const, priority: "low" as const, assignee: "Eli Brooks", dueDate: "2026-08-11", labels: ["Release"] },
      { title: "Refine empty states", description: "Make every first-run state useful and action oriented.", status: "in_progress" as const, priority: "medium" as const, assignee: "Maya Chen", dueDate: "2026-08-20", labels: ["Design"] },
    ];
    for (const [index, sample] of samples.entries()) {
      await ctx.db.insert("tasks", {
        ...sample,
        createdBy: args.actor,
        updatedBy: args.actor,
        updatedAt: now - index * 1000,
      });
    }
    return samples.length;
  },
});
