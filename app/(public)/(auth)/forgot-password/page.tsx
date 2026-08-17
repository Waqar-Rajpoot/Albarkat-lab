import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
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
            <h1 className="text-xl font-semibold text-text">Reset your password</h1>
            <p className="text-sm text-text-secondary">
              Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface p-6 shadow-sm">
          <ForgotPasswordForm />
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