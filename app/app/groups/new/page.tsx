"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

export default function NewGroup() {
  const router = useRouter();
  const mutation = useMutation(api.groups.createGroup);
  return (
    <form onSubmit={(ev) => {
      ev.preventDefault();
      const formData = new FormData(ev.currentTarget);
      const name = formData.get("name") as string;
      mutation({ name });
      router.push("/")
    }}>
      <label htmlFor="name">Name</label>
      <input type="text" id="name" name="name" />
      <Button type="submit">
        Create Group
      </Button>
    </form>
  );
}
