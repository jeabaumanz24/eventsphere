import React, { useState, useMemo, useEffect } from 'react';
import {
  Sparkles,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  ChevronDown,
  Info,
} from 'lucide-react';
import { EventTimeline } from './EventTimeline';
import { useLanguage } from '../context/LanguageContext';
import { trackEvent } from '../utils/analytics';
import { getPageHref } from '../utils/navigation';
import { EventTypeTag } from '../types';
import { vendorsData } from '../data/mockData';
import {
  getCulturalAdjustment,
  PLANNER_CULTURAL_TRADITIONS,
  PLANNER_EVENT_CONFIGS,
  PLANNER_EVENT_TYPES,
  PlannerCulturalTradition,
} from '../data/plannerConfigs';
import {
  buildPlanQueryString,
  getEventSlug,
  matchVendorsToPlan,
  parseEventParam,
  parsePlannerTraditionParam,
  parsePositiveIntParam,
  plannerTraditionToMarketplace,
  plannerTraditionToSlug,
} from '../utils/plannerMatching';

interface AIPlannerSectionProps {
  isPagePrimary?: boolean;
  onExploreVendors?: () => void;
  onOpenConsult?: () => void;
  onScheduleExported?: (msg: string) => void;
}

interface InitialPlannerState {
  eventType: EventTypeTag;
  tradition: PlannerCulturalTradition;
  budget: number;
  guests: number;
}

function readPlannerStateFromUrl(): InitialPlannerState {
  const defaultEvent: EventTypeTag = 'Milestone Birthdays';
  const defaultConfig = PLANNER_EVENT_CONFIGS[defaultEvent];
  const fallback: InitialPlannerState = {
    eventType: defaultEvent,
    tradition: 'None',
    budget: defaultConfig.defaultBudget,
    guests: defaultConfig.defaultGuests,
  };

  if (typeof window === 'undefined') return fallback;
  try {
    const params = new URLSearchParams(window.location.search);
    const parsedEvent = parseEventParam(params.get('event') ?? params.get('eventType'));
    const eventType: EventTypeTag =
      parsedEvent !== 'All Events' && parsedEvent in PLANNER_EVENT_CONFIGS
        ? parsedEvent
        : defaultEvent;
    const config = PLANNER_EVENT_CONFIGS[eventType];
    const tradition = parsePlannerTraditionParam(params.get('tradition'));
    const parsedBudget = parsePositiveIntParam(params.get('budget'), 2500, 120000);
    const parsedGuests = parsePositiveIntParam(params.get('guests'), 10, 400);

    return {
      eventType,
      tradition,
      budget: parsedBudget ?? config.defaultBudget,
      guests: parsedGuests ?? config.defaultGuests,
    };
  } catch {
    return fallback;
  }
}

export const AIPlannerSection: React.FC<AIPlannerSectionProps> = ({
  isPagePrimary = false,
  onExploreVendors,
  onScheduleExported,
}) => {
  const { t } = useLanguage();
  const HeadingTag = isPagePrimary ? 'h1' : 'h2';

  const initialState = useMemo(() => readPlannerStateFromUrl(), []);

  const [selectedEventType, setSelectedEventType] =
    useState<EventTypeTag>(initialState.eventType);
  const [selectedTradition, setSelectedTradition] =
    useState<PlannerCulturalTradition>(initialState.tradition);
  const [totalBudget, setTotalBudget] = useState<number>(initialState.budget);
  const [guestCount, setGuestCount] = useState<number>(initialState.guests);
  const [activeTab, setActiveTab] = useState<'budget' | 'timeline' | 'insights'>(
    'budget'
  );

  useEffect(() => {
    const handlePopState = () => {
      const next = readPlannerStateFromUrl();
      setSelectedEventType(next.eventType);
      setSelectedTradition(next.tradition);
      setTotalBudget(next.budget);
      setGuestCount(next.guests);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const eventConfig = PLANNER_EVENT_CONFIGS[selectedEventType];
  const culturalAdjustment = useMemo(
    () => getCulturalAdjustment(selectedEventType, selectedTradition),
    [selectedEventType, selectedTradition]
  );

  const matchedPlan = useMemo(
    () =>
      matchVendorsToPlan({
        vendors: vendorsData,
        eventType: selectedEventType,
        tradition: plannerTraditionToMarketplace(selectedTradition),
        budget: totalBudget,
        guests: guestCount,
      }),
    [selectedEventType, selectedTradition, totalBudget, guestCount]
  );

  const matchingVendorCount = matchedPlan.vendors.length;

  const planQueryString = useMemo(
    () =>
      buildPlanQueryString({
        event: selectedEventType,
        traditionSlug: plannerTraditionToSlug(selectedTradition),
        budget: totalBudget,
        guests: guestCount,
      }),
    [selectedEventType, selectedTradition, totalBudget, guestCount]
  );

  const vendorsMatchHref = getPageHref('vendors', planQueryString);

  const handleMatchVendorsClick = () => {
    trackEvent('marketplace_filter_used', {
      filter_type: 'planner_match',
      event_type: getEventSlug(selectedEventType),
    });
  };

  const handleEventTypeChange = (nextType: EventTypeTag) => {
    const nextConfig = PLANNER_EVENT_CONFIGS[nextType];
    setSelectedEventType(nextType);
    setTotalBudget(nextConfig.defaultBudget);
    setGuestCount(nextConfig.defaultGuests);

    trackEvent('budget_calculator_used', {
      action: 'event_type_select',
      event_type: nextType,
      culture: selectedTradition,
      budget_aud: nextConfig.defaultBudget,
      guest_count: nextConfig.defaultGuests,
    });

    if (activeTab === 'timeline') {
      trackEvent('timeline_generated', {
        action: 'event_type_select',
        event_type: nextType,
        culture: selectedTradition,
        view_mode: 'roadmap',
      });
    }
  };

  const handleTraditionChange = (nextTradition: PlannerCulturalTradition) => {
    setSelectedTradition(nextTradition);
    trackEvent('budget_calculator_used', {
      action: 'culture_select',
      event_type: selectedEventType,
      culture: nextTradition,
      budget_aud: totalBudget,
      guest_count: guestCount,
    });

    if (activeTab === 'timeline') {
      trackEvent('timeline_generated', {
        action: 'culture_select',
        event_type: selectedEventType,
        culture: nextTradition,
        view_mode: 'roadmap',
      });
    }
  };

  const handleSwitchTab = (tab: 'budget' | 'timeline' | 'insights') => {
    setActiveTab(tab);
    if (tab === 'timeline') {
      trackEvent('timeline_generated', {
        action: 'tab_open',
        event_type: selectedEventType,
        culture: selectedTradition,
        view_mode: 'roadmap',
      });
    }
  };

  const costPerGuest = Math.round(totalBudget / Math.max(1, guestCount));
  const bufferAmount = Math.round(totalBudget * 0.07);
  const estimatedSavings = Math.round(totalBudget * 0.07);
  const isBelowSaAvg = costPerGuest <= eventConfig.saAveragePerGuest;

  return (
    <section
      id="ai-planner"
      className={`${
        isPagePrimary ? 'pt-32 pb-20 md:pt-36 md:pb-24' : 'py-20 md:py-28'
      } bg-[#F2CCC3]/25 relative`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#8A5A44]">
            {t('planner.kicker')}
          </span>
          <HeadingTag className="text-3xl sm:text-4xl font-serif font-bold text-[#724319] [text-wrap:balance]">
            {t('planner.title')}
          </HeadingTag>
          <p className="text-sm sm:text-base text-[#724319]/80 leading-relaxed [text-wrap:balance]">
            {t('planner.subtitle')}
          </p>
        </div>

        {/* SaaS-Style Interface Window */}
        <div className="bg-white rounded-3xl border border-[#EBC1B6] shadow-2xl overflow-hidden max-w-5xl mx-auto">
          {/* Top App Toolbar Header */}
          <div className="bg-[#FFF8F6] px-6 py-4 border-b border-[#EBC1B6]/60 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="w-3 h-3 rounded-full bg-rose-400/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-400/80 inline-block" />
              </div>
              <span className="text-xs font-semibold text-[#724319] pl-2 border-l border-[#EBC1B6]">
                {t('planner.studioBar')}
              </span>
            </div>

            {/* Dashboard Navigation Tabs */}
            <div
              role="tablist"
              aria-label={t('planner.title')}
              className="flex flex-wrap items-center gap-1 bg-[#F2CCC3]/30 p-1 rounded-xl"
            >
              <button
                type="button"
                role="tab"
                id="planner-tab-budget"
                aria-selected={activeTab === 'budget'}
                aria-controls="planner-panel-budget"
                onClick={() => handleSwitchTab('budget')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724319] ${
                  activeTab === 'budget'
                    ? 'bg-white text-[#724319] shadow-xs font-semibold'
                    : 'text-[#724319]/75 hover:text-[#724319]'
                }`}
              >
                {t('planner.tabBudget')}
              </button>
              <button
                type="button"
                role="tab"
                id="planner-tab-timeline"
                aria-selected={activeTab === 'timeline'}
                aria-controls="planner-panel-timeline"
                onClick={() => handleSwitchTab('timeline')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724319] ${
                  activeTab === 'timeline'
                    ? 'bg-white text-[#724319] shadow-xs font-semibold'
                    : 'text-[#724319]/75 hover:text-[#724319]'
                }`}
              >
                {t('planner.tabTimeline')}
              </button>
              <button
                type="button"
                role="tab"
                id="planner-tab-insights"
                aria-selected={activeTab === 'insights'}
                aria-controls="planner-panel-insights"
                onClick={() => handleSwitchTab('insights')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724319] ${
                  activeTab === 'insights'
                    ? 'bg-white text-[#724319] shadow-xs font-semibold'
                    : 'text-[#724319]/75 hover:text-[#724319]'
                }`}
              >
                {t('planner.tabInsights')}
              </button>
            </div>
          </div>

          {/* Celebration Type + Optional Cultural Tradition Dropdown Bar */}
          <div className="px-6 py-4 bg-white border-b border-[#EBC1B6]/40 grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <div className="space-y-1.5">
              <label
                htmlFor="planner-celebration-type"
                className="block text-xs font-semibold uppercase tracking-wider text-[#8A5A44]"
              >
                {t('planner.celebrationTypeLabel')}
              </label>
              <div className="relative">
                <select
                  id="planner-celebration-type"
                  value={selectedEventType}
                  onChange={(e) => handleEventTypeChange(e.target.value as EventTypeTag)}
                  className="w-full appearance-none pl-4 pr-10 py-2.5 rounded-xl bg-[#FFF8F6] border border-[#EBC1B6] text-xs sm:text-sm font-semibold text-[#724319] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724319] cursor-pointer"
                >
                  {PLANNER_EVENT_TYPES.map((typeOption) => (
                    <option key={typeOption} value={typeOption}>
                      {t(`eventType.${typeOption}`)}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="w-4 h-4 text-[#8A5A44] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="planner-cultural-tradition"
                className="block text-xs font-semibold uppercase tracking-wider text-[#8A5A44]"
              >
                {t('planner.culturalTraditionLabel')}
              </label>
              <div className="relative">
                <select
                  id="planner-cultural-tradition"
                  value={selectedTradition}
                  onChange={(e) =>
                    handleTraditionChange(e.target.value as PlannerCulturalTradition)
                  }
                  className="w-full appearance-none pl-4 pr-10 py-2.5 rounded-xl bg-[#FFF8F6] border border-[#EBC1B6] text-xs sm:text-sm font-semibold text-[#724319] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724319] cursor-pointer"
                >
                  {PLANNER_CULTURAL_TRADITIONS.map((tradition) => (
                    <option key={tradition} value={tradition}>
                      {t(`planner.tradition.${tradition}`)}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="w-4 h-4 text-[#8A5A44] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>

          {/* Sample Estimate Simulation Notice */}
          <div className="px-6 py-2.5 bg-[#FFF8F6]/90 border-b border-[#EBC1B6]/35 flex items-center gap-2 text-[11px] sm:text-xs text-[#8A5A44]">
            <Info className="w-3.5 h-3.5 shrink-0 text-[#8A5A44]" aria-hidden="true" />
            <span>{t('planner.sampleBanner')}</span>
          </div>

          {/* Tab 1: Budget Calculator & Cost Forecasting */}
          {activeTab === 'budget' && (
            <div
              id="planner-panel-budget"
              role="tabpanel"
              aria-labelledby="planner-tab-budget"
              className="p-6 sm:p-8 space-y-8"
            >
              {/* Sliders Control Bar */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-[#FFF8F6] rounded-2xl border border-[#EBC1B6]/60">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <label
                      htmlFor="planner-budget-slider"
                      className="font-semibold text-[#724319]"
                    >
                      {t('planner.estBudget')} ({t('planner.sampleEstLabel')})
                    </label>
                    <span className="font-mono font-bold text-base text-[#724319] tabular-nums">
                      ${totalBudget.toLocaleString()} AUD
                    </span>
                  </div>
                  <input
                    id="planner-budget-slider"
                    type="range"
                    min={2500}
                    max={120000}
                    step={500}
                    value={totalBudget}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setTotalBudget(val);
                      trackEvent('budget_calculator_used', {
                        action: 'budget_slider',
                        event_type: selectedEventType,
                        culture: selectedTradition,
                        budget_aud: val,
                        guest_count: guestCount,
                      });
                    }}
                    className="w-full accent-[#724319] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#8A5A44] font-mono">
                    <span>$2.5k</span>
                    <span>$15k</span>
                    <span>$50k</span>
                    <span>$120k+</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <label
                      htmlFor="planner-guests-slider"
                      className="font-semibold text-[#724319]"
                    >
                      {t('planner.invitedGuests')}
                    </label>
                    <span className="font-mono font-bold text-base text-[#724319] tabular-nums">
                      {guestCount} {t('planner.guestsUnit')}
                    </span>
                  </div>
                  <input
                    id="planner-guests-slider"
                    type="range"
                    min={10}
                    max={400}
                    step={5}
                    value={guestCount}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setGuestCount(val);
                      trackEvent('budget_calculator_used', {
                        action: 'guest_slider',
                        event_type: selectedEventType,
                        culture: selectedTradition,
                        budget_aud: totalBudget,
                        guest_count: val,
                      });
                    }}
                    className="w-full accent-[#724319] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#8A5A44] font-mono">
                    <span>10</span>
                    <span>{t('planner.rangeGuestsMid')}</span>
                    <span>{t('planner.rangeGuestsMax')}</span>
                  </div>
                </div>
              </div>

              {/* Key Summary KPI Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-[#EBC1B6]/70 shadow-xs">
                  <span className="text-[11px] text-[#8A5A44] uppercase font-semibold">
                    {t('planner.costPerGuest')} ({t('planner.sampleEstLabel')})
                  </span>
                  <div className="text-xl font-bold font-serif text-[#724319] mt-1 tabular-nums">
                    ${costPerGuest} AUD
                  </div>
                  <span className="text-[10px] text-[#8A5A44] flex items-center gap-1 mt-0.5">
                    {isBelowSaAvg ? (
                      <>
                        <TrendingDown className="w-3 h-3 inline text-emerald-700" aria-hidden="true" />
                        <span className="text-emerald-700">
                          Sample SA benchmark ~${eventConfig.saAveragePerGuest} AUD
                        </span>
                      </>
                    ) : (
                      <span>Sample SA benchmark ~${eventConfig.saAveragePerGuest} AUD</span>
                    )}
                  </span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#EBC1B6]/70 shadow-xs">
                  <span className="text-[11px] text-[#8A5A44] uppercase font-semibold">
                    {t('planner.buffer')} ({t('planner.sampleEstLabel')})
                  </span>
                  <div className="text-xl font-bold font-serif text-[#724319] mt-1 tabular-nums">
                    ${bufferAmount.toLocaleString()} AUD
                  </div>
                  <span className="text-[10px] text-[#8A5A44]">{t('planner.bufferSub')}</span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#EBC1B6]/70 shadow-xs">
                  <span className="text-[11px] text-[#8A5A44] uppercase font-semibold">
                    {t('planner.vendorFits')}
                  </span>
                  <div className="text-xl font-bold font-serif text-[#724319] mt-1 tabular-nums">
                    {matchingVendorCount} Sample
                  </div>
                  <span className="text-[10px] text-[#8A5A44]">
                    Matching {t(`eventType.${selectedEventType}`)}
                    {selectedTradition !== 'None' && selectedTradition !== 'Other'
                      ? ` · ${t(`planner.tradition.${selectedTradition}`)}`
                      : ''}
                  </span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#EBC1B6]/70 shadow-xs">
                  <span className="text-[11px] text-[#8A5A44] uppercase font-semibold">
                    {t('planner.savings')} ({t('planner.sampleEstLabel')})
                  </span>
                  <div className="text-xl font-bold font-serif text-[#724319] mt-1 tabular-nums">
                    ${estimatedSavings.toLocaleString()} AUD
                  </div>
                  <span className="text-[10px] text-emerald-700">{t('planner.savingsSub')}</span>
                </div>
              </div>

              {/* Event-Type Specific Breakdown of Categories */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A5A44]">
                    {t('planner.breakdownTitle')} — {t(`eventType.${selectedEventType}`)}
                  </h4>
                  <span className="text-[11px] font-medium text-[#8A5A44]">
                    {t('planner.sampleEstLabel')}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {eventConfig.allocations.map((item) => {
                    const amount = Math.round(totalBudget * item.pct);
                    return (
                      <div
                        key={`${selectedEventType}-${item.key}`}
                        className="p-4 bg-[#FFF8F6] rounded-xl border border-[#EBC1B6]/50 flex flex-col justify-between gap-2"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5 min-w-0">
                            <span className="text-lg shrink-0" aria-hidden="true">
                              {item.icon}
                            </span>
                            <div className="min-w-0">
                              <div className="text-xs font-semibold text-[#724319] leading-tight">
                                {item.label}
                              </div>
                              <div className="text-[10px] text-[#8A5A44] font-mono mt-0.5">
                                {(item.pct * 100).toFixed(0)}
                                {t('planner.ofTotal')}
                              </div>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-xs font-bold font-mono text-[#724319] tabular-nums">
                              ${amount.toLocaleString()} AUD
                            </div>
                            <div className="text-[10px] text-[#8A5A44]">sample est.</div>
                          </div>
                        </div>
                        <p className="text-[11px] text-[#724319]/75 leading-snug">
                          {item.sampleNote}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Optional Cultural Tradition Suggested Line Items (Strict Isolation) */}
              {culturalAdjustment && (
                <div className="rounded-2xl bg-gradient-to-br from-[#F2CCC3]/30 via-[#FFF8F6] to-white border border-[#EBC1B6] p-5 space-y-3">
                  <div className="space-y-1">
                    <h4 className="text-sm font-serif font-bold text-[#724319]">
                      {t('planner.culturalLineItemsHeading', {
                        tradition: t(`planner.tradition.${selectedTradition}`),
                        eventType: t(`eventType.${selectedEventType}`),
                      })}
                    </h4>
                    <p className="text-xs text-[#724319]/75">
                      {t('planner.culturalLineItemsSub')}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {culturalAdjustment.budgetLineItems.map((item) => (
                      <div
                        key={item.title}
                        className="p-3.5 rounded-xl bg-white border border-[#EBC1B6]/70 space-y-1"
                      >
                        <div className="text-xs font-semibold text-[#724319] leading-snug">
                          {item.title}
                        </div>
                        <div className="text-[11px] font-mono font-bold text-[#8A5A44]">
                          {item.estimateRange}
                        </div>
                        <p className="text-[11px] text-[#724319]/75 leading-snug">
                          {item.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Event Timeline Component */}
          {activeTab === 'timeline' && (
            <div
              id="planner-panel-timeline"
              role="tabpanel"
              aria-labelledby="planner-tab-timeline"
              className="p-6 sm:p-8"
            >
              <EventTimeline
                celebrationType={selectedEventType}
                selectedTradition={selectedTradition}
                vendorsMatchHref={vendorsMatchHref}
                onMatchVendorsClick={handleMatchVendorsClick}
                onExploreVendors={onExploreVendors}
                onExportSchedule={onScheduleExported}
              />
            </div>
          )}

          {/* Tab 3: Insights & AI Forecasting */}
          {activeTab === 'insights' && (
            <div
              id="planner-panel-insights"
              role="tabpanel"
              aria-labelledby="planner-tab-insights"
              className="p-6 sm:p-8 space-y-6"
            >
              <div className="p-5 bg-[#F2CCC3]/30 rounded-2xl border border-[#EBC1B6] flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#EBC1B6] flex items-center justify-center shrink-0 text-[#724319]">
                  <Sparkles className="w-5 h-5 text-[#8A5A44]" aria-hidden="true" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-serif font-bold text-[#724319]">
                      {t(`eventType.${selectedEventType}`)} — {t('planner.insightRecTitle')}
                    </h4>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white border border-[#EBC1B6] text-[#8A5A44]">
                      {t('planner.sampleEstLabel')}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#724319]/85 leading-relaxed">
                    {eventConfig.buildPrimaryRecommendation(
                      totalBudget,
                      guestCount,
                      selectedTradition
                    )}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 sm:p-5 bg-[#FFF8F6] rounded-2xl border border-[#EBC1B6]/60 space-y-2">
                  <span className="font-semibold text-[#724319] flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
                    <span>{eventConfig.insightCostTitle}</span>
                  </span>
                  <p className="text-xs text-[#724319]/80 leading-relaxed">
                    {eventConfig.insightCostBody}
                  </p>
                </div>

                <div className="p-4 sm:p-5 bg-[#FFF8F6] rounded-2xl border border-[#EBC1B6]/60 space-y-2">
                  <span className="font-semibold text-[#724319] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#8A5A44] shrink-0" aria-hidden="true" />
                    <span>
                      {culturalAdjustment
                        ? culturalAdjustment.insightTitle
                        : eventConfig.insightBaselineTimingTitle}
                    </span>
                  </span>
                  <p className="text-xs text-[#724319]/80 leading-relaxed">
                    {culturalAdjustment
                      ? culturalAdjustment.insightBody
                      : eventConfig.insightBaselineTimingBody}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Action Footer */}
          <div className="px-6 py-4 bg-[#FFF8F6] border-t border-[#EBC1B6]/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-[#8A5A44]">{t('planner.footerPrompt')}</span>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <a
                href={vendorsMatchHref}
                onClick={(e) => {
                  handleMatchVendorsClick();
                  if (onExploreVendors) {
                    e.preventDefault();
                    onExploreVendors();
                  }
                }}
                className="w-full sm:w-auto text-center px-4 py-2 bg-[#724319] hover:bg-[#8A5A44] text-white font-medium rounded-full transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724319]"
              >
                {t('planner.matchBtn')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
