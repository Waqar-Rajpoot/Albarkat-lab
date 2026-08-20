import type { Metadata } from "next";
import { FileText } from "lucide-react";
import { BookingPageShell } from "@/components/booking/booking-page-shell";
import { OnlineReportForm } from "@/components/booking/online-report-form";

export const metadata: Metadata = {
  title: "Online Report | AL-Barkat Lab",
  description:
    "Request your lab report from AL-Barkat Lab'z & Digital X-Ray — enter your details and we'll send it over WhatsApp.",
};

export default function OnlineReportPage() {
  return (
    <BookingPageShell
      icon={FileText}
      title="Request Your Online Report"
      subtitle="Enter your patient and lab number details and we'll send your report over WhatsApp."
    >
      <OnlineReportForm />
    </BookingPageShell>
  );
}