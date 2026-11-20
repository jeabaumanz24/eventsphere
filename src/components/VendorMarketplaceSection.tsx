import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
  Search,
  Star,
  MapPin,
  Heart,
  ArrowUpRight,
  Sparkles,
  Scale,
  Check,
  X,
  SlidersHorizontal,
  Info,
} from 'lucide-react';
import { vendorsData } from '../data/mockData';
import {
  MARKETPLACE_REGION_FILTERS,
  serviceZoneToSlug,
} from '../data/serviceZones';
import {
  CulturalTradition,
  EventTypeTag,
  MarketplaceFilterContext,
  MatchTier,
  ServiceZone,
  Vendor,
  VendorCategory,
} from '../types';
import { useLanguage } from '../context/LanguageContext';
import { VendorCompareModal } from './VendorCompareModal';
import { VendorImage } from './VendorImage';
import { trackEvent } from '../utils/analytics';
import { getPageHref } from '../utils/navigation';
import {
  buildMarketplaceUrlQuery,
  buildPlanQueryString,
  getEventSlug,
  MARKETPLACE_TRADITION_FILTERS,
  MarketplaceMatchMode,
  marketplaceTraditionToSlug,
  MatchedVendorItem,
  matchVendorsToPlan,
  parseMarketplaceUrlParams,
} from '../utils/plannerMatching';

interface VendorMarketplaceSectionProps {
  isPagePrimary?: boolean;
  onSelectVendor: (vendor: Vendor, filterContext?: MarketplaceFilterContext) => void;
  onNotify?: (message: string) => void;
  wishlistIds?: string[];
  onToggleWishlist?: (vendor: Vendor) => void;
  onPlannerFilterChange?: (isPlannerFiltered: boolean) => void;
}

const EVENT_TYPE_FILTERS: Array<'All Events' | EventTypeTag> = [
  'All Events',
  'Weddings',
  'Engagements & Proposals',
  'Elopements',
  'Milestone Birthdays',
  'Diwali & Festival of Lights',
  'Lunar New Year',
  'Eid',
  'Christenings & Baby Showers',
  'Graduations',
  'Community Festivals',
  'Corporate Events',
];

const VENDOR_CATEGORIES: Array<'All' | VendorCategory> = [
  'All',
  'Caterers',
  'Entertainment & DJs',
  'Venues & Marquees',
  'Decor & Styling',
  'Photographers',
  'Planners',
  'Florists',
  'Makeup Artists',
  'Cultural Specialists',
];

function getMatchTierBadgeClasses(tier: MatchTier): string {
  switch (tier) {
    case 'exact':
      return 'bg-[#F2CCC3]/55 text-[#724319] border-[#EBC1B6]';
    case 'area':
      return 'bg-[#FFF8F6] text-[#724319] border-[#8A5A44]/50';
    case 'neutral':
      return 'bg-amber-50 text-[#724319] border-amber-200';
    case 'closest':
    default:
      return 'bg-stone-100 text-[#724319] border-stone-300';
  }
}

export const VendorMarketplaceSection: React.FC<VendorMarketplaceSectionProps> = ({
  isPagePrimary = false,
  onSelectVendor,
  onNotify,
  wishlistIds,
  onToggleWishlist,
  onPlannerFilterChange,
}) => {
  const { t } = useLanguage();
  const HeadingTag = isPagePrimary ? 'h1' : 'h2';

  const initialUrlState = useMemo(
    () =>
      typeof window !== 'undefined'
        ? parseMarketplaceUrlParams(window.location.search)
        : parseMarketplaceUrlParams(''),
    []
  );

  const [selectedEventType, setSelectedEventType] = useState<'All Events' | EventTypeTag>(
    initialUrlState.eventType
  );
  const [selectedTradition, setSelectedTradition] = useState<'All Traditions' | CulturalTradition>(
    initialUrlState.tradition
  );
  const [selectedRegion, setSelectedRegion] = useState<'All Regions' | ServiceZone>(
    initialUrlState.region
  );
  const [planBudget, setPlanBudget] = useState<number | null>(initialUrlState.budget);
  const [planGuests, setPlanGuests] = useState<number | null>(initialUrlState.guests);
  const [selectedCategory, setSelectedCategory] = useState<'All' | VendorCategory>(
    initialUrlState.category
  );
  const [searchQuery, setSearchQuery] = useState<string>(initialUrlState.searchQuery);
  const [matchMode, setMatchMode] = useState<MarketplaceMatchMode>(initialUrlState.matchMode);
  const [localWishlistIds, setLocalWishlistIds] = useState<string[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);

  const isApplyingPopstateRef = useRef<boolean>(false);

  // Re-apply URL parameters on browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      isApplyingPopstateRef.current = true;
      const parsed = parseMarketplaceUrlParams(window.location.search);
      setSelectedEventType(parsed.eventType);
      setSelectedTradition(parsed.tradition);
      setSelectedRegion(parsed.region);
      setPlanBudget(parsed.budget);
      setPlanGuests(parsed.guests);
      setSelectedCategory(parsed.category);
      setSearchQuery(parsed.searchQuery);
      setMatchMode(parsed.matchMode);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Keep URL query string synced whenever Marketplace filters change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isApplyingPopstateRef.current) {
      isApplyingPopstateRef.current = false;
      return;
    }

    const nextQuery = buildMarketplaceUrlQuery({
      eventType: selectedEventType,
      tradition: selectedTradition,
      region: selectedRegion,
      budget: planBudget,
      guests: planGuests,
      category: selectedCategory,
      searchQuery,
      matchMode,
    });

    if (window.location.search !== nextQuery) {
      try {
        window.history.replaceState(null, '', `${window.location.pathname}${nextQuery}`);
      } catch {
        // Ignore history restrictions in sandboxed environments
      }
    }
  }, [
    selectedEventType,
    selectedTradition,
    selectedRegion,
    planBudget,
    planGuests,
    selectedCategory,
    searchQuery,
    matchMode,
  ]);

  const effectiveWishlistIds = wishlistIds ?? localWishlistIds;

  const getVendorDescription = useCallback(
    (vendor: Vendor): string => {
      const key = `vendor.${vendor.id}.desc`;
      const translated = t(key);
      return translated === key ? vendor.description : translated;
    },
    [t]
  );

  const translatedDescriptions = useMemo(() => {
    const map: Record<string, string> = {};
    for (const v of vendorsData) {
      map[v.id] = getVendorDescription(v);
    }
    return map;
  }, [getVendorDescription]);

  // Shared matching engine (plan mode or strict manual filtering)
  const matchedResult = useMemo(
    () =>
      matchVendorsToPlan({
        vendors: vendorsData,
        eventType: selectedEventType,
        tradition: selectedTradition,
        region: selectedRegion,
        budget: planBudget,
        guests: planGuests,
        category: selectedCategory,
        searchQuery,
        translatedDescriptions,
        matchMode,
      }),
    [
      selectedEventType,
      selectedTradition,
      selectedRegion,
      planBudget,
      planGuests,
      selectedCategory,
      searchQuery,
      translatedDescriptions,
      matchMode,
    ]
  );

  const filteredVendors = matchedResult.vendors;
  const hasBudgetPlan = planBudget !== null && planGuests !== null;
  const hasManualCriteria =
    selectedEventType !== 'All Events' ||
    selectedTradition !== 'All Traditions' ||
    selectedRegion !== 'All Regions' ||
    searchQuery.trim() !== '';
  const showMatchedPlanBar =
    matchedResult.isPlanModeActive ||
    hasBudgetPlan ||
    selectedRegion !== 'All Regions' ||
    selectedCategory !== 'All';
  const hasAnyActiveFilter =
    hasManualCriteria || selectedCategory !== 'All' || hasBudgetPlan;
  const isStrictFiltered = matchMode === 'strict' && hasManualCriteria;

  useEffect(() => {
    onPlannerFilterChange?.(hasBudgetPlan);
  }, [hasBudgetPlan, onPlannerFilterChange]);

  const categoryCounts = matchedResult.categoryCounts;

  const clearAllFilters = useCallback(() => {
    setSelectedEventType('All Events');
    setSelectedTradition('All Traditions');
    setSelectedRegion('All Regions');
    setPlanBudget(null);
    setPlanGuests(null);
    setSelectedCategory('All');
    setSearchQuery('');
    setMatchMode('strict');
  }, []);

  const currentFilterContext = useMemo<MarketplaceFilterContext>(
    () => ({
      eventType: selectedEventType,
      tradition: selectedTradition,
      region: selectedRegion,
      guests: planGuests,
    }),
    [selectedEventType, selectedTradition, selectedRegion, planGuests]
  );

  const editPlanHref = useMemo(() => {
    if (!hasBudgetPlan) return getPageHref('ai-planner');
    const plannerEvent: EventTypeTag =
      selectedEventType === 'All Events' ? 'Milestone Birthdays' : selectedEventType;
    const query = buildPlanQueryString({
      event: plannerEvent,
      traditionSlug: marketplaceTraditionToSlug(selectedTradition),
      budget: planBudget,
      guests: planGuests,
      region: selectedRegion,
    });
    return getPageHref('ai-planner', query);
  }, [
    hasBudgetPlan,
    selectedEventType,
    selectedTradition,
    planBudget,
    planGuests,
    selectedRegion,
  ]);

  const toggleFavorite = (e: React.MouseEvent, vendor: Vendor) => {
    e.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist(vendor);
      return;
    }
    setLocalWishlistIds((prev) =>
      prev.includes(vendor.id) ? prev.filter((item) => item !== vendor.id) : [...prev, vendor.id]
    );
  };

  const comparedVendors = useMemo(() => {
    return compareIds
      .map((id) => vendorsData.find((v) => v.id === id))
      .filter((v): v is Vendor => Boolean(v));
  }, [compareIds]);

  const toggleCompare = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        const next = prev.filter((item) => item !== id);
        if (next.length === 0) setIsCompareOpen(false);
        return next;
      }
      if (prev.length >= 3) {
        onNotify?.(t('compare.maxToast'));
        return prev;
      }
      return [...prev, id];
    });
  };

  const removeFromCompare = (id: string) => {
    setCompareIds((prev) => {
      const next = prev.filter((item) => item !== id);
      if (next.length === 0) setIsCompareOpen(false);
      return next;
    });
  };

  const clearCompare = () => {
    setCompareIds([]);
    setIsCompareOpen(false);
  };

  const renderVendorCard = (item: MatchedVendorItem, showMatchLabel: boolean) => {
    const { vendor, matchTier, matchLabel } = item;
    const isFav = effectiveWishlistIds.includes(vendor.id);
    const isCompared = compareIds.includes(vendor.id);
    const isWithinBudget = hasBudgetPlan && Boolean(matchedResult.withinBudgetMap[vendor.id]);
    const hasRating = typeof vendor.rating === 'number' && typeof vendor.reviewCount === 'number';

    return (
      <div
        key={vendor.id}
        onClick={() => onSelectVendor(vendor, currentFilterContext)}
        className={`group bg-white rounded-3xl overflow-hidden border shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 flex flex-col justify-between cursor-pointer ${
          isCompared
            ? 'border-[#724319] ring-2 ring-[#724319]/25'
            : 'border-[#EBC1B6]/70'
        }`}
      >
        <div>
          {/* Image with overlay badge and bookmark */}
          <div className="relative aspect-[16/10] overflow-hidden bg-[#F2CCC3]/50">
            <VendorImage
              vendor={vendor}
              variant="card"
              imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              loading="lazy"
            />
            {vendor.image && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80" />
            )}

            {/* Category Label */}
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold text-[#724319] shadow-xs">
              {t(`cat.${vendor.category}`)}
            </div>

            {/* Heart Favorite button */}
            <button
              type="button"
              onClick={(e) => toggleFavorite(e, vendor)}
              className={`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all shadow-xs cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724319] ${
                isFav
                  ? 'bg-white text-rose-500 ring-2 ring-rose-200 scale-105'
                  : 'bg-white/90 text-[#724319] hover:text-rose-600'
              }`}
              aria-label={isFav ? t('wishlist.savedAria') : t('wishlist.saveAria')}
              aria-pressed={isFav}
              title={isFav ? t('wishlist.savedAria') : t('wishlist.saveAria')}
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            {/* Starting Price tag */}
            <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-mono text-white">
              {t('marketplace.from')} {vendor.startingPrice}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {(showMatchLabel || isWithinBudget) && (
              <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
                {showMatchLabel && (
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getMatchTierBadgeClasses(
                      matchTier
                    )}`}
                  >
                    {matchLabel}
                  </span>
                )}
                {isWithinBudget && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-900 border border-emerald-300">
                    <Check className="w-3 h-3 text-emerald-700" aria-hidden="true" />
                    <span>Within your budget</span>
                  </span>
                )}
              </div>
            )}

            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h3 className="text-lg font-serif font-bold text-[#724319] group-hover:text-[#8A5A44] transition-colors leading-snug">
                {vendor.businessName}
              </h3>
              {hasRating && (
                <div className="flex items-center gap-1 text-xs font-semibold text-[#724319] shrink-0 tabular-nums">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                  <span>
                    {Number.isInteger(vendor.rating) ? `${vendor.rating}.0` : vendor.rating}
                  </span>
                  <span className="text-[11px] text-[#724319]/65 font-normal">
                    ({vendor.reviewCount})
                  </span>
                </div>
              )}
            </div>

            {/* Lead Artisan Name */}
            <div className="text-xs font-medium text-[#6E432F] mb-2.5">
              {t('marketplace.lead')} {vendor.name}
            </div>

            {/* Location text */}
            <div className="flex items-center gap-1.5 text-xs text-[#724319]/80 mb-3">
              <MapPin className="w-3.5 h-3.5 text-[#8A5A44] shrink-0" aria-hidden="true" />
              <span>{vendor.location}</span>
            </div>

            <p className="text-xs text-[#724319]/85 line-clamp-2 leading-relaxed mb-3.5">
              {getVendorDescription(vendor)}
            </p>

            {/* Event-Type Tags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {vendor.eventTypes.slice(0, 6).map((evType) => (
                <span
                  key={evType}
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                    selectedEventType === evType
                      ? 'bg-[#724319] text-white border-[#724319]'
                      : 'bg-[#FFF8F6] text-[#724319]/90 border-[#EBC1B6]/70'
                  }`}
                >
                  {t(`eventType.${evType}`)}
                </span>
              ))}
            </div>

            {/* Cultural Specialties unboxed text with dot separator */}
            <div className="text-[11px] text-[#6E432F] flex flex-wrap items-center gap-x-1.5 gap-y-1">
              {vendor.culturalSpecialties.map((spec, i) => (
                <React.Fragment key={spec}>
                  <span>{spec}</span>
                  {i < vendor.culturalSpecialties.length - 1 && (
                    <span aria-hidden="true" className="text-[#EBC1B6]">
                      ·
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Card Action footer */}
        <div className="px-5 py-3.5 bg-[#FFF8F6] border-t border-[#EBC1B6]/40 flex items-center justify-between gap-2 text-xs font-semibold text-[#724319]">
          <button
            type="button"
            onClick={(e) => toggleCompare(e, vendor.id)}
            aria-pressed={isCompared}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-semibold transition-all cursor-pointer shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724319] ${
              isCompared
                ? 'bg-[#724319] text-white border-[#724319] shadow-2xs'
                : 'bg-white text-[#724319] border-[#EBC1B6] hover:border-[#8A5A44] hover:bg-[#F2CCC3]/30'
            }`}
          >
            {isCompared ? (
              <Check className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
              <Scale className="w-3.5 h-3.5 text-[#8A5A44]" aria-hidden="true" />
            )}
            <span>{isCompared ? t('compare.btnAdded') : t('compare.btnAdd')}</span>
          </button>

          <div className="inline-flex items-center gap-2 ml-auto">
            <span>{t('marketplace.viewProfile')}</span>
            <div className="w-7 h-7 rounded-full bg-white border border-[#EBC1B6] flex items-center justify-center group-hover:bg-[#724319] group-hover:text-white transition-all shrink-0">
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section
      id="marketplace"
      className={`${
        isPagePrimary ? 'pt-32 pb-20 md:pt-36 md:pb-24' : 'py-20 md:py-28'
      } bg-[#FFF8F6] relative`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#8A5A44]">
            {t('marketplace.kicker')}
          </span>
          <HeadingTag className="text-3xl sm:text-4xl font-serif font-bold text-[#724319] [text-wrap:balance]">
            {t('marketplace.title')}
          </HeadingTag>
          <p className="text-sm sm:text-base text-[#724319]/80 leading-relaxed [text-wrap:balance]">
            {t('marketplace.subtitle')}
          </p>
        </div>

        {/* Matched Plan Summary Bar */}
        {showMatchedPlanBar && (
          <div
            aria-live="polite"
            className="mb-6 bg-white rounded-2xl border border-[#724319]/30 shadow-xs px-5 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3 min-w-0">
              <span className="w-8 h-8 rounded-xl bg-[#F2CCC3]/50 border border-[#EBC1B6] flex items-center justify-center shrink-0 text-[#724319]">
                <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
              </span>
              <div className="min-w-0 space-y-1">
                <p className="text-xs sm:text-sm font-semibold text-[#724319] leading-snug">
                  Matched to your plan:{' '}
                  <span className="font-bold">
                    {[
                      selectedEventType !== 'All Events'
                        ? t(`eventType.${selectedEventType}`)
                        : hasBudgetPlan
                          ? t('eventType.All Events')
                          : null,
                      selectedCategory !== 'All' ? t(`cat.${selectedCategory}`) : null,
                      selectedTradition !== 'All Traditions' ? selectedTradition : null,
                      selectedRegion !== 'All Regions' ? selectedRegion : null,
                      hasBudgetPlan && planBudget !== null
                        ? `$${planBudget.toLocaleString()} AUD`
                        : null,
                      hasBudgetPlan && planGuests !== null ? `${planGuests} guests` : null,
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </span>
                </p>

                {matchedResult.isPlanModeActive ? (
                  <div className="space-y-0.5 text-xs text-[#6E432F]">
                    <p className="font-medium text-[#724319]">
                      {selectedCategory !== 'All' ? (
                        <>
                          Showing{' '}
                          <span className="font-bold tabular-nums">{filteredVendors.length}</span>{' '}
                          {t(`cat.${selectedCategory}`).toLowerCase()} for{' '}
                          {t(`eventType.${selectedEventType}`)}
                        </>
                      ) : (
                        <>
                          We found{' '}
                          <span className="font-bold tabular-nums">
                            {matchedResult.essentialServiceCount}
                          </span>{' '}
                          essential services for your plan
                        </>
                      )}
                      {hasBudgetPlan && matchedResult.withinBudgetCount > 0
                        ? ` · ${matchedResult.withinBudgetCount} within your category budget share`
                        : ''}
                    </p>
                    {matchedResult.relaxationMessage && (
                      <p className="text-xs text-[#6E432F]">{matchedResult.relaxationMessage}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-[#6E432F]">
                    {hasBudgetPlan
                      ? matchedResult.withinBudgetCount > 0
                        ? `${matchedResult.withinBudgetCount} ${
                            matchedResult.withinBudgetCount === 1 ? 'vendor fits' : 'vendors fit'
                          } your category budget share — sorted first.`
                        : 'Sorted by category relevance for your selected celebration.'
                      : selectedCategory !== 'All'
                        ? `Showing ${filteredVendors.length} ${t(`cat.${selectedCategory}`).toLowerCase()}${
                            selectedRegion !== 'All Regions' ? ` serving ${selectedRegion}` : ''
                          }.`
                        : `Showing vendors serving ${selectedRegion}.`}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              {hasBudgetPlan && (
                <a
                  href={editPlanHref}
                  className="px-3.5 py-2 rounded-full text-xs font-semibold text-[#724319] bg-[#FFF8F6] hover:bg-[#F2CCC3]/45 border border-[#EBC1B6] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724319]"
                >
                  Edit plan
                </a>
              )}
              <button
                type="button"
                onClick={clearAllFilters}
                className="px-3.5 py-2 rounded-full text-xs font-semibold text-white bg-[#724319] hover:bg-[#8A5A44] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724319]"
              >
                Clear filters
              </button>
            </div>
          </div>
        )}

        {/* Event-Type, Cultural-Tradition & Region Filters Card */}
        <div className="mb-8 bg-white rounded-3xl p-5 sm:p-6 border border-[#EBC1B6]/80 shadow-xs space-y-5">
          {/* Event Type Filter */}
          <div className="space-y-3" role="group" aria-labelledby="event-filter-label">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span
                id="event-filter-label"
                className="text-xs font-semibold uppercase tracking-wider text-[#6E432F]"
              >
                {t('eventFilter.label')}
              </span>
              {selectedEventType !== 'All Events' && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedEventType('All Events');
                    setMatchMode('strict');
                  }}
                  className="text-xs font-medium text-[#724319] hover:text-[#4A2B10] underline decoration-[#EBC1B6] underline-offset-4 cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724319]"
                >
                  {t('eventType.All Events')}
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {EVENT_TYPE_FILTERS.map((eventOpt) => {
                const isSelected = selectedEventType === eventOpt;
                return (
                  <button
                    key={eventOpt}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => {
                      const nextMode: MarketplaceMatchMode =
                        eventOpt === 'All Events' ? 'strict' : 'plan';
                      setSelectedEventType(eventOpt);
                      setMatchMode(nextMode);
                      const preview = matchVendorsToPlan({
                        vendors: vendorsData,
                        eventType: eventOpt,
                        tradition: selectedTradition,
                        region: selectedRegion,
                        budget: planBudget,
                        guests: planGuests,
                        category: selectedCategory,
                        searchQuery,
                        translatedDescriptions,
                        matchMode: nextMode,
                      });
                      trackEvent('marketplace_filter_used', {
                        filter_type: 'event_type',
                        event_type: eventOpt === 'All Events' ? 'all' : getEventSlug(eventOpt),
                        match_tier: preview.overallMatchTier,
                      });
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-all motion-reduce:transition-none cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724319] ${
                      isSelected
                        ? 'bg-[#724319] text-white shadow-xs font-semibold'
                        : 'bg-[#FFF8F6] hover:bg-[#F2CCC3]/50 text-[#724319] border border-[#EBC1B6]/70'
                    }`}
                  >
                    {t(`eventType.${eventOpt}`)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cultural Tradition Filter */}
          <div
            className="pt-4 border-t border-[#EBC1B6]/50 space-y-3"
            role="group"
            aria-labelledby="tradition-filter-label"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span
                id="tradition-filter-label"
                className="text-xs font-semibold uppercase tracking-wider text-[#6E432F]"
              >
                Cultural tradition
              </span>
              {selectedTradition !== 'All Traditions' && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTradition('All Traditions');
                    if (selectedEventType !== 'All Events') {
                      setMatchMode('plan');
                    }
                  }}
                  className="text-xs font-medium text-[#724319] hover:text-[#4A2B10] underline decoration-[#EBC1B6] underline-offset-4 cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724319]"
                >
                  All Traditions
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {MARKETPLACE_TRADITION_FILTERS.map((traditionOpt) => {
                const isSelected = selectedTradition === traditionOpt;
                return (
                  <button
                    key={traditionOpt}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => {
                      const nextMode: MarketplaceMatchMode =
                        selectedEventType !== 'All Events' ? 'plan' : 'strict';
                      setSelectedTradition(traditionOpt);
                      setMatchMode(nextMode);
                      const preview = matchVendorsToPlan({
                        vendors: vendorsData,
                        eventType: selectedEventType,
                        tradition: traditionOpt,
                        region: selectedRegion,
                        budget: planBudget,
                        guests: planGuests,
                        category: selectedCategory,
                        searchQuery,
                        translatedDescriptions,
                        matchMode: nextMode,
                      });
                      trackEvent('marketplace_filter_used', {
                        filter_type: 'cultural_tradition',
                        tradition:
                          traditionOpt === 'All Traditions'
                            ? 'all'
                            : marketplaceTraditionToSlug(traditionOpt),
                        ...(selectedRegion !== 'All Regions'
                          ? { region: serviceZoneToSlug(selectedRegion) }
                          : {}),
                        match_tier: preview.overallMatchTier,
                      });
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-all motion-reduce:transition-none cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724319] ${
                      isSelected
                        ? 'bg-[#724319] text-white shadow-xs font-semibold'
                        : 'bg-[#FFF8F6] hover:bg-[#F2CCC3]/50 text-[#724319] border border-[#EBC1B6]/70'
                    }`}
                  >
                    {traditionOpt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Region Filter (Shared 9 South Australian Service Zones) */}
          <div
            className="pt-4 border-t border-[#EBC1B6]/50 space-y-3"
            role="group"
            aria-labelledby="region-filter-label"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span
                id="region-filter-label"
                className="text-xs font-semibold uppercase tracking-wider text-[#6E432F]"
              >
                Region
              </span>
              {selectedRegion !== 'All Regions' && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRegion('All Regions');
                    if (selectedEventType !== 'All Events') {
                      setMatchMode('plan');
                    }
                  }}
                  className="text-xs font-medium text-[#724319] hover:text-[#4A2B10] underline decoration-[#EBC1B6] underline-offset-4 cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724319]"
                >
                  All Regions
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {MARKETPLACE_REGION_FILTERS.map((regionOpt) => {
                const isSelected = selectedRegion === regionOpt;
                return (
                  <button
                    key={regionOpt}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => {
                      const nextMode: MarketplaceMatchMode =
                        selectedEventType !== 'All Events' ? 'plan' : 'strict';
                      setSelectedRegion(regionOpt);
                      setMatchMode(nextMode);
                      const preview = matchVendorsToPlan({
                        vendors: vendorsData,
                        eventType: selectedEventType,
                        tradition: selectedTradition,
                        region: regionOpt,
                        budget: planBudget,
                        guests: planGuests,
                        category: selectedCategory,
                        searchQuery,
                        translatedDescriptions,
                        matchMode: nextMode,
                      });
                      trackEvent('marketplace_filter_used', {
                        filter_type: 'region',
                        region:
                          regionOpt === 'All Regions' ? 'all' : serviceZoneToSlug(regionOpt),
                        match_tier: preview.overallMatchTier,
                      });
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all motion-reduce:transition-none cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724319] ${
                      isSelected
                        ? 'bg-[#724319] text-white shadow-xs font-semibold'
                        : 'bg-[#FFF8F6] hover:bg-[#F2CCC3]/50 text-[#724319] border border-[#EBC1B6]/70'
                    }`}
                  >
                    {regionOpt}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <label htmlFor="marketplace-search" className="sr-only">
                Search vendors by name, suburb, celebration or cultural specialty
              </label>
              <Search
                className="w-4 h-4 text-[#8A5A44] absolute left-4 top-1/2 -translate-y-1/2"
                aria-hidden="true"
              />
              <input
                id="marketplace-search"
                type="text"
                placeholder={t('marketplace.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setMatchMode('strict');
                }}
                className="w-full pl-11 pr-20 py-3 bg-white border border-[#EBC1B6] rounded-2xl text-sm text-[#724319] placeholder:text-[#6E432F]/65 focus:outline-none focus:ring-2 focus:ring-[#724319]/35 focus:border-[#724319] transition-all shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search query"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[#724319] hover:text-[#4A2B10] px-2 py-1 cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724319]"
                >
                  {t('marketplace.clear')}
                </button>
              )}
            </div>
          </div>

          {/* Interactive Category Filter Pills */}
          <div
            className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none"
            role="group"
            aria-label="Vendor categories"
          >
            {VENDOR_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              const count = categoryCounts[cat] ?? 0;
              return (
                <button
                  key={cat}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => {
                    setSelectedCategory(cat);
                    trackEvent('marketplace_filter_used', {
                      filter_type: 'category',
                      event_type:
                        selectedEventType === 'All Events'
                          ? 'all'
                          : getEventSlug(selectedEventType),
                      category: cat,
                      match_tier: matchedResult.overallMatchTier,
                    });
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all motion-reduce:transition-none cursor-pointer shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724319] ${
                    isActive
                      ? 'bg-[#724319] text-white shadow-xs font-semibold'
                      : 'bg-white hover:bg-[#F2CCC3]/40 text-[#724319] border border-[#EBC1B6]/60'
                  }`}
                >
                  {t(`cat.${cat}`)}{' '}
                  <span className={`ml-1 tabular-nums ${isActive ? 'text-white/85' : 'text-[#6E432F]'}`}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Result Count, Strict Mode Toggle & Plan Matching Status */}
        <div className="mb-6 space-y-3" aria-live="polite">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs sm:text-sm font-medium text-[#724319]">
              {matchedResult.isPlanModeActive ? (
                <>
                  We found{' '}
                  <span className="font-bold tabular-nums">
                    {matchedResult.essentialServiceCount}
                  </span>{' '}
                  essential services for your plan
                  {matchedResult.addOnVendors.length > 0 && (
                    <span className="text-[#6E432F]">
                      {' '}
                      · plus {matchedResult.addOnVendors.length} add-on{' '}
                      {matchedResult.addOnVendors.length === 1 ? 'option' : 'options'}
                    </span>
                  )}
                </>
              ) : (
                <>
                  Showing <span className="font-bold tabular-nums">{filteredVendors.length}</span> of{' '}
                  <span className="font-bold tabular-nums">{vendorsData.length}</span> vendors
                  {hasBudgetPlan && matchedResult.withinBudgetCount > 0 && (
                    <span className="text-[#6E432F]">
                      {' '}
                      · {matchedResult.withinBudgetCount} within your budget
                    </span>
                  )}
                </>
              )}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              {isStrictFiltered && selectedEventType !== 'All Events' && (
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#6E432F]">
                  <span>Showing exact matches only</span>
                  <span aria-hidden="true" className="text-[#EBC1B6]">
                    ·
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setMatchMode('plan');
                      const preview = matchVendorsToPlan({
                        vendors: vendorsData,
                        eventType: selectedEventType,
                        tradition: selectedTradition,
                        region: selectedRegion,
                        budget: planBudget,
                        guests: planGuests,
                        category: selectedCategory,
                        searchQuery,
                        translatedDescriptions,
                        matchMode: 'plan',
                      });
                      trackEvent('marketplace_filter_used', {
                        filter_type: 'include_closest_matches',
                        event_type: getEventSlug(selectedEventType),
                        match_tier: preview.overallMatchTier,
                      });
                    }}
                    className="font-semibold text-[#724319] hover:text-[#4A2B10] underline decoration-[#8A5A44] underline-offset-4 cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724319]"
                  >
                    Include closest matches
                  </button>
                </div>
              )}

              {isStrictFiltered && selectedEventType === 'All Events' && (
                <span className="text-xs text-[#6E432F]">Showing exact matches only</span>
              )}

              {matchedResult.isPlanModeActive && (
                <button
                  type="button"
                  onClick={() => setMatchMode('strict')}
                  className="text-xs font-medium text-[#6E432F] hover:text-[#724319] underline decoration-[#EBC1B6] underline-offset-4 cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724319]"
                >
                  Show exact matches only
                </button>
              )}

              {hasAnyActiveFilter && !showMatchedPlanBar && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs font-semibold text-[#724319] hover:text-[#4A2B10] underline decoration-[#EBC1B6] underline-offset-4 cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724319]"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {matchedResult.isPlanModeActive && matchedResult.relaxationMessage && (
            <div
              role="status"
              className="rounded-2xl bg-white border border-[#8A5A44]/40 px-4 py-3 flex items-start gap-2.5 text-xs sm:text-sm text-[#724319]"
            >
              <Info className="w-4 h-4 text-[#724319] shrink-0 mt-0.5" aria-hidden="true" />
              <span>{matchedResult.relaxationMessage}</span>
            </div>
          )}
        </div>

        {/* Active Inline Compare Tray Banner */}
        {comparedVendors.length > 0 && (
          <div className="mb-8 bg-white rounded-2xl border border-[#8A5A44]/50 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#724319] mr-1">
                <Scale className="w-4 h-4 text-[#8A5A44]" aria-hidden="true" />
                <span>{t('compare.selectedCount', { count: comparedVendors.length })}</span>
              </span>
              {comparedVendors.map((v) => (
                <span
                  key={v.id}
                  className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full bg-[#FFF8F6] border border-[#EBC1B6] text-xs font-medium text-[#724319]"
                >
                  <span className="truncate max-w-[160px]">{v.businessName}</span>
                  <button
                    type="button"
                    onClick={() => removeFromCompare(v.id)}
                    className="w-4 h-4 rounded-full hover:bg-[#F2CCC3]/60 flex items-center justify-center text-[#8A5A44] hover:text-[#724319] cursor-pointer"
                    aria-label={`${t('compare.remove')} ${v.businessName}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {comparedVendors.length === 1 && (
                <span className="text-[11px] text-[#8A5A44] italic">
                  {t('compare.addMoreHint')}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={clearCompare}
                className="px-3 py-1.5 rounded-full text-xs font-medium text-[#8A5A44] hover:text-[#724319] bg-[#FFF8F6] border border-[#EBC1B6] transition-colors cursor-pointer"
              >
                {t('compare.clearAll')}
              </button>
              <button
                type="button"
                onClick={() => setIsCompareOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-[#724319] hover:bg-[#8A5A44] text-white transition-colors shadow-xs cursor-pointer"
              >
                <Scale className="w-3.5 h-3.5" aria-hidden="true" />
                <span>
                  {t('compare.openTable')} ({comparedVendors.length})
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Vendor Results: Plan Mode (Essentials first, then Add-ons) vs Strict / Default Grid */}
        {matchedResult.isPlanModeActive && selectedEventType !== 'All Events' ? (
          <div className="space-y-12">
            {/* Essentials Section */}
            {matchedResult.essentialGroups.length > 0 && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2 pb-2 border-b border-[#EBC1B6]/70">
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#724319]">
                    Essentials for {t(`eventType.${selectedEventType}`)}
                  </h2>
                  <span className="text-xs font-medium text-[#6E432F]">
                    Core categories for this celebration
                  </span>
                </div>

                {matchedResult.essentialGroups.some((g) => g.emptyMessage) && (
                  <div className="space-y-2">
                    {matchedResult.essentialGroups
                      .filter((g) => g.emptyMessage)
                      .map((g) => (
                        <div
                          key={g.category}
                          role="status"
                          className="p-4 rounded-2xl bg-white border border-[#EBC1B6] text-xs sm:text-sm text-[#724319]"
                        >
                          {g.emptyMessage}
                        </div>
                      ))}
                  </div>
                )}

                {matchedResult.essentialVendors.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                    {matchedResult.essentialVendors.map((item) => renderVendorCard(item, true))}
                  </div>
                )}
              </div>
            )}

            {/* Add-ons Section */}
            {matchedResult.addOnVendors.length > 0 && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2 pb-2 border-b border-[#EBC1B6]/70">
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#724319]">
                    Add-ons
                  </h2>
                  <span className="text-xs font-medium text-[#6E432F]">
                    Optional extras and additional matching vendors
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                  {matchedResult.addOnVendors.map((item) => renderVendorCard(item, true))}
                </div>
              </div>
            )}
          </div>
        ) : filteredVendors.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#EBC1B6] p-8 max-w-lg mx-auto space-y-3">
            <Sparkles className="w-8 h-8 text-[#8A5A44] mx-auto" aria-hidden="true" />
            <h3 className="text-lg font-serif font-bold text-[#724319]">
              {t('marketplace.noVendors')}
            </h3>
            <p className="text-xs text-[#724319]/80">
              {t('marketplace.noVendorsDesc', {
                query: searchQuery || t(`eventType.${selectedEventType}`),
              })}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              {isStrictFiltered && selectedEventType !== 'All Events' && (
                <button
                  type="button"
                  onClick={() => setMatchMode('plan')}
                  className="px-4 py-2 bg-[#724319] hover:bg-[#8A5A44] text-white rounded-full text-xs font-medium cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724319]"
                >
                  Include closest matches
                </button>
              )}
              <button
                type="button"
                onClick={clearAllFilters}
                className={`px-4 py-2 rounded-full text-xs font-medium cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724319] ${
                  isStrictFiltered && selectedEventType !== 'All Events'
                    ? 'bg-[#FFF8F6] hover:bg-[#F2CCC3]/50 text-[#724319] border border-[#EBC1B6]'
                    : 'bg-[#724319] hover:bg-[#8A5A44] text-white'
                }`}
              >
                {t('marketplace.resetFilters')}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {matchedResult.matchedItems.map((item) =>
              renderVendorCard(item, hasManualCriteria)
            )}
          </div>
        )}
      </div>

      {/* Floating Bottom Compare Tray (Visible Whenever 1–3 Vendors Are Selected) */}
      {comparedVendors.length > 0 && !isCompareOpen && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-1.5rem)] max-w-3xl bg-white/95 backdrop-blur-md border border-[#8A5A44]/50 rounded-2xl shadow-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex -space-x-2 shrink-0">
              {comparedVendors.map((v) => (
                <VendorImage
                  key={v.id}
                  vendor={v}
                  variant="avatar"
                  className="w-8 h-8 rounded-full border-2 border-white shadow-xs"
                  imgClassName="w-8 h-8 rounded-full object-cover border-2 border-white shadow-xs"
                />
              ))}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-[#724319]">
                {t('compare.selectedCount', { count: comparedVendors.length })}
              </div>
              <div className="text-[11px] text-[#8A5A44] truncate max-w-[220px] sm:max-w-[340px]">
                {comparedVendors.map((v) => v.businessName).join(' · ')}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto shrink-0">
            <button
              type="button"
              onClick={clearCompare}
              className="px-3 py-1.5 rounded-full text-xs font-medium text-[#8A5A44] hover:text-[#724319] bg-[#FFF8F6] border border-[#EBC1B6] transition-colors cursor-pointer"
            >
              {t('compare.clearAll')}
            </button>
            <button
              type="button"
              onClick={() => setIsCompareOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[#724319] hover:bg-[#8A5A44] text-white transition-colors shadow-xs cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t('compare.openTable')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Side-by-Side Vendor Comparison Table Modal */}
      <VendorCompareModal
        isOpen={isCompareOpen}
        vendors={comparedVendors}
        onClose={() => setIsCompareOpen(false)}
        onRemoveVendor={removeFromCompare}
        onClearAll={clearCompare}
        onSelectVendor={(vendor) => onSelectVendor(vendor, currentFilterContext)}
      />
    </section>
  );
};
