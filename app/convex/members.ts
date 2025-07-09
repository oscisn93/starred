import { ConvexError } from "convex/values";
import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getMemberInfo = query({
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (userId === null) {
            throw new ConvexError("Must be logged in");
        }
        const user = await ctx.db.get(userId);

        return {
            user
        }
    }
});