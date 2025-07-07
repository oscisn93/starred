import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
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
  groups: defineTable({
    name: v.string(),
    admin: v.id("users")
  })
    .index("by_admin", ["admin"]),
  participants: defineTable({
    user: v.id("users"),
    group: v.id("groups"),
    points: v.number(),
  }),
  tasks: defineTable({
    group: v.id("groups"),
    participant: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
    points: v.number(),
    dueDate: v.string(),
    completed: v.boolean(),
  })
    .index("by_participant", ["participant"])
    .index("by_group", ["group"]),
  ratings: defineTable({
    task: v.id("tasks"),
    verified: v.boolean(),
    rating: v.number(),
    feedback: v.optional(v.string()),
  }),
  rewards: defineTable({
    author: v.id("users"),
    manager: v.id("users"),
    name: v.string(),
    description: v.optional(v.string()),
    points: v.number(),
    earned: v.boolean(),
  }),
});
