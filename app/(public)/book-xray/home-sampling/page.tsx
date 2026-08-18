import type { Metadata } from "next";
import { Syringe } from "lucide-react";
import { BookingPageShell } from "@/components/booking/booking-page-shell";
import { HomeSamplingForm } from "@/components/booking/home-sampling-form";

export const metadata: Metadata = {
  title: "Home Sampling | AL-Barkat Lab",
  description:
    "Request a home sample collection from AL-Barkat Lab'z & Digital X-Ray — tell us what you need and we'll confirm over WhatsApp.",
};

export default function HomeSamplingPage() {
  return (
    <BookingPageShell
      icon={Syringe}
      title="Request Home Sampling"
      subtitle="Describe what you need, share your details, and we'll arrange a home sample collection over WhatsApp."
    >
      <HomeSamplingForm />
    </BookingPageShell>
  );
}
