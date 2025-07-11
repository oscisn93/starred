import SignOutButton from "@/components/sign-out-button";
import Groups from "@/components/groups";
import TaskList from "@/components/task-list";
import { Star } from "lucide-react";

export default function Home() {
  return (
    <>
      <header className="sticky top-0 z-10 border-b-2 border-b-yellow-800 flex flex-row justify-between items-center bg-zinc-900 p-2 items-center">
        <span className="flex items-center justify-between w-full text-yellow-600">
          <span className="flex w-1/3 px-2">
            <Star className="mr-2"/>Starred | Dashboard</span>
          <SignOutButton />
        </span>
      </header>
      <main className="flex gap-2 p-2 bg-slate-950 h-dvh text-slate-100 font-semibold">
        <section className="w-1/2 h-fit bg-orange-800 rounded p-2 flex flex-col gap-2">
          <h3>Groups</h3>
          <Groups />
        </section>
        <section className="w-1/2 h-fit bg-green-600 rounded p-2 flex flex-col gap-2">
          <h3>Tasks</h3>
          <TaskList />
        </section>
      </main>
    </>
  );
}


