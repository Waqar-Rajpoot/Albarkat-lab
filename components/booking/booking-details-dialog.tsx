"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PatientInfoFields } from "@/components/booking/patient-info-fields";
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
  const [patient, setPatient] = useState<PatientInfo>(emptyPatientInfo);
  const [attempted, setAttempted] = useState(false);

  const isValid = patientInfoIsValid(patient);

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
      </DialogContent>
    </Dialog>
  );
}
