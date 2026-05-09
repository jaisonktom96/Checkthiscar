"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import { BRANDS, YEARS, getModels, getVariants } from "@/data/carDatabase";
import { Button } from "@/components/ui/button";

const ALL_MODELS = BRANDS.flatMap((brand) =>
  getModels(brand).map((model) => ({ brand, model }))
);

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedVariant, setSelectedVariant] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered =
    query.length >= 1
      ? ALL_MODELS.filter(
          ({ brand, model }) =>
            model.toLowerCase().includes(query.toLowerCase()) ||
            brand.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 12)
      : [];

  const variants = selectedModel ? getVariants(selectedModel) : [];

  const handleSelect = ({ brand, model }: { brand: string; model: string }) => {
    setSelectedBrand(brand);
    setSelectedModel(model);
    setSelectedYear("");
    setSelectedVariant("");
    setQuery(model);
    setOpen(false);
  };

  const reset = () => {
    setSelectedBrand("");
    setSelectedModel("");
    setSelectedYear("");
    setSelectedVariant("");
    setQuery("");
  };

  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const entries = Array.from(files).slice(0, 10).map((f) => ({
      url: URL.createObjectURL(f),
      isPdf: f.type === "application/pdf",
    }));
    sessionStorage.setItem("ctc_photos", JSON.stringify(entries));
    const params = new URLSearchParams({
      brand: selectedBrand,
      model: selectedModel,
      year: selectedYear,
      variant: selectedVariant,
    });
    router.push(`/check?${params}`);
  };

  const handleStart = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const canStart = selectedModel && selectedYear && selectedVariant;

  return (
    <div className="space-y-5 w-full max-w-lg flex flex-col items-center">
      {/* Model search */}
      <div ref={containerRef} className="relative w-full">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none"
          strokeWidth={1.5}
        />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            if (!e.target.value) reset();
          }}
          onFocus={() => {
            if (query.length >= 1) setOpen(true);
          }}
          placeholder="Search model — Swift, Creta, Nexon..."
          className="w-full rounded-xl border border-transparent bg-white text-zinc-900 pl-11 pr-4 py-4 text-base placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-white/30 transition-colors shadow-lg"
        />

        {open && filtered.length > 0 && (
          <div className="absolute top-full mt-1.5 left-0 right-0 rounded-xl border border-border bg-card shadow-2xl z-50 overflow-hidden">
            {filtered.map(({ brand, model }, i) => (
              <button
                key={i}
                onMouseDown={() => handleSelect({ brand, model })}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary text-left transition-colors cursor-pointer border-b border-border last:border-0"
              >
                <span className="text-sm font-semibold">{model}</span>
                <span className="text-xs text-muted-foreground">{brand}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Year pills */}
      {selectedModel && (
        <div className="space-y-2.5 animate-in fade-in slide-in-from-bottom-1 duration-200 w-full">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Year
          </p>
          <div className="flex flex-wrap gap-2">
            {YEARS.map((y) => (
              <button
                key={y}
                onClick={() => {
                  setSelectedYear(String(y));
                  setSelectedVariant("");
                }}
                className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors cursor-pointer ${
                  selectedYear === String(y)
                    ? "bg-transparent text-foreground border-foreground/60"
                    : "bg-transparent text-muted-foreground border-border hover:border-muted-foreground/50"
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Variant pills */}
      {selectedYear && variants.length > 0 && (
        <div className="space-y-2.5 animate-in fade-in slide-in-from-bottom-1 duration-200 w-full">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Variant
          </p>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => (
              <button
                key={v}
                onClick={() => setSelectedVariant(v)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors cursor-pointer ${
                  selectedVariant === v
                    ? "bg-transparent text-foreground border-foreground/60"
                    : "bg-transparent text-muted-foreground border-border hover:border-muted-foreground/50"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        multiple
        className="hidden"
        onChange={(e) => handleFilesSelected(e.target.files)}
      />

      {/* CTA */}
      {canStart && (
        <Button
          size="lg"
          onClick={handleStart}
          className="w-full bg-foreground text-background hover:bg-foreground/90 font-semibold gap-2 cursor-pointer animate-in fade-in duration-200 h-14 text-base"
        >
          Upload images / Service records
          <ArrowRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
