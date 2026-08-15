import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default async function DashboardPage() {
  // This is the real authorization boundary — the proxy check is only
  // an optimistic UX redirect, not security enforcement.
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <SignOutButton />
      </div>

      <div className="rounded-lg border border-black/10 p-4 dark:border-white/15">
        <p className="text-sm text-black/60 dark:text-white/60">Signed in as</p>
        <p className="font-medium">{session.user.name}</p>
        <p className="text-sm text-black/60 dark:text-white/60">{session.user.email}</p>
      </div>
    </div>
  );
}
