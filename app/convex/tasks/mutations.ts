import { ConvexError, v } from "convex/values";
import { mutation } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { isGroupAdmin } from "../groups";

export const createTask = mutation({
  args: {
    groupId: v.id("groups"),
    title: v.string(),
    description: v.optional(v.string()),
    points: v.number(),
    deadline: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    if (args.points < 10 || args.points > 100) {
      throw new ConvexError("Points must be a value between 10 and 100");
    }
    const adminId = await getAuthUserId(ctx);
    if (await isGroupAdmin(ctx, args.groupId, adminId)) {
      await ctx.db.insert("tasks", {
        groupId: args.groupId,
        title: args.title,
        description: args.description,
        points: args.points,
        deadline: args.deadline,
      });
    }
  },
});

export const setTaskCompleted = mutation({
  args: { taskId: v.id("tasks"), markedComplete: v.boolean() },
  handler: async (ctx, args) => {
    // get the logged in user's id
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Must be logged");
    }
    // find contract that binds task to participant
    const result = await ctx.db
      .query("contracts")
      .withIndex("by_member_task", (q) =>
        q.eq("memberId", userId).eq("taskId", args.taskId),
      )
      .unique();
    if (!result) {
      throw new ConvexError("Must have a valid task id");
    }
    await ctx.db.patch(result._id, { markedComplete: args.markedComplete });
    // we need to find the feedback record for the taskId
    return {
      task: args.taskId,
      markedComplete: args.markedComplete,
    };
  },
});

export const setTaskPoints = mutation({
  args: {
    taskId: v.id("tasks"),
    groupId: v.id("groups"),
    points: v.number()
  },
  handler: async (ctx, args) => {
    if (args.points < 10 || args.points > 100) {
      throw new ConvexError("Points must be a value between 10 and 100");
    }
    const adminId = await getAuthUserId(ctx);
    if (await isGroupAdmin(ctx, args.groupId, adminId)) {
      await ctx.db.patch(args.taskId, {
        points: args.points
      });
    } else {
      throw new ConvexError("Must be admin to update points");
    }
  }
});

export const setTaskDeadline = mutation({
  args: {
    taskId: v.id("tasks"),
    groupId: v.id("groups"),
    deadline: v.number()
  },
  handler: async (ctx, args) => {
    const adminId = await getAuthUserId(ctx);
    if (await isGroupAdmin(ctx, args.groupId, adminId)) {
      await ctx.db.patch(args.taskId, {
        deadline: args.deadline
      });
    } else {
      throw new ConvexError("Must be admin to update deadline")
    }
  }
});

export const deleteTask = mutation({
  args: {
    taskId: v.id("tasks"),
    groupId: v.id("groups")
  },
  handler: async (ctx, args) => {
    const adminId = await getAuthUserId(ctx);
    if (await isGroupAdmin(ctx, args.groupId, adminId)) {
      await ctx.db.delete(args.taskId);
    } else {
      throw new ConvexError("Must be admin to delete task");
    }
  }
});