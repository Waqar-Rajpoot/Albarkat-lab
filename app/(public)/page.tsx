import Link from "next/link";
import { Bone, FlaskConical, Package, ShieldCheck, Clock, Award } from "lucide-react";
import { connectToDatabase } from "@/lib/mongodb";
import PackageModel from "@/models/Package";
import { WhyChooseUsCarousel } from "@/components/why-choose-us-carousel";
import { PackagesCarousel, type HealthPackage } from "@/components/packages-carousel";
import Image from "next/image";
export const dynamic = "force-dynamic";

async function getFeaturedPackages(): Promise<HealthPackage[]> {
  await connectToDatabase();
  const packages = await PackageModel.find({ isFeatured: true })
    .sort({ createdAt: -1 })
    .lean();

  return packages.map((p) => ({
    id: String(p._id),
    title: p.title,
    description: p.description,
    discountedPrice: p.discountedPrice,
    originalPrice: p.originalPrice,
    includedTests: p.includedTests,
    isFeatured: p.isFeatured,
  }));
}

export default async function HomePage() {
  const featuredPackages = await getFeaturedPackages();

  return (
    <div className="flex flex-col">
      {/* Hero */}
      {/* Hero */}
<section className="relative overflow-hidden px-4 py-20 sm:py-28">
  <Image
    src="/hero-bg.jpg"
    alt=""
    fill
    priority
    className="object-cover"
  />
  <div className="absolute inset-0 bg-black/55" />

  <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
    <span className="rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-medium text-white backdrop-blur-sm">
      Trusted Diagnostics, Close to Home
    </span>
    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
      Your Health, <span className="text-blue-500">Accurately Measured</span>
    </h1>
    <p className="max-w-xl text-base text-white/85 sm:text-lg">
      AL-Barkat Lab brings you reliable lab tests, X-ray imaging, and complete
      health checkup packages — with fast results you can trust.
    </p>
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Link
        href="/book-test"
        className="rounded-md bg-blue-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-600"
      >
        Book a Test
      </Link>
      <Link
        href="/book-package"
        className="rounded-md border border-white/40 bg-white/10 px-6 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
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
              <h3 className="text-lg font-semibold text-text">Home Sampling</h3>
              <p className="text-sm text-text-secondary">
                Convenient at-home sample collection for accurate diagnostic results.
              </p>
              <Link
                href="/home-sampling"
                className="mt-2 text-sm font-medium text-secondary hover:underline"
              >
                Learn More →
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

          <PackagesCarousel packages={featuredPackages} />
        </div>
      </section>
    </div>
  );
}