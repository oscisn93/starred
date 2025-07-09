import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { isGroupAdmin } from "./groups";

export const createContract = mutation({
    args: {
        taskId: v.id("tasks"),
        groupId: v.id("groups"),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (userId === null) {
            throw new ConvexError("Must be logged in");
        }
        const member = await ctx.db
            .query("members")
            .withIndex("by_group_user", (q) =>
                q.eq("groupId", args.groupId).eq("userId", userId),
            )
            .unique();
        if (member === null) {
            throw new ConvexError("Must be a member of the group");
        }
        const contractId = await ctx.db.insert("contracts", {
            taskId: args.taskId,
            groupId: args.groupId,
            memberId: userId,
            markedComplete: false,
            verified: false,
            rating: 0,
        });
        return {
            contractId,
        };
    },
});

export const getContract = query({
    args: {
        contractId: v.id("contracts"),
        groupId: v.id("groups"),
    },
    handler: async (ctx, args) => {
        const adminId = await getAuthUserId(ctx);
        if (await isGroupAdmin(ctx, args.groupId, adminId)) {
            throw new ConvexError("Must be admin of group");
        }
        const contract = await ctx.db.get(args.contractId);
        if (contract === null) {
            throw new ConvexError("Contract does not exist");
        }
        return {
            contract,
        };
    },
});

export const getMemberContract = query({
    args: {
        contractId: v.id("contracts"),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (userId === null) {
            throw new ConvexError("Must be logged in");
        }
        const contract = await ctx.db.get(args.contractId);
        if (contract === null) {
            throw new ConvexError("Contract does not exist");
        }
        if (contract.memberId !== userId) {
            throw new ConvexError("Must be member of group");
        }
        return {
            contract,
        };
    },
});

export const getMemberContracts = query({
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (userId === null) {
            throw new ConvexError("Must be logged in");
        }
        const contracts = await ctx.db
            .query("contracts")
            .withIndex("by_member", (q) => q.eq("memberId", userId))
            .collect();
        if (contracts === null) {
            throw new ConvexError("Contract does not exist");
        }
        return {
            contracts,
        };
    },
});

export const getTaskContract = query({
    args: {
        taskId: v.id("tasks"),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (userId === null) {
            throw new ConvexError("Must be logged in");
        }
        const contract = await ctx.db
            .query("contracts")
            .withIndex("by_member_task", (q) =>
                q.eq("memberId", userId).eq("taskId", args.taskId),
            )
            .unique();
        if (contract === null) {
            throw new ConvexError("Contract does not exist");
        }
        return {
            contract,
        };
    },
});

export const getTaskContracts = query({
    args: {
        taskId: v.id("tasks"),
    },
    handler: async (ctx, args) => {
        const contracts = await ctx.db
            .query("contracts")
            .withIndex("by_task", (q) => q.eq("taskId", args.taskId))
            .collect();
        return {
            contracts,
        };
    },
});

export const setContractVerified = mutation({
    args: {
        contractId: v.id("contracts"),
        verified: v.boolean(),
        rating: v.optional(v.number()),
        feedback: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        if (args.rating && (args.rating > 5 || args.rating < 0)) {
            throw new ConvexError("rating must be between 0 and 5 inclusive");
        }
        const contract = await ctx.db.get(args.contractId);
        if (contract === null) {
            throw new ConvexError("contract does not exist");
        }
        const adminId = await getAuthUserId(ctx);
        if (await isGroupAdmin(ctx, contract.groupId, adminId)) {
            await ctx.db.patch(args.contractId, {
                verified: args.verified,
                rating: args.rating ? args.rating : contract.rating,
                feedback: args.feedback ? args.feedback : contract.feedback,
            });
            // once a contract is verified
            // the task points are awarded to the member
            const member = await ctx.db
                .query("members")
                .withIndex("by_group_user", q =>
                    q.eq("groupId", contract.groupId).eq("userId", contract.memberId)
                ).unique();
            if (member === null) {
                throw new ConvexError("User is not a member in the group");
            }
            const task = await ctx.db.get(contract.taskId);
            if (task === null) {
                throw new ConvexError("Task no longer exists");
            }
            await ctx.db.patch(member._id, {
                points: member.points + task.points
            });
        }
    },
});

export const setContractFeedback = mutation({
    args: {
        contractId: v.id("contracts"),
        feedback: v.string(),
    },
    handler: async (ctx, args) => {
        const contract = await ctx.db.get(args.contractId);
        if (contract === null) {
            throw new ConvexError("Contract does not exist");
        }
        const adminId = await getAuthUserId(ctx);
        if (await isGroupAdmin(ctx, contract.groupId, adminId)) {
            await ctx.db.patch(args.contractId, {
                feedback: args.feedback,
            });
        }
    },
});

export const setContractRating = mutation({
    args: {
        contractId: v.id("contracts"),
        rating: v.number(),
    },
    handler: async (ctx, args) => {
        if (args.rating > 5 || args.rating < 0) {
            throw new ConvexError("rating must be between 0 and 5 inclusive");
        }
        const contract = await ctx.db.get(args.contractId);
        if (contract === null) {
            throw new ConvexError("Contract does not exist");
        }
        const adminId = await getAuthUserId(ctx);
        if (await isGroupAdmin(ctx, contract.groupId, adminId)) {
            await ctx.db.patch(args.contractId, {
                rating: args.rating,
            });
        }
    },
});

export const deleteMemberContract = mutation({
    args: {
        contractId: v.id("contracts"),
        memberId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (userId === null) {
            throw new ConvexError("Must be logged in");
        }
        if (userId !== args.memberId) {
            throw new ConvexError("Must be contract owner");
        }
        await ctx.db.delete(args.contractId);
    },
});

export const deleteContract = mutation({
    args: {
        contractId: v.id("contracts"),
        groupId: v.id("groups"),
    },
    handler: async (ctx, args) => {
        const adminId = await getAuthUserId(ctx);
        if (await isGroupAdmin(ctx, args.groupId, adminId)) {
            await ctx.db.delete(args.contractId);
        } else {
            throw new ConvexError("Must be admin to delete.");
        }
    },
});
