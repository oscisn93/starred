import { ConvexError, v } from "convex/values";
import {
  mutation,
  query
} from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const listPartcipantTasks = query({
  args: {
    count: v.number(),
    cursor: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("No user session found.");
    }
    const result = await ctx.db
      .query("tasks")
      .withIndex("by_participant", (q) => q.eq("participant", userId))
      .paginate({
        numItems: args.count,
        cursor: args.cursor || null
      });
    return {
      tasks: result.page,
      cursor: result.continueCursor
    };
  },   
});

export const listGroupTasks = query({
  args: {
    count: v.number(),
    cursor: v.optional(v.string()),
    group: v.id("groups")
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Must be logged");
    }
    // we must check if the user is the admin of the group
    const group = await ctx.db.query("groups")
      .withIndex("by_admin", (q) => q.eq("admin", userId))
      .take(1);

    if (group.length === 0) {
      throw new ConvexError("Unauthorized. Must be admin.");
    }

    const result = await ctx.db
      .query("tasks")
      .withIndex("by_group", (q) => q.eq("group", args.group))
      .paginate({
        numItems: args.count,
        cursor: args.cursor || null
      });
    return {
      tasks: result.page,
      cursor: result.continueCursor
    }
  }
})

export const create = mutation({
  args: {
    group: v.id("groups"),
    participant: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
    points: v.number(),
    dueDate: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("tasks", {
      group: args.group,
      participant: args.participant,
      title: args.title,
      description: args.description,
      points: args.points,
      dueDate: args.dueDate || "",
      completed: false
    });
  }
})

