import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default async function AdminPage() {
  // Layout already guarantees session + role === "admin" here.
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Admin panel</h1>
        <SignOutButton />
      </div>

      <div className="rounded-lg border border-black/10 p-4 dark:border-white/15">
        <p className="text-sm text-black/60 dark:text-white/60">Signed in as</p>
        <p className="font-medium">{session?.user.name}</p>
        <p className="text-sm text-black/60 dark:text-white/60">{session?.user.email}</p>
        <p className="mt-2 inline-block rounded bg-black/10 px-2 py-0.5 text-xs font-medium dark:bg-white/10">
          {session?.user.role}
        </p>
      </div>

      {/* Build out user management, etc. here */}
    </div>
  );
}
