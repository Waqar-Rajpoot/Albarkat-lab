import Link from "next/link";
import { SearchX, Home, FlaskConical } from "lucide-react";

export const metadata = {
  title: "Page Not Found | AL-Barkat Lab",
  description:
    "The page you're looking for doesn't exist. Head back home or book a lab test, X-ray, or health package.",
};

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center bg-background px-4 py-20">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-surface">
          <SearchX className="h-8 w-8 text-primary" />
        </div>

        <span className="text-6xl font-bold tracking-tight text-primary sm:text-7xl">
          404
        </span>

        <h1 className="text-2xl font-semibold text-text sm:text-3xl">
          Page Not Found
        </h1>
        <p className="max-w-md text-sm text-text-secondary sm:text-base">
          The page you&apos;re looking for doesn&apos;t exist or may have
          been moved. Let&apos;s get you back on track.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
          <Link
            href="/book-test"
            className="flex items-center gap-2 rounded-md border border-border bg-surface px-6 py-2.5 text-sm font-medium text-text transition-colors hover:bg-background-light"
          >
            <FlaskConical className="h-4 w-4" />
            Book a Test
          </Link>
        </div>
      </div>
    </section>
  );
}