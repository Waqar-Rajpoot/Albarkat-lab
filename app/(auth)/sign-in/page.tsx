import Link from "next/link";
import { SignInForm } from "@/components/auth/sign-in-form";
import { GoogleButton } from "@/components/auth/google-button";

export default function SignInPage() {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-4 py-16">
      <div className="flex flex-col gap-1.5 text-center">
        <h1 className="text-xl font-semibold">Sign in</h1>
        <p className="text-sm text-black/60 dark:text-white/60">
          Welcome back. Sign in to continue.
        </p>
      </div>

      <GoogleButton />

      <div className="flex items-center gap-3 text-xs text-black/40 dark:text-white/40">
        <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
        or
        <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
      </div>

      <SignInForm />

      <p className="text-center text-sm text-black/60 dark:text-white/60">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="font-medium underline underline-offset-4">
          Sign up
        </Link>
      </p>
    </div>
  );
}
