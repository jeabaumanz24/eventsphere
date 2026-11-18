import { vendorsData } from './mockData';
import { Vendor } from '../types';

export type DateRangeId = '30d' | '90d' | '12m';

export const EVENT_TYPE_BUCKETS = [
  'Weddings',
  'Milestone Birthdays',
  'Diwali',
  'Lunar New Year',
  'Eid',
  'Corporate Events',
  'Other',
] as const;

export type EventBucketLabel = (typeof EVENT_TYPE_BUCKETS)[number];

export const TRADITION_BUCKETS = [
  'Filipino',
  'Greek',
  'Indian',
  'Chinese',
  'Middle Eastern',
  'Other',
] as const;

export type TraditionBucketLabel = (typeof TRADITION_BUCKETS)[number];

export interface DateRangeOption {
  id: DateRangeId;
  label: string;
  shortLabel: string;
  previousPeriodLabel: string;
}

export const DATE_RANGE_OPTIONS: DateRangeOption[] = [
  {
    id: '30d',
    label: 'Last 30 days',
    shortLabel: '30-day',
    previousPeriodLabel: 'vs previous 30 days',
  },
  {
    id: '90d',
    label: 'Last 90 days',
    shortLabel: '90-day',
    previousPeriodLabel: 'vs previous 90 days',
  },
  {
    id: '12m',
    label: 'Last 12 months',
    shortLabel: '12-month',
    previousPeriodLabel: 'vs previous 12 months',
  },
];

export interface BreakdownDatum {
  label: string;
  value: number;
  sharePct: number;
  deltaLabel?: string;
}

export interface TimeSeriesPoint {
  period: string;
  enquiries: number;
  views: number;
}

export interface VendorInsightsReport {
  vendor: Vendor;
  roleLabel: string;
  dateRange: DateRangeOption;
  summary: {
    profileViews: number;
    viewsDelta: string;
    enquiries: number;
    enquiriesDelta: string;
    conversionRate: number;
    conversionDelta: string;
    avgResponseHours: number;
    responseDelta: string;
  };
  enquiriesByEventType: BreakdownDatum[];
  viewsByEventType: BreakdownDatum[];
  enquiriesByTradition: BreakdownDatum[];
  enquiriesOverTime: TimeSeriesPoint[];
  aiInsights: string[];
  topEventType: BreakdownDatum;
  topTradition: BreakdownDatum;
  plainTextSummary: string;
}

interface VendorProfileSeed {
  vendorId: string;
  roleLabel: string;
  eventWeights: Record<EventBucketLabel, number>;
  traditionWeights: Record<TraditionBucketLabel, number>;
  viewsPerEnquiryByEvent: Record<EventBucketLabel, number>;
  timeSeriesByRange: Record<
    DateRangeId,
    {
      periods: { period: string; enquiries: number }[];
      viewsDelta: string;
      enquiriesDelta: string;
      conversionDelta: string;
      avgResponseHours: number;
      responseDelta: string;
    }
  >;
  risingCategoryHint: {
    bucket: EventBucketLabel;
    growthLabel: string;
    actionTip: string;
  };
  traditionActionTip: string;
}

const VENDOR_SEEDS: VendorProfileSeed[] = [
  {
    vendorId: 'v30',
    roleLabel: 'Caterer',
    // Tagged eventTypes: Milestone Birthdays, Christenings & Baby Showers, Graduations, Community Festivals, Weddings, Engagements & Proposals, Corporate Events
    // Tagged traditions: Italian, Greek (Greek top)
    eventWeights: {
      Weddings: 0.34,
      'Milestone Birthdays': 0.28,
      Diwali: 0,
      'Lunar New Year': 0,
      Eid: 0,
      'Corporate Events': 0.22,
      Other: 0.16,
    },
    traditionWeights: {
      Filipino: 0,
      Greek: 0.62,
      Indian: 0,
      Chinese: 0,
      'Middle Eastern': 0,
      Other: 0.38, // Italian family catering
    },
    viewsPerEnquiryByEvent: {
      Weddings: 6.4,
      'Milestone Birthdays': 5.8,
      Diwali: 0,
      'Lunar New Year': 0,
      Eid: 0,
      'Corporate Events': 5.5,
      Other: 7.1,
    },
    timeSeriesByRange: {
      '30d': {
        periods: [
          { period: 'Wk 1', enquiries: 7 },
          { period: 'Wk 2', enquiries: 8 },
          { period: 'Wk 3', enquiries: 10 },
          { period: 'Wk 4', enquiries: 11 },
        ],
        viewsDelta: '+16.4%',
        enquiriesDelta: '+24.1%',
        conversionDelta: '+1.1 pts',
        avgResponseHours: 2.3,
        responseDelta: '0.5 hrs faster',
      },
      '90d': {
        periods: [
          { period: 'Wk 1–2', enquiries: 13 },
          { period: 'Wk 3–4', enquiries: 15 },
          { period: 'Wk 5–6', enquiries: 16 },
          { period: 'Wk 7–8', enquiries: 18 },
          { period: 'Wk 9–10', enquiries: 20 },
          { period: 'Wk 11–12', enquiries: 23 },
        ],
        viewsDelta: '+19.8%',
        enquiriesDelta: '+26.5%',
        conversionDelta: '+0.9 pts',
        avgResponseHours: 2.4,
        responseDelta: '0.4 hrs faster',
      },
      '12m': {
        periods: [
          { period: 'Nov', enquiries: 28 },
          { period: 'Dec', enquiries: 32 },
          { period: 'Jan', enquiries: 24 },
          { period: 'Feb', enquiries: 27 },
          { period: 'Mar', enquiries: 34 },
          { period: 'Apr', enquiries: 36 },
          { period: 'May', enquiries: 31 },
          { period: 'Jun', enquiries: 26 },
          { period: 'Jul', enquiries: 29 },
          { period: 'Aug', enquiries: 35 },
          { period: 'Sep', enquiries: 38 },
          { period: 'Oct', enquiries: 42 },
        ],
        viewsDelta: '+22.4%',
        enquiriesDelta: '+29.0%',
        conversionDelta: '+0.8 pts',
        avgResponseHours: 2.5,
        responseDelta: '0.6 hrs faster',
      },
    },
    risingCategoryHint: {
      bucket: 'Corporate Events',
      growthLabel: '+28%',
      actionTip:
        'Corporate Events enquiries are rising (+28%) — consider publishing a weekday long-table office catering package with per-head GST pricing.',
    },
    traditionActionTip:
      'Greek celebrations drive your highest enquiry volume; highlighting lamb spit-roast availability and fasting-friendly vegan platters can lift shortlist conversion.',
  },
  {
    vendorId: 'v23',
    roleLabel: 'Venue',
    // Tagged all 9 traditions; eventTypes include Diwali, Eid, Lunar New Year, Community Festivals, Weddings, Milestone Birthdays, Graduations, Corporate Events
    eventWeights: {
      Weddings: 0.24,
      'Milestone Birthdays': 0.14,
      Diwali: 0.18,
      'Lunar New Year': 0.12,
      Eid: 0.13,
      'Corporate Events': 0.11,
      Other: 0.08,
    },
    traditionWeights: {
      Filipino: 0.11,
      Greek: 0.12,
      Indian: 0.27,
      Chinese: 0.17,
      'Middle Eastern': 0.21,
      Other: 0.12,
    },
    viewsPerEnquiryByEvent: {
      Weddings: 7.4,
      'Milestone Birthdays': 6.9,
      Diwali: 6.1,
      'Lunar New Year': 6.3,
      Eid: 5.9,
      'Corporate Events': 7.8,
      Other: 8.2,
    },
    timeSeriesByRange: {
      '30d': {
        periods: [
          { period: 'Wk 1', enquiries: 9 },
          { period: 'Wk 2', enquiries: 11 },
          { period: 'Wk 3', enquiries: 12 },
          { period: 'Wk 4', enquiries: 14 },
        ],
        viewsDelta: '+14.2%',
        enquiriesDelta: '+21.0%',
        conversionDelta: '+0.9 pts',
        avgResponseHours: 1.9,
        responseDelta: '0.3 hrs faster',
      },
      '90d': {
        periods: [
          { period: 'Wk 1–2', enquiries: 19 },
          { period: 'Wk 3–4', enquiries: 21 },
          { period: 'Wk 5–6', enquiries: 23 },
          { period: 'Wk 7–8', enquiries: 25 },
          { period: 'Wk 9–10', enquiries: 28 },
          { period: 'Wk 11–12', enquiries: 31 },
        ],
        viewsDelta: '+18.5%',
        enquiriesDelta: '+24.6%',
        conversionDelta: '+0.8 pts',
        avgResponseHours: 2.0,
        responseDelta: '0.4 hrs faster',
      },
      '12m': {
        periods: [
          { period: 'Nov', enquiries: 39 },
          { period: 'Dec', enquiries: 41 },
          { period: 'Jan', enquiries: 44 },
          { period: 'Feb', enquiries: 48 },
          { period: 'Mar', enquiries: 43 },
          { period: 'Apr', enquiries: 51 },
          { period: 'May', enquiries: 38 },
          { period: 'Jun', enquiries: 35 },
          { period: 'Jul', enquiries: 40 },
          { period: 'Aug', enquiries: 45 },
          { period: 'Sep', enquiries: 49 },
          { period: 'Oct', enquiries: 57 },
        ],
        viewsDelta: '+21.3%',
        enquiriesDelta: '+27.8%',
        conversionDelta: '+0.7 pts',
        avgResponseHours: 2.1,
        responseDelta: '0.5 hrs faster',
      },
    },
    risingCategoryHint: {
      bucket: 'Eid',
      growthLabel: '+31%',
      actionTip:
        'Eid enquiries are rising (+31%) — featuring separate Halal prep kitchen photos and flexible moon-sighting hold windows can convert more family groups.',
    },
    traditionActionTip:
      'Indian and Middle Eastern enquiries lead demand at Thebarton Multicultural Pavilion; list exact banquet table capacities and stage AV specs upfront.',
  },
  {
    vendorId: 'v20',
    roleLabel: 'Entertainment',
    // Tagged traditions: Chinese, Vietnamese
    // Tagged eventTypes: Lunar New Year, Community Festivals, Milestone Birthdays, Weddings, Graduations, Corporate Events
    eventWeights: {
      Weddings: 0.21,
      'Milestone Birthdays': 0.16,
      Diwali: 0,
      'Lunar New Year': 0.37,
      Eid: 0,
      'Corporate Events': 0.16,
      Other: 0.10,
    },
    traditionWeights: {
      Filipino: 0,
      Greek: 0,
      Indian: 0,
      Chinese: 0.68,
      'Middle Eastern': 0,
      Other: 0.32, // Vietnamese Tet & mixed community events
    },
    viewsPerEnquiryByEvent: {
      Weddings: 6.2,
      'Milestone Birthdays': 5.9,
      Diwali: 0,
      'Lunar New Year': 4.8,
      Eid: 0,
      'Corporate Events': 5.6,
      Other: 6.8,
    },
    timeSeriesByRange: {
      '30d': {
        periods: [
          { period: 'Wk 1', enquiries: 5 },
          { period: 'Wk 2', enquiries: 6 },
          { period: 'Wk 3', enquiries: 7 },
          { period: 'Wk 4', enquiries: 8 },
        ],
        viewsDelta: '+17.9%',
        enquiriesDelta: '+23.8%',
        conversionDelta: '+0.9 pts',
        avgResponseHours: 2.6,
        responseDelta: '0.3 hrs faster',
      },
      '90d': {
        periods: [
          { period: 'Wk 1–2', enquiries: 10 },
          { period: 'Wk 3–4', enquiries: 12 },
          { period: 'Wk 5–6', enquiries: 13 },
          { period: 'Wk 7–8', enquiries: 15 },
          { period: 'Wk 9–10', enquiries: 17 },
          { period: 'Wk 11–12', enquiries: 19 },
        ],
        viewsDelta: '+22.1%',
        enquiriesDelta: '+29.4%',
        conversionDelta: '+1.0 pts',
        avgResponseHours: 2.5,
        responseDelta: '0.4 hrs faster',
      },
      '12m': {
        periods: [
          { period: 'Nov', enquiries: 18 },
          { period: 'Dec', enquiries: 22 },
          { period: 'Jan', enquiries: 41 },
          { period: 'Feb', enquiries: 49 },
          { period: 'Mar', enquiries: 24 },
          { period: 'Apr', enquiries: 19 },
          { period: 'May', enquiries: 17 },
          { period: 'Jun', enquiries: 16 },
          { period: 'Jul', enquiries: 20 },
          { period: 'Aug', enquiries: 23 },
          { period: 'Sep', enquiries: 27 },
          { period: 'Oct', enquiries: 30 },
        ],
        viewsDelta: '+25.6%',
        enquiriesDelta: '+33.2%',
        conversionDelta: '+1.1 pts',
        avgResponseHours: 2.4,
        responseDelta: '0.5 hrs faster',
      },
    },
    risingCategoryHint: {
      bucket: 'Corporate Events',
      growthLabel: '+26%',
      actionTip:
        'Corporate Events enquiries are rising (+26%) — consider creating a 20-minute Adelaide CBD office foyer lion blessing package for January–February.',
    },
    traditionActionTip:
      'Chinese and Vietnamese celebrations generate all of your bookings; listing bilingual MC and Cai Qing ceiling height rules lowers back-and-forth emails.',
  },
  {
    vendorId: 'v25',
    roleLabel: 'Decor',
    // Tagged traditions: Indian ONLY
    // Tagged eventTypes: Diwali & Festival of Lights (top), Weddings, Engagements & Proposals, Community Festivals
    eventWeights: {
      Weddings: 0.27,
      'Milestone Birthdays': 0,
      Diwali: 0.51,
      'Lunar New Year': 0,
      Eid: 0,
      'Corporate Events': 0,
      Other: 0.22, // Engagements & Proposals + Community Festivals
    },
    traditionWeights: {
      Filipino: 0,
      Greek: 0,
      Indian: 0.92,
      Chinese: 0,
      'Middle Eastern': 0,
      Other: 0.08, // Dual-heritage Indian-Australian hosts
    },
    viewsPerEnquiryByEvent: {
      Weddings: 6.1,
      'Milestone Birthdays': 0,
      Diwali: 4.9,
      'Lunar New Year': 0,
      Eid: 0,
      'Corporate Events': 0,
      Other: 6.7,
    },
    timeSeriesByRange: {
      '30d': {
        periods: [
          { period: 'Wk 1', enquiries: 6 },
          { period: 'Wk 2', enquiries: 7 },
          { period: 'Wk 3', enquiries: 9 },
          { period: 'Wk 4', enquiries: 10 },
        ],
        viewsDelta: '+21.2%',
        enquiriesDelta: '+28.0%',
        conversionDelta: '+1.0 pts',
        avgResponseHours: 1.7,
        responseDelta: '0.4 hrs faster',
      },
      '90d': {
        periods: [
          { period: 'Wk 1–2', enquiries: 11 },
          { period: 'Wk 3–4', enquiries: 13 },
          { period: 'Wk 5–6', enquiries: 15 },
          { period: 'Wk 7–8', enquiries: 17 },
          { period: 'Wk 9–10', enquiries: 19 },
          { period: 'Wk 11–12', enquiries: 22 },
        ],
        viewsDelta: '+24.0%',
        enquiriesDelta: '+31.5%',
        conversionDelta: '+1.1 pts',
        avgResponseHours: 1.8,
        responseDelta: '0.5 hrs faster',
      },
      '12m': {
        periods: [
          { period: 'Nov', enquiries: 42 },
          { period: 'Dec', enquiries: 25 },
          { period: 'Jan', enquiries: 21 },
          { period: 'Feb', enquiries: 23 },
          { period: 'Mar', enquiries: 26 },
          { period: 'Apr', enquiries: 28 },
          { period: 'May', enquiries: 24 },
          { period: 'Jun', enquiries: 22 },
          { period: 'Jul', enquiries: 27 },
          { period: 'Aug', enquiries: 31 },
          { period: 'Sep', enquiries: 39 },
          { period: 'Oct', enquiries: 54 },
        ],
        viewsDelta: '+27.4%',
        enquiriesDelta: '+34.8%',
        conversionDelta: '+1.0 pts',
        avgResponseHours: 1.8,
        responseDelta: '0.6 hrs faster',
      },
    },
    risingCategoryHint: {
      bucket: 'Diwali',
      growthLabel: '+34%',
      actionTip:
        'Diwali leads at 51% of all enquiries (+34% peak demand) — launch an early-bird hall-safe floating rangoli and brass LED diya package before September.',
    },
    traditionActionTip:
      'Indian hosts look specifically for flame-free council compliance; pinning close-up rangoli base specs on your gallery helps close enquiries faster.',
  },
  {
    vendorId: 'v4',
    roleLabel: 'Planner',
    // Tagged traditions: Middle Eastern or Muslim, Italian, Greek, Indian, Chinese
    // Tagged eventTypes: Weddings, Milestone Birthdays, Engagements & Proposals, Graduations, Corporate Events
    eventWeights: {
      Weddings: 0.44,
      'Milestone Birthdays': 0.19,
      Diwali: 0,
      'Lunar New Year': 0,
      Eid: 0,
      'Corporate Events': 0.23,
      Other: 0.14, // Engagements & Graduations
    },
    traditionWeights: {
      Filipino: 0,
      Greek: 0.18,
      Indian: 0.21,
      Chinese: 0.17,
      'Middle Eastern': 0.29,
      Other: 0.15, // Italian
    },
    viewsPerEnquiryByEvent: {
      Weddings: 7.2,
      'Milestone Birthdays': 6.6,
      Diwali: 0,
      'Lunar New Year': 0,
      Eid: 0,
      'Corporate Events': 6.1,
      Other: 7.5,
    },
    timeSeriesByRange: {
      '30d': {
        periods: [
          { period: 'Wk 1', enquiries: 6 },
          { period: 'Wk 2', enquiries: 7 },
          { period: 'Wk 3', enquiries: 8 },
          { period: 'Wk 4', enquiries: 9 },
        ],
        viewsDelta: '+13.5%',
        enquiriesDelta: '+20.0%',
        conversionDelta: '+0.8 pts',
        avgResponseHours: 1.6,
        responseDelta: '0.3 hrs faster',
      },
      '90d': {
        periods: [
          { period: 'Wk 1–2', enquiries: 12 },
          { period: 'Wk 3–4', enquiries: 13 },
          { period: 'Wk 5–6', enquiries: 14 },
          { period: 'Wk 7–8', enquiries: 16 },
          { period: 'Wk 9–10', enquiries: 17 },
          { period: 'Wk 11–12', enquiries: 19 },
        ],
        viewsDelta: '+16.2%',
        enquiriesDelta: '+22.4%',
        conversionDelta: '+0.7 pts',
        avgResponseHours: 1.6,
        responseDelta: '0.4 hrs faster',
      },
      '12m': {
        periods: [
          { period: 'Nov', enquiries: 26 },
          { period: 'Dec', enquiries: 28 },
          { period: 'Jan', enquiries: 24 },
          { period: 'Feb', enquiries: 27 },
          { period: 'Mar', enquiries: 31 },
          { period: 'Apr', enquiries: 29 },
          { period: 'May', enquiries: 25 },
          { period: 'Jun', enquiries: 23 },
          { period: 'Jul', enquiries: 26 },
          { period: 'Aug', enquiries: 30 },
          { period: 'Sep', enquiries: 33 },
          { period: 'Oct', enquiries: 36 },
        ],
        viewsDelta: '+19.1%',
        enquiriesDelta: '+25.3%',
        conversionDelta: '+0.7 pts',
        avgResponseHours: 1.7,
        responseDelta: '0.4 hrs faster',
      },
    },
    risingCategoryHint: {
      bucket: 'Corporate Events',
      growthLabel: '+24%',
      actionTip:
        'Corporate Events enquiries are rising (+24%) — add a bilingual gala & awards night run-sheet tier alongside your multi-day wedding planning packages.',
    },
    traditionActionTip:
      'Middle Eastern and dual-heritage Indian weddings lead your planner demand; showcase sample bilingual run sheets to reinforce multi-day coordination trust.',
  },
  {
    vendorId: 'v1',
    roleLabel: 'Photographer',
    // Tagged traditions: Filipino, Italian, Greek, Indian (Filipino top)
    // Tagged eventTypes: Weddings, Engagements & Proposals, Christenings & Baby Showers, Milestone Birthdays
    eventWeights: {
      Weddings: 0.48,
      'Milestone Birthdays': 0.19,
      Diwali: 0,
      'Lunar New Year': 0,
      Eid: 0,
      'Corporate Events': 0,
      Other: 0.33, // Engagements & Proposals + Christenings & Baby Showers
    },
    traditionWeights: {
      Filipino: 0.44,
      Greek: 0.21,
      Indian: 0.19,
      Chinese: 0,
      'Middle Eastern': 0,
      Other: 0.16, // Italian
    },
    viewsPerEnquiryByEvent: {
      Weddings: 6.8,
      'Milestone Birthdays': 6.4,
      Diwali: 0,
      'Lunar New Year': 0,
      Eid: 0,
      'Corporate Events': 0,
      Other: 7.0,
    },
    timeSeriesByRange: {
      '30d': {
        periods: [
          { period: 'Wk 1', enquiries: 8 },
          { period: 'Wk 2', enquiries: 9 },
          { period: 'Wk 3', enquiries: 10 },
          { period: 'Wk 4', enquiries: 12 },
        ],
        viewsDelta: '+15.8%',
        enquiriesDelta: '+22.0%',
        conversionDelta: '+0.8 pts',
        avgResponseHours: 2.1,
        responseDelta: '0.4 hrs faster',
      },
      '90d': {
        periods: [
          { period: 'Wk 1–2', enquiries: 16 },
          { period: 'Wk 3–4', enquiries: 17 },
          { period: 'Wk 5–6', enquiries: 18 },
          { period: 'Wk 7–8', enquiries: 20 },
          { period: 'Wk 9–10', enquiries: 22 },
          { period: 'Wk 11–12', enquiries: 24 },
        ],
        viewsDelta: '+18.4%',
        enquiriesDelta: '+24.5%',
        conversionDelta: '+0.7 pts',
        avgResponseHours: 2.1,
        responseDelta: '0.5 hrs faster',
      },
      '12m': {
        periods: [
          { period: 'Nov', enquiries: 34 },
          { period: 'Dec', enquiries: 31 },
          { period: 'Jan', enquiries: 27 },
          { period: 'Feb', enquiries: 30 },
          { period: 'Mar', enquiries: 38 },
          { period: 'Apr', enquiries: 39 },
          { period: 'May', enquiries: 33 },
          { period: 'Jun', enquiries: 29 },
          { period: 'Jul', enquiries: 32 },
          { period: 'Aug', enquiries: 36 },
          { period: 'Sep', enquiries: 41 },
          { period: 'Oct', enquiries: 44 },
        ],
        viewsDelta: '+20.7%',
        enquiriesDelta: '+26.9%',
        conversionDelta: '+0.8 pts',
        avgResponseHours: 2.2,
        responseDelta: '0.5 hrs faster',
      },
    },
    risingCategoryHint: {
      bucket: 'Other',
      growthLabel: '+27%',
      actionTip:
        'Engagements & Christenings ("Other") are rising (+27%) — bundle a 90-minute family christening & proposal mini-session option into your pricing card.',
    },
    traditionActionTip:
      'Filipino hosts represent 44% of your photography enquiries; feature veil, cord and arras gallery highlights near the top of your portfolio.',
  },
];

function allocateIntegers(total: number, weights: Record<string, number>, keys: readonly string[]): number[] {
  const activeIndices: number[] = [];
  const raw = keys.map((k, idx) => {
    const w = weights[k] ?? 0;
    if (w > 0) activeIndices.push(idx);
    return total * w;
  });

  const floors = raw.map((val, idx) => (weights[keys[idx]] > 0 ? Math.floor(val) : 0));
  let remainder = total - floors.reduce((acc, n) => acc + n, 0);

  const remainders = activeIndices
    .map((idx) => ({ idx, frac: raw[idx] - floors[idx] }))
    .sort((a, b) => b.frac - a.frac);

  for (let i = 0; i < remainder && i < remainders.length; i += 1) {
    floors[remainders[i].idx] += 1;
  }

  return floors;
}

export interface VendorSelectOption {
  id: string;
  businessName: string;
  roleLabel: string;
  category: string;
}

export const INSIGHTS_VENDOR_OPTIONS: VendorSelectOption[] = VENDOR_SEEDS.map((seed) => {
  const vendor = vendorsData.find((v) => v.id === seed.vendorId);
  if (!vendor) {
    throw new Error(`Missing mock vendor id "${seed.vendorId}" for Vendor Insights`);
  }
  return {
    id: vendor.id,
    businessName: vendor.businessName,
    roleLabel: seed.roleLabel,
    category: vendor.category,
  };
});

export function buildVendorInsightsReport(
  vendorId: string,
  dateRangeId: DateRangeId
): VendorInsightsReport {
  const seed = VENDOR_SEEDS.find((s) => s.vendorId === vendorId) ?? VENDOR_SEEDS[0];
  const vendor = vendorsData.find((v) => v.id === seed.vendorId)!;
  const dateRange = DATE_RANGE_OPTIONS.find((d) => d.id === dateRangeId) ?? DATE_RANGE_OPTIONS[1];
  const rangeSeed = seed.timeSeriesByRange[dateRange.id];

  const totalEnquiries = rangeSeed.periods.reduce((acc, p) => acc + p.enquiries, 0);

  const eventCounts = allocateIntegers(totalEnquiries, seed.eventWeights, EVENT_TYPE_BUCKETS);
  const traditionCounts = allocateIntegers(totalEnquiries, seed.traditionWeights, TRADITION_BUCKETS);

  const enquiriesByEventType: BreakdownDatum[] = EVENT_TYPE_BUCKETS.map((label, idx) => {
    const value = eventCounts[idx];
    return {
      label,
      value,
      sharePct: totalEnquiries > 0 ? Number(((value / totalEnquiries) * 100).toFixed(1)) : 0,
    };
  });

  const viewCounts = EVENT_TYPE_BUCKETS.map((label, idx) => {
    const enq = eventCounts[idx];
    const mult = seed.viewsPerEnquiryByEvent[label];
    if (enq === 0 || mult <= 0) return 0;
    return Math.max(enq, Math.round(enq * mult));
  });

  const totalViews = viewCounts.reduce((acc, n) => acc + n, 0);

  const viewsByEventType: BreakdownDatum[] = EVENT_TYPE_BUCKETS.map((label, idx) => {
    const value = viewCounts[idx];
    return {
      label,
      value,
      sharePct: totalViews > 0 ? Number(((value / totalViews) * 100).toFixed(1)) : 0,
    };
  });

  const enquiriesByTradition: BreakdownDatum[] = TRADITION_BUCKETS.map((label, idx) => {
    const value = traditionCounts[idx];
    return {
      label,
      value,
      sharePct: totalEnquiries > 0 ? Number(((value / totalEnquiries) * 100).toFixed(1)) : 0,
    };
  });

  const overallRatio = totalEnquiries > 0 ? totalViews / totalEnquiries : 6.5;
  const periodRawViews = rangeSeed.periods.map((p) => Math.max(p.enquiries, Math.round(p.enquiries * overallRatio)));
  const rawViewSum = periodRawViews.reduce((acc, n) => acc + n, 0);
  const viewDiff = totalViews - rawViewSum;
  if (periodRawViews.length > 0 && viewDiff !== 0) {
    periodRawViews[periodRawViews.length - 1] = Math.max(
      rangeSeed.periods[rangeSeed.periods.length - 1].enquiries,
      periodRawViews[periodRawViews.length - 1] + viewDiff
    );
  }

  const enquiriesOverTime: TimeSeriesPoint[] = rangeSeed.periods.map((p, idx) => ({
    period: p.period,
    enquiries: p.enquiries,
    views: periodRawViews[idx],
  }));

  const conversionRate = totalViews > 0 ? Number(((totalEnquiries / totalViews) * 100).toFixed(1)) : 0;

  const topEventType = [...enquiriesByEventType].sort((a, b) => b.value - a.value)[0];
  const topTradition = [...enquiriesByTradition].sort((a, b) => b.value - a.value)[0];

  const responseTip =
    rangeSeed.avgResponseHours <= 2.1
      ? `Your average sample reply time of ${rangeSeed.avgResponseHours.toFixed(1)} hrs supports a ${conversionRate.toFixed(1)}% view-to-enquiry conversion rate; adding instant availability badges on dates 3–6 months out can lift enquiries further.`
      : `Trimming sample response times from ${rangeSeed.avgResponseHours.toFixed(1)} hrs toward under 2 hours could improve your ${conversionRate.toFixed(1)}% conversion rate during weekend enquiry spikes.`;

  const aiInsights = [seed.risingCategoryHint.actionTip, seed.traditionActionTip, responseTip];

  const plainTextSummary = [
    `EventSphere Adelaide — Vendor Insights Report (${dateRange.label})`,
    'Simulation using fictional vendors and sample data. Figures are illustrative, not real performance.',
    '',
    `Vendor: ${vendor.businessName} (${seed.roleLabel} — ${vendor.category})`,
    `Location: ${vendor.location}`,
    `Date Range: ${dateRange.label}`,
    '',
    'Key Metrics:',
    `- Profile Views: ${totalViews.toLocaleString('en-AU')} (${rangeSeed.viewsDelta} ${dateRange.previousPeriodLabel})`,
    `- Enquiries: ${totalEnquiries.toLocaleString('en-AU')} (${rangeSeed.enquiriesDelta} ${dateRange.previousPeriodLabel})`,
    `- Conversion Rate: ${conversionRate.toFixed(1)}% (${rangeSeed.conversionDelta} ${dateRange.previousPeriodLabel})`,
    `- Average Response Time: ${rangeSeed.avgResponseHours.toFixed(1)} hrs (${rangeSeed.responseDelta} ${dateRange.previousPeriodLabel})`,
    '',
    'Enquiries by Event Type:',
    ...enquiriesByEventType.map((d) => `- ${d.label}: ${d.value} (${d.sharePct.toFixed(1)}%)`),
    '',
    'Views by Event Type:',
    ...viewsByEventType.map((d) => `- ${d.label}: ${d.value} (${d.sharePct.toFixed(1)}%)`),
    '',
    'Popular Cultural Traditions Among Enquiries:',
    ...enquiriesByTradition.map((d) => `- ${d.label}: ${d.value} (${d.sharePct.toFixed(1)}%)`),
    '',
    'Enquiries Over Time:',
    ...enquiriesOverTime.map((p) => `- ${p.period}: ${p.enquiries} enquiries`),
    '',
    'Sample Insights (Rule-Based Simulation):',
    ...aiInsights.map((tip, idx) => `${idx + 1}. ${tip}`),
  ].join('\n');

  return {
    vendor,
    roleLabel: seed.roleLabel,
    dateRange,
    summary: {
      profileViews: totalViews,
      viewsDelta: `${rangeSeed.viewsDelta} ${dateRange.previousPeriodLabel}`,
      enquiries: totalEnquiries,
      enquiriesDelta: `${rangeSeed.enquiriesDelta} ${dateRange.previousPeriodLabel}`,
      conversionRate,
      conversionDelta: `${rangeSeed.conversionDelta} ${dateRange.previousPeriodLabel}`,
      avgResponseHours: rangeSeed.avgResponseHours,
      responseDelta: `${rangeSeed.responseDelta} ${dateRange.previousPeriodLabel}`,
    },
    enquiriesByEventType,
    viewsByEventType,
    enquiriesByTradition,
    enquiriesOverTime,
    aiInsights,
    topEventType,
    topTradition,
    plainTextSummary,
  };
}
