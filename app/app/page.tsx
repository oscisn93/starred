import SignOutButton from "@/components/sign-out-button";
import UserProfile from "@/components/user-profile";

export default function Home() {
  return (
    <>
      <header className="sticky top-0 z-10 bg-background p-4 border-b-2 border-slate-200 dark:border-slate-800 flex flex-row justify-between items-center">
        Dashboard | {} 
        <SignOutButton />
      </header>
      <main className="p-8 flex flex-col gap-8">
        <h1 className="text-4xl font-bold text-center">
          <UserProfile />          
        </h1>
      </main>
    </>
  );
}


