"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

export default function TaskList() {
  const router = useRouter()
  const data = useQuery(api.tasks.queries.getMemberTasks);
  if (data === undefined) {
    return (
      <div className="mx-auto">
        <p>loading... </p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-8 max-w-lg mx-auto">
      {data.tasks.length > 0 ? data.tasks.map(task => (
        <div>
          <h1>task.title</h1>
          <aside>
            {task.description? task.description: "No description provided"}
          </aside>
        </div>
      )): "User has no assigned tasks"}
      <section>
        <Button onClick={()=> router.push("/tasks/suggest")}>
          Suggest New Task
        </Button>
        <Button>
          Add New Task <Plus />
        </Button>
      </section>
    </div>
  );
}
