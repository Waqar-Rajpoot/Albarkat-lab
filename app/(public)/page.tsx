import Link from "next/link";
import { Bone, FlaskConical, Package, ShieldCheck, Clock, Award } from "lucide-react";
import { WhyChooseUsCarousel } from "@/components/why-choose-us-carousel";
import { PackagesCarousel } from "@/components/packages-carousel";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-background px-4 py-20 sm:py-28">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <span className="rounded-full border border-border bg-surface px-4 py-1 text-xs font-medium text-text-secondary">
            Trusted Diagnostics, Close to Home
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-text sm:text-5xl">
            Your Health, <span className="text-primary">Accurately Measured</span>
          </h1>
          <p className="max-w-xl text-base text-text-secondary sm:text-lg">
            AL-Barkat Lab brings you reliable lab tests, X-ray imaging, and complete
            health checkup packages — with fast results you can trust.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/book-test"
              className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
            >
              Book a Test
            </Link>
            <Link
              href="/book-package"
              className="rounded-md border border-border bg-surface px-6 py-2.5 text-sm font-medium text-text transition-colors hover:bg-background-light"
            >
              View Health Packages
            </Link>
          </div>
        </div>
      </section>

      {/* About / explain the lab */}
      <section className="border-t border-border bg-surface px-4 py-16">
        <div className="mx-auto flex max-w-5xl flex-col gap-10 sm:flex-row sm:items-center">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-text sm:text-3xl">
              About AL-Barkat Lab&apos;z &amp; Digital X-Ray
            </h2>
            <p className="mt-4 text-text-secondary">
              Founded in 1990 as New Nishtar Clinical Lab, we were the first
              diagnostic laboratory established in Abdul Hakeem. Today, under
              the leadership of CEO Muhammad Ibrahim, that legacy continues on
              Multan Road as AL-Barkat Lab&apos;z &amp; Digital X-Ray — combining
              over 36 years of experience with modern lab testing, Digital
              X-Ray, and Home Sample Collection.
            </p>
            <p className="mt-3 text-text-secondary">
              We built our booking process to be simple — choose a test, X-ray, or
              package online, pick a convenient time, and get your results without
              the wait.
            </p>
            <Link
              href="/about"
              className="mt-4 inline-block text-sm font-medium text-secondary hover:underline"
            >
              Learn more about us →
            </Link>
          </div>

          <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-background p-5 text-center">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <p className="text-sm font-medium text-text">Accurate Results</p>
              <p className="text-xs text-text-secondary">
                Certified labs and calibrated equipment
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-background p-5 text-center">
              <Clock className="h-6 w-6 text-primary" />
              <p className="text-sm font-medium text-text">Fast Turnaround</p>
              <p className="text-xs text-text-secondary">
                Quick reporting, no long waits
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-background p-5 text-center">
              <Award className="h-6 w-6 text-primary" />
              <p className="text-sm font-medium text-text">Trusted Experience</p>
              <p className="text-xs text-text-secondary">
                Years of dependable community service
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-semibold text-text sm:text-3xl">
              Our Services
            </h2>
            <p className="mt-2 text-text-secondary">
              Everything you need, all in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-6">
              <FlaskConical className="h-8 w-8 text-primary" />
              <h3 className="text-lg font-semibold text-text">Lab Tests</h3>
              <p className="text-sm text-text-secondary">
                Blood work, urine analysis, and a wide range of diagnostic panels —
                book online in minutes.
              </p>
              <Link
                href="/book-test"
                className="mt-2 text-sm font-medium text-secondary hover:underline"
              >
                Book a Test →
              </Link>
            </div>

            <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-6">
              <Bone className="h-8 w-8 text-primary" />
              <h3 className="text-lg font-semibold text-text">X-Ray Imaging</h3>
              <p className="text-sm text-text-secondary">
                Digital X-ray imaging with fast reporting, reviewed by experienced
                radiologists.
              </p>
              <Link
                href="/book-xray"
                className="mt-2 text-sm font-medium text-secondary hover:underline"
              >
                Book an X-Ray →
              </Link>
            </div>

            <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-6">
              <Package className="h-8 w-8 text-primary" />
              <h3 className="text-lg font-semibold text-text">Health Packages</h3>
              <p className="text-sm text-text-secondary">
                Full-body checkup bundles that combine multiple tests at a better
                value.
              </p>
              <Link
                href="/book-package"
                className="mt-2 text-sm font-medium text-secondary hover:underline"
              >
                View Packages →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us — carousel */}
      <section className="border-t border-border bg-surface px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-semibold text-text sm:text-3xl">
              Why Choose AL-Barkat Lab&apos;z?
            </h2>
            <p className="mt-2 text-text-secondary">
              Reasons patients across Abdul Hakeem have trusted us for over
              three decades.
            </p>
          </div>

          <WhyChooseUsCarousel />
        </div>
      </section>

      {/* Health Packages — carousel */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-semibold text-text sm:text-3xl">
              Discount Offers
            </h2>
            <p className="mt-2 text-text-secondary">
              Bundled tests at a better value.
            </p>
          </div>

          <PackagesCarousel />
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-primary px-4 py-14">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">
            Ready to book your test?
          </h2>
          <p className="text-sm text-white/85 sm:text-base">
            Create an account and book your lab test, X-ray, or health package in
            just a few clicks.
          </p>
          <Link
            href="/sign-up"
            className="rounded-md bg-white px-6 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-white/90"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}