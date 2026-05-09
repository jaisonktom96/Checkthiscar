"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, X, Camera, FileText, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getFuelTypes } from "@/data/carDatabase";

import { CITIES } from "@/data/cities";
import type { CarVitals, FuelType } from "@/types/car";

const ANALYSIS_STEPS = [
  "Reading uploaded photos…",
  "Scanning service book for stamps & gaps…",
  "Checking odometer for consistency…",
  "Looking up batch issues for this model & year…",
  "Estimating fair market value…",
  "Forecasting upcoming maintenance costs…",
  "Calculating negotiation leverage…",
  "Comparing with new base variant…",
  "Generating final report…",
];

function AnalysisOverlay({ car }: { car: string }) {
  const [activeStep, setActiveStep] = useState(0);
  const [doneSteps, setDoneSteps] = useState<number[]>([]);

  useEffect(() => {
    const tick = setInterval(() => {
      setDoneSteps((prev) => {
        if (!prev.includes(activeStep)) return [...prev, activeStep];
        return prev;
      });
      setActiveStep((s) => {
        const next = s + 1;
        return next < ANALYSIS_STEPS.length ? next : s;
      });
    }, 2200);
    return () => clearInterval(tick);
  }, [activeStep]);

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8">
        {/* Pulsing orb */}
        <div className="flex justify-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full bg-foreground/10 animate-ping" />
            <div className="absolute inset-2 rounded-full bg-foreground/20 animate-pulse" />
            <div className="absolute inset-4 rounded-full bg-foreground" />
          </div>
        </div>

        <div className="text-center space-y-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Analysing</p>
          <p className="text-lg font-bold">{car}</p>
        </div>

        {/* Step list */}
        <div className="space-y-3">
          {ANALYSIS_STEPS.map((step, i) => {
            const isDone = doneSteps.includes(i);
            const isActive = i === activeStep;
            return (
              <div
                key={i}
                className={`flex items-center gap-3 transition-opacity duration-500 ${
                  i > activeStep && !isDone ? "opacity-25" : "opacity-100"
                }`}
              >
                <div className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-colors duration-300 ${
                  isDone
                    ? "bg-foreground border-foreground"
                    : isActive
                    ? "border-foreground"
                    : "border-border"
                }`}>
                  {isDone ? (
                    <Check className="h-3 w-3 text-background" strokeWidth={2.5} />
                  ) : isActive ? (
                    <div className="w-2 h-2 rounded-full bg-foreground animate-pulse" />
                  ) : null}
                </div>
                <span className={`text-sm transition-colors duration-300 ${
                  isDone ? "text-muted-foreground line-through" : isActive ? "text-foreground font-medium" : "text-muted-foreground"
                }`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-muted-foreground/50">This takes about 15–30 seconds</p>
      </div>
    </div>
  );
}


function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
      {children}
    </Label>
  );
}

function CheckPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [running, setRunning] = useState(false);

  const brand = searchParams.get("brand") ?? "";
  const model = searchParams.get("model") ?? "";
  const year = searchParams.get("year") ?? "";
  const variant = searchParams.get("variant") ?? "";

  useEffect(() => {
    if (!brand || !model || !year) router.replace("/");
  }, [brand, model, year, router]);

  const fuelOptions = model ? getFuelTypes(model) : ["Petrol"];
  const [fuelType] = useState<FuelType>(fuelOptions[0] as FuelType);

  const [odometer, setOdometer] = useState("");
  const [askingPrice, setAskingPrice] = useState("");
  const [city, setCity] = useState("");

  const [photos, setPhotos] = useState<{ url: string; isPdf: boolean }[]>([]);
  const [loadingCount, setLoadingCount] = useState(0);
  const hadPhotos = useRef(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("ctc_photos");
    if (stored) {
      setPhotos(JSON.parse(stored));
      sessionStorage.removeItem("ctc_photos");
    }
  }, []);

  useEffect(() => {
    if (photos.length > 0) {
      hadPhotos.current = true;
    } else if (hadPhotos.current) {
      router.push("/");
    }
  }, [photos, router]);

  const addPhotos = (files: FileList | null) => {
    if (!files) return;
    const toAdd = Array.from(files).slice(0, 10 - photos.length);
    const newEntries = toAdd.map((file) => ({
      url: URL.createObjectURL(file),
      isPdf: file.type === "application/pdf",
    }));
    // PDFs have no image to load, so only images count as "loading"
    const imageCount = newEntries.filter((e) => !e.isPdf).length;
    if (imageCount > 0) setLoadingCount((c) => c + imageCount);
    setPhotos((p) => [...p, ...newEntries].slice(0, 10));
  };

  const handleAnalyze = async () => {
    setRunning(true);
    const vitals: CarVitals = {
      brand, model, year: Number(year), variant, fuelType,
      odometer: Number(odometer) || 0,
      askingPrice: Number(askingPrice) || 0,
      city: city || "Unknown",
    };

    // Convert blob URLs to base64 for the API
    const toBase64 = ({ url }: { url: string }): Promise<{ data: string; mediaType: string }> =>
      fetch(url)
        .then((r) => r.blob())
        .then(
          (blob) =>
            new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = () => {
                const dataUrl = reader.result as string;
                const [header, data] = dataUrl.split(",");
                const mediaType = header.match(/:(.*?);/)?.[1] ?? "image/jpeg";
                resolve({ data, mediaType });
              };
              reader.readAsDataURL(blob);
            })
        );

    try {
      const images = await Promise.all(photos.map(toBase64));
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vitals, images }),
      });
      const result = await res.json();
      localStorage.setItem("ctc_vitals", JSON.stringify(vitals));
      localStorage.setItem("ctc_result", JSON.stringify(result));
      router.push("/results");
    } catch (e) {
      console.error(e);
      setRunning(false);
    }
  };

  const hasPhotos = photos.length > 0;

  return (
    <>
    {running && <AnalysisOverlay car={`${year} ${brand} ${model}`} />}
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-2xl flex items-center gap-4 px-6 h-14">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <span className="text-sm font-semibold">
            checkthiscar<span className="text-muted-foreground">.in</span>
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-12">
        {/* Car identity */}
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground mb-3">
          Checking
        </p>
        <h1 className="text-2xl font-bold mb-8">
          {year} {brand} {model}
          <span className="text-muted-foreground font-normal"> · {variant}</span>
        </h1>

        <div className="space-y-8">
          {/* Photo upload — hero element */}
          <div className="space-y-4">
            <FieldLabel>Car & Service Book Photos</FieldLabel>

            {!hasPhotos ? (
              <div className="flex flex-col items-center justify-center gap-6 w-full rounded-2xl border border-border bg-card py-14">
                <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
                  <Camera className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Snap the service book, odometer &amp; car</p>
                  <p className="text-xs text-muted-foreground/50 mt-1">Up to 10 files · JPG, PNG, PDF</p>
                </div>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    multiple
                    className="hidden"
                    onChange={(e) => addPhotos(e.target.files)}
                  />
                  <span className="inline-flex items-center gap-2 bg-foreground text-background font-semibold text-sm px-6 py-3 rounded-lg hover:bg-foreground/90 transition-colors">
                    <Camera className="h-4 w-4" strokeWidth={2} />
                    Upload photos
                  </span>
                </label>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  {photos.map(({ url, isPdf }, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-card border border-border">
                      {isPdf ? (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                          <FileText className="h-7 w-7 text-muted-foreground" strokeWidth={1.5} />
                          <span className="text-[10px] text-muted-foreground">PDF</span>
                        </div>
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={url}
                          alt=""
                          className="w-full h-full object-cover"
                          onLoad={() => setLoadingCount((c) => Math.max(0, c - 1))}
                        />
                      )}
                      <button
                        onClick={() => setPhotos((p) => p.filter((_, j) => j !== i))}
                        className="absolute top-1.5 right-1.5 rounded-full bg-background/90 p-1 cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {photos.length < 10 && (
                    <label className="aspect-square rounded-xl border border-dashed border-border bg-card flex items-center justify-center cursor-pointer hover:border-muted-foreground/40 transition-colors">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        multiple
                        className="hidden"
                        onChange={(e) => addPhotos(e.target.files)}
                      />
                      <Camera className="h-5 w-5 text-muted-foreground/50" strokeWidth={1.5} />
                    </label>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Rest only shown after photos added */}
          {hasPhotos && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Optional details */}
              <div className="space-y-6 border-t border-border pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FieldLabel>Odometer (km)</FieldLabel>
                    <Input
                      type="number"
                      value={odometer}
                      onChange={(e) => setOdometer(e.target.value)}
                      placeholder="e.g. 52000"
                      className="bg-card border-border placeholder:text-muted-foreground/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <FieldLabel>Asking Price (₹)</FieldLabel>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
                      <Input
                        type="number"
                        value={askingPrice}
                        onChange={(e) => setAskingPrice(e.target.value)}
                        placeholder="e.g. 750000"
                        className="bg-card border-border placeholder:text-muted-foreground/50 pl-7"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <FieldLabel>City</FieldLabel>
                  <Select value={city} onValueChange={(v) => v && setCity(v)}>
                    <SelectTrigger className="bg-card border-border">
                      <SelectValue placeholder="Select your city" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {CITIES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {loadingCount > 0 && (
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <span className="inline-block h-3 w-3 rounded-full border-2 border-muted-foreground border-t-transparent animate-spin" />
                  Loading {loadingCount} file{loadingCount > 1 ? "s" : ""}…
                </p>
              )}

              <Button
                size="lg"
                onClick={handleAnalyze}
                disabled={running || loadingCount > 0}
                className="w-full bg-foreground text-background hover:bg-foreground/90 font-semibold cursor-pointer h-14 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {running ? "Analysing…" : "Run Analysis →"}
              </Button>
            </div>
          )}

        </div>
      </div>
    </div>
    </>
  );
}

export default function CheckPage() {
  return (
    <Suspense>
      <CheckPageContent />
    </Suspense>
  );
}
