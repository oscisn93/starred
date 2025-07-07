"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import SignOutButton from "@/components/sign-out-button";

export default function Home() {
  return (
    <>
      <header className="sticky top-0 z-10 bg-background p-4 border-b-2 border-slate-200 dark:border-slate-800 flex flex-row justify-between items-center">
        Convex + Next.js + Convex Auth
        <SignOutButton />
      </header>
      <main className="p-8 flex flex-col gap-8">
        <h1 className="text-4xl font-bold text-center">
          Convex + Next.js + Convex Auth
        </h1>
        <Content />
      </main>
    </>
  );
}

function Content() {
  const { tasks } =
    useQuery(api.myFunctions.listTasks, {
      count: 10,
      page: 1,
    }) ?? {};
  if (tasks === undefined) {
    return (
      <div className="mx-auto">
        <p>loading... </p>
      </div>
    );
  }

  return <div className="flex flex-col gap-8 max-w-lg mx-auto"></div>;
}
