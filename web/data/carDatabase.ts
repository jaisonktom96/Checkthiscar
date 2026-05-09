import type { FuelType } from '../types/car';

export const BRANDS = [
  'Maruti Suzuki',
  'Hyundai',
  'Tata',
  'Honda',
  'Toyota',
  'Volkswagen',
  'Skoda',
  'Kia',
  'MG',
  'Mahindra',
  'Renault',
];

export const MODELS_BY_BRAND: Record<string, string[]> = {
  'Maruti Suzuki': ['Swift', 'Baleno', 'Brezza', 'Dzire', 'WagonR', 'Ertiga', 'Grand Vitara', 'Jimny'],
  'Hyundai': ['i20', 'Grand i10 Nios', 'Creta', 'Venue', 'Verna', 'Alcazar', 'Exter'],
  'Tata': ['Nexon', 'Punch', 'Altroz', 'Harrier', 'Safari', 'Tiago', 'Tigor', 'Nexon EV'],
  'Honda': ['City', 'Amaze', 'Elevate', 'WR-V'],
  'Toyota': ['Innova Crysta', 'Innova HyCross', 'Urban Cruiser Hyryder', 'Glanza', 'Fortuner'],
  'Volkswagen': ['Taigun', 'Virtus', 'Polo', 'Vento'],
  'Skoda': ['Kushaq', 'Slavia', 'Octavia', 'Superb'],
  'Kia': ['Seltos', 'Sonet', 'Carens'],
  'MG': ['Hector', 'Astor', 'Gloster', 'ZS EV'],
  'Mahindra': ['Scorpio N', 'Scorpio Classic', 'XUV700', 'XUV300', 'Thar', 'Bolero'],
  'Renault': ['Kwid', 'Triber', 'Kiger'],
};

export const VARIANTS_BY_MODEL: Record<string, string[]> = {
  'Swift': ['LXi', 'VXi', 'VXi AMT', 'ZXi', 'ZXi AMT', 'ZXi+', 'ZXi+ AMT'],
  'Baleno': ['Sigma', 'Delta', 'Zeta', 'Alpha', 'Alpha Turbo'],
  'Brezza': ['LXi', 'VXi', 'ZXi', 'ZXi+', 'ZXi+ Dual Tone', 'ZXi+ AT'],
  'Dzire': ['LXi', 'VXi', 'ZXi', 'ZXi+', 'ZXi+ AMT'],
  'WagonR': ['LXi', 'VXi', 'VXi+', 'ZXi', 'ZXi+'],
  'Ertiga': ['VXi', 'ZXi', 'ZXi+', 'ZXi AT', 'ZXi+ AT'],
  'Grand Vitara': ['Sigma', 'Delta', 'Zeta', 'Alpha', 'Alpha Strong Hybrid'],
  'Jimny': ['Zeta', 'Alpha', 'Alpha Dual Tone'],
  'i20': ['Era', 'Magna', 'Sportz', 'Sportz Turbo', 'Asta', 'Asta (O)', 'Asta Turbo DCT'],
  'Grand i10 Nios': ['Era', 'Magna', 'Sportz', 'Asta', 'Asta (O)'],
  'Creta': ['E', 'EX', 'S', 'S(O)', 'SX', 'SX(O)', 'SX Tech', 'SX(O) Turbo'],
  'Venue': ['E', 'S', 'S+', 'SX', 'SX+', 'SX(O)', 'N Line'],
  'Verna': ['EX', 'S', 'SX', 'SX(O)', 'SX Tech'],
  'Alcazar': ['Prestige', 'Prestige (O)', 'Platinum', 'Platinum (O)'],
  'Exter': ['EX', 'S', 'SX', 'SX(O)', 'SX+ Knight'],
  'Nexon': ['Smart', 'Smart+', 'Pure', 'Creative', 'Fearless', 'Fearless+'],
  'Punch': ['Pure', 'Adventure', 'Accomplished', 'Creative', 'Creative+'],
  'Altroz': ['XE', 'XM', 'XM+', 'XZ', 'XZ+', 'XZ+ Turbo'],
  'Harrier': ['Smart', 'Pure', 'Adventure', 'Fearless', 'Fearless+'],
  'Safari': ['Smart', 'Pure', 'Adventure', 'Accomplished', 'Fearless', 'Fearless+'],
  'Tiago': ['XE', 'XM', 'XT', 'XZ', 'XZ+'],
  'Nexon EV': ['MR', 'MR +', 'LR', 'LR Fearless', 'LR Fearless+'],
  'City': ['SV', 'V', 'VX', 'ZX', 'V CVT', 'VX CVT', 'ZX CVT'],
  'Amaze': ['E', 'S', 'V', 'VX', 'S CVT', 'V CVT'],
  'Elevate': ['S', 'SV', 'V', 'VX', 'ZX', 'ZX CVT'],
  'WR-V': ['S', 'SV', 'VX'],
  'Innova Crysta': ['GX 7-STR', 'GX 8-STR', 'VX 7-STR', 'VX 8-STR', 'ZX'],
  'Innova HyCross': ['G', 'GX', 'VX', 'ZX', 'ZX(O)'],
  'Urban Cruiser Hyryder': ['S', 'G', 'V', 'Z', 'Z Strong Hybrid'],
  'Glanza': ['E', 'S', 'G', 'V'],
  'Fortuner': ['4×2 MT', '4×2 AT', '4×4 AT', 'Legender', 'GR Sport'],
  'Taigun': ['Trendline', 'Comfortline', 'Highline', 'Topline'],
  'Virtus': ['Dynamic', 'Comfortline', 'Highline', 'Topline'],
  'Polo': ['Trendline', 'Comfortline', 'Highline', 'GTI'],
  'Vento': ['Trendline', 'Comfortline', 'Highline'],
  'Kushaq': ['Active', 'Ambition', 'Style', 'Style DSG'],
  'Slavia': ['Active', 'Ambition', 'Style', 'Style DSG', 'Prestige TSI DSG'],
  'Octavia': ['Style', 'Style Plus'],
  'Superb': ['L&K'],
  'Seltos': ['HTE', 'HTK', 'HTK+', 'HTX', 'HTX+', 'GTX', 'GTX+'],
  'Sonet': ['HTE', 'HTK', 'HTK+', 'HTX', 'HTX+', 'GTX+'],
  'Carens': ['Premium', 'Prestige', 'Prestige Plus', 'Luxury', 'Luxury Plus'],
  'Hector': ['Style', 'Super', 'Sharp', 'Savvy'],
  'Astor': ['Style', 'Super', 'Smart', 'Sharp', 'Savvy'],
  'Gloster': ['Super', 'Sharp', 'Savvy'],
  'ZS EV': ['Excite', 'Exclusive'],
  'Scorpio N': ['Z2', 'Z4', 'Z6', 'Z8', 'Z8 L'],
  'Scorpio Classic': ['S', 'S5', 'S7', 'S11'],
  'XUV700': ['MX', 'AX3', 'AX5', 'AX7', 'AX7 L'],
  'XUV300': ['W4', 'W6', 'W8', 'W8 (O)'],
  'Thar': ['AX (O) 4×4', 'LX 4×4', 'LX 4×4 Hard Top', 'LX 4×4 AT'],
  'Bolero': ['B4', 'B6', 'B6 (O)'],
  'Kwid': ['STD', 'RXE', 'RXL', 'RXT', 'RXT (O)', 'Climber'],
  'Triber': ['RXE', 'RXL', 'RXZ'],
  'Kiger': ['RXE', 'RXL', 'RXT', 'RXZ', 'RXZ Turbo'],
};

export const FUEL_TYPES_BY_MODEL: Record<string, FuelType[]> = {
  'Swift': ['Petrol', 'CNG'],
  'WagonR': ['Petrol', 'CNG'],
  'Ertiga': ['Petrol', 'CNG'],
  'Creta': ['Petrol', 'Diesel'],
  'Verna': ['Petrol', 'Diesel'],
  'Nexon': ['Petrol', 'Diesel'],
  'Harrier': ['Diesel'],
  'Safari': ['Diesel'],
  'Scorpio N': ['Petrol', 'Diesel'],
  'XUV700': ['Petrol', 'Diesel'],
  'Nexon EV': ['Electric'],
  'ZS EV': ['Electric'],
  'Grand Vitara': ['Petrol', 'Hybrid'],
  'Urban Cruiser Hyryder': ['Petrol', 'Hybrid'],
  'Innova HyCross': ['Petrol', 'Hybrid'],
};

export const YEARS = Array.from({ length: 12 }, (_, i) => 2024 - i);

export function getModels(brand: string): string[] {
  return MODELS_BY_BRAND[brand] ?? [];
}

export function getVariants(model: string): string[] {
  return VARIANTS_BY_MODEL[model] ?? ['Base', 'Mid', 'Top', 'Premium'];
}

export function getFuelTypes(model: string): FuelType[] {
  return FUEL_TYPES_BY_MODEL[model] ?? ['Petrol', 'Diesel'];
}
