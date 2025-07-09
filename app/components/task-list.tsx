"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useState } from "react";

export default async function TaskList() {
  const [count, setCount] = useState<number>(10);
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
    </div>
  );
}