"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PatientInfo } from "@/lib/patient-info";

export function PatientInfoFields({
  values,
  onChange,
}: {
  values: PatientInfo;
  onChange: (field: keyof PatientInfo, value: string) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Patient Name</Label>
        <Input
          id="name"
          required
          placeholder="e.g. Ahmed Ali"
          value={values.name}
          onChange={(e) => onChange("name", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="guardianName">Father / Husband Name</Label>
        <Input
          id="guardianName"
          required
          placeholder="e.g. Muhammad Ali"
          value={values.guardianName}
          onChange={(e) => onChange("guardianName", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          type="number"
          min={0}
          max={120}
          required
          placeholder="e.g. 32"
          value={values.age}
          onChange={(e) => onChange("age", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="reference">Reference (optional)</Label>
        <Input
          id="reference"
          placeholder="Referred by (doctor/clinic), if any"
          value={values.reference}
          onChange={(e) => onChange("reference", e.target.value)}
        />
      </div>
    </div>
  );
}
