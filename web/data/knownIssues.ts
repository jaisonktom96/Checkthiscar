import type { KnownIssue } from '../types/car';

const ISSUES: Record<string, KnownIssue[]> = {
  'Hyundai_i20': [
    {
      title: 'DCT Dual-Clutch Judder',
      severity: 'HIGH',
      affectedYears: '2018–2021 (DCT variants)',
      description:
        'The dual-clutch gearbox shows lurching and hesitation below 30 km/h in stop-and-go traffic. Hyundai issued a TCU software update, but not all cars received it through dealers.',
      estimatedFixCost: '₹25,000–₹80,000 (clutch pack replacement)',
    },
    {
      title: 'Sunroof Rattle at Highway Speeds',
      severity: 'LOW',
      affectedYears: '2020–2023 (sunroof variants)',
      description:
        'Wind noise and a structural rattle come from the panoramic sunroof trim at speeds above 80 km/h. Dealer fix involves foam tape around the sunroof frame.',
      estimatedFixCost: '₹1,000–₹3,500 (dealer goodwill fix)',
    },
  ],
  'Hyundai_Creta': [
    {
      title: '1.6 CRDi Diesel Carbon Buildup',
      severity: 'HIGH',
      affectedYears: '2015–2019 (1.6 Diesel)',
      description:
        'Intake manifold and EGR valve accumulate carbon deposits, causing power loss and rough idle. Requires walnut-blasting service every 40,000–60,000 km.',
      estimatedFixCost: '₹8,000–₹15,000',
    },
    {
      title: 'Sunroof Track Corrosion',
      severity: 'MEDIUM',
      affectedYears: '2016–2020 (coastal cities)',
      description:
        'Sunroof track corrodes in high-humidity or coastal cities, causing the sunroof to stick or make grinding noises when opening.',
      estimatedFixCost: '₹5,000–₹18,000',
    },
    {
      title: 'Front Brake Disc Warping',
      severity: 'MEDIUM',
      affectedYears: '2015–2019',
      description:
        'Front discs warp after aggressive braking on hilly terrain. Steering wheel vibration under braking is the key symptom.',
      estimatedFixCost: '₹4,000–₹8,000 (resurfacing or replacement)',
    },
  ],
  'Hyundai_Venue': [
    {
      title: 'DCT Hesitation in Urban Traffic',
      severity: 'HIGH',
      affectedYears: '2019–2021 (DCT variant)',
      description:
        'The iMT and DCT variants show hesitation during slow urban driving. Hyundai extended the warranty on this clutch pack for affected batches.',
      estimatedFixCost: '₹20,000–₹60,000',
    },
  ],
  'Maruti_Suzuki_Swift': [
    {
      title: 'AMT Gear Hunt on Inclines',
      severity: 'MEDIUM',
      affectedYears: '2018–2022 (AMT variant)',
      description:
        'The Auto Gear Shift (AGS) unit hunts for gears and can roll back on uphill starts. Software updates in later 2022 batches largely address this.',
      estimatedFixCost: 'Free software update',
    },
    {
      title: 'AC Compressor Bearing Rattle',
      severity: 'LOW',
      affectedYears: '2018–2021',
      description:
        'AC compressor develops a rattling sound above 3,500 RPM in hot weather. Usually an AC belt tension issue or early compressor bearing wear.',
      estimatedFixCost: '₹2,000–₹8,000',
    },
  ],
  'Maruti_Suzuki_Brezza': [
    {
      title: 'Mild Hybrid Battery Degradation',
      severity: 'MEDIUM',
      affectedYears: '2022–2024 (Mild Hybrid)',
      description:
        "The 48V mild hybrid battery can degrade faster in extreme heat. Once degraded, the auto stop-start system stops functioning.",
      estimatedFixCost: '₹20,000–₹40,000 (battery pack replacement)',
    },
  ],
  'Tata_Nexon': [
    {
      title: 'Infotainment System Freeze',
      severity: 'MEDIUM',
      affectedYears: '2017–2020',
      description:
        'The HARMAN JBL infotainment unit hangs and requires a hard reset (disconnect battery). Tata has pushed OTA software updates but the issue persists in early units.',
      estimatedFixCost: '₹0–₹15,000 (software update to unit replacement)',
    },
    {
      title: 'Wind Noise from A-Pillar Seal',
      severity: 'LOW',
      affectedYears: '2017–2022',
      description:
        'Rubber seal around the A-pillar deteriorates after 3–4 years, causing noticeable wind noise at highway speeds.',
      estimatedFixCost: '₹500–₹2,000 (seal replacement)',
    },
  ],
  'Tata_Nexon_EV': [
    {
      title: 'Range Reduction under AC + City Load',
      severity: 'MEDIUM',
      affectedYears: '2020–2022 (MR variant)',
      description:
        'Real-world range of the Medium Range (30 kWh) battery drops 20–30% when AC is used heavily. The LR variant handles this better.',
      estimatedFixCost: 'N/A — operating characteristic of MR battery',
    },
  ],
  'Volkswagen_Taigun': [
    {
      title: 'DSG Shudder at Launch',
      severity: 'HIGH',
      affectedYears: '2021–2022 (DSG variant)',
      description:
        'The DQ200 7-speed dual-clutch shows a shudder and hesitation during initial launch from standstill. VW issued a technical service bulletin for TCU re-calibration.',
      estimatedFixCost: '₹0 (software TSB) to ₹40,000 (mechatronic unit)',
    },
    {
      title: '1.0 TSI Oil Consumption',
      severity: 'MEDIUM',
      affectedYears: '2021–2024',
      description:
        'The 3-cylinder TSI engine consumes more oil than expected between services (up to 0.5L per 5,000 km). Not a critical issue but requires vigilance.',
      estimatedFixCost: '₹500–₹1,000 per top-up',
    },
  ],
  'Skoda_Kushaq': [
    {
      title: 'DSG Shudder at Parking Speeds',
      severity: 'HIGH',
      affectedYears: '2021–2022 (DSG)',
      description:
        'Shares the same DQ200 dual-clutch platform as the VW Taigun. Shudder is most noticeable during parking manoeuvres and hill starts. Ask for TSB software update proof.',
      estimatedFixCost: '₹0 (software) to ₹40,000 (mechatronic replacement)',
    },
  ],
  'Skoda_Slavia': [
    {
      title: 'DSG Shudder at Parking Speeds',
      severity: 'HIGH',
      affectedYears: '2022–2023 (DSG)',
      description:
        'Same DQ200 dual-clutch issue affecting the full Skoda-VW India MQB-A0-IN platform. Most noticeable during slow reversing and hill starts.',
      estimatedFixCost: '₹0 (software) to ₹40,000 (mechatronic replacement)',
    },
    {
      title: 'Fuel Filler Panel Rattle',
      severity: 'LOW',
      affectedYears: '2022–2023',
      description:
        'The fuel filler cap area produces a tinny rattle on rough roads. A simple foam pad behind the panel is the authorised fix.',
      estimatedFixCost: '₹200–₹500',
    },
  ],
  'Kia_Seltos': [
    {
      title: '1.4T DCT Hesitation',
      severity: 'HIGH',
      affectedYears: '2019–2021 (1.4T DCT)',
      description:
        'The Gamma 1.4T paired with the 7-speed DCT shows hesitation and shudder during slow urban driving. Kia issued a TCU update for some batches but not universally.',
      estimatedFixCost: '₹0–₹50,000',
    },
    {
      title: 'Panoramic Sunroof Water Ingress',
      severity: 'MEDIUM',
      affectedYears: '2019–2022',
      description:
        'Sunroof drainage channels block after 2–3 years, causing water to seep into the cabin roof after heavy rain. Check the headliner for staining.',
      estimatedFixCost: '₹2,000–₹8,000 (cleaning + resealing)',
    },
  ],
  'Mahindra_XUV700': [
    {
      title: 'ADAS False Braking Alerts',
      severity: 'MEDIUM',
      affectedYears: '2021–2022',
      description:
        'Forward collision warning and autonomous emergency braking trigger false alerts on speed bumps, painted road markings, and overpass shadows.',
      estimatedFixCost: 'N/A — software updates help but do not fully resolve',
    },
    {
      title: 'AdrenoX Connected Car Dropouts',
      severity: 'LOW',
      affectedYears: '2021–2023',
      description:
        'Remote start, live location, and connected features drop connectivity frequently and require manual reconnection via the app.',
      estimatedFixCost: 'N/A — connectivity issue',
    },
  ],
  'Mahindra_Thar': [
    {
      title: 'High Road Noise at Highway Speeds',
      severity: 'MEDIUM',
      affectedYears: '2020–2024',
      description:
        "Stock off-road tyres generate significant road noise above 80 km/h. While a known characteristic, many urban buyers find it fatiguing on daily highway commutes.",
      estimatedFixCost: '₹20,000–₹30,000 (highway tyre swap) or N/A if expected',
    },
  ],
};

export function getKnownIssues(brand: string, model: string): KnownIssue[] {
  const key = `${brand.replace(/\s+/g, '_')}_${model.replace(/\s+/g, '_')}`;
  return (
    ISSUES[key] ?? [
      {
        title: 'Verify Open Recall Notices',
        severity: 'LOW',
        affectedYears: 'All years',
        description:
          'Search the manufacturer website or ask the dealer if there are any open Technical Service Bulletins (TSBs) or recalls for this specific vehicle and year.',
        estimatedFixCost: 'Usually free at authorised service centres',
      },
      {
        title: 'Pre-Purchase Third-Party Inspection',
        severity: 'LOW',
        affectedYears: 'All',
        description:
          'For this model, consider hiring an independent mechanic (₹800–₹1,500) for a comprehensive pre-purchase inspection before committing.',
        estimatedFixCost: '₹800–₹1,500 inspection fee',
      },
    ]
  );
}

export function getSellerQuestions(brand: string, model: string): string[] {
  const issues = getKnownIssues(brand, model);
  const questions: string[] = [];

  if (issues.some((i) => i.title.toLowerCase().includes('dct') || i.title.toLowerCase().includes('dsg'))) {
    questions.push(
      'Has the DCT/DSG software ever been updated at the service centre? Ask for the service receipt showing the TSB job number.'
    );
  }
  if (issues.some((i) => i.title.toLowerCase().includes('sunroof'))) {
    questions.push(
      'Has water ever leaked from the sunroof? Inspect the headliner above the driver seat for discolouration or sagging.'
    );
  }
  if (issues.some((i) => i.title.toLowerCase().includes('carbon') || i.title.toLowerCase().includes('diesel'))) {
    questions.push(
      'When was the last intake carbon cleaning done? Request the diesel-specific service history in full.'
    );
  }

  if (questions.length < 3) {
    questions.push('Can you share the last 3 workshop bills, including the most recent one?');
  }
  if (questions.length < 3) {
    questions.push(
      'Is the car still under manufacturer warranty? Has it been extended by the authorised dealer?'
    );
  }
  if (questions.length < 3) {
    questions.push(
      'Has the car been in any accidents, even minor? Check the chassis rail under the bonnet for any weld or repair marks.'
    );
  }

  return questions.slice(0, 3);
}
