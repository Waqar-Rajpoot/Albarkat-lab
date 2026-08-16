import Image from "next/image";
import Link from "next/link";
import { SignInForm } from "@/components/auth/sign-in-form";
import { GoogleButton } from "@/components/auth/google-button";

export default function SignInPage() {
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
            <h1 className="text-xl font-semibold text-text">Welcome back</h1>
            <p className="text-sm text-text-secondary">
              Sign in to your AL-Barkat Lab account.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6 rounded-lg border border-border bg-surface p-6 shadow-sm">
          <GoogleButton /> 

          <div className="flex items-center gap-3 text-xs font-medium text-text-secondary">
            <div className="h-px flex-1 bg-border" />
            OR CONTINUE WITH EMAIL
            <div className="h-px flex-1 bg-border" />
          </div>

          <SignInForm />
        </div>

        <p className="text-center text-sm text-text-secondary">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="font-medium text-secondary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}