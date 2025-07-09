import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  // groups are groupings of admins and members
  groups: defineTable({
    // name can describe group.
    // Example: family-chores, football-team, church-choir, etc...
    name: v.string(),
    // One user must be responsible for creating and verifying
    // completion of tasks. They are the admin.
    adminId: v.id("users"),
  }).index("by_admin", ["adminId"]),
  // participants are the users who are
  // given rewards for completing tasks
  members: defineTable({
    userId: v.id("users"),
    groupId: v.id("groups"),
    points: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_group", ["groupId"])
    .index("by_group_user", ["groupId", "userId"]),
  // a tasks is designated for a group
  // it is created by admins
  tasks: defineTable({
    groupId: v.id("groups"),
    title: v.string(),
    description: v.optional(v.string()),
    points: v.number(),
    deadline: v.optional(v.number()),
  })
    .index("by_group", ["groupId"])
    .index("by_deadline", ["deadline"]),
  // feedback is a mechanism for interacting with tasks
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
