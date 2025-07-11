"use client";

import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

export default function Groups() {
  const router = useRouter();
  const data = useQuery(api.groups.getMemberGroups);
  return (
    <div className="flex flex-col">
      <section className="flex flex-col items-center justify-center">
        {data && data.groups.length > 0 ?
          data.groups.map(group => (
            <div>
              <h2>{group!.name}</h2>
            </div>
          ))
          : "User has no groups"
        }
      </section>
      <section>
        <Button onClick={(ev) => {
          ev.preventDefault();
          router.push("/groups/new");
        }}>
          Create New Group <Plus />
        </Button>
      </section>
    </div>
  );
}
