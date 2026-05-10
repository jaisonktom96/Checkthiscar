import Image from "next/image";
import { AlertTriangle, BarChart2, IndianRupee, Search } from "lucide-react";
import { HeroSearch } from "@/components/HeroSearch";

const FEATURES = [
  {
    Icon: Search,
    title: "Hidden Maintenance Gaps",
    desc: "Every missed service that voids your warranty or masks expensive future repairs.",
  },
  {
    Icon: IndianRupee,
    title: "Upcoming Cost Forecast",
    desc: "Know if you'll spend ₹25,000 on tyres and a major service within 3 months of buying.",
  },
  {
    Icon: AlertTriangle,
    title: "Batch-Specific Defects",
    desc: "The 3 exact questions to ask the seller, based on real known issues for this year and model.",
  },
  {
    Icon: BarChart2,
    title: "Data-Backed Offer Price",
    desc: "A negotiation breakdown that proves your lower price is fair — not just a gut feeling.",
  },
];


export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-5xl flex items-center px-6 h-14">
          <span className="font-semibold text-sm tracking-tight">
            checkthiscar<span className="text-muted-foreground">.in</span>
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pt-[100px] pb-[100px] flex flex-col gap-10">
        {/* Top row: image + title/description */}
        <div className="flex flex-col md:flex-row md:items-stretch gap-16 md:gap-0">
          {/* Left: image fills height of right column */}
          <div className="flex-shrink-0 relative w-full md:w-[360px] md:self-stretch">
            <Image
              src="/dark-car.svg"
              alt="Car illustration"
              width={720}
              height={480}
              className="w-full h-auto md:absolute md:inset-0 md:h-full md:w-full md:object-contain md:object-left-bottom"
              priority
            />
          </div>

          {/* Right: title + description only */}
          <div className="flex flex-col justify-center flex-1 text-left">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.08] mb-6">
              Be an informed used car buyer
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
              Audit any used car instantly. Upload images and service history to uncover hidden risks
              and get a fair offer price.
            </p>
          </div>
        </div>

        {/* Full-width search below */}
        <HeroSearch />
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground mb-8">
          What the report covers
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FEATURES.map(({ Icon, title, desc }, i) => (
            <div
              key={i}
              className="rounded-lg border border-border bg-card p-6 hover:border-muted-foreground/30 transition-colors duration-200"
            >
              <Icon className="h-4 w-4 text-muted-foreground mb-5" strokeWidth={1.5} />
              <h3 className="font-semibold text-sm mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <span className="text-sm font-semibold">
            checkthiscar<span className="text-muted-foreground">.in</span>
          </span>
          <p className="text-xs text-muted-foreground">
            Analysis is AI-generated for guidance only. Always conduct a physical inspection before purchase.
          </p>
        </div>
      </footer>
    </div>
  );
}
