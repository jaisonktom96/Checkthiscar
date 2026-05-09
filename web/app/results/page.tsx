"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle, AlertTriangle, RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { AnalysisResult, CarVitals, RiskLevel } from "@/types/car";

function fmt(n: number) {
  return "₹ " + n.toLocaleString("en-IN");
}

function ScoreDial({ score, risk }: { score: number; risk: RiskLevel }) {
  const color =
    risk === "LOW"
      ? "var(--risk-low)"
      : risk === "MEDIUM"
      ? "var(--risk-medium)"
      : "var(--risk-high)";

  const label =
    risk === "LOW" ? "Low Risk" : risk === "MEDIUM" ? "Medium Risk" : "High Risk";

  const pct = ((score - 22) / (95 - 22)) * 100;
  const dasharray = 2 * Math.PI * 44;
  const dashoffset = dasharray * (1 - pct / 100);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r="44" fill="none" stroke="var(--border)" strokeWidth="7" />
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={dasharray}
            strokeDashoffset={dashoffset}
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold tabular-nums">{score}</span>
          <span className="text-[10px] text-muted-foreground">/ 95</span>
        </div>
      </div>
      <span
        className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full"
        style={{ color, background: `color-mix(in oklch, ${color} 14%, transparent)` }}
      >
        {label}
      </span>
    </div>
  );
}

function SeverityBadge({ sev }: { sev: "LOW" | "MEDIUM" | "HIGH" }) {
  const cls =
    sev === "HIGH"
      ? "bg-red-950/60 text-red-400 border-red-900"
      : sev === "MEDIUM"
      ? "bg-amber-950/60 text-amber-400 border-amber-900"
      : "bg-green-950/60 text-green-400 border-green-900";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide border ${cls}`}>
      {sev}
    </span>
  );
}

function PriorityBadge({ p }: { p: "URGENT" | "SOON" | "UPCOMING" }) {
  const cls =
    p === "URGENT"
      ? "bg-red-950/60 text-red-400 border-red-900"
      : p === "SOON"
      ? "bg-amber-950/60 text-amber-400 border-amber-900"
      : "bg-blue-950/60 text-blue-400 border-blue-900";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide border ${cls}`}>
      {p}
    </span>
  );
}

export default function ResultsPage() {
  const [vitals, setVitals] = useState<CarVitals | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    try {
      const v = localStorage.getItem("ctc_vitals");
      const r = localStorage.getItem("ctc_result");
      if (v) setVitals(JSON.parse(v));
      if (r) setResult(JSON.parse(r));
    } catch {
      // ignore parse errors
    }
  }, []);

  if (!result || !vitals) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 px-6">
        <p className="text-muted-foreground text-sm">No analysis found.</p>
        <Link href="/check">
          <Button className="bg-foreground text-background hover:bg-foreground/90 cursor-pointer">
            Start a Check
          </Button>
        </Link>
      </div>
    );
  }

  const verdictLabel =
    result.priceVerdict === "GOOD_DEAL"
      ? "Good Deal"
      : result.priceVerdict === "FAIR"
      ? "Fair Price"
      : "Overpriced";
  const verdictColor =
    result.priceVerdict === "GOOD_DEAL"
      ? "text-green-400"
      : result.priceVerdict === "FAIR"
      ? "text-amber-400"
      : "text-red-400";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-2xl flex items-center justify-between px-6 h-14">
          <Link href="/check" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-xs">New Check</span>
          </Link>
          <span className="text-sm font-semibold">
            checkthiscar<span className="text-muted-foreground">.in</span>
          </span>
          <Link href="/check">
            <Button size="sm" variant="outline" className="gap-1.5 text-xs border-border hover:bg-secondary cursor-pointer">
              <RefreshCw className="h-3 w-3" />
              Again
            </Button>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-12">
        {/* Car identity */}
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground mb-2">
          Analysis Report
        </p>
        <h1 className="text-xl font-bold mb-1">
          {vitals.year} {vitals.brand} {vitals.model}
          <span className="text-muted-foreground font-normal"> · {vitals.variant}</span>
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          {vitals.odometer.toLocaleString("en-IN")} km · {vitals.fuelType} · {vitals.city}
        </p>

        {/* Hero score + price verdict */}
        <div className="rounded-xl border border-border bg-card p-6 flex flex-col sm:flex-row items-center gap-8 mb-8">
          <ScoreDial score={result.overallScore} risk={result.riskLevel} />

          <div className="flex-1 space-y-4 w-full">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Asking Price</span>
              <span className="text-sm font-semibold">{fmt(vitals.askingPrice)}</span>
            </div>
            <Separator className="bg-border" />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Fair Market</span>
              <span className="text-sm font-semibold">{fmt(result.fairMarketPrice)}</span>
            </div>
            <Separator className="bg-border" />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Verdict</span>
              <span className={`text-sm font-bold ${verdictColor}`}>{verdictLabel}</span>
            </div>
            <Separator className="bg-border" />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Warranty</span>
              <Badge
                variant="outline"
                className={result.warrantyStatus === "ACTIVE" ? "border-green-800 text-green-400" : "border-border text-muted-foreground"}
              >
                {result.warrantyStatus === "ACTIVE" ? "Active" : "Expired"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview">
          <TabsList className="w-full bg-card border border-border mb-6 h-auto p-1 flex gap-1">
            {["overview", "service", "risk", "negotiate", "vs-new"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="flex-1 text-[11px] font-medium uppercase tracking-wide py-1.5 data-[state=active]:bg-foreground data-[state=active]:text-background cursor-pointer"
              >
                {tab === "vs-new" ? "vs New" : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ── Overview ── */}
          <TabsContent value="overview" className="space-y-4 focus-visible:outline-none">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              At a Glance
            </p>

            {result.serviceGaps.length === 0 ? (
              <div className="rounded-lg border border-green-900 bg-green-950/30 p-4 text-sm text-green-300">
                No service gaps detected.
              </div>
            ) : (
              <div className="space-y-2">
                {result.serviceGaps.map((gap, i) => (
                  <div key={i} className="flex gap-3 rounded-lg border border-border bg-card p-4">
                    <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" strokeWidth={1.5} />
                    <p className="text-sm text-muted-foreground leading-relaxed">{gap}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="rounded-lg border border-border bg-card p-4 mt-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Upcoming Maintenance Cost</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">{fmt(result.totalUpcomingCost)}</span>
                <span className="text-xs text-muted-foreground mb-1">estimated next 12 months</span>
              </div>
            </div>
          </TabsContent>

          {/* ── Service ── */}
          <TabsContent value="service" className="space-y-4 focus-visible:outline-none">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Service History
            </p>

            {result.serviceGaps.length === 0 ? (
              <div className="rounded-lg border border-green-900 bg-green-950/30 p-4 text-sm text-green-300">
                Service history looks complete.
              </div>
            ) : (
              <div className="space-y-2">
                {result.serviceGaps.map((gap, i) => (
                  <div key={i} className="flex gap-3 rounded-lg border border-border bg-card p-4">
                    <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" strokeWidth={1.5} />
                    <p className="text-sm text-muted-foreground leading-relaxed">{gap}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="rounded-lg border border-border bg-card overflow-hidden mt-4">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Upcoming Service Costs</p>
              </div>
              {result.upcomingCosts.length === 0 ? (
                <p className="text-sm text-muted-foreground px-4 py-4">No upcoming costs projected.</p>
              ) : (
                <div className="divide-y divide-border">
                  {result.upcomingCosts.map((cost, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3 gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{cost.item}</p>
                        <p className="text-xs text-muted-foreground">
                          Due around {cost.dueSoonKm.toLocaleString("en-IN")} km
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <PriorityBadge p={cost.priority} />
                        <span className="text-sm font-semibold tabular-nums">{fmt(cost.estimatedCost)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* ── Risk ── */}
          <TabsContent value="risk" className="space-y-4 focus-visible:outline-none">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Batch-Specific Defects
            </p>

            {result.batchIssues.length === 0 ? (
              <div className="rounded-lg border border-green-900 bg-green-950/30 p-4 text-sm text-green-300">
                No known batch defects for this model.
              </div>
            ) : (
              <div className="space-y-3">
                {result.batchIssues.map((issue, i) => (
                  <div key={i} className="rounded-lg border border-border bg-card p-4 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold leading-snug">{issue.title}</p>
                      <SeverityBadge sev={issue.severity} />
                    </div>
                    <p className="text-xs text-muted-foreground">Affected: {issue.affectedYears}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{issue.description}</p>
                    <p className="text-xs text-muted-foreground">
                      Est. fix cost: <span className="text-foreground font-medium">{issue.estimatedFixCost}</span>
                    </p>
                  </div>
                ))}
              </div>
            )}

            {result.sellerQuestions.length > 0 && (
              <div className="rounded-lg border border-border bg-card p-4 mt-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Ask the Seller</p>
                <ol className="space-y-3">
                  {result.sellerQuestions.map((q, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-[11px] font-mono text-muted-foreground/60 mt-0.5 shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="text-sm text-muted-foreground leading-relaxed">{q}</p>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </TabsContent>

          {/* ── Negotiate ── */}
          <TabsContent value="negotiate" className="space-y-4 focus-visible:outline-none">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Negotiation Breakdown
            </p>

            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="divide-y divide-border">
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-muted-foreground">Asking Price</span>
                  <span className="text-sm font-semibold tabular-nums">{fmt(vitals.askingPrice)}</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-muted-foreground">Fair Market Value</span>
                  <span className="text-sm font-semibold tabular-nums">{fmt(result.fairMarketPrice)}</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-muted-foreground">
                    Upcoming Maintenance
                    <span className="ml-1 text-xs opacity-60">(65% deducted)</span>
                  </span>
                  <span className="text-sm font-semibold tabular-nums text-red-400">
                    − {fmt(Math.round(result.totalUpcomingCost * 0.65))}
                  </span>
                </div>

                {result.upcomingCosts.map((cost, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-2 bg-secondary/30">
                    <span className="text-xs text-muted-foreground pl-4">{cost.item}</span>
                    <span className="text-xs text-muted-foreground tabular-nums">{fmt(cost.estimatedCost)}</span>
                  </div>
                ))}

                <div className="flex items-center justify-between px-4 py-4 bg-secondary/50">
                  <span className="text-sm font-semibold">Recommended Offer</span>
                  <span className="text-lg font-bold tabular-nums">{fmt(result.recommendedOffer)}</span>
                </div>
              </div>
            </div>

            {result.negotiationSaving > 0 && (
              <div className="rounded-lg border border-green-900 bg-green-950/30 p-4">
                <p className="text-sm text-green-300 font-medium">
                  Potential saving: <span className="font-bold">{fmt(result.negotiationSaving)}</span>
                </p>
                <p className="text-xs text-green-400/70 mt-1">
                  Use the maintenance cost breakdown above to justify your counter-offer.
                </p>
              </div>
            )}
          </TabsContent>

          {/* ── vs New ── */}
          <TabsContent value="vs-new" className="space-y-4 focus-visible:outline-none">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Feature Comparison
            </p>

            <div className="text-xs text-muted-foreground flex items-center gap-4 mb-4">
              <span className="font-semibold text-foreground">
                {result.newBaseComparison.usedCarLabel}
              </span>
              <span className="text-border">vs</span>
              <span>
                {result.newBaseComparison.newBaseLabel}{" "}
                <span className="text-foreground/60">({fmt(result.newBaseComparison.newBasePrice)} ex-showroom)</span>
              </span>
            </div>

            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <div className="grid grid-cols-[1fr_4rem_4rem] text-[10px] text-muted-foreground uppercase tracking-wider px-4 py-2 border-b border-border">
                <span>Feature</span>
                <span className="text-center">Used</span>
                <span className="text-center">New</span>
              </div>
              <div className="divide-y divide-border">
                {result.newBaseComparison.features.map((row, i) => (
                  <div key={i} className="grid grid-cols-[1fr_4rem_4rem] px-4 py-3 items-center">
                    <span className="text-sm text-muted-foreground">{row.name}</span>
                    <span className="flex justify-center">
                      {row.usedHas ? (
                        <CheckCircle2 className="h-4 w-4 text-green-400" strokeWidth={1.5} />
                      ) : (
                        <XCircle className="h-4 w-4 text-border" strokeWidth={1.5} />
                      )}
                    </span>
                    <span className="flex justify-center">
                      {row.newBaseHas ? (
                        <CheckCircle2 className="h-4 w-4 text-green-400" strokeWidth={1.5} />
                      ) : (
                        <XCircle className="h-4 w-4 text-border" strokeWidth={1.5} />
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-4 mt-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Price Delta</p>
              <p className="text-lg font-bold">
                {fmt(result.newBaseComparison.newBasePrice - vitals.askingPrice)}
                <span className="text-sm text-muted-foreground font-normal"> cheaper than new base</span>
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Plus you get{" "}
                {result.newBaseComparison.features.filter((f) => f.usedHas && !f.newBaseHas).length} feature
                {result.newBaseComparison.features.filter((f) => f.usedHas && !f.newBaseHas).length !== 1 ? "s" : ""}{" "}
                the base trim doesn&apos;t offer.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer CTA */}
        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-xs text-muted-foreground mb-4">
            Analysis is AI-generated for guidance only. Always conduct a physical inspection before purchase.
          </p>
          <Link href="/check">
            <Button className="bg-foreground text-background hover:bg-foreground/90 font-semibold gap-2 cursor-pointer">
              Check Another Car
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
