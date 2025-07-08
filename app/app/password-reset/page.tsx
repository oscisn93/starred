import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";

export default function PasswordReset() {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<"forgot" | { email: string }>("forgot");
  return step === "forgot" ? (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        void signIn("password", formData).then(() =>
          setStep({ email: formData.get("email") as string }),
        );
      }}
    >
      <input name="email" placeholder="e@mail.com" type="text" />
      <input name="flow" type="hidden" value="reset" />
      <Button type="submit">Send Code</Button>
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
      <input type="password" name="new-pasword" placeholder="New Password" />
      <input type="hidden" name="email" value={step.email} />
      <input type="hidden" name="flow" value="reset-verification" />
      <Button type="submit">Continue</Button>
      <Button type="button" variant="outline" onClick={() => setStep("forgot")}>
        Cancel
      </Button>
    </form>
  );
}
