"use client";

import { GithubIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState<string>("m@example.com");
  const [password, setPassword] = useState<string>("");
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<"signUp" | "signIn" | { email: string }>(
    "signIn",
  );
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "signIn" || "signUp" ? (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                void signIn("password", { email, password, flow: step });
              }}
            >
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    onChange={(event) => {
                      setEmail(event.target.value);
                    }}
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    {step === "signIn" ? (
                      <a
                        href="/password-reset"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    ) : null}
                  </div>
                  <Input
                    id="password"
                    type="password"
                    onChange={(event) => {
                      setPassword(event.target.value);
                    }}
                    required
                  />
                </div>
                {step === "signUp" ? (
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                    </div>
                    <Input id="confirm-password" type="password" required />
                  </div>
                ) : null}
                <input name="flow" type="hidden" value={step as string} />
                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full">
                    {step === "signIn" ? "Sign in" : "Sign up"}
                  </Button>
                  <Button
                    onClick={() => void signIn("github")}
                    className="w-full"
                  >
                    Signin with Github <GithubIcon />
                  </Button>
                </div>
              </div>

              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <a
                  href="#"
                  onClick={() => {
                    setStep(step === "signIn" ? "signUp" : "signIn");
                  }}
                  className="underline underline-offset-4"
                >
                  {step === "signIn" ? "Sign up instead" : "Sign in instead"}
                </a>
              </div>
            </form>
          ) : (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                void signIn("password", formData);
              }}
            >
              <input type="text" name="code" placeholder="Code" />
              <input type="hidden" name="flow" value="email-verification" />
              <input type="hidden" name="email" value={step.email} />
              <Button type="submit">Continue</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("signIn")}
              >
                Cancel
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
