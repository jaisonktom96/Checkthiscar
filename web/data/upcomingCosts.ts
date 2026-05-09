import type { UpcomingCost, FuelType } from '../types/car';

export function getUpcomingCosts(
  odometer: number,
  ageYears: number,
  fuelType: FuelType
): UpcomingCost[] {
  const costs: UpcomingCost[] = [];

  const nextMinorKm = Math.ceil(odometer / 10000) * 10000;
  if (nextMinorKm - odometer < 4000) {
    costs.push({
      item: `${nextMinorKm.toLocaleString('en-IN')} km minor service (oil + filter + fluids check)`,
      dueSoonKm: nextMinorKm - odometer,
      estimatedCost: fuelType === 'Diesel' ? 5500 : 4500,
      priority: nextMinorKm - odometer < 1500 ? 'URGENT' : 'SOON',
    });
  }

  const nextMajorKm = Math.ceil(odometer / 20000) * 20000;
  if (nextMajorKm - odometer < 7000) {
    costs.push({
      item: `${nextMajorKm.toLocaleString('en-IN')} km major service (full consumables + inspection)`,
      dueSoonKm: nextMajorKm - odometer,
      estimatedCost: fuelType === 'Diesel' ? 12000 : 8500,
      priority: nextMajorKm - odometer < 2500 ? 'URGENT' : 'SOON',
    });
  }

  if (odometer > 40000 && odometer < 70000) {
    costs.push({
      item: 'Tyre set inspection — replacement likely needed (4× MRF/Bridgestone)',
      dueSoonKm: Math.max(0, 60000 - odometer),
      estimatedCost: 18000,
      priority: odometer > 55000 ? 'URGENT' : 'SOON',
    });
  } else if (odometer >= 70000) {
    costs.push({
      item: 'Tyre set replacement overdue (4× MRF/Bridgestone)',
      dueSoonKm: 0,
      estimatedCost: 18000,
      priority: 'URGENT',
    });
  }

  if (ageYears >= 3) {
    costs.push({
      item: 'Car battery replacement (Amaron/Exide 35–45 Ah)',
      dueSoonKm: 0,
      estimatedCost: 5500,
      priority: ageYears >= 4 ? 'URGENT' : 'SOON',
    });
  }

  if (odometer > 40000) {
    costs.push({
      item: 'Front disc brake pads replacement',
      dueSoonKm: Math.max(0, 60000 - odometer),
      estimatedCost: 3500,
      priority: odometer > 55000 ? 'URGENT' : 'UPCOMING',
    });
  }

  if (fuelType === 'Petrol' && odometer > 40000) {
    costs.push({
      item: 'Iridium spark plugs set (4× plugs)',
      dueSoonKm: Math.max(0, 60000 - odometer),
      estimatedCost: 3800,
      priority: odometer > 55000 ? 'SOON' : 'UPCOMING',
    });
  }

  if (ageYears >= 4 || odometer > 60000) {
    costs.push({
      item: 'Engine coolant flush and refill',
      dueSoonKm: 0,
      estimatedCost: 1800,
      priority: 'UPCOMING',
    });
  }

  if (odometer > 30000) {
    costs.push({
      item: 'Air filter + cabin air filter replacement',
      dueSoonKm: Math.max(0, 40000 - odometer),
      estimatedCost: 1600,
      priority: odometer > 38000 ? 'SOON' : 'UPCOMING',
    });
  }

  const ORDER = { URGENT: 0, SOON: 1, UPCOMING: 2 };
  return costs.sort((a, b) => ORDER[a.priority] - ORDER[b.priority]);
}
