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

export const setTaskCompleted = mutation({
  args: { taskId: v.id("tasks"), markedComplete: v.boolean() },
  handler: async (ctx, args) => {
    // get the logged in user's id
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Must be logged");
    }
    // find contract that binds task to participant
    const result = await ctx.db.query("contracts")
      .withIndex("by_participant_task", (q) => 
        q.eq("participantId", userId).eq("taskId", args.taskId)
    ).unique();
    if (!result) {
      throw new ConvexError("Must have a valid task id")
    }
    await ctx.db.patch(result._id, { markedComplete: args.markedComplete })
    // we need to find the feedback record for the taskId
    return {
      task: args.taskId,
      markedComplete: args.markedComplete
    }
  }
})

export const createTask = mutation({
  args: {
    groupId: v.id("groups"),
    title: v.string(),
    description: v.optional(v.string()),
    points: v.number(),
    dueDate: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("tasks", {
      groupId: args.groupId,
      title: args.title,
      description: args.description,
      points: args.points,
      dueDate: args.dueDate,
    });
  }
})

