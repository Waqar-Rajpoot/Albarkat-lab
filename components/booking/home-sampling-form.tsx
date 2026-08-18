"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookingDetailsDialog } from "@/components/booking/booking-details-dialog";
import type { PatientInfo } from "@/lib/patient-info";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function HomeSamplingForm() {
  const [problem, setProblem] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [attempted, setAttempted] = useState(false);

  function handleContinue() {
    setAttempted(true);
    if (problem.trim().length === 0) return;
    setDialogOpen(true);
  }

  function handleConfirm(patient: PatientInfo) {
    const lines = [
      "*New Home Sampling Request*",
      "",
      "*Patient Details*",
      `Name: ${patient.name}`,
      `Father/Husband Name: ${patient.guardianName}`,
      `Age: ${patient.age}`,
      "",
      "*Details*",
      problem.trim(),
    ];

    if (patient.reference.trim()) {
      lines.push("", `Reference: ${patient.reference.trim()}`);
    }

    lines.push("", "Please arrange a home sample collection.");

    window.open(buildWhatsAppLink(lines.join("\n")), "_blank");
    setDialogOpen(false);
  }

  const summaryText = problem.trim();
  const truncatedSummary =
    summaryText.length > 120 ? `"${summaryText.slice(0, 120)}…"` : `"${summaryText}"`;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="problem">Describe the issue / what you need sampled</Label>
        <Textarea
          id="problem"
          required
          rows={6}
          placeholder="e.g. Fever and body ache for 3 days, need CBC and blood sugar test done at home"
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
        />
        {attempted && summaryText.length === 0 && (
          <p className="text-sm text-error">Please describe what you need.</p>
        )}
      </div>

      <Button type="button" size="lg" className="gap-2 self-start" onClick={handleContinue}>
        <MessageCircle className="h-4 w-4" />
        Continue
      </Button>

      <BookingDetailsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Confirm Your Details"
        description="A few details before we send your home sampling request on WhatsApp."
        summary={summaryText ? truncatedSummary : undefined}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
