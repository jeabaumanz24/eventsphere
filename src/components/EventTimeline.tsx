import React, { useState, useMemo, useEffect } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Filter,
  Sparkles,
  Download,
  AlertCircle,
  CalendarCheck,
  ShieldCheck,
  Flame,
} from 'lucide-react';
import { useLanguage, LanguageCode } from '../context/LanguageContext';
import { EventTypeTag } from '../types';
import {
  getCulturalAdjustment,
  PLANNER_EVENT_CONFIGS,
  PlannerCulturalTradition,
  TimelineMilestoneTemplate,
} from '../data/plannerConfigs';
import { trackEvent } from '../utils/analytics';
import { getPageHref } from '../utils/navigation';
import { AdelaideDatePicker } from './AdelaideDatePicker';
import {
  PEAK_LEAD_TIME_EXTRA_DAYS,
  buildDefaultDateFromLeadDays,
  formatLeadLabelFromDays,
  getSeasonInfoForIsoDate,
  getTodayAdelaideDate,
  parseIsoDateLocal,
} from '../utils/adelaideSeasons';

const PEAK_BUFFER_SERVICE_IDS = new Set<TimelineMilestoneTemplate['serviceId']>([
  'venue',
  'catering',
  'photo',
]);

const LOCALE_MAP: Record<LanguageCode, string> = {
  en: 'en-AU',
  it: 'it-IT',
  el: 'el-GR',
  zh: 'zh-CN',
  vi: 'vi-VN',
  tl: 'fil-PH',
  hi: 'hi-IN',
};

interface EventTimelineProps {
  celebrationType: EventTypeTag;
  selectedTradition: PlannerCulturalTradition;
  eventDate?: string;
  onEventDateChange?: (nextIsoDate: string) => void;
  vendorsMatchHref?: string;
  onMatchVendorsClick?: () => void;
  onExploreVendors?: () => void;
  onExportSchedule?: (msg: string) => void;
}

export const EventTimeline: React.FC<EventTimelineProps> = ({
  celebrationType,
  selectedTradition,
  eventDate: controlledEventDate,
  onEventDateChange,
  vendorsMatchHref,
  onMatchVendorsClick,
  onExploreVendors,
  onExportSchedule,
}) => {
  const { t, currentLanguage } = useLanguage();
  const eventConfig = PLANNER_EVENT_CONFIGS[celebrationType];

  const [internalEventDate, setInternalEventDate] = useState<string>(() =>
    buildDefaultDateFromLeadDays(eventConfig.defaultLeadDays)
  );
  const eventDate = controlledEventDate ?? internalEventDate;

  const updateEventDate = (nextIsoDate: string) => {
    if (onEventDateChange) {
      onEventDateChange(nextIsoDate);
    } else {
      setInternalEventDate(nextIsoDate);
    }
  };

  const [viewMode, setViewMode] = useState<'roadmap' | 'dayOf'>('roadmap');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});
  const [hiddenServiceIds, setHiddenServiceIds] = useState<string[]>([]);

  // Reset date lead-time (when uncontrolled) and filters when Celebration Type changes
  useEffect(() => {
    if (!controlledEventDate) {
      setInternalEventDate(buildDefaultDateFromLeadDays(eventConfig.defaultLeadDays));
    }
    setCategoryFilter('all');
    setHiddenServiceIds([]);
  }, [celebrationType, eventConfig.defaultLeadDays, controlledEventDate]);

  // Reset category filter if cultural tradition switches
  useEffect(() => {
    setCategoryFilter('all');
  }, [selectedTradition]);

  const allMilestones: TimelineMilestoneTemplate[] = useMemo(() => {
    const base = [...eventConfig.milestones];
    const culturalAdj = getCulturalAdjustment(celebrationType, selectedTradition);
    if (culturalAdj) {
      base.push(culturalAdj.milestone);
    }
    return base;
  }, [eventConfig.milestones, celebrationType, selectedTradition]);

  // Distinct service categories actually present for this celebration type + tradition
  const availableServices = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of allMilestones) {
      if (!map.has(item.serviceId)) {
        map.set(item.serviceId, item.serviceLabel);
      }
    }
    return Array.from(map.entries()).map(([id, label]) => ({ id, label }));
  }, [allMilestones]);

  const activeServiceIds = useMemo(
    () =>
      availableServices
        .map((s) => s.id)
        .filter((id) => !hiddenServiceIds.includes(id)),
    [availableServices, hiddenServiceIds]
  );

  const visibleByService = useMemo(
    () => allMilestones.filter((item) => activeServiceIds.includes(item.serviceId)),
    [allMilestones, activeServiceIds]
  );

  const seasonInfo = useMemo(() => getSeasonInfoForIsoDate(eventDate), [eventDate]);
  const isPeakSeason = seasonInfo.tier === 'peak';

  const todayAdelaide = getTodayAdelaideDate();
  const localeStr = LOCALE_MAP[currentLanguage] || 'en-AU';

  const daysUntilEvent = useMemo(() => {
    const today = getTodayAdelaideDate();
    const target = parseIsoDateLocal(eventDate) ?? today;
    const diffTime = target.getTime() - today.getTime();
    return Math.max(0, Math.round(diffTime / (1000 * 60 * 60 * 24)));
  }, [eventDate]);

  interface ComputedMilestone extends TimelineMilestoneTemplate {
    effectiveLeadDays: number;
    effectiveLeadLabel: string;
    hasPeakBuffer: boolean;
    isDueNow: boolean;
    targetDateStr: string;
  }

  const visibleComputedMilestones: ComputedMilestone[] = useMemo(() => {
    const today = getTodayAdelaideDate();
    const base = parseIsoDateLocal(eventDate) ?? today;

    return visibleByService.map((item) => {
      const hasPeakBuffer =
        isPeakSeason && PEAK_BUFFER_SERVICE_IDS.has(item.serviceId) && item.leadDays > 0;
      const effectiveLeadDays = hasPeakBuffer
        ? item.leadDays + PEAK_LEAD_TIME_EXTRA_DAYS
        : item.leadDays;
      const effectiveLeadLabel = hasPeakBuffer
        ? formatLeadLabelFromDays(effectiveLeadDays)
        : item.leadLabel;

      const targetDate = new Date(
        base.getFullYear(),
        base.getMonth(),
        base.getDate() - effectiveLeadDays
      );
      const isDueNow = targetDate.getTime() <= today.getTime();
      const targetDateStr = targetDate.toLocaleDateString(localeStr, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });

      return {
        ...item,
        effectiveLeadDays,
        effectiveLeadLabel,
        hasPeakBuffer,
        isDueNow,
        targetDateStr,
      };
    });
  }, [visibleByService, eventDate, isPeakSeason, localeStr]);

  const dueNowCount = useMemo(
    () => visibleComputedMilestones.filter((m) => m.isDueNow).length,
    [visibleComputedMilestones]
  );

  const isCompressedTimeline =
    dueNowCount > 0 ||
    daysUntilEvent <= Math.max(45, Math.round(eventConfig.defaultLeadDays * 0.55));

  const filteredMilestones = useMemo(() => {
    let list = [...visibleComputedMilestones];
    if (categoryFilter !== 'all') {
      list = list.filter((item) => item.serviceId === categoryFilter);
    }

    if (viewMode === 'roadmap') {
      list.sort((a, b) => b.effectiveLeadDays - a.effectiveLeadDays);
    } else {
      list.sort((a, b) => a.dayOfTime.localeCompare(b.dayOfTime));
    }

    return list;
  }, [visibleComputedMilestones, categoryFilter, viewMode]);

  const toggleService = (serviceId: string) => {
    setHiddenServiceIds((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
    trackEvent('timeline_generated', {
      action: 'service_toggle',
      event_type: celebrationType,
      culture: selectedTradition,
      view_mode: viewMode,
      season: seasonInfo.tier,
    });
  };

  const toggleComplete = (id: string) => {
    setCompletedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const totalItemsCount = visibleByService.length;
  const completedCount = visibleByService.filter((m) => completedItems[m.id]).length;
  const progressPercent =
    totalItemsCount > 0 ? Math.round((completedCount / totalItemsCount) * 100) : 0;

  const handleExport = () => {
    const formattedDate = (parseIsoDateLocal(eventDate) ?? todayAdelaide).toLocaleDateString(
      localeStr,
      {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }
    );
    const modeLabel = viewMode === 'roadmap' ? t('timeline.roadmap') : t('timeline.dayOf');
    trackEvent('timeline_generated', {
      action: 'export_schedule',
      event_type: celebrationType,
      culture: selectedTradition,
      view_mode: viewMode,
      season: seasonInfo.tier,
    });
    const msg = t('timeline.exportToast', { date: formattedDate, mode: modeLabel });
    if (onExportSchedule) {
      onExportSchedule(msg);
    }
  };

  return (
    <div className="space-y-6">
      {/* Schedule Control Center */}
      <div className="p-5 sm:p-6 bg-[#FFF8F6] rounded-2xl border border-[#EBC1B6]/70 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#EBC1B6]/50">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-[#8A5A44]" aria-hidden="true" />
              <h3 className="text-base sm:text-lg font-serif font-bold text-[#724319]">
                {t(`eventType.${celebrationType}`)} — {t('timeline.title')}
              </h3>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white border border-[#EBC1B6] text-[#8A5A44]">
                {t('planner.sampleEstLabel')}
              </span>
            </div>
            <p className="text-xs text-[#724319]/75 mt-1">
              {t('timeline.subtitle')}
            </p>
          </div>

          {/* Date Picker & Days Counter */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="min-w-[235px]">
              <AdelaideDatePicker
                id="timeline-event-date"
                value={eventDate}
                compact
                locale={localeStr}
                onChange={(nextIso) => {
                  updateEventDate(nextIso);
                  trackEvent('timeline_generated', {
                    action: 'date_change',
                    event_type: celebrationType,
                    culture: selectedTradition,
                    view_mode: viewMode,
                    season: getSeasonInfoForIsoDate(nextIso).tier,
                  });
                }}
              />
            </div>

            <div className="bg-[#F2CCC3]/60 px-3 py-2 rounded-xl text-xs font-medium text-[#724319] border border-[#EBC1B6]">
              <span className="font-bold tabular-nums">{daysUntilEvent}</span>{' '}
              {t('timeline.daysToGo')}
            </div>
          </div>
        </div>

        {/* Service Requirement Chips / Multi-select */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8A5A44]">
              {t('timeline.activeReq')} ({activeServiceIds.length}/{availableServices.length}):
            </span>
            <span className="text-[11px] text-[#724319]/75">
              {t('timeline.clickToggle')}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {availableServices.map((srv) => {
              const isSelected = activeServiceIds.includes(srv.id);
              return (
                <button
                  key={srv.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => toggleService(srv.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all motion-reduce:transition-none cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724319] ${
                    isSelected
                      ? 'bg-[#724319] text-white shadow-2xs'
                      : 'bg-white hover:bg-[#F2CCC3]/40 text-[#724319]/85 border border-[#EBC1B6]/60'
                  }`}
                >
                  <span>{srv.label}</span>
                  {isSelected && <span className="text-[10px] ml-0.5 opacity-85" aria-hidden="true">✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* View Mode Switcher & Export */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          <div
            className="inline-flex p-1 bg-white border border-[#EBC1B6] rounded-xl text-xs shadow-2xs"
            role="group"
            aria-label="Timeline view mode"
          >
            <button
              type="button"
              aria-pressed={viewMode === 'roadmap'}
              onClick={() => {
                setViewMode('roadmap');
                trackEvent('timeline_generated', {
                  action: 'view_mode_change',
                  event_type: celebrationType,
                  culture: selectedTradition,
                  view_mode: 'roadmap',
                  season: seasonInfo.tier,
                });
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors motion-reduce:transition-none cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724319] ${
                viewMode === 'roadmap'
                  ? 'bg-[#724319] text-white font-semibold'
                  : 'text-[#724319]/80 hover:text-[#724319]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t('timeline.roadmap')}</span>
            </button>
            <button
              type="button"
              aria-pressed={viewMode === 'dayOf'}
              onClick={() => {
                setViewMode('dayOf');
                trackEvent('timeline_generated', {
                  action: 'view_mode_change',
                  event_type: celebrationType,
                  culture: selectedTradition,
                  view_mode: 'dayOf',
                  season: seasonInfo.tier,
                });
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors motion-reduce:transition-none cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724319] ${
                viewMode === 'dayOf'
                  ? 'bg-[#724319] text-white font-semibold'
                  : 'text-[#724319]/80 hover:text-[#724319]'
              }`}
            >
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t('timeline.dayOf')}</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-[11px] font-semibold text-[#724319]">
                {t('timeline.progressText', {
                  done: completedCount,
                  total: totalItemsCount,
                  pct: progressPercent,
                })}
              </div>
              <div className="w-32 h-1.5 bg-[#EBC1B6]/60 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-[#724319] rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-[#FFF8F6] border border-[#EBC1B6] text-[#724319] rounded-xl text-xs font-semibold shadow-2xs hover:shadow-xs transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724319]"
            >
              <Download className="w-3.5 h-3.5 text-[#8A5A44]" aria-hidden="true" />
              <span>{t('timeline.exportBtn')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs (Wrapping cleanly without horizontal scrolling) */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-[#8A5A44] font-semibold shrink-0 mr-1 flex items-center gap-1">
          <Filter className="w-3 h-3" aria-hidden="true" /> {t('timeline.filterLabel')}
        </span>
        <button
          type="button"
          aria-pressed={categoryFilter === 'all'}
          onClick={() => setCategoryFilter('all')}
          className={`px-3 py-1 rounded-lg transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724319] ${
            categoryFilter === 'all'
              ? 'bg-[#724319] text-white font-medium'
              : 'bg-white hover:bg-[#F2CCC3]/40 text-[#724319] border border-[#EBC1B6]'
          }`}
        >
          {t('timeline.allReq')} ({visibleByService.length})
        </button>
        {availableServices
          .filter((s) => activeServiceIds.includes(s.id))
          .map((srv) => (
            <button
              key={srv.id}
              type="button"
              aria-pressed={categoryFilter === srv.id}
              onClick={() => setCategoryFilter(srv.id)}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724319] ${
                categoryFilter === srv.id
                  ? 'bg-[#724319] text-white font-medium'
                  : 'bg-white hover:bg-[#F2CCC3]/40 text-[#724319] border border-[#EBC1B6]'
              }`}
            >
              {srv.label}
            </button>
          ))}
      </div>

      {/* Season & Timeline Notices */}
      {(isPeakSeason || (viewMode === 'roadmap' && isCompressedTimeline)) && (
        <div aria-live="polite" className="space-y-2.5">
          {isPeakSeason && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-[#7C2D12] text-xs flex items-start gap-2.5">
              <Flame className="w-4 h-4 shrink-0 mt-0.5 text-[#9A3412]" aria-hidden="true" />
              <div>
                <strong className="font-semibold">
                  Peak season: extra lead time added to venue and catering milestones.
                </strong>{' '}
                <span>
                  Photography milestones also shift +4 weeks earlier for {seasonInfo.monthName} Adelaide dates.
                </span>
              </div>
            </div>
          )}

          {viewMode === 'roadmap' && isCompressedTimeline && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-[#881337] text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#9F1239]" aria-hidden="true" />
              <div>
                <strong className="font-semibold">Compressed timeline</strong> —{' '}
                <span>
                  {dueNowCount > 0
                    ? `${dueNowCount} ${
                        dueNowCount === 1 ? 'milestone falls' : 'milestones fall'
                      } on or before today (Australia/Adelaide time) and ${
                        dueNowCount === 1 ? 'is' : 'are'
                      } marked Due now.`
                    : `Only ${daysUntilEvent} days until your selected date. Prioritise venue and catering enquiries first.`}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Timeline Stream Display */}
      {filteredMilestones.length === 0 ? (
        <div className="p-8 text-center bg-[#FFF8F6] rounded-2xl border border-[#EBC1B6] space-y-2">
          <AlertCircle className="w-8 h-8 text-[#8A5A44] mx-auto" aria-hidden="true" />
          <h4 className="text-sm font-semibold text-[#724319]">{t('timeline.noMilestones')}</h4>
          <p className="text-xs text-[#724319]/80">
            {t('timeline.noMilestonesDesc')}
          </p>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 border-l-2 border-[#EBC1B6] space-y-4">
          {filteredMilestones.map((item) => {
            const isDone = !!completedItems[item.id];

            return (
              <div key={item.id} className="relative">
                {/* Timeline Node Bullet on the left line */}
                <div
                  aria-hidden="true"
                  className={`absolute -left-[31px] sm:-left-[39px] top-5 w-4 h-4 rounded-full border-2 transition-colors motion-reduce:transition-none ${
                    isDone
                      ? 'bg-[#724319] border-[#724319]'
                      : item.isDueNow && viewMode === 'roadmap'
                      ? 'bg-[#9F1239] border-white ring-2 ring-rose-300'
                      : item.isCritical
                      ? 'bg-rose-600 border-white ring-2 ring-rose-300'
                      : 'bg-white border-[#8A5A44]'
                  }`}
                />

                <button
                  type="button"
                  aria-pressed={isDone}
                  onClick={() => toggleComplete(item.id)}
                  className={`w-full text-left group bg-white rounded-2xl p-4 sm:p-5 border transition-all duration-200 motion-reduce:transition-none cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724319] ${
                    isDone
                      ? 'border-[#EBC1B6]/60 bg-white/70 opacity-85'
                      : 'border-[#EBC1B6] hover:border-[#8A5A44] shadow-xs hover:shadow-md'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {viewMode === 'roadmap' ? (
                        <span className="text-[11px] font-mono font-bold text-[#724319] bg-[#FFF8F6] border border-[#EBC1B6] px-2.5 py-0.5 rounded-md">
                          {item.effectiveLeadLabel}
                        </span>
                      ) : (
                        <span className="text-[11px] font-mono font-bold text-[#724319] bg-[#F2CCC3]/50 border border-[#EBC1B6] px-2.5 py-0.5 rounded-md flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#8A5A44]" aria-hidden="true" />
                          {item.dayOfTime}
                        </span>
                      )}

                      {viewMode === 'roadmap' && item.hasPeakBuffer && (
                        <span className="text-[10px] font-bold text-[#7C2D12] bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-md">
                          +4 wks peak
                        </span>
                      )}

                      {viewMode === 'roadmap' &&
                        (item.isDueNow ? (
                          <span className="inline-flex items-center text-[11px] font-bold text-[#881337] bg-rose-50 border border-rose-300 px-2 py-0.5 rounded-md">
                            Due now
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#724319]/85 font-mono">
                            {t('timeline.targetDate')} <strong>{item.targetDateStr}</strong>
                          </span>
                        ))}

                      <span className="text-[10px] text-[#6E432F] uppercase font-semibold">
                        · {item.serviceLabel}
                      </span>

                      {item.isCritical && (
                        <span className="text-[10px] font-bold text-[#881337] bg-rose-50 border border-rose-300 px-2 py-0.5 rounded-md">
                          {t('timeline.critical')}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-[#8A5A44] shrink-0">
                      <span className="text-[11px] font-medium hidden sm:inline">
                        {isDone ? t('timeline.completed') : t('timeline.pending')}
                      </span>
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" aria-hidden="true" />
                      ) : (
                        <Circle className="w-5 h-5 text-[#8A5A44]/50 group-hover:text-[#8A5A44]" aria-hidden="true" />
                      )}
                    </div>
                  </div>

                  <h4
                    className={`text-sm sm:text-base font-serif font-bold ${
                      isDone ? 'line-through text-[#724319]/50' : 'text-[#724319]'
                    }`}
                  >
                    {item.title}
                  </h4>

                  <p className="text-xs text-[#724319]/80 mt-1 leading-relaxed">
                    {item.description}
                  </p>

                  {item.adelaideTip && (
                    <div className="mt-3 pt-2.5 border-t border-[#EBC1B6]/40 flex items-start gap-2 text-[11px] text-[#8A5A44] bg-[#FFF8F6]/80 p-2.5 rounded-xl">
                      <Sparkles className="w-3.5 h-3.5 text-[#8A5A44] shrink-0 mt-0.5" aria-hidden="true" />
                      <span>
                        <strong className="font-semibold text-[#724319]">{t('timeline.tipLabel')}</strong>{' '}
                        {item.adelaideTip}
                      </span>
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Banner with CTA to Match Vendors */}
      <div className="p-4 bg-[#FFF8F6] rounded-2xl border border-[#EBC1B6]/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[#724319]">
          <ShieldCheck className="w-4 h-4 text-[#8A5A44] shrink-0" aria-hidden="true" />
          <span>{t('timeline.syncBanner')}</span>
        </div>
        <a
          href={vendorsMatchHref || getPageHref('vendors')}
          onClick={(e) => {
            onMatchVendorsClick?.();
            if (onExploreVendors) {
              e.preventDefault();
              onExploreVendors();
            }
          }}
          className="text-xs font-semibold text-white bg-[#724319] hover:bg-[#8A5A44] px-4 py-2 rounded-full transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724319]"
        >
          {t('timeline.matchBtn')}
        </a>
      </div>
    </div>
  );
};
