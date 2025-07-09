import { ConvexError, v } from "convex/values";
import {
    mutation,
} from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

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

