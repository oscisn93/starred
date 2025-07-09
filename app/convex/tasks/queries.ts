import { ConvexError, v } from "convex/values";
import {
  query
} from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getParticipantTask = query({
  args: {
    taskId: v.id("tasks")
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("No user session found.");
    }

    const contract = await ctx.db
      .query("contracts")
      .withIndex("by_participant_task", q =>
        q.eq("participantId", userId)
          .eq("taskId", args.taskId)
      ).unique();

    if (!contract) {
      throw new ConvexError("Task not assigned to user");
    }

    const task = await ctx.db.get(args.taskId);

    if (!task) {
      throw new ConvexError("Task not found");
    }

    return {
      task: {
        id: task._id,
        title: task.title,
        description: task.description,
        points: task.points,
        contract: contract ? {
          id: contract._id,
          markedComplete: contract.markedComplete,
          verified: contract.verified,
          rating: contract.rating,
          feedback: contract.feedback
        } : contract,
        dueDate: task.dueDate
      }
    };
  }
});

export const getAdminTask = query({
  args: {
    taskId: v.id("tasks")
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("No user session found");
    }

    const group = await ctx.db
      .query("groups")
      .withIndex("by_admin", q => q.eq("adminId", userId))
      .unique();
    if (!group) {
      throw new ConvexError("User must be an admin");
    }

    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throw new ConvexError("Task not found");
    }
    if (task.groupId !== group._id) {
      throw new ConvexError("Must be group admin for groupId")
    }

    const contracts = await ctx.db
      .query("contracts")
      .withIndex("by_task", q => q.eq("taskId", args.taskId))
      .collect();

    return {
      task,
      contracts
    }
  }
})

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
      .query("contracts")
      .withIndex("by_participant_task", (q) =>
        q.eq("participantId", userId)
      )
      .paginate({
        numItems: args.count,
        cursor: args.cursor || null
      });
    const taskList = result.page.map(async contract => {
      const task = await ctx.db.get(contract.taskId);
      return task!!;
    });
    return {
      tasks: taskList,
      cursor: result.continueCursor
    };
  },
});

export const listGroupTasks = query({
  args: {
    count: v.number(),
    cursor: v.optional(v.string()),
    groupId: v.id("groups")
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    // unauthenticated users get error message
    if (!userId) {
      throw new ConvexError("Must be logged");
    }
    // we must check if the user is the admin of the group
    const group = await ctx.db.get(args.groupId);
    // group is potentially null
    if (!group) {
      throw new ConvexError("Must have a valid groupId")
    }
    // User is unauthorized
    if (group.adminId !== userId) {
      throw new ConvexError("Unauthorized. Must be admin");
    }
    // finally return results
    const result = await ctx.db
      .query("tasks")
      .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
      .paginate({
        numItems: args.count,
        cursor: args.cursor || null
      });
    return {
      tasks: result.page,
      cursor: result.continueCursor
    }
  }
});