import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>;
}) {
  const { token, error } = await searchParams;

  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-background px-4 py-16">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <Image
            src="/al_barkat_logo_vector-1.svg"
            alt="AL-Barkat Lab"
            width={40}
            height={54}
            priority
          />
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold text-text">Set a new password</h1>
            <p className="text-sm text-text-secondary">
              Choose a new password for your account.
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface p-6 shadow-sm">
          {token && !error ? (
            <ResetPasswordForm token={token} />
          ) : (
            <div className="flex flex-col items-center gap-2 rounded-md border border-error-light bg-error-light p-4 text-center">
              <ShieldAlert className="h-6 w-6 text-error" />
              <p className="font-medium text-text">This link is invalid or expired</p>
              <p className="text-sm text-text-secondary">
                Password reset links only work once and expire after 1 hour.
                Request a new one below.
              </p>
              <Link
                href="/forgot-password"
                className="mt-1 text-sm font-medium text-secondary hover:underline"
              >
                Request a new link
              </Link>
            </div>
          )}
        </div>

        <Link
          href="/sign-in"
          className="flex items-center justify-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>
      </div>
    </div>
  );
}