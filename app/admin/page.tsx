import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Bone, FlaskConical } from "lucide-react";
import { auth } from "@/lib/auth";

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-10 sm:py-16">
      <h1 className="text-xl font-semibold text-text">Admin panel</h1>

      <div className="rounded-lg border border-border bg-surface p-4 shadow-sm">
        <p className="text-sm text-text-secondary">Signed in as</p>
        <p className="font-medium text-text">{session.user.name}</p>
        <p className="text-sm text-text-secondary">{session.user.email}</p>
        <p className="mt-2 inline-block rounded bg-background-light px-2 py-0.5 text-xs font-medium text-text">
          {session.user.role}
        </p>
      </div>

      {/* Build out user management, etc. here */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/admin/xrays"
          className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4 shadow-sm transition hover:border-primary-light"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
            <Bone className="h-5 w-5" />
          </span>
          <div>
            <p className="font-medium text-text">X-Ray Procedures</p>
            <p className="text-sm text-text-secondary">Manage the procedure list</p>
          </div>
        </Link>
        <Link
          href="/admin/tests"
          className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4 shadow-sm transition hover:border-primary-light"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
            <FlaskConical className="h-5 w-5" />
          </span>
          <div>
            <p className="font-medium text-text">Lab Tests</p>
            <p className="text-sm text-text-secondary">Manage the test list</p>
          </div>
        </Link>
      </div>
    </div>
  );
}