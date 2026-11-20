import {
  getEssentialCategoriesForEvent,
  getOptionalCategoriesForEvent,
} from '../data/eventEssentialCategories';
import { PLANNER_EVENT_CONFIGS, PlannerCulturalTradition } from '../data/plannerConfigs';
import {
  ALL_SERVICE_ZONES,
  getZoneByName,
  METRO_SERVICE_ZONES,
  parseRegionParam,
  serviceZoneToSlug,
  vendorServesZone,
} from '../data/serviceZones';
import {
  CulturalTradition,
  EventTypeTag,
  MatchTier,
  ServiceZone,
  Vendor,
  VendorCategory,
} from '../types';

export const EVENT_SLUG_MAP: Record<EventTypeTag, string> = {
  Weddings: 'weddings',
  'Engagements & Proposals': 'engagements-and-proposals',
  Elopements: 'elopements',
  'Milestone Birthdays': 'milestone-birthdays',
  'Diwali & Festival of Lights': 'diwali-and-festival-of-lights',
  'Lunar New Year': 'lunar-new-year',
  Eid: 'eid',
  'Christenings & Baby Showers': 'christenings-and-baby-showers',
  Graduations: 'graduations',
  'Community Festivals': 'community-festivals',
  'Corporate Events': 'corporate-events',
};

const SLUG_TO_EVENT_MAP: Record<string, EventTypeTag> = Object.entries(EVENT_SLUG_MAP).reduce(
  (acc, [eventType, slug]) => {
    acc[slug] = eventType as EventTypeTag;
    return acc;
  },
  {} as Record<string, EventTypeTag>
);

export const ALL_CULTURAL_TRADITIONS: CulturalTradition[] = [
  'Filipino',
  'Greek',
  'Indian',
  'Chinese',
  'Italian',
  'Middle Eastern or Muslim',
  'Pacific Islander',
  'Vietnamese',
  'Korean',
];

export const MARKETPLACE_TRADITION_FILTERS: Array<'All Traditions' | CulturalTradition> = [
  'All Traditions',
  ...ALL_CULTURAL_TRADITIONS,
];

export const TRADITION_SLUG_MAP: Record<CulturalTradition, string> = {
  Filipino: 'filipino',
  Greek: 'greek',
  Indian: 'indian',
  Chinese: 'chinese',
  Italian: 'italian',
  'Middle Eastern or Muslim': 'middle-eastern',
  'Pacific Islander': 'pacific-islander',
  Vietnamese: 'vietnamese',
  Korean: 'korean',
};

const SLUG_TO_TRADITION_MAP: Record<string, CulturalTradition> = {
  filipino: 'Filipino',
  'filipino-australian-fusion': 'Filipino',
  greek: 'Greek',
  indian: 'Indian',
  chinese: 'Chinese',
  italian: 'Italian',
  'middle-eastern': 'Middle Eastern or Muslim',
  'middle-eastern-or-muslim': 'Middle Eastern or Muslim',
  'pacific-islander': 'Pacific Islander',
  vietnamese: 'Vietnamese',
  korean: 'Korean',
};

const PLANNER_TO_MARKETPLACE_TRADITION: Record<
  PlannerCulturalTradition,
  'All Traditions' | CulturalTradition
> = {
  None: 'All Traditions',
  'Filipino-Australian Fusion': 'Filipino',
  Greek: 'Greek',
  Indian: 'Indian',
  Chinese: 'Chinese',
  'Middle Eastern': 'Middle Eastern or Muslim',
  'Pacific Islander': 'Pacific Islander',
  Other: 'All Traditions',
};

const MARKETPLACE_TO_PLANNER_TRADITION: Partial<
  Record<'All Traditions' | CulturalTradition, PlannerCulturalTradition>
> = {
  'All Traditions': 'None',
  Filipino: 'Filipino-Australian Fusion',
  Greek: 'Greek',
  Indian: 'Indian',
  Chinese: 'Chinese',
  'Middle Eastern or Muslim': 'Middle Eastern',
  'Pacific Islander': 'Pacific Islander',
};

export const VENDOR_CATEGORY_SLUGS: Record<VendorCategory, string> = {
  Caterers: 'caterers',
  'Entertainment & DJs': 'entertainment-and-djs',
  'Venues & Marquees': 'venues-and-marquees',
  'Decor & Styling': 'decor-and-styling',
  'Proposal & Elopement': 'proposal-and-elopement',
  Photographers: 'photographers',
  Planners: 'planners',
  Florists: 'florists',
  'Makeup Artists': 'makeup-artists',
  'Cultural Specialists': 'cultural-specialists',
};

const SLUG_TO_CATEGORY_MAP: Record<string, VendorCategory> = Object.entries(
  VENDOR_CATEGORY_SLUGS
).reduce((acc, [category, slug]) => {
  acc[slug] = category as VendorCategory;
  return acc;
}, {} as Record<string, VendorCategory>);

export const MATCH_TIER_LABELS: Record<MatchTier, string> = {
  exact: 'Exact match',
  area: 'Serves your area',
  neutral: 'Experienced across traditions',
  closest: 'Closest match',
};

const TIER_SEVERITY: Record<MatchTier, number> = {
  exact: 0,
  area: 1,
  neutral: 2,
  closest: 3,
};

export function getEventSlug(eventType: 'All Events' | EventTypeTag): string {
  if (eventType === 'All Events') return '';
  return EVENT_SLUG_MAP[eventType];
}

export function parseEventParam(raw: string | null): 'All Events' | EventTypeTag {
  if (!raw) return 'All Events';
  const normalized = raw.trim().toLowerCase();
  if (!normalized || normalized === 'all' || normalized === 'all-events') {
    return 'All Events';
  }
  if (normalized in SLUG_TO_EVENT_MAP) {
    return SLUG_TO_EVENT_MAP[normalized];
  }
  const byExactLabel = (Object.keys(EVENT_SLUG_MAP) as EventTypeTag[]).find(
    (ev) => ev.toLowerCase() === normalized
  );
  return byExactLabel ?? 'All Events';
}

export function plannerTraditionToSlug(tradition: PlannerCulturalTradition): string {
  if (tradition === 'None') return '';
  if (tradition === 'Other') return 'other';
  const mpTradition = PLANNER_TO_MARKETPLACE_TRADITION[tradition];
  if (mpTradition === 'All Traditions') return '';
  return TRADITION_SLUG_MAP[mpTradition];
}

export function plannerTraditionToMarketplace(
  tradition: PlannerCulturalTradition
): 'All Traditions' | CulturalTradition {
  return PLANNER_TO_MARKETPLACE_TRADITION[tradition] ?? 'All Traditions';
}

export function marketplaceTraditionToSlug(
  tradition: 'All Traditions' | CulturalTradition
): string {
  if (tradition === 'All Traditions') return '';
  return TRADITION_SLUG_MAP[tradition];
}

export function marketplaceTraditionToPlanner(
  tradition: 'All Traditions' | CulturalTradition
): PlannerCulturalTradition {
  return MARKETPLACE_TO_PLANNER_TRADITION[tradition] ?? 'None';
}

export function parseTraditionParam(
  raw: string | null
): 'All Traditions' | CulturalTradition {
  if (!raw) return 'All Traditions';
  const normalized = raw.trim().toLowerCase();
  if (!normalized || normalized === 'none' || normalized === 'all' || normalized === 'all-traditions') {
    return 'All Traditions';
  }
  if (normalized in SLUG_TO_TRADITION_MAP) {
    return SLUG_TO_TRADITION_MAP[normalized];
  }
  const byExactLabel = MARKETPLACE_TRADITION_FILTERS.find(
    (tr) => tr !== 'All Traditions' && tr.toLowerCase() === normalized
  );
  return byExactLabel ?? 'All Traditions';
}

export function parsePlannerTraditionParam(raw: string | null): PlannerCulturalTradition {
  if (!raw) return 'None';
  const normalized = raw.trim().toLowerCase();
  if (normalized === 'other') return 'Other';
  const mpTradition = parseTraditionParam(raw);
  return marketplaceTraditionToPlanner(mpTradition);
}

const CATEGORY_ALIAS_MAP: Record<string, VendorCategory> = {
  photographer: 'Photographers',
  caterer: 'Caterers',
  venue: 'Venues & Marquees',
  venues: 'Venues & Marquees',
  marquee: 'Venues & Marquees',
  celebrant: 'Cultural Specialists',
  'cultural-specialist': 'Cultural Specialists',
  florist: 'Florists',
  decor: 'Decor & Styling',
  styling: 'Decor & Styling',
  makeup: 'Makeup Artists',
  'makeup-artist': 'Makeup Artists',
  dj: 'Entertainment & DJs',
  entertainment: 'Entertainment & DJs',
  planner: 'Planners',
  proposal: 'Proposal & Elopement',
  'proposal-specialist': 'Proposal & Elopement',
};

export function parseCategoryParam(raw: string | null): 'All' | VendorCategory {
  if (!raw) return 'All';
  const normalized = raw.trim().toLowerCase();
  if (!normalized || normalized === 'all') return 'All';
  if (normalized in SLUG_TO_CATEGORY_MAP) {
    return SLUG_TO_CATEGORY_MAP[normalized];
  }
  if (normalized in CATEGORY_ALIAS_MAP) {
    return CATEGORY_ALIAS_MAP[normalized];
  }
  const byExactLabel = (Object.keys(VENDOR_CATEGORY_SLUGS) as VendorCategory[]).find(
    (cat) => cat.toLowerCase() === normalized
  );
  return byExactLabel ?? 'All';
}

export function parsePositiveIntParam(
  raw: string | null,
  min: number,
  max: number
): number | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!/^\d+(\.\d+)?$/.test(trimmed)) return null;
  const num = Math.round(Number(trimmed));
  if (!Number.isFinite(num) || num < min || num > max) return null;
  return num;
}

export interface PlanQueryInput {
  event: EventTypeTag;
  traditionSlug: string;
  budget: number;
  guests: number;
  region?: 'All Regions' | ServiceZone;
}

export function buildPlanQueryString(input: PlanQueryInput): string {
  const params = new URLSearchParams();
  params.set('event', getEventSlug(input.event));
  if (input.traditionSlug && input.traditionSlug.trim() !== '') {
    params.set('tradition', input.traditionSlug);
  }
  if (input.region && input.region !== 'All Regions') {
    const regionSlug = serviceZoneToSlug(input.region);
    if (regionSlug) {
      params.set('region', regionSlug);
    }
  }
  params.set('budget', String(Math.round(input.budget)));
  params.set('guests', String(Math.round(input.guests)));
  params.set('mode', 'plan');
  return `?${params.toString()}`;
}

export type MarketplaceMatchMode = 'plan' | 'strict';

export interface MarketplaceUrlState {
  eventType: 'All Events' | EventTypeTag;
  tradition: 'All Traditions' | CulturalTradition;
  region: 'All Regions' | ServiceZone;
  budget: number | null;
  guests: number | null;
  category: 'All' | VendorCategory;
  searchQuery: string;
  matchMode: MarketplaceMatchMode;
  isPlanEntry: boolean;
}

export function parseMarketplaceUrlParams(search: string): MarketplaceUrlState {
  try {
    const params = new URLSearchParams(search);
    const eventType = parseEventParam(params.get('event') ?? params.get('eventType'));
    const tradition = parseTraditionParam(params.get('tradition'));
    const region = parseRegionParam(params.get('region'));
    const budget = parsePositiveIntParam(params.get('budget'), 500, 1000000);
    const guests = parsePositiveIntParam(params.get('guests'), 1, 10000);
    const category = parseCategoryParam(params.get('category'));
    const rawQuery = params.get('q') ?? '';
    const searchQuery = rawQuery.trim().slice(0, 120);
    const rawMode = (params.get('mode') ?? '').trim().toLowerCase();

    const hasPlanParams =
      rawMode === 'plan' ||
      eventType !== 'All Events' ||
      budget !== null ||
      guests !== null;

    const matchMode: MarketplaceMatchMode =
      rawMode === 'strict' ? 'strict' : hasPlanParams ? 'plan' : 'strict';

    return {
      eventType,
      tradition,
      region,
      budget,
      guests,
      category,
      searchQuery,
      matchMode,
      isPlanEntry: rawMode === 'plan' || (budget !== null && guests !== null),
    };
  } catch {
    return {
      eventType: 'All Events',
      tradition: 'All Traditions',
      region: 'All Regions',
      budget: null,
      guests: null,
      category: 'All',
      searchQuery: '',
      matchMode: 'strict',
      isPlanEntry: false,
    };
  }
}

export function buildMarketplaceUrlQuery(
  state: Omit<MarketplaceUrlState, 'isPlanEntry' | 'matchMode'> & {
    matchMode?: MarketplaceMatchMode;
  }
): string {
  const params = new URLSearchParams();

  if (state.eventType !== 'All Events') {
    params.set('event', getEventSlug(state.eventType));
  }

  if (state.tradition !== 'All Traditions') {
    params.set('tradition', marketplaceTraditionToSlug(state.tradition));
  }

  if (state.region !== 'All Regions') {
    const regionSlug = serviceZoneToSlug(state.region);
    if (regionSlug) {
      params.set('region', regionSlug);
    }
  }

  if (state.budget !== null) {
    params.set('budget', String(Math.round(state.budget)));
  }

  if (state.guests !== null) {
    params.set('guests', String(Math.round(state.guests)));
  }

  if (state.category !== 'All') {
    params.set('category', VENDOR_CATEGORY_SLUGS[state.category]);
  }

  const trimmedQ = state.searchQuery.trim();
  if (trimmedQ) {
    params.set('q', trimmedQ);
  }

  const hasFilters =
    state.eventType !== 'All Events' ||
    state.tradition !== 'All Traditions' ||
    state.region !== 'All Regions' ||
    state.budget !== null ||
    state.guests !== null;

  if (hasFilters && state.matchMode === 'plan') {
    params.set('mode', 'plan');
  } else if (hasFilters && state.matchMode === 'strict') {
    params.set('mode', 'strict');
  }

  const str = params.toString();
  return str ? `?${str}` : '';
}

export function estimateVendorCostForPlan(startingPrice: string, guests: number): number {
  const numericMatch = startingPrice.replace(/,/g, '').match(/(\d+(?:\.\d+)?)/);
  const basePrice = numericMatch ? Number(numericMatch[1]) : 0;
  if (!Number.isFinite(basePrice) || basePrice <= 0) return 0;

  if (startingPrice.toLowerCase().includes('/ guest')) {
    return Math.round(basePrice * Math.max(1, guests));
  }
  return Math.round(basePrice);
}

export function getCategoryAllocationPct(
  eventType: 'All Events' | EventTypeTag,
  category: VendorCategory
): number {
  const effectiveEvent: EventTypeTag = eventType === 'All Events' ? 'Weddings' : eventType;
  const allocations = PLANNER_EVENT_CONFIGS[effectiveEvent].allocations;
  const findPct = (key: string): number | undefined =>
    allocations.find((item) => item.key === key)?.pct;

  switch (category) {
    case 'Venues & Marquees':
      return findPct('venue') ?? findPct('decor') ?? 0.24;
    case 'Caterers':
      return findPct('catering') ?? 0.34;
    case 'Photographers':
      return findPct('photo') ?? 0.12;
    case 'Florists':
      return findPct('floral') ?? findPct('decor') ?? findPct('styling') ?? 0.12;
    case 'Decor & Styling':
      return findPct('decor') ?? findPct('floral') ?? findPct('styling') ?? 0.12;
    case 'Entertainment & DJs':
      return findPct('entertainment') ?? findPct('av') ?? 0.10;
    case 'Cultural Specialists':
      return Math.max(findPct('entertainment') ?? 0, findPct('decor') ?? 0, 0.10);
    case 'Makeup Artists':
      return findPct('styling') ?? 0.08;
    case 'Planners':
      return findPct('logistics') ?? 0.12;
    case 'Proposal & Elopement':
      return Math.max(findPct('venue') ?? 0, findPct('decor') ?? 0, 0.25);
    default:
      return 0.12;
  }
}

export function isStateWideVendor(vendor: Vendor): boolean {
  return vendor.serviceAreas.length >= ALL_SERVICE_ZONES.length;
}

export function isMetroOrStateWideVendor(vendor: Vendor): boolean {
  if (isStateWideVendor(vendor)) return true;
  return METRO_SERVICE_ZONES.every((zone) => vendor.serviceAreas.includes(zone));
}

export function isTraditionNeutralVendor(vendor: Vendor): boolean {
  return (
    Boolean(vendor.traditionNeutral) ||
    vendor.traditions.length === 0 ||
    vendor.traditions.length >= ALL_CULTURAL_TRADITIONS.length
  );
}

export interface TierVendorCounts {
  exact: number;
  area: number;
  neutral: number;
  closest: number;
}

export interface MatchedVendorItem {
  vendor: Vendor;
  matchTier: MatchTier;
  matchLabel: string;
  isEssential: boolean;
  matchedTagCount: number;
  withinBudget: boolean;
  estimatedCost: number;
  categoryBudgetLimit: number;
  matchedZone: ServiceZone | null;
}

export interface CategoryTierEvaluation {
  category: VendorCategory;
  tierCounts: TierVendorCounts;
  winningTier: MatchTier | null;
  candidates: MatchedVendorItem[];
}

export interface EssentialCategoryGroup {
  category: VendorCategory;
  tier: MatchTier | null;
  tierLabel: string | null;
  vendors: MatchedVendorItem[];
  emptyMessage: string | null;
  tierCounts: TierVendorCounts;
}

export interface RelaxedCategoryNote {
  category: VendorCategory;
  tier: MatchTier;
  label: string;
}

export interface MatchVendorsInput {
  vendors: Vendor[];
  eventType: 'All Events' | EventTypeTag;
  tradition: 'All Traditions' | CulturalTradition;
  traditions?: CulturalTradition[];
  region?: 'All Regions' | ServiceZone;
  budget: number | null;
  guests: number | null;
  category?: 'All' | VendorCategory;
  searchQuery?: string;
  translatedDescriptions?: Record<string, string>;
  matchMode?: MarketplaceMatchMode;
  maxPerEssentialCategory?: number;
  preferredKeywords?: string[];
}

export interface MatchVendorsResult {
  vendors: Vendor[];
  matchedItems: MatchedVendorItem[];
  essentialGroups: EssentialCategoryGroup[];
  essentialVendors: MatchedVendorItem[];
  addOnVendors: MatchedVendorItem[];
  essentialServiceCount: number;
  relaxedEssentialNotes: RelaxedCategoryNote[];
  categoryCounts: Record<string, number>;
  matchTierMap: Record<string, MatchTier>;
  matchLabelMap: Record<string, string>;
  overallMatchTier: MatchTier;
  withinBudgetMap: Record<string, boolean>;
  withinBudgetCount: number;
  estimatedCostMap: Record<string, number>;
  categoryLimitMap: Record<string, number>;
  relaxedBudget: boolean;
  relaxedTradition: boolean;
  relaxedRegion: boolean;
  relaxationMessage: string | null;
  isPlanModeActive: boolean;
}

function getZoneProximityScore(
  vendor: Vendor,
  region: 'All Regions' | ServiceZone
): { priority: number; matchedZone: ServiceZone | null } {
  if (region === 'All Regions') {
    return {
      priority: isStateWideVendor(vendor) ? 2 : 1,
      matchedZone: vendor.serviceAreas[0] ?? null,
    };
  }

  if (vendorServesZone(vendor, region)) {
    return { priority: 30, matchedZone: region };
  }

  if (isStateWideVendor(vendor)) {
    return { priority: 22, matchedZone: region };
  }

  if (isMetroOrStateWideVendor(vendor)) {
    return { priority: 18, matchedZone: vendor.serviceAreas[0] ?? null };
  }

  const nearbyZones = getZoneByName(region)?.nearbyZones ?? [];
  const nearestIdx = nearbyZones.findIndex((nz) => vendor.serviceAreas.includes(nz));
  if (nearestIdx >= 0) {
    return {
      priority: Math.max(2, 14 - nearestIdx * 2),
      matchedZone: nearbyZones[nearestIdx],
    };
  }

  return { priority: 0, matchedZone: vendor.serviceAreas[0] ?? null };
}

function buildSearchMatcher(
  searchQuery: string,
  translatedDescriptions?: Record<string, string>
): (vendor: Vendor) => boolean {
  const q = searchQuery.toLowerCase().trim();
  if (!q) return () => true;

  return (vendor: Vendor): boolean => {
    const translatedDesc = (translatedDescriptions?.[vendor.id] ?? '').toLowerCase();
    return (
      vendor.name.toLowerCase().includes(q) ||
      vendor.businessName.toLowerCase().includes(q) ||
      vendor.location.toLowerCase().includes(q) ||
      vendor.serviceAreas.some((area) => area.toLowerCase().includes(q)) ||
      vendor.description.toLowerCase().includes(q) ||
      translatedDesc.includes(q) ||
      vendor.features.some((feat) => feat.toLowerCase().includes(q)) ||
      vendor.culturalSpecialties.some((spec) => spec.toLowerCase().includes(q)) ||
      vendor.eventTypes.some((et) => et.toLowerCase().includes(q))
    );
  };
}

function resolveTargetTraditions(
  tradition: 'All Traditions' | CulturalTradition,
  traditions?: CulturalTradition[]
): CulturalTradition[] {
  if (traditions !== undefined) {
    return traditions;
  }
  return tradition === 'All Traditions' ? [] : [tradition];
}

function computeBudgetFit(
  vendor: Vendor,
  eventType: 'All Events' | EventTypeTag,
  budget: number | null,
  guests: number | null
): { withinBudget: boolean; estimatedCost: number; categoryBudgetLimit: number } {
  const effectiveGuests = guests !== null && guests > 0 ? guests : 60;
  const estimatedCost = estimateVendorCostForPlan(vendor.startingPrice, effectiveGuests);
  if (budget === null || budget <= 0) {
    return { withinBudget: false, estimatedCost, categoryBudgetLimit: 0 };
  }
  const sharePct = getCategoryAllocationPct(eventType, vendor.category);
  const categoryBudgetLimit = Math.round(budget * sharePct);
  const withinBudget = estimatedCost > 0 && estimatedCost <= categoryBudgetLimit;
  return { withinBudget, estimatedCost, categoryBudgetLimit };
}

function countMatchingTags(
  vendor: Vendor,
  eventType: 'All Events' | EventTypeTag,
  targetTraditions: CulturalTradition[],
  region: 'All Regions' | ServiceZone,
  preferredKeywords: string[]
): number {
  let tags = 0;

  if (eventType !== 'All Events' && vendor.eventTypes.includes(eventType)) {
    tags += 1;
  }

  for (const tr of targetTraditions) {
    if (vendor.traditions.includes(tr)) {
      tags += 1;
    }
  }

  if (region !== 'All Regions' && vendorServesZone(vendor, region)) {
    tags += 1;
  }

  if (preferredKeywords.length > 0) {
    const searchable = [
      vendor.businessName,
      vendor.description,
      ...vendor.culturalSpecialties,
      ...vendor.features,
    ]
      .join(' ')
      .toLowerCase();

    for (const kw of preferredKeywords) {
      if (kw && searchable.includes(kw.toLowerCase())) {
        tags += 1;
      }
    }
  }

  return tags;
}

export function evaluateCategoryTiers(params: {
  vendors: Vendor[];
  category: VendorCategory;
  eventType: 'All Events' | EventTypeTag;
  tradition: 'All Traditions' | CulturalTradition;
  traditions?: CulturalTradition[];
  region: 'All Regions' | ServiceZone;
  budget: number | null;
  guests: number | null;
  isEssential: boolean;
  searchQuery?: string;
  translatedDescriptions?: Record<string, string>;
  preferredKeywords?: string[];
}): CategoryTierEvaluation {
  const {
    vendors,
    category,
    eventType,
    tradition,
    traditions,
    region,
    budget,
    guests,
    isEssential,
    searchQuery = '',
    translatedDescriptions,
    preferredKeywords = [],
  } = params;

  const targetTraditions = resolveTargetTraditions(tradition, traditions);
  const matchesSearch = buildSearchMatcher(searchQuery, translatedDescriptions);
  const catVendors = vendors.filter((v) => v.category === category && matchesSearch(v));

  const matchesEvent = (v: Vendor): boolean =>
    eventType === 'All Events' || v.eventTypes.includes(eventType);

  const matchesTraditionStrict = (v: Vendor): boolean => {
    if (targetTraditions.length === 0) return true;
    if (targetTraditions.length === 1) return v.traditions.includes(targetTraditions[0]);
    return targetTraditions.every((tr) => v.traditions.includes(tr));
  };

  const matchesTraditionPartial = (v: Vendor): boolean => {
    if (targetTraditions.length === 0) return true;
    return targetTraditions.some((tr) => v.traditions.includes(tr));
  };

  const matchesRegion = (v: Vendor): boolean =>
    region === 'All Regions' || vendorServesZone(v, region);

  // Tier 1: event type + tradition + region
  const tier1Raw = catVendors.filter(
    (v) => matchesEvent(v) && matchesTraditionStrict(v) && matchesRegion(v)
  );

  // Tier 2: event type + tradition, any region (chosen region first, then metro-wide or state-wide)
  let tier2Raw = catVendors.filter((v) => matchesEvent(v) && matchesTraditionStrict(v));
  if (tier2Raw.length === 0 && targetTraditions.length > 1) {
    tier2Raw = catVendors.filter((v) => matchesEvent(v) && matchesTraditionPartial(v));
  }

  // Tier 3: event type + region, tradition-neutral vendors
  const tier3Raw = catVendors.filter(
    (v) => matchesEvent(v) && matchesRegion(v) && isTraditionNeutralVendor(v)
  );

  // Tier 4: the category for any event type, tradition-neutral and state-wide
  const tier4Raw = catVendors.filter(
    (v) => isTraditionNeutralVendor(v) && isStateWideVendor(v)
  );

  const tierCounts: TierVendorCounts = {
    exact: tier1Raw.length,
    area: tier2Raw.length,
    neutral: tier3Raw.length,
    closest: tier4Raw.length,
  };

  let winningTier: MatchTier | null = null;
  let winningRaw: Vendor[] = [];

  if (tier1Raw.length > 0) {
    winningTier = 'exact';
    winningRaw = tier1Raw;
  } else if (tier2Raw.length > 0) {
    winningTier = 'area';
    winningRaw = tier2Raw;
  } else if (tier3Raw.length > 0) {
    winningTier = 'neutral';
    winningRaw = tier3Raw;
  } else if (tier4Raw.length > 0) {
    winningTier = 'closest';
    winningRaw = tier4Raw;
  } else if (catVendors.length > 0 && isEssential) {
    // Final safety net if a category has non-neutral vendors only
    winningTier = 'closest';
    winningRaw = catVendors;
  }

  const hasBudget = budget !== null && budget > 0;

  const ranked = winningRaw
    .map((vendor) => {
      const tagCount = countMatchingTags(
        vendor,
        eventType,
        targetTraditions,
        region,
        preferredKeywords
      );
      const budgetInfo = computeBudgetFit(vendor, eventType, budget, guests);
      const zoneInfo = getZoneProximityScore(vendor, region);

      // Prefer tradition-focused specialists over broad multi-tradition listings when tied in Tier 1/2
      const specificityBonus =
        targetTraditions.length > 0 && !isTraditionNeutralVendor(vendor)
          ? Math.max(0, 6 - vendor.traditions.length)
          : 0;

      return {
        item: {
          vendor,
          matchTier: winningTier ?? 'closest',
          matchLabel: MATCH_TIER_LABELS[winningTier ?? 'closest'],
          isEssential,
          matchedTagCount: tagCount,
          withinBudget: budgetInfo.withinBudget,
          estimatedCost: budgetInfo.estimatedCost,
          categoryBudgetLimit: budgetInfo.categoryBudgetLimit,
          matchedZone: zoneInfo.matchedZone,
        } satisfies MatchedVendorItem,
        zonePriority: zoneInfo.priority,
        specificityBonus,
      };
    })
    .sort((a, b) => {
      // In Tier 2 (any region), rank chosen region first, then metro-wide or state-wide, then nearby
      if (winningTier === 'area' && a.zonePriority !== b.zonePriority) {
        return b.zonePriority - a.zonePriority;
      }

      // Within a tier, rank by number of matching tags
      if (a.item.matchedTagCount !== b.item.matchedTagCount) {
        return b.item.matchedTagCount - a.item.matchedTagCount;
      }

      // Then by fit to the budget if one was set
      if (hasBudget) {
        const aFits = a.item.withinBudget ? 1 : 0;
        const bFits = b.item.withinBudget ? 1 : 0;
        if (aFits !== bFits) {
          return bFits - aFits;
        }
        if (a.item.estimatedCost !== b.item.estimatedCost) {
          return a.item.estimatedCost - b.item.estimatedCost;
        }
      }

      // Prefer higher cultural specificity on ties
      if (a.specificityBonus !== b.specificityBonus) {
        return b.specificityBonus - a.specificityBonus;
      }

      // Final stable tie-break
      return (b.item.vendor.rating ?? 0) - (a.item.vendor.rating ?? 0);
    })
    .map((entry) => entry.item);

  return {
    category,
    tierCounts,
    winningTier,
    candidates: ranked,
  };
}

export function matchVendorsToPlan({
  vendors,
  eventType,
  tradition,
  traditions,
  region = 'All Regions',
  budget,
  guests,
  category = 'All',
  searchQuery = '',
  translatedDescriptions,
  matchMode = 'plan',
  maxPerEssentialCategory = 2,
  preferredKeywords = [],
}: MatchVendorsInput): MatchVendorsResult {
  const targetTraditions = resolveTargetTraditions(tradition, traditions);
  const matchesSearch = buildSearchMatcher(searchQuery, translatedDescriptions);
  const hasBudgetFilter = budget !== null && budget > 0;
  const isPlanModeWithEvent = matchMode === 'plan' && eventType !== 'All Events';

  const withinBudgetMap: Record<string, boolean> = {};
  const estimatedCostMap: Record<string, number> = {};
  const categoryLimitMap: Record<string, number> = {};
  const matchTierMap: Record<string, MatchTier> = {};
  const matchLabelMap: Record<string, string> = {};

  const recordItemMaps = (items: MatchedVendorItem[]) => {
    for (const item of items) {
      matchTierMap[item.vendor.id] = item.matchTier;
      matchLabelMap[item.vendor.id] = item.matchLabel;
      if (hasBudgetFilter) {
        withinBudgetMap[item.vendor.id] = item.withinBudget;
        estimatedCostMap[item.vendor.id] = item.estimatedCost;
        categoryLimitMap[item.vendor.id] = item.categoryBudgetLimit;
      }
    }
  };

  // STRICT MODE (manual filter changes) or Plan Mode with no specific event type selected
  if (!isPlanModeWithEvent) {
    const matchesEvent = (v: Vendor): boolean =>
      eventType === 'All Events' || v.eventTypes.includes(eventType);

    const matchesTradition = (v: Vendor): boolean => {
      if (targetTraditions.length === 0) return true;
      if (targetTraditions.length === 1) return v.traditions.includes(targetTraditions[0]);
      return targetTraditions.every((tr) => v.traditions.includes(tr));
    };

    const matchesRegion = (v: Vendor): boolean =>
      region === 'All Regions' || vendorServesZone(v, region);

    const baseCandidates = vendors.filter(
      (v) => matchesEvent(v) && matchesTradition(v) && matchesRegion(v) && matchesSearch(v)
    );

    const allCategoryCounts: Record<string, number> = { All: baseCandidates.length };
    for (const v of baseCandidates) {
      allCategoryCounts[v.category] = (allCategoryCounts[v.category] || 0) + 1;
    }

    const categoryFiltered =
      category === 'All'
        ? baseCandidates
        : baseCandidates.filter((v) => v.category === category);

    const matchedItems: MatchedVendorItem[] = categoryFiltered
      .map((vendor) => {
        const budgetInfo = computeBudgetFit(vendor, eventType, budget, guests);
        const zoneInfo = getZoneProximityScore(vendor, region);
        const tagCount = countMatchingTags(
          vendor,
          eventType,
          targetTraditions,
          region,
          preferredKeywords
        );
        return {
          vendor,
          matchTier: 'exact' as MatchTier,
          matchLabel: MATCH_TIER_LABELS.exact,
          isEssential: false,
          matchedTagCount: tagCount,
          withinBudget: budgetInfo.withinBudget,
          estimatedCost: budgetInfo.estimatedCost,
          categoryBudgetLimit: budgetInfo.categoryBudgetLimit,
          matchedZone: zoneInfo.matchedZone,
        };
      })
      .sort((a, b) => {
        if (hasBudgetFilter) {
          const aFits = a.withinBudget ? 1 : 0;
          const bFits = b.withinBudget ? 1 : 0;
          if (aFits !== bFits) return bFits - aFits;
        }
        return 0;
      });

    recordItemMaps(matchedItems);
    const withinBudgetCount = hasBudgetFilter
      ? matchedItems.filter((item) => item.withinBudget).length
      : 0;

    return {
      vendors: matchedItems.map((i) => i.vendor),
      matchedItems,
      essentialGroups: [],
      essentialVendors: [],
      addOnVendors: matchedItems,
      essentialServiceCount: 0,
      relaxedEssentialNotes: [],
      categoryCounts: allCategoryCounts,
      matchTierMap,
      matchLabelMap,
      overallMatchTier: 'exact',
      withinBudgetMap,
      withinBudgetCount,
      estimatedCostMap,
      categoryLimitMap,
      relaxedBudget: hasBudgetFilter && matchedItems.length > 0 && withinBudgetCount === 0,
      relaxedTradition: false,
      relaxedRegion: false,
      relaxationMessage: null,
      isPlanModeActive: false,
    };
  }

  // PLAN MATCHING MODE (tiered essential categories first, then add-ons)
  const essentialCategories = getEssentialCategoriesForEvent(eventType);
  const optionalCategories = getOptionalCategoriesForEvent(eventType);

  const allEssentialGroups: EssentialCategoryGroup[] = [];
  const allEssentialItems: MatchedVendorItem[] = [];
  const seenVendorIds = new Set<string>();
  const extraEssentialMatches: MatchedVendorItem[] = [];

  for (const essCat of essentialCategories) {
    const evalResult = evaluateCategoryTiers({
      vendors,
      category: essCat,
      eventType,
      tradition,
      traditions,
      region,
      budget,
      guests,
      isEssential: true,
      searchQuery,
      translatedDescriptions,
      preferredKeywords,
    });

    const picked = evalResult.candidates.slice(0, maxPerEssentialCategory);
    for (const item of picked) {
      seenVendorIds.add(item.vendor.id);
      allEssentialItems.push(item);
    }

    // Keep any additional exact-tier matches from essential categories as add-ons so no relevant vendor disappears
    if (evalResult.winningTier === 'exact' && evalResult.candidates.length > maxPerEssentialCategory) {
      for (const extra of evalResult.candidates.slice(maxPerEssentialCategory)) {
        if (!seenVendorIds.has(extra.vendor.id)) {
          seenVendorIds.add(extra.vendor.id);
          extraEssentialMatches.push({ ...extra, isEssential: false });
        }
      }
    }

    allEssentialGroups.push({
      category: essCat,
      tier: evalResult.winningTier,
      tierLabel: evalResult.winningTier ? MATCH_TIER_LABELS[evalResult.winningTier] : null,
      vendors: picked,
      emptyMessage:
        picked.length === 0 ? `No vendors listed yet for ${essCat}` : null,
      tierCounts: evalResult.tierCounts,
    });
  }

  // Optional add-on categories
  const allAddOnItems: MatchedVendorItem[] = [...extraEssentialMatches];
  for (const optCat of optionalCategories) {
    const evalResult = evaluateCategoryTiers({
      vendors,
      category: optCat,
      eventType,
      tradition,
      traditions,
      region,
      budget,
      guests,
      isEssential: false,
      searchQuery,
      translatedDescriptions,
      preferredKeywords,
    });

    if (evalResult.candidates.length === 0) continue;

    // Show all exact matches for optional categories, or top 2 if relaxed
    const limit = evalResult.winningTier === 'exact' ? evalResult.candidates.length : 2;
    for (const item of evalResult.candidates.slice(0, limit)) {
      if (!seenVendorIds.has(item.vendor.id)) {
        seenVendorIds.add(item.vendor.id);
        allAddOnItems.push(item);
      }
    }
  }

  // Category chip counts across ALL plan results (essentials + add-ons, including relaxed matches)
  const allCombinedItems = [...allEssentialItems, ...allAddOnItems];
  const categoryCounts: Record<string, number> = { All: allCombinedItems.length };
  for (const item of allCombinedItems) {
    categoryCounts[item.vendor.category] = (categoryCounts[item.vendor.category] || 0) + 1;
  }

  // Filter displayed results if a category chip is selected
  const visibleEssentialGroups =
    category === 'All'
      ? allEssentialGroups
      : allEssentialGroups.filter((group) => group.category === category);

  const visibleEssentialItems =
    category === 'All'
      ? allEssentialItems
      : allEssentialItems.filter((item) => item.vendor.category === category);

  const visibleAddOnItems =
    category === 'All'
      ? allAddOnItems
      : allAddOnItems.filter((item) => item.vendor.category === category);

  const visibleMatchedItems = [...visibleEssentialItems, ...visibleAddOnItems];
  recordItemMaps(allCombinedItems);

  const relaxedEssentialNotes: RelaxedCategoryNote[] = allEssentialGroups
    .filter((g) => g.tier !== null && g.tier !== 'exact')
    .map((g) => ({
      category: g.category,
      tier: g.tier as MatchTier,
      label: MATCH_TIER_LABELS[g.tier as MatchTier],
    }));

  let overallMatchTier: MatchTier = 'exact';
  for (const g of allEssentialGroups) {
    if (g.tier && TIER_SEVERITY[g.tier] > TIER_SEVERITY[overallMatchTier]) {
      overallMatchTier = g.tier;
    }
  }

  const withinBudgetCount = hasBudgetFilter
    ? visibleMatchedItems.filter((item) => item.withinBudget).length
    : 0;

  const relaxedRegion = relaxedEssentialNotes.some(
    (n) => n.tier === 'area' || n.tier === 'closest'
  );
  const relaxedTradition = relaxedEssentialNotes.some(
    (n) => n.tier === 'neutral' || n.tier === 'closest'
  );
  const relaxedBudget =
    hasBudgetFilter && visibleMatchedItems.length > 0 && withinBudgetCount === 0;

  const relaxationMessage =
    relaxedEssentialNotes.length > 0
      ? `Expanded matching used for: ${relaxedEssentialNotes
          .map((n) => `${n.category} (${n.label})`)
          .join(', ')}.`
      : null;

  return {
    vendors: visibleMatchedItems.map((i) => i.vendor),
    matchedItems: visibleMatchedItems,
    essentialGroups: visibleEssentialGroups,
    essentialVendors: visibleEssentialItems,
    addOnVendors: visibleAddOnItems,
    essentialServiceCount: allEssentialItems.length,
    relaxedEssentialNotes,
    categoryCounts,
    matchTierMap,
    matchLabelMap,
    overallMatchTier,
    withinBudgetMap,
    withinBudgetCount,
    estimatedCostMap,
    categoryLimitMap,
    relaxedBudget,
    relaxedTradition,
    relaxedRegion,
    relaxationMessage,
    isPlanModeActive: true,
  };
}
