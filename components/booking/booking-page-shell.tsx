import type { LucideIcon } from "lucide-react";

export function BookingPageShell({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main className="bg-background-light">
      <section className="bg-surface border-b border-border px-4 py-6 sm:py-8">
        <div className="mx-auto max-w-3xl px-6 py-14 sm:py-16">
          <div className="flex items-center gap-2 text-navy-light">
            <Icon className="h-5 w-5" />
            <span className="text-xs font-medium uppercase tracking-wide">
              Book Online
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-bold text-text sm:text-4xl">{title}</h1>
          <p className="mt-3 max-w-xl text-sm text-text-secondary sm:text-base">{subtitle}</p>
        </div>
      </section>

      <section className="px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-3xl rounded-lg border border-border bg-surface p-5 shadow-sm sm:p-8">
          {children}
        </div>
      </section>
    </main>
  );
}
