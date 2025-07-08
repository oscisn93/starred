import { Password } from "@convex-dev/auth/providers/Password";
import Github from "@auth/core/providers/github";
import { convexAuth } from "@convex-dev/auth/server";
import { ResendOTPPasswordReset } from "./ResendOTPPasswordReset";
import { ResendOTP } from "./ResendOTP";
import { z } from "zod";
import { ConvexError, Value } from "convex/values";

const ParamsSchema = z.object({
  email: z.string().email(),
});

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      profile(params: Record<string, Value | undefined>) {
        const { error, data } = ParamsSchema.safeParse(params);
        if (error) {
          throw new ConvexError(error.format());
        }
        return { email: data.email };
      },
      validatePasswordRequirements(password: string) {
        if (
          password.length < 8 ||
          !/\d/.test(password) ||
          !/[a-z]/.test(password) ||
          !/[A-Z]/.test(password)
        ) {
          throw new ConvexError("Invalid password.");
        }
      },
      reset: ResendOTPPasswordReset,
      verify: ResendOTP,
    }),
    Github,
  ],
});
