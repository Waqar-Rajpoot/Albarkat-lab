import type { Metadata } from "next";
import { FlaskConical } from "lucide-react";
import { connectToDatabase } from "@/lib/mongodb";
import Test from "@/models/Test";
import { BookingPageShell } from "@/components/booking/booking-page-shell";
import { TestBookingForm, type TestOption } from "@/components/booking/test-booking-form";

export const metadata: Metadata = {
  title: "Book a Test | AL-Barkat Lab",
  description:
    "Book any lab test at AL-Barkat Lab'z & Digital X-Ray — fill in your details and confirm instantly over WhatsApp.",
};

export const dynamic = "force-dynamic";

async function getTests(): Promise<TestOption[]> {
  await connectToDatabase();
  const tests = await Test.find().sort({ testId: 1 }).lean();

  return tests.map((t) => ({
    _id: String(t._id),
    testId: t.testId,
    description: t.description,
    price: t.price,
  }));
}

export default async function BookTestPage() {
  const tests = await getTests();

  return (
    <BookingPageShell
      icon={FlaskConical}
      title="Book a Lab Test"
      subtitle="Select the test(s) you need, share your details, and we'll confirm your booking over WhatsApp."
    >
      <TestBookingForm tests={tests} />
    </BookingPageShell>
  );
}
