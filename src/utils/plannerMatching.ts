import { PLANNER_EVENT_CONFIGS, PlannerCulturalTradition } from '../data/plannerConfigs';
import { CulturalTradition, EventTypeTag, Vendor, VendorCategory } from '../types';

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

export const MARKETPLACE_TRADITION_FILTERS: Array<'All Traditions' | CulturalTradition> = [
  'All Traditions',
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

export function parseCategoryParam(raw: string | null): 'All' | VendorCategory {
  if (!raw) return 'All';
  const normalized = raw.trim().toLowerCase();
  if (!normalized || normalized === 'all') return 'All';
  if (normalized in SLUG_TO_CATEGORY_MAP) {
    return SLUG_TO_CATEGORY_MAP[normalized];
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
}

export function buildPlanQueryString(input: PlanQueryInput): string {
  const params = new URLSearchParams();
  params.set('event', getEventSlug(input.event));
  params.set('tradition', input.traditionSlug);
  params.set('budget', String(Math.round(input.budget)));
  params.set('guests', String(Math.round(input.guests)));
  return `?${params.toString()}`;
}

export interface MarketplaceUrlState {
  eventType: 'All Events' | EventTypeTag;
  tradition: 'All Traditions' | CulturalTradition;
  budget: number | null;
  guests: number | null;
  category: 'All' | VendorCategory;
  searchQuery: string;
}

export function parseMarketplaceUrlParams(search: string): MarketplaceUrlState {
  try {
    const params = new URLSearchParams(search);
    const eventType = parseEventParam(params.get('event') ?? params.get('eventType'));
    const tradition = parseTraditionParam(params.get('tradition'));
    const budget = parsePositiveIntParam(params.get('budget'), 500, 1000000);
    const guests = parsePositiveIntParam(params.get('guests'), 1, 10000);
    const category = parseCategoryParam(params.get('category'));
    const rawQuery = params.get('q') ?? '';
    const searchQuery = rawQuery.trim().slice(0, 120);

    return {
      eventType,
      tradition,
      budget,
      guests,
      category,
      searchQuery,
    };
  } catch {
    return {
      eventType: 'All Events',
      tradition: 'All Traditions',
      budget: null,
      guests: null,
      category: 'All',
      searchQuery: '',
    };
  }
}

export function buildMarketplaceUrlQuery(state: MarketplaceUrlState): string {
  const params = new URLSearchParams();
  const hasBudgetPlan = state.budget !== null && state.guests !== null;

  if (state.eventType !== 'All Events') {
    params.set('event', getEventSlug(state.eventType));
  }

  if (state.tradition !== 'All Traditions') {
    params.set('tradition', marketplaceTraditionToSlug(state.tradition));
  } else if (hasBudgetPlan) {
    params.set('tradition', '');
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

export interface MatchVendorsInput {
  vendors: Vendor[];
  eventType: 'All Events' | EventTypeTag;
  tradition: 'All Traditions' | CulturalTradition;
  budget: number | null;
  guests: number | null;
  category?: 'All' | VendorCategory;
  searchQuery?: string;
  translatedDescriptions?: Record<string, string>;
}

export interface MatchVendorsResult {
  vendors: Vendor[];
  withinBudgetMap: Record<string, boolean>;
  withinBudgetCount: number;
  estimatedCostMap: Record<string, number>;
  categoryLimitMap: Record<string, number>;
  relaxedBudget: boolean;
  relaxedTradition: boolean;
  relaxationMessage: string | null;
}

export function matchVendorsToPlan({
  vendors,
  eventType,
  tradition,
  budget,
  guests,
  category = 'All',
  searchQuery = '',
  translatedDescriptions,
}: MatchVendorsInput): MatchVendorsResult {
  const q = searchQuery.toLowerCase().trim();

  const matchesSearch = (vendor: Vendor): boolean => {
    if (!q) return true;
    const translatedDesc = (translatedDescriptions?.[vendor.id] ?? '').toLowerCase();
    return (
      vendor.name.toLowerCase().includes(q) ||
      vendor.businessName.toLowerCase().includes(q) ||
      vendor.location.toLowerCase().includes(q) ||
      vendor.description.toLowerCase().includes(q) ||
      translatedDesc.includes(q) ||
      vendor.features.some((feat) => feat.toLowerCase().includes(q)) ||
      vendor.culturalSpecialties.some((spec) => spec.toLowerCase().includes(q)) ||
      vendor.eventTypes.some((et) => et.toLowerCase().includes(q))
    );
  };

  const matchesCategory = (vendor: Vendor): boolean =>
    category === 'All' || vendor.category === category;

  const matchesEvent = (vendor: Vendor): boolean =>
    eventType === 'All Events' || vendor.eventTypes.includes(eventType);

  const matchesTradition = (vendor: Vendor): boolean =>
    tradition === 'All Traditions' || vendor.traditions.includes(tradition);

  let relaxedTradition = false;
  let candidates = vendors.filter(
    (v) => matchesEvent(v) && matchesTradition(v) && matchesCategory(v) && matchesSearch(v)
  );

  // If no matches with the selected tradition, relax tradition while still respecting event, category, and search.
  if (candidates.length === 0 && tradition !== 'All Traditions') {
    const eventWithoutTradition = vendors.filter(
      (v) => matchesEvent(v) && matchesCategory(v) && matchesSearch(v)
    );
    if (eventWithoutTradition.length > 0) {
      candidates = eventWithoutTradition;
      relaxedTradition = true;
    }
  }

  const hasBudgetFilter = budget !== null && budget > 0 && guests !== null && guests > 0;
  const withinBudgetMap: Record<string, boolean> = {};
  const estimatedCostMap: Record<string, number> = {};
  const categoryLimitMap: Record<string, number> = {};
  let withinBudgetCount = 0;

  if (hasBudgetFilter) {
    for (const vendor of candidates) {
      const sharePct = getCategoryAllocationPct(eventType, vendor.category);
      const categoryBudgetLimit = Math.round(budget * sharePct);
      const estimatedCost = estimateVendorCostForPlan(vendor.startingPrice, guests);
      const fits = estimatedCost <= categoryBudgetLimit;

      withinBudgetMap[vendor.id] = fits;
      estimatedCostMap[vendor.id] = estimatedCost;
      categoryLimitMap[vendor.id] = categoryBudgetLimit;
      if (fits) {
        withinBudgetCount += 1;
      }
    }
  }

  // Sort within-budget vendors first while preserving stable relative ordering
  const sortedVendors = [...candidates].sort((a, b) => {
    if (!hasBudgetFilter) return 0;
    const aFits = withinBudgetMap[a.id] ? 1 : 0;
    const bFits = withinBudgetMap[b.id] ? 1 : 0;
    return bFits - aFits;
  });

  const relaxedBudget = hasBudgetFilter && sortedVendors.length > 0 && withinBudgetCount === 0;

  let relaxationMessage: string | null = null;
  if (relaxedBudget && relaxedTradition) {
    relaxationMessage =
      'No exact matches within budget or cultural tradition, showing closest options for this celebration.';
  } else if (relaxedBudget) {
    relaxationMessage = 'No exact matches within budget, showing closest options.';
  } else if (relaxedTradition) {
    relaxationMessage =
      'No exact matches for that cultural tradition, showing closest options for this celebration.';
  }

  return {
    vendors: sortedVendors,
    withinBudgetMap,
    withinBudgetCount,
    estimatedCostMap,
    categoryLimitMap,
    relaxedBudget,
    relaxedTradition,
    relaxationMessage,
  };
}
