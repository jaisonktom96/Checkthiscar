export type FuelType = 'Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'Hybrid';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type RepairCategory =
  | 'Engine'
  | 'Transmission'
  | 'Suspension'
  | 'AC/Electrical'
  | 'Body/Paint'
  | 'Brakes'
  | 'Interior';

export interface CarVitals {
  brand: string;
  model: string;
  year: number;
  variant: string;
  fuelType: FuelType;
  odometer: number;
  askingPrice: number;
  city: string;
}

export interface ServiceHistory {
  photos: string[];
  hasServiceBook: boolean;
  lastServiceKm: number;
  repairCategories: RepairCategory[];
  notes: string;
}

export interface KnownIssue {
  title: string;
  severity: RiskLevel;
  affectedYears: string;
  description: string;
  estimatedFixCost: string;
}

export interface UpcomingCost {
  item: string;
  dueSoonKm: number;
  estimatedCost: number;
  priority: 'URGENT' | 'SOON' | 'UPCOMING';
}

export interface FeatureRow {
  name: string;
  usedHas: boolean;
  newBaseHas: boolean;
}

export interface FeatureComparison {
  usedCarLabel: string;
  newBaseLabel: string;
  newBasePrice: number;
  features: FeatureRow[];
}

export interface AnalysisResult {
  overallScore: number;
  riskLevel: RiskLevel;
  fairMarketPrice: number;
  recommendedOffer: number;
  priceVerdict: 'GOOD_DEAL' | 'FAIR' | 'OVERPRICED';
  batchIssues: KnownIssue[];
  sellerQuestions: string[];
  upcomingCosts: UpcomingCost[];
  serviceGaps: string[];
  warrantyStatus: 'ACTIVE' | 'EXPIRED' | 'UNKNOWN';
  newBaseComparison: FeatureComparison;
  totalUpcomingCost: number;
  negotiationSaving: number;
}
