"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { roleRedirectPath } from "@/lib/role-redirect";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resent, setResent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setNeedsVerification(false);
    setResent(false);
    setLoading(true);

    const { data, error } = await authClient.signIn.email({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      // Better Auth returns this specific code when requireEmailVerification
      // is on and the user hasn't clicked the link yet.
      if (error.code === "EMAIL_NOT_VERIFIED") {
        setNeedsVerification(true);
      } else {
        setError(error.message ?? "Something went wrong. Please try again.");
      }
      return;
    }

    router.push(redirectTo || roleRedirectPath(data.user.role));
  }

  async function handleResend() {
    await authClient.sendVerificationEmail({
      email,
      callbackURL: "/auth/redirect",
    });
    setResent(true);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            href="/forgot-password"
            className="text-xs font-medium text-secondary hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pr-16"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 flex items-center gap-1 px-3 text-xs font-medium text-text-secondary transition-colors hover:text-text"
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {error && (
        <p className="rounded-md border border-error-light bg-error-light px-3 py-2 text-sm text-error">
          {error}
        </p>
      )}

      {needsVerification && (
        <div className="rounded-md border border-warning-light bg-warning-light px-3 py-2.5 text-sm text-text">
          <p>Please verify your email before signing in.</p>
          {resent ? (
            <p className="mt-1 text-text-secondary">
              Verification email sent — check your inbox.
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="mt-1 font-medium text-secondary underline underline-offset-4"
            >
              Resend verification email
            </button>
          )}
        </div>
      )}

      <Button type="submit" variant="default" disabled={loading} className="mt-2">
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {loading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}