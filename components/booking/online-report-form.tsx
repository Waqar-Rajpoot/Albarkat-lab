"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn, MessageCircle, ShieldAlert } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { buildWhatsAppLink } from "@/lib/whatsapp";

type ReportRequest = {
    patientName: string;
    labNo: string;
    guardianName: string;
    phone: string;
};

const emptyRequest: ReportRequest = {
    patientName: "",
    labNo: "",
    guardianName: "",
    phone: "",
};

function isValid(values: ReportRequest): boolean {
    return (
        values.patientName.trim().length > 0 &&
        values.labNo.trim().length > 0 &&
        values.guardianName.trim().length > 0 &&
        values.phone.trim().length > 0
    );
}

export function OnlineReportForm() {
    const pathname = usePathname();
    const { data: session, isPending: sessionLoading } = authClient.useSession();
    const [values, setValues] = useState<ReportRequest>(emptyRequest);
    const [attempted, setAttempted] = useState(false);

    const isLoggedIn = Boolean(session);
    const canRequest = isLoggedIn && session?.user.role === "user";

    function handleChange(field: keyof ReportRequest, value: string) {
        setValues((prev) => ({ ...prev, [field]: value }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setAttempted(true);
        if (!isValid(values)) return;

        const lines = [
            "*Online Report Request*",
            "",
            "*Patient Details*",
            `Patient Name: ${values.patientName.trim()}`,
            `Lab No: ${values.labNo.trim()}`,
            `Father/Husband Name: ${values.guardianName.trim()}`,
            `Phone No: ${values.phone.trim()}`,
            "",
            "Please share my report.",
        ];

        window.open(buildWhatsAppLink(lines.join("\n")), "_blank");
        setValues(emptyRequest);
        setAttempted(false);
    }

    if (sessionLoading) {
        return <p className="py-6 text-center text-sm text-text-secondary">Checking your account…</p>;
    }

    if (!isLoggedIn) {
        return (
            <div className="flex flex-col items-center gap-3 rounded-md border border-dashed border-border bg-background-light px-4 py-8 text-center">
                <LogIn className="h-7 w-7 text-primary" />
                <p className="text-sm font-medium text-text">Please sign in to continue</p>
                <p className="text-sm text-text-secondary">
                    You need to be signed in to request your report over WhatsApp.
                </p>
                <Link
                    href={`/sign-in?redirect=${encodeURIComponent(pathname)}`}
                    className={buttonVariants({ variant: "default", size: "lg", className: "mt-1" })}
                >
                    Sign in
                </Link>
            </div>
        );
    }

    if (!canRequest) {
        return (
            <div className="flex flex-col items-center gap-3 rounded-md border border-dashed border-border bg-background-light px-4 py-8 text-center">
                <ShieldAlert className="h-7 w-7 text-warning" />
                <p className="text-sm font-medium text-text">
                    Report requests are only available for user accounts.
                </p>
                <p className="text-sm text-text-secondary">
                    You&apos;re signed in with an admin account, which can&apos;t send report requests.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="patientName">Patient Name</Label>
                    <Input
                        id="patientName"
                        required
                        placeholder="e.g. Ahmed Ali"
                        value={values.patientName}
                        onChange={(e) => handleChange("patientName", e.target.value)}
                    />
                    {attempted && !values.patientName.trim() && (
                        <p className="text-sm text-error">Please enter the patient name.</p>
                    )}
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="labNo">Lab No</Label>
                    <Input
                        id="labNo"
                        required
                        placeholder="e.g. LB-10234"
                        value={values.labNo}
                        onChange={(e) => handleChange("labNo", e.target.value)}
                    />
                    {attempted && !values.labNo.trim() && (
                        <p className="text-sm text-error">Please enter the lab number.</p>
                    )}
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="guardianName">Father / Husband Name</Label>
                    <Input
                        id="guardianName"
                        required
                        placeholder="e.g. Muhammad Ali"
                        value={values.guardianName}
                        onChange={(e) => handleChange("guardianName", e.target.value)}
                    />
                    {attempted && !values.guardianName.trim() && (
                        <p className="text-sm text-error">Please enter father/husband name.</p>
                    )}
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="phone">Phone No</Label>
                    <Input
                        id="phone"
                        type="tel"
                        required
                        placeholder="e.g. 0300-1234567"
                        value={values.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                    />
                    {attempted && !values.phone.trim() && (
                        <p className="text-sm text-error">Please enter your phone number.</p>
                    )}
                </div>
            </div>

            <Button type="submit" size="lg" className="gap-2 self-start">
                <MessageCircle className="h-4 w-4" />
                Send via WhatsApp
            </Button>
        </form>
    );
}