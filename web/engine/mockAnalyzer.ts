import type { CarVitals, ServiceHistory, AnalysisResult, KnownIssue, RiskLevel } from '../types/car';
import { getKnownIssues, getSellerQuestions } from '../data/knownIssues';
import { getUpcomingCosts } from '../data/upcomingCosts';
import { getFeatureComparison } from '../data/featureMatrix';

const CURRENT_YEAR = 2025;

const BASE_EX_SHOWROOM: Record<string, number> = {
  Swift: 760000,
  Baleno: 830000,
  Brezza: 1100000,
  Dzire: 790000,
  WagonR: 690000,
  Ertiga: 1000000,
  'Grand Vitara': 1300000,
  Jimny: 1290000,
  i20: 860000,
  'Grand i10 Nios': 690000,
  Creta: 1400000,
  Venue: 960000,
  Verna: 1200000,
  Alcazar: 1600000,
  Exter: 780000,
  Nexon: 960000,
  Punch: 760000,
  Altroz: 800000,
  Harrier: 1700000,
  Safari: 1800000,
  Tiago: 630000,
  Tigor: 760000,
  'Nexon EV': 1450000,
  City: 1200000,
  Amaze: 790000,
  Elevate: 1200000,
  'WR-V': 1100000,
  'Innova Crysta': 2100000,
  'Innova HyCross': 1900000,
  'Urban Cruiser Hyryder': 1160000,
  Glanza: 740000,
  Fortuner: 3500000,
  Taigun: 1260000,
  Virtus: 1250000,
  Polo: 950000,
  Vento: 1050000,
  Kushaq: 1250000,
  Slavia: 1250000,
  Octavia: 2600000,
  Superb: 3500000,
  Seltos: 1260000,
  Sonet: 960000,
  Carens: 1100000,
  Hector: 1450000,
  Astor: 1160000,
  Gloster: 2200000,
  'ZS EV': 1490000,
  'Scorpio N': 1760000,
  'Scorpio Classic': 980000,
  XUV700: 1860000,
  XUV300: 900000,
  Thar: 1760000,
  Bolero: 980000,
  Kwid: 580000,
  Triber: 760000,
  Kiger: 730000,
};

function getBasePrice(model: string): number {
  return BASE_EX_SHOWROOM[model] ?? 1000000;
}

function depreciatedValue(basePrice: number, ageYears: number, odometer: number): number {
  const RATES = [0.15, 0.10, 0.08, 0.07, 0.06, 0.05, 0.05, 0.04, 0.04, 0.03];
  let value = basePrice;
  for (let i = 0; i < Math.min(ageYears, RATES.length); i++) {
    value *= 1 - RATES[i];
  }
  const avgKm = ageYears * 12000;
  if (odometer > avgKm) {
    const excess = odometer - avgKm;
    value *= Math.max(0.68, 1 - excess / 300000);
  }
  return Math.round(value / 10000) * 10000;
}

function computeScore(
  vitals: CarVitals,
  serviceHistory: ServiceHistory,
  issues: KnownIssue[]
): number {
  const age = CURRENT_YEAR - vitals.year;
  let score = 82;

  score -= Math.min(14, age * 2);

  if (vitals.odometer > 80000) score -= 12;
  else if (vitals.odometer > 60000) score -= 8;
  else if (vitals.odometer > 40000) score -= 5;
  else if (vitals.odometer > 25000) score -= 2;

  if (vitals.fuelType === 'Diesel' && vitals.odometer > 100000) score -= 6;

  score -= Math.min(14, issues.filter((i) => i.severity === 'HIGH').length * 7);
  score -= Math.min(8, issues.filter((i) => i.severity === 'MEDIUM').length * 3);

  if (!serviceHistory.hasServiceBook) score -= 8;
  if (serviceHistory.photos.length >= 3) score += 5;
  if (serviceHistory.repairCategories.includes('Engine')) score -= 5;
  if (serviceHistory.repairCategories.includes('Transmission')) score -= 4;

  return Math.max(22, Math.min(95, score));
}

function detectServiceGaps(vitals: CarVitals, serviceHistory: ServiceHistory): string[] {
  const gaps: string[] = [];
  const age = Math.max(1, CURRENT_YEAR - vitals.year);
  const avgKmPerYear = vitals.odometer / age;

  if (!serviceHistory.hasServiceBook) {
    gaps.push('No service book available — complete service history cannot be verified');
  }

  if (serviceHistory.lastServiceKm > 0) {
    const kmSinceLast = vitals.odometer - serviceHistory.lastServiceKm;
    if (kmSinceLast > 12000) {
      gaps.push(
        `Overdue for service: ${kmSinceLast.toLocaleString('en-IN')} km since last recorded service (recommended interval: 10,000 km)`
      );
    }
  }

  if (avgKmPerYear > 20000) {
    gaps.push(
      `High-intensity usage: ~${Math.round(avgKmPerYear).toLocaleString('en-IN')} km/year — accelerated consumable wear expected`
    );
  }

  if (serviceHistory.photos.length === 0 && serviceHistory.hasServiceBook) {
    gaps.push(
      'Service book claimed but no stamp photos uploaded — verify page stamps match the vehicle VIN at handover'
    );
  }

  return gaps;
}

export function analyzeVehicle(vitals: CarVitals, serviceHistory: ServiceHistory): AnalysisResult {
  const age = CURRENT_YEAR - vitals.year;
  const batchIssues = getKnownIssues(vitals.brand, vitals.model);
  const sellerQuestions = getSellerQuestions(vitals.brand, vitals.model);
  const overallScore = computeScore(vitals, serviceHistory, batchIssues);
  const upcomingCosts = getUpcomingCosts(vitals.odometer, age, vitals.fuelType);
  const serviceGaps = detectServiceGaps(vitals, serviceHistory);
  const newBaseComparison = getFeatureComparison(vitals.brand, vitals.model, vitals.variant);

  const highCount = batchIssues.filter((i) => i.severity === 'HIGH').length;
  const riskLevel: RiskLevel = highCount >= 2 ? 'HIGH' : highCount === 1 ? 'MEDIUM' : 'LOW';

  const basePrice = getBasePrice(vitals.model);
  const fairMarketPrice = depreciatedValue(basePrice, age, vitals.odometer);

  const totalUpcomingCost = upcomingCosts.reduce((s, c) => s + c.estimatedCost, 0);
  const rawOffer = fairMarketPrice - totalUpcomingCost * 0.65;
  const recommendedOffer = Math.max(
    Math.round(rawOffer / 5000) * 5000,
    Math.round(vitals.askingPrice * 0.72 / 5000) * 5000
  );

  const priceDiff = vitals.askingPrice - fairMarketPrice;
  const priceVerdict =
    priceDiff < -50000 ? 'GOOD_DEAL' : priceDiff < 50000 ? 'FAIR' : 'OVERPRICED';

  return {
    overallScore,
    riskLevel,
    fairMarketPrice,
    recommendedOffer,
    priceVerdict,
    batchIssues,
    sellerQuestions,
    upcomingCosts,
    serviceGaps,
    warrantyStatus: age <= 3 ? 'ACTIVE' : 'EXPIRED',
    newBaseComparison,
    totalUpcomingCost,
    negotiationSaving: Math.max(0, vitals.askingPrice - recommendedOffer),
  };
}
