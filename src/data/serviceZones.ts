import { ServiceZone, Vendor } from '../types';

export interface ServiceZoneInfo {
  id: string;
  name: ServiceZone;
  description: string;
  popularSettings: string[];
  nearbyZones: ServiceZone[];
}

export const SERVICE_ZONES: ServiceZoneInfo[] = [
  {
    id: 'adelaide-cbd-north-adelaide',
    name: 'Adelaide CBD & North Adelaide',
    description:
      'Central city and parkland precincts suited to formal banquets, multi-faith ceremonies, and intimate family gatherings.',
    popularSettings: [
      'Heritage sandstone halls',
      'Rooftop ballrooms',
      'Botanic garden pavilions',
    ],
    nearbyZones: [
      'Eastern suburbs',
      'Western suburbs',
      'Southern suburbs',
      'Northern suburbs',
      'Glenelg & the coast',
      'Adelaide Hills',
    ],
  },
  {
    id: 'eastern-suburbs',
    name: 'Eastern suburbs',
    description:
      'Tree-lined inner-east and foothill neighbourhoods popular for garden receptions, milestone dinners, and family banquets.',
    popularSettings: [
      'Heritage stone villas',
      'Leafy garden courtyards',
      'Foothill function rooms',
    ],
    nearbyZones: [
      'Adelaide CBD & North Adelaide',
      'Adelaide Hills',
      'Northern suburbs',
      'Southern suburbs',
      'Western suburbs',
    ],
  },
  {
    id: 'western-suburbs',
    name: 'Western suburbs',
    description:
      'Multicultural inner-west and riverside corridors well equipped for large community feasts, dancing, and high-capacity receptions.',
    popularSettings: [
      'Community reception halls',
      'Waterfront pavilions',
      'Warehouse event spaces',
    ],
    nearbyZones: [
      'Adelaide CBD & North Adelaide',
      'Glenelg & the coast',
      'Northern suburbs',
      'Southern suburbs',
      'Eastern suburbs',
    ],
  },
  {
    id: 'northern-suburbs',
    name: 'Northern suburbs',
    description:
      'Spacious suburban and lakeside precincts designed for multi-generational milestones, cultural festivals, and generous family feasts.',
    popularSettings: [
      'Large banquet halls',
      'Lakeside lawns & marquees',
      'Community cultural centres',
    ],
    nearbyZones: [
      'Eastern suburbs',
      'Adelaide CBD & North Adelaide',
      'Western suburbs',
      'Barossa Valley',
      'Adelaide Hills',
    ],
  },
  {
    id: 'southern-suburbs',
    name: 'Southern suburbs',
    description:
      'Inner-south and suburban garden precincts ideal for intimate family milestones, bridal lunches, and neighbourhood celebrations.',
    popularSettings: [
      'Boutique garden estates',
      'Suburban civic halls',
      'Courtyard dining rooms',
    ],
    nearbyZones: [
      'Adelaide CBD & North Adelaide',
      'Glenelg & the coast',
      'Eastern suburbs',
      'McLaren Vale & Fleurieu Peninsula',
      'Adelaide Hills',
    ],
  },
  {
    id: 'adelaide-hills',
    name: 'Adelaide Hills',
    description:
      'Cool-climate woodland, orchard, and stone-hall settings suited to seasonal weddings, outdoor ceremonies, and micro-elopements.',
    popularSettings: [
      'Stone heritage halls',
      'Woodland & orchard gardens',
      'Cool-climate winery estates',
    ],
    nearbyZones: [
      'Eastern suburbs',
      'Southern suburbs',
      'Adelaide CBD & North Adelaide',
      'McLaren Vale & Fleurieu Peninsula',
      'Barossa Valley',
    ],
  },
  {
    id: 'barossa-valley',
    name: 'Barossa Valley',
    description:
      'Historic wine-country estates and rural lawns tailored to long-table feasts, destination weddings, and weekend family celebrations.',
    popularSettings: [
      'Vineyard estates',
      'Barrel halls & stone cellars',
      'Country marquee lawns',
    ],
    nearbyZones: [
      'Northern suburbs',
      'Adelaide Hills',
      'Eastern suburbs',
      'Adelaide CBD & North Adelaide',
    ],
  },
  {
    id: 'mclaren-vale-fleurieu',
    name: 'McLaren Vale & Fleurieu Peninsula',
    description:
      'Rolling vineyards, olive groves, and coastal clifftops built for sunset proposals, outdoor long lunches, and weekend weddings.',
    popularSettings: [
      'Vineyard & olive-grove estates',
      'Coastal clifftop lookouts',
      'Rustic barn & marquee venues',
    ],
    nearbyZones: [
      'Southern suburbs',
      'Glenelg & the coast',
      'Adelaide Hills',
      'Adelaide CBD & North Adelaide',
    ],
  },
  {
    id: 'glenelg-coast',
    name: 'Glenelg & the coast',
    description:
      'Breezy seaside precincts suited to sunset ceremonies, beachfront receptions, engagements, and relaxed coastal milestones.',
    popularSettings: [
      'Beachfront pavilions',
      'Ocean-view hotel ballrooms',
      'Foreshore lawns & piers',
    ],
    nearbyZones: [
      'Western suburbs',
      'Southern suburbs',
      'Adelaide CBD & North Adelaide',
      'McLaren Vale & Fleurieu Peninsula',
    ],
  },
];

export const ALL_SERVICE_ZONES: ServiceZone[] = SERVICE_ZONES.map((z) => z.name);

export const METRO_SERVICE_ZONES: ServiceZone[] = [
  'Adelaide CBD & North Adelaide',
  'Eastern suburbs',
  'Western suburbs',
  'Northern suburbs',
  'Southern suburbs',
  'Glenelg & the coast',
];

export const MARKETPLACE_REGION_FILTERS: Array<'All Regions' | ServiceZone> = [
  'All Regions',
  ...ALL_SERVICE_ZONES,
];

const ID_TO_ZONE_MAP: Record<string, ServiceZoneInfo> = SERVICE_ZONES.reduce(
  (acc, zone) => {
    acc[zone.id] = zone;
    return acc;
  },
  {} as Record<string, ServiceZoneInfo>
);

const NAME_TO_ZONE_MAP: Record<string, ServiceZoneInfo> = SERVICE_ZONES.reduce(
  (acc, zone) => {
    acc[zone.name.toLowerCase()] = zone;
    return acc;
  },
  {} as Record<string, ServiceZoneInfo>
);

export function getZoneById(id: string | null | undefined): ServiceZoneInfo | null {
  if (!id) return null;
  const normalized = id.trim().toLowerCase();
  return ID_TO_ZONE_MAP[normalized] ?? null;
}

export function getZoneByName(name: string | null | undefined): ServiceZoneInfo | null {
  if (!name) return null;
  const normalized = name.trim().toLowerCase();
  return NAME_TO_ZONE_MAP[normalized] ?? null;
}

export function serviceZoneToSlug(zone: 'All Regions' | ServiceZone): string {
  if (zone === 'All Regions') return '';
  return getZoneByName(zone)?.id ?? '';
}

export function parseRegionParam(raw: string | null): 'All Regions' | ServiceZone {
  if (!raw) return 'All Regions';
  const normalized = raw.trim().toLowerCase();
  if (!normalized || normalized === 'all' || normalized === 'all-regions') {
    return 'All Regions';
  }
  const byId = ID_TO_ZONE_MAP[normalized];
  if (byId) return byId.name;
  const byName = NAME_TO_ZONE_MAP[normalized];
  if (byName) return byName.name;
  return 'All Regions';
}

export function vendorServesZone(vendor: Vendor, zone: ServiceZone): boolean {
  return vendor.serviceAreas.includes(zone);
}

export function countVendorsInZone(vendors: Vendor[], zone: ServiceZone): number {
  return vendors.filter((v) => v.serviceAreas.includes(zone)).length;
}
