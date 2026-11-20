import { ALL_EVENT_TYPES, getEssentialCategoriesForEvent } from '../data/eventEssentialCategories';
import { ALL_SERVICE_ZONES } from '../data/serviceZones';
import { CulturalTradition, EventTypeTag, MatchTier, ServiceZone, Vendor, VendorCategory } from '../types';
import {
  evaluateCategoryTiers,
  MARKETPLACE_TRADITION_FILTERS,
  matchVendorsToPlan,
  TierVendorCounts,
} from './plannerMatching';

export interface CoverageFailure {
  eventType: EventTypeTag;
  tradition: 'All Traditions' | CulturalTradition;
  region: ServiceZone;
  missingCategories: VendorCategory[];
}

export interface CoverageTestSummary {
  totalCombinations: number;
  passedCombinations: number;
  failedCombinations: CoverageFailure[];
}

export interface SampleCombinationRow {
  category: VendorCategory;
  tierCounts: TierVendorCounts;
  winningTier: MatchTier | null;
  selectedCount: number;
  selectedVendorNames: string[];
}

export interface SampleCombinationReport {
  label: string;
  eventType: EventTypeTag;
  tradition: 'All Traditions' | CulturalTradition;
  region: ServiceZone;
  essentialRows: SampleCombinationRow[];
}

export function runPlanCoverageTest(vendors: Vendor[]): CoverageTestSummary {
  let totalCombinations = 0;
  let passedCombinations = 0;
  const failedCombinations: CoverageFailure[] = [];

  for (const eventType of ALL_EVENT_TYPES) {
    const essentialCategories = getEssentialCategoriesForEvent(eventType);

    for (const tradition of MARKETPLACE_TRADITION_FILTERS) {
      for (const region of ALL_SERVICE_ZONES) {
        totalCombinations += 1;

        const result = matchVendorsToPlan({
          vendors,
          eventType,
          tradition,
          region,
          budget: null,
          guests: null,
          matchMode: 'plan',
        });

        const missingCategories: VendorCategory[] = [];
        for (const essCat of essentialCategories) {
          const group = result.essentialGroups.find((g) => g.category === essCat);
          if (!group || group.vendors.length < 1) {
            missingCategories.push(essCat);
          }
        }

        if (missingCategories.length === 0) {
          passedCombinations += 1;
        } else {
          failedCombinations.push({
            eventType,
            tradition,
            region,
            missingCategories,
          });
        }
      }
    }
  }

  return {
    totalCombinations,
    passedCombinations,
    failedCombinations,
  };
}

export function buildSampleCombinationReports(vendors: Vendor[]): SampleCombinationReport[] {
  const samples: Array<{
    label: string;
    eventType: EventTypeTag;
    tradition: 'All Traditions' | CulturalTradition;
    region: ServiceZone;
  }> = [
    {
      label: 'Engagements and Proposals + Korean + Western suburbs',
      eventType: 'Engagements & Proposals',
      tradition: 'Korean',
      region: 'Western suburbs',
    },
    {
      label: 'Diwali and Festival of Lights + Indian + Adelaide Hills',
      eventType: 'Diwali & Festival of Lights',
      tradition: 'Indian',
      region: 'Adelaide Hills',
    },
    {
      label: 'Eid + Middle Eastern or Muslim + Northern suburbs',
      eventType: 'Eid',
      tradition: 'Middle Eastern or Muslim',
      region: 'Northern suburbs',
    },
  ];

  return samples.map((sample) => {
    const essentialCategories = getEssentialCategoriesForEvent(sample.eventType);
    const essentialRows: SampleCombinationRow[] = essentialCategories.map((cat) => {
      const evaluation = evaluateCategoryTiers({
        vendors,
        category: cat,
        eventType: sample.eventType,
        tradition: sample.tradition,
        region: sample.region,
        budget: null,
        guests: null,
        isEssential: true,
      });
      const picked = evaluation.candidates.slice(0, 2);
      return {
        category: cat,
        tierCounts: evaluation.tierCounts,
        winningTier: evaluation.winningTier,
        selectedCount: picked.length,
        selectedVendorNames: picked.map((p) => p.vendor.businessName),
      };
    });

    return {
      ...sample,
      essentialRows,
    };
  });
}
