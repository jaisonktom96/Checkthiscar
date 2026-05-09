import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import type { AnalysisResult } from "@/types/car";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { vitals, images } = await req.json() as {
    vitals: {
      brand: string; model: string; year: number; variant: string;
      fuelType: string; odometer: number; askingPrice: number; city: string;
    };
    images: Array<{ data: string; mediaType: string }>;
  };

  const fileBlocks = images.map((img) => {
    if (img.mediaType === "application/pdf") {
      return {
        type: "document" as const,
        source: {
          type: "base64" as const,
          media_type: "application/pdf" as const,
          data: img.data,
        },
      };
    }
    return {
      type: "image" as const,
      source: {
        type: "base64" as const,
        media_type: img.mediaType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
        data: img.data,
      },
    };
  });

  const carSummary = `${vitals.year} ${vitals.brand} ${vitals.model} ${vitals.variant} (${vitals.fuelType})
Odometer: ${vitals.odometer > 0 ? `${vitals.odometer.toLocaleString("en-IN")} km` : "not provided"}
Asking Price: ${vitals.askingPrice > 0 ? `₹${vitals.askingPrice.toLocaleString("en-IN")}` : "not provided"}
City: ${vitals.city !== "Unknown" ? vitals.city : "not provided"}`;

  const prompt = `You are an expert used car inspector and analyst for the Indian market with deep knowledge of Indian car models, their known issues, maintenance costs, and resale values.

Analyse this used car:
${carSummary}

${images.length > 0 ? `I have uploaded ${images.length} file(s) — these may include service book PDFs, photos of stamps, odometer, exterior/interior. Analyse them carefully for:
- Service book stamps, dates, and gaps
- Visible damage, wear, or rust
- Odometer reading (if visible)
- Overall condition` : "No images were uploaded — base your analysis on the car details alone."}

Return ONLY a valid JSON object (no markdown, no explanation) matching this exact schema:

{
  "overallScore": <integer 22-95, higher is better>,
  "riskLevel": <"LOW" | "MEDIUM" | "HIGH">,
  "fairMarketPrice": <integer in INR, realistic depreciated value>,
  "recommendedOffer": <integer in INR, what buyer should offer>,
  "priceVerdict": <"GOOD_DEAL" | "FAIR" | "OVERPRICED">,
  "batchIssues": [
    {
      "title": <string>,
      "severity": <"LOW" | "MEDIUM" | "HIGH">,
      "affectedYears": <string, e.g. "2020-2022">,
      "description": <string, 1-2 sentences>,
      "estimatedFixCost": <string, e.g. "₹15,000–25,000">
    }
  ],
  "sellerQuestions": [<3 specific questions to ask the seller based on known issues>],
  "upcomingCosts": [
    {
      "item": <string>,
      "dueSoonKm": <integer, km at which this is due>,
      "estimatedCost": <integer in INR>,
      "priority": <"URGENT" | "SOON" | "UPCOMING">
    }
  ],
  "serviceGaps": [<strings describing service or condition issues spotted>],
  "warrantyStatus": <"ACTIVE" | "EXPIRED" | "UNKNOWN">,
  "newBaseComparison": {
    "usedCarLabel": <"${vitals.year} ${vitals.brand} ${vitals.model} ${vitals.variant}">,
    "newBaseLabel": <string, current base variant name>,
    "newBasePrice": <integer in INR, current base variant ex-showroom>,
    "features": [
      { "name": <string>, "usedHas": <boolean>, "newBaseHas": <boolean> }
    ]
  },
  "totalUpcomingCost": <sum of all upcomingCosts estimatedCost>,
  "negotiationSaving": <max(0, askingPrice - recommendedOffer)>,
  "imageAnalysis": <string, 2-3 sentence summary of what you observed in the images, or "No images provided." if none>
}

Rules:
- fairMarketPrice and recommendedOffer must be realistic for the Indian used car market
- If askingPrice is 0 (not provided), set priceVerdict to "FAIR" and negotiationSaving to 0
- Include 3-5 real known batch issues for this exact model and year range
- Include 3-5 realistic upcoming maintenance costs based on the odometer reading
- Include 8-10 feature comparison rows (sunroof, touchscreen size, ADAS, ventilated seats, wireless charging, 360 camera, connected car tech, spare wheel type, warranty remaining, service cost)
- serviceGaps should reflect what you saw in images OR flag that no images/records were provided`;

  const response = await client.messages.create({
    model: "claude-opus-4-7",
    max_tokens: 3000,
    messages: [
      {
        role: "user",
        content: [
          ...fileBlocks,
          { type: "text", text: prompt },
        ],
      },
    ],
  });

  const raw = response.content[0].type === "text" ? response.content[0].text : "";

  // Strip any accidental markdown fences
  const cleaned = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
  const result: AnalysisResult = JSON.parse(cleaned);

  return NextResponse.json(result);
}
