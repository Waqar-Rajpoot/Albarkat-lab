import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { roleRedirectPath } from "@/lib/role-redirect";

export default async function AuthRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const { redirect: redirectTo } = await searchParams;

  redirect(redirectTo || roleRedirectPath(session.user.role));
}