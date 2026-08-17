import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | AL-Barkat Lab",
  description:
    "AL-Barkat Lab'z & Digital X-Ray has served Abdul Hakeem since 1990 — the area's first diagnostic lab. Learn our story, mission, and why patients trust us.",
};

const whyChooseUs = [
  "Established in 1990",
  "First Laboratory in Abdul Hakeem",
  "More Than 36 Years of Trusted Service",
  "Experienced & Qualified Staff",
  "Accurate & Reliable Test Results",
  "Modern Digital X-Ray Facility",
  "Home Sample Collection Available",
  "Affordable Prices",
  "Fast Report Delivery",
  "Patient-Centered Care",
];

export default function AboutPage() {
  return (
    <main className="bg-background-light">
      {/* Hero */}
      <section className="bg-navy-dark">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            About AL-Barkat Lab&apos;z &amp; Digital X-Ray
          </h1>
          <p className="mt-4 max-w-2xl text-base text-navy-light sm:text-lg">
            36+ years of accurate, reliable, and compassionate diagnostic
            care in Abdul Hakeem.
          </p>
        </div>
      </section>

      {/* About Us */}
      <section className="mx-auto max-w-6xl px-6 py-14 sm:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-text-dark sm:text-3xl">
              Our Story
            </h2>
            <div className="mt-4 space-y-4 text-text-gray leading-relaxed">
              <p>
                AL-BARKAT LAB&apos;Z &amp; DIGITAL X-RAY proudly carries
                forward a legacy of excellence in diagnostic healthcare that
                began in 1990. Our journey started with New Nishtar Clinical
                Lab on Boys High School Road, Abdul Hakeem, proudly
                recognized as the first laboratory established in Abdul
                Hakeem. Since its foundation, our mission has been to
                provide accurate, reliable, and timely diagnostic services
                while earning the trust of generations through quality,
                integrity, and compassionate patient care.
              </p>
              <p>
                Today, this legacy continues as AL-BARKAT LAB&apos;Z &amp;
                DIGITAL X-RAY, conveniently located on Multan Road, Abdul
                Hakeem. Under the leadership of CEO Muhammad Ibrahim, we
                combine decades of experience with modern diagnostic
                technology to deliver high-quality laboratory testing,
                Digital X-Ray services, and Home Sample Collection. With
                over 36 years of dedicated service, we remain committed to
                excellence, precision, and patient satisfaction, proudly
                serving our community with trusted healthcare solutions.
              </p>
            </div>
          </div>

          {/* Stat callouts */}
          <div className="grid grid-cols-2 gap-4 content-start lg:grid-cols-1">
            {[
              { value: "1990", label: "Founded" },
              { value: "1st", label: "Lab in Abdul Hakeem" },
              { value: "36+", label: "Years of Service" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border bg-surface p-5 text-center lg:text-left"
              >
                <p className="text-2xl font-bold text-navy-dark sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-text-gray">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-surface border-y border-border">
        <div className="mx-auto max-w-6xl px-6 py-14 sm:py-16">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-accent-blue-light p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-blue text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" />
                </svg>
              </div>
              <h3 className="mt-5 text-xl font-bold text-text-dark">
                Our Mission
              </h3>
              <p className="mt-3 text-text-gray leading-relaxed">
                To provide accurate, reliable, and timely diagnostic
                services that support better healthcare decisions. We are
                committed to delivering high-quality laboratory testing,
                Digital X-Ray services, and Home Sample Collection with
                professionalism, compassion, and the highest standards of
                patient care.
              </p>
            </div>

            <div className="rounded-2xl bg-green-light p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <h3 className="mt-5 text-xl font-bold text-text-dark">
                Our Vision
              </h3>
              <p className="mt-3 text-text-gray leading-relaxed">
                To remain the most trusted and preferred diagnostic center
                in Abdul Hakeem by continuously improving our services,
                adopting modern diagnostic technologies, and maintaining
                excellence in quality, accuracy, and patient satisfaction.
                We strive to build lasting trust with every patient and
                healthcare professional we serve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mx-auto max-w-6xl px-6 py-14 sm:py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-dark sm:text-3xl">
            Why Choose AL-Barkat Lab&apos;z?
          </h2>
          <p className="mt-3 text-text-gray">
            Reasons patients across Abdul Hakeem have trusted us for over
            three decades.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {whyChooseUs.map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4"
            >
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-green-light text-green">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span className="font-medium text-text-dark">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-dark">
        <div className="mx-auto max-w-6xl px-6 py-14 text-center sm:py-16">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Ready to book your test?
          </h2>
          <p className="mt-3 text-navy-light">
            Choose a test, X-ray, or health package and get results you can
            trust.
          </p>
          <a
            href="/book-test"
            className="mt-6 inline-block rounded-lg bg-green px-6 py-3 font-semibold text-white transition-colors hover:bg-green-hover"
          >
            Book a Test
          </a>
        </div>
      </section>
    </main>
  );
}