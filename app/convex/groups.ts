import { ConvexError, v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

export async function isGroupAdmin(
  ctx: QueryCtx,
  groupId: Id<"groups">,
  userId: Id<"users"> | null,
) {
  if (userId === null) {
    throw new ConvexError("Must be logged in");
  }
  const group = await ctx.db.get(groupId);
  if (group === null || group.adminId !== userId) {
    return false;
  }
  return true;
}

export const getGroup = query({
  args: {
    groupId: v.id("groups"),
  },
  handler: async (ctx, args) => {
    const group = await ctx.db.get(args.groupId);
    return {
      group,
    };
  },
});

export const getMemberGroups = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("Must be logged in");
    }
    const memberships = await ctx.db
      .query("members")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    const groups = await Promise.all(memberships.map(async (p) => await ctx.db.get(p.groupId)));
    return {
      groups,
    };
  },
});

export const getAdminGroups = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("Must be logged in");
    }
    const groups = await ctx.db
      .query("groups")
      .withIndex("by_admin", (q) => q.eq("adminId", userId))
      .collect();
    return {
      groups,
    };
  },
});

export const updateGroupName = mutation({
  args: {
    groupId: v.id("groups"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const adminId = await getAuthUserId(ctx);
    if (await isGroupAdmin(ctx, args.groupId, adminId)) {
      await ctx.db.patch(args.groupId, { name: args.name });
    }
  },
});

export const createGroup = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("Must be logged in.");
    }
    const groupId = await ctx.db.insert("groups", {
      name: args.name,
      adminId: userId,
    });
    return {
      groupId,
    };
  },
});

export const deleteGroup = mutation({
  args: {
    groupId: v.id("groups"),
  },
  handler: async (ctx, args) => {
    const adminId = await getAuthUserId(ctx);
    if (await isGroupAdmin(ctx, args.groupId, adminId)) {
      await ctx.db.delete(args.groupId);
    }
  },
});

export const addToGroup = mutation({
  args: {
    userId: v.id("users"),
    groupId: v.id("groups"),
  },
  handler: async (ctx, args) => {
    const adminId = await getAuthUserId(ctx);
    if (await isGroupAdmin(ctx, args.groupId, adminId)) {
      const user = await ctx.db.get(args.userId);
      if (!user === null) {
        throw new ConvexError("User that does not exist");
      }
      const memberId = await ctx.db.insert("members", {
        userId: args.userId,
        groupId: args.groupId,
        points: 0,
      });
      return {
        memberId,
      };
    }
    return null;
  },
});

export const removeFromGroup = mutation({
  args: {
    userId: v.id("users"),
    groupId: v.id("groups"),
  },
  handler: async (ctx, args) => {
    const adminId = await getAuthUserId(ctx);
    if (await isGroupAdmin(ctx, args.groupId, adminId)) {
      const member = await ctx.db
        .query("members")
        .withIndex("by_group_user", (q) =>
          q.eq("groupId", args.groupId).eq("userId", args.userId),
        )
        .unique();
      if (member === null) {
        throw new ConvexError("Member does not exist");
      }
      await ctx.db.delete(member._id);
    }
  },
});
