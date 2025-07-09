import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  // override the default convex users table
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
  })
    .index("by_email", ["email"])
    .index("by_phone", ["phone"]),
  // groups are groupings of admins and participants
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
  participants: defineTable({
    userId: v.id("users"),
    groupId: v.id("groups"),
    points: v.number(),
  })
    .index("by_group_user", ["groupId", "userId"]),
  // a tasks is designated for a group
  // it is created by admins
  tasks: defineTable({
    groupId: v.id("groups"),
    title: v.string(),
    description: v.optional(v.string()),
    points: v.number(),
    dueDate: v.optional(v.number()),
  })
    .index("by_dueDate", ["dueDate"])
    .index("by_group", ["groupId"]),
  // feedback is a mechanism for interacting with tasks
  contracts: defineTable({
    taskId: v.id("tasks"),
    groupId: v.id("groups"),
    participantId: v.id("users"),
    markedComplete: v.boolean(),
    verified: v.boolean(),
    rating: v.number(),
    feedback: v.optional(v.string()),
  })
    .index("by_participant", ["participantId"])
    .index("by_participant_task", ["participantId", "taskId"])
    .index("by_task", ["taskId"])
    .index("by_group", ["groupId"]),
  rewards: defineTable({
    authorId: v.id("users"),
    groupId: v.id("groups"),
    name: v.string(),
    description: v.optional(v.string()),
    points: v.number(),
    earned: v.boolean(),
  }),
});
