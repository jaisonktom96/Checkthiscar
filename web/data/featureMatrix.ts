import type { FeatureComparison } from '../types/car';

const NEW_BASE_PRICES: Record<string, number> = {
  Swift: 690000,
  Baleno: 680000,
  Brezza: 840000,
  Dzire: 700000,
  WagonR: 640000,
  Ertiga: 870000,
  'Grand Vitara': 1090000,
  Jimny: 1270000,
  i20: 720000,
  'Grand i10 Nios': 590000,
  Creta: 1100000,
  Venue: 760000,
  Verna: 1080000,
  Alcazar: 1400000,
  Nexon: 790000,
  Punch: 620000,
  Altroz: 730000,
  Harrier: 1490000,
  Safari: 1580000,
  Tiago: 550000,
  City: 1170000,
  Amaze: 750000,
  Elevate: 1130000,
  Taigun: 1120000,
  Virtus: 1100000,
  Kushaq: 1120000,
  Slavia: 1100000,
  Seltos: 1080000,
  Sonet: 790000,
  Carens: 1060000,
  Hector: 1390000,
  Astor: 1090000,
  'Scorpio N': 1350000,
  'Scorpio Classic': 950000,
  XUV700: 1400000,
  Thar: 1700000,
  'Innova Crysta': 1900000,
  'Urban Cruiser Hyryder': 1100000,
  Fortuner: 3300000,
  Kwid: 490000,
  Triber: 680000,
  Kiger: 680000,
};

function isHighTrimVariant(variant: string): boolean {
  const topKeywords = [
    'ZXi+', 'Alpha', 'Asta', 'SX(O)', 'GTX+', 'Prestige TSI', 'ZX CVT', 'ZX',
    'Topline', 'AX7', 'Fearless+', 'Creative+', 'Savvy', 'Platinum', 'Luxury Plus',
    'GR Sport', 'Legender', 'Style DSG', 'Z Strong Hybrid', 'L&K',
  ];
  return topKeywords.some((k) => variant.includes(k));
}

export function getFeatureComparison(
  brand: string,
  model: string,
  variant: string
): FeatureComparison {
  const newBasePrice = NEW_BASE_PRICES[model] ?? 1000000;
  const isHigh = isHighTrimVariant(variant);

  return {
    usedCarLabel: `${brand} ${model} ${variant}`,
    newBaseLabel: `2025 ${brand} ${model} (Base)`,
    newBasePrice,
    features: [
      { name: 'Panoramic sunroof', usedHas: isHigh, newBaseHas: false },
      { name: '360° surround-view camera', usedHas: isHigh, newBaseHas: false },
      { name: 'Large touchscreen (10"+)', usedHas: true, newBaseHas: false },
      { name: 'Wireless CarPlay / Android Auto', usedHas: isHigh, newBaseHas: false },
      { name: 'Auto climate control (AC)', usedHas: isHigh, newBaseHas: false },
      { name: 'Alloy wheels', usedHas: true, newBaseHas: false },
      { name: 'LED headlamps', usedHas: true, newBaseHas: false },
      { name: 'ADAS / Safety suite', usedHas: isHigh, newBaseHas: false },
      { name: 'Manufacturer warranty', usedHas: false, newBaseHas: true },
      { name: 'Zero odometer', usedHas: false, newBaseHas: true },
      { name: 'No hidden wear / history', usedHas: false, newBaseHas: true },
    ],
  };
}
