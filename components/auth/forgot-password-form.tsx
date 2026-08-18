"use client";

import { useState, type FormEvent } from "react";
import { MailCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: "/reset-password",
    });

    setLoading(false);

    if (error) {
      setError(error.message ?? "Something went wrong. Please try again.");
      return;
    }

    // better-auth always returns success here regardless of whether the
    // email exists, so we can't distinguish "sent" from "no such account" —
    // and shouldn't, since that would leak which emails are registered.
    setSubmittedEmail(email);
  }

  if (submittedEmail) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-md border border-border bg-background-light p-4 text-center">
        <MailCheck className="h-6 w-6 text-success" />
        <p className="font-medium text-text">Check your inbox</p>
        <p className="text-sm text-text-secondary">
          If an account exists for{" "}
          <span className="font-medium text-text">{submittedEmail}</span>, we&apos;ve
          sent a link to reset the password. The link expires in 1 hour.
        </p>
      </div>
    );
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

      {error && (
        <p className="rounded-md border border-error-light bg-error-light px-3 py-2 text-sm text-error">
          {error}
        </p>
      )}

      <Button type="submit" variant="default" disabled={loading} className="mt-2">
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {loading ? "Sending..." : "Send reset link"}
      </Button>
    </form>
  );
}