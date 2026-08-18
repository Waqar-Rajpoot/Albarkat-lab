"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn, MessageCircle, ShieldAlert } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PatientInfoFields } from "@/components/booking/patient-info-fields";
import { authClient } from "@/lib/auth-client";
import { emptyPatientInfo, patientInfoIsValid, type PatientInfo } from "@/lib/patient-info";

export function BookingDetailsDialog({
  open,
  onOpenChange,
  title,
  description,
  summary,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  summary?: ReactNode;
  onConfirm: (patient: PatientInfo) => void;
}) {
  const pathname = usePathname();
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const [patient, setPatient] = useState<PatientInfo>(emptyPatientInfo);
  const [attempted, setAttempted] = useState(false);

  const isValid = patientInfoIsValid(patient);
  const isLoggedIn = Boolean(session);
  const canBook = isLoggedIn && session?.user.role === "user";

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setAttempted(true);
    if (!isValid) return;
    onConfirm(patient);
    setPatient(emptyPatientInfo);
    setAttempted(false);
  }
  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      setPatient(emptyPatientInfo);
      setAttempted(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {summary && (
          <div className="rounded-md border border-border bg-background-light px-3 py-2.5 text-sm text-text">
            {summary}
          </div>
        )}

        {sessionLoading ? (
          <p className="py-6 text-center text-sm text-text-secondary">Checking your account…</p>
        ) : !isLoggedIn ? (
          <div className="flex flex-col items-center gap-3 rounded-md border border-dashed border-border bg-background-light px-4 py-8 text-center">
            <LogIn className="h-7 w-7 text-primary" />
            <p className="text-sm font-medium text-text">Please sign in to continue</p>
            <p className="text-sm text-text-secondary">
              You need to be signed in to send a booking request over WhatsApp.
            </p>
            <Link
              href={`/sign-in?redirect=${encodeURIComponent(pathname)}`}
              className={buttonVariants({ variant: "default", size: "lg", className: "mt-1" })}
            >
              Sign in
            </Link>
          </div>
        ) : !canBook ? (
          <div className="flex flex-col items-center gap-3 rounded-md border border-dashed border-border bg-background-light px-4 py-8 text-center">
            <ShieldAlert className="h-7 w-7 text-warning" />
            <p className="text-sm font-medium text-text">
              Booking is only available for user accounts.
            </p>
            <p className="text-sm text-text-secondary">
              You&apos;re signed in with an admin account, which can&apos;t send bookings.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <PatientInfoFields
              values={patient}
              onChange={(field, value) => setPatient((prev) => ({ ...prev, [field]: value }))}
            />
            {attempted && !isValid && (
              <p className="text-sm text-error">
                Fill in your name, father/husband name, and a valid age to continue.
              </p>
            )}
            <DialogFooter>
              <Button type="submit" size="lg" className="gap-2">
                <MessageCircle className="h-4 w-4" />
                Send via WhatsApp
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}