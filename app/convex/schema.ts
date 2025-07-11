import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  groups: defineTable({
    name: v.string(),
    adminId: v.id("users"),
  })
    .index("by_admin", ["adminId"]),
  members: defineTable({
    userId: v.id("users"),
    groupId: v.id("groups"),
    points: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_group", ["groupId"])
    .index("by_group_user", ["groupId", "userId"]),
  tasks: defineTable({
    groupId: v.id("groups"),
    title: v.string(),
    description: v.optional(v.string()),
    points: v.number(),
    deadline: v.optional(v.number()),
  })
    .index("by_group", ["groupId"])
    .index("by_deadline", ["deadline"]),
  contracts: defineTable({
    taskId: v.id("tasks"),
    groupId: v.id("groups"),
    memberId: v.id("users"),
    markedComplete: v.boolean(),
    verified: v.boolean(),
    rating: v.number(),
    feedback: v.optional(v.string()),
  })
    .index("by_member", ["memberId"])
    .index("by_group", ["groupId"])
    .index("by_task", ["taskId"])
    .index("by_member_task", ["memberId", "taskId"]),
  rewards: defineTable({
    adminId: v.id("users"),
    groupId: v.id("groups"),
    name: v.string(),
    description: v.optional(v.string()),
    points: v.number(),
    earned: v.boolean(),
  }),
  prizes: defineTable({
    memberId: v.id("users"),
    rewardId: v.id("rewards"),
  })
    .index("by_member", ["memberId"]),
});
