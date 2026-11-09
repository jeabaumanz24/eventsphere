import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Filter,
  Sparkles,
  Download,
  Share2,
  Camera,
  Utensils,
  Flower2,
  Music,
  Heart,
  Plus,
  AlertCircle,
  CalendarCheck,
  ChevronRight,
  ShieldCheck,
  Building2,
  Sparkle,
} from 'lucide-react';

export interface ServiceRequirement {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
}

export const AVAILABLE_SERVICES: ServiceRequirement[] = [
  { id: 'venue', name: 'Venue & Estate', icon: Building2, description: 'Barossa or Adelaide Hills estate hold' },
  { id: 'photo', name: 'Photography & Film', icon: Camera, description: 'Maria Santos or documentary team' },
  { id: 'catering', name: 'Multicultural Banquet', icon: Utensils, description: 'Dual-culture feast & Barossa wine' },
  { id: 'florals', name: 'Botanical Styling', icon: Flower2, description: 'Native proteas & table arches' },
  { id: 'rituals', name: 'Sacred Cultural Rites', icon: Heart, description: 'Veil, Cord, Sangeet, or Stefana' },
  { id: 'music', name: 'Music & Bilingual MC', icon: Music, description: 'Ceremony acoustic & cultural reception' },
  { id: 'beauty', name: 'Bridal Hair & Makeup', icon: Sparkles, description: 'All-day 16hr luminous beauty' },
];

interface TimelineEvent {
  id: string;
  serviceId: string;
  monthsOffset: number; // positive = months before event
  title: string;
  description: string;
  category: string;
  isCritical?: boolean;
  adelaideTip?: string;
  dayOfTime?: string; // e.g. "09:30 AM" for day-of view
  dayOfPhase?: 'morning' | 'ceremony' | 'reception' | 'evening';
}

interface EventTimelineProps {
  selectedCulture?: string;
  onExploreVendors?: () => void;
  onExportSchedule?: (msg: string) => void;
}

export const EventTimeline: React.FC<EventTimelineProps> = ({
  selectedCulture = 'filipino',
  onExploreVendors,
  onExportSchedule,
}) => {
  // Default to a realistic event date ~8 months out
  const [eventDate, setEventDate] = useState<string>(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 8);
    return d.toISOString().split('T')[0];
  });

  const [viewMode, setViewMode] = useState<'roadmap' | 'dayOf'>('roadmap');
  const [activeServices, setActiveServices] = useState<string[]>([
    'venue',
    'photo',
    'catering',
    'florals',
    'rituals',
    'music',
    'beauty',
  ]);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({
    'venue-12': true,
    'photo-9': true,
  });

  // Toggle a single service requirement
  const toggleService = (id: string) => {
    setActiveServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  // Toggle completion of a milestone
  const toggleComplete = (id: string) => {
    setCompletedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Calculate days remaining
  const daysUntilEvent = useMemo(() => {
    const target = new Date(eventDate);
    const today = new Date();
    const diffTime = target.getTime() - today.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }, [eventDate]);

  // Master schedule milestones database dynamically filtered by selected services & culture
  const allMilestones: TimelineEvent[] = useMemo(() => {
    const items: TimelineEvent[] = [];

    // VENUE
    if (activeServices.includes('venue')) {
      items.push(
        {
          id: 'venue-12',
          serviceId: 'venue',
          monthsOffset: 12,
          title: 'Lock Adelaide Venue Estate & Date Hold',
          description: 'Secure Barossa, Adelaide Hills or Botanic Garden glasshouse contract and pay initial deposit.',
          category: 'Venue & Estate',
          isCritical: true,
          adelaideTip: 'Spring dates in Barossa (Oct–Nov) book 14 months in advance.',
          dayOfTime: '08:00 AM',
          dayOfPhase: 'morning',
        },
        {
          id: 'venue-3',
          serviceId: 'venue',
          monthsOffset: 3,
          title: 'Final Venue Walkthrough & Curfew Briefing',
          description: 'Confirm acoustic curfew limits, wet-weather backup pavilion, and load-in permits with estate manager.',
          category: 'Venue & Estate',
          dayOfTime: '01:30 PM',
          dayOfPhase: 'ceremony',
        }
      );
    }

    // PHOTOGRAPHY
    if (activeServices.includes('photo')) {
      items.push(
        {
          id: 'photo-9',
          serviceId: 'photo',
          monthsOffset: 9,
          title: 'Book Photographer & Videographer',
          description: 'Select culturally-experienced visual team (e.g. Maria Santos) and schedule Adelaide engagement session.',
          category: 'Photography & Film',
          isCritical: true,
          adelaideTip: 'Share your ceremony ritual shot-list for sacred traditions.',
          dayOfTime: '10:00 AM',
          dayOfPhase: 'morning',
        },
        {
          id: 'photo-1',
          serviceId: 'photo',
          monthsOffset: 1,
          title: 'Golden Hour Timeline & Shot List Sign-off',
          description: 'Calculate sunset hour at your South Australian location for scenic vineyard & ocean portraits.',
          category: 'Photography & Film',
          dayOfTime: '05:15 PM',
          dayOfPhase: 'reception',
        }
      );
    }

    // CATERING
    if (activeServices.includes('catering')) {
      items.push(
        {
          id: 'catering-6',
          serviceId: 'catering',
          monthsOffset: 6,
          title: 'Menu Tasting & Local Wine Pairings',
          description: 'Coordinate dual-heritage banquet menu with caterer, including halal, vegetarian or lechon options.',
          category: 'Multicultural Banquet',
          isCritical: true,
          adelaideTip: 'Barossa Shiraz and Adelaide Hills Chardonnay pairings elevate local guest experience.',
          dayOfTime: '06:45 PM',
          dayOfPhase: 'reception',
        },
        {
          id: 'catering-1',
          serviceId: 'catering',
          monthsOffset: 1,
          title: 'Final Dietary & Headcount Roster',
          description: 'Submit verified table breakdown, children meals, and vendor meals to Adelaide banquet team.',
          category: 'Multicultural Banquet',
          dayOfTime: '07:30 PM',
          dayOfPhase: 'reception',
        }
      );
    }

    // FLORALS
    if (activeServices.includes('florals')) {
      items.push(
        {
          id: 'florals-6',
          serviceId: 'florals',
          monthsOffset: 6,
          title: 'Floral Concept & Native Botanical Palette',
          description: 'Finalize South Australian proteas, eucalyptus, and ceramic vase styling with Aria Botanical Arts.',
          category: 'Botanical Styling',
          adelaideTip: 'Using seasonal Adelaide natives cuts import shipping fees by up to 35%.',
          dayOfTime: '11:00 AM',
          dayOfPhase: 'morning',
        },
        {
          id: 'florals-2',
          serviceId: 'florals',
          monthsOffset: 2,
          title: 'Ceremony Arch & Tablescape Mockup Approval',
          description: 'Review physical sample centerpiece and floral garland draping.',
          category: 'Botanical Styling',
          dayOfTime: '01:00 PM',
          dayOfPhase: 'ceremony',
        }
      );
    }

    // CULTURAL RITUALS (Customized to culture)
    if (activeServices.includes('rituals')) {
      let ritualTitle = 'Confirm Cultural Sponsors & Ritual Heirlooms';
      let ritualDesc = 'Review ceremonial protocols, blessing artifacts, and dual-tradition order of service.';
      let dayOfRitual = 'Sacred Cultural Ceremonies & Blessings';

      if (selectedCulture === 'filipino') {
        ritualTitle = 'Sponsor Invitations & Filipino Veil, Cord & Arras Coins';
        ritualDesc = 'Commission heirloom cord artisans, prepare 13 coins (arras), and brief principal sponsors (Ninongs & Ninangs).';
        dayOfRitual = 'Traditional Filipino Cord, Veil & Arras Exchange';
      } else if (selectedCulture === 'southasian') {
        ritualTitle = 'Sangeet Choreography & Mandap Sacred Fire Clearances';
        ritualDesc = 'Secure fire permit for Agni ceremony with SA Metropolitan Fire Service and schedule Henna night.';
        dayOfRitual = 'Seven Pheras & Sangeet Performance Show';
      } else if (selectedCulture === 'mediterranean') {
        ritualTitle = 'Stefana Crowns & Artisan Koufeta Favors';
        ritualDesc = 'Source silver crowning ribbons and traditional sugar-coated almond bomboniere for wedding guests.';
        dayOfRitual = 'Orthodox Stefana Crowning Ceremony';
      }

      items.push(
        {
          id: 'rituals-5',
          serviceId: 'rituals',
          monthsOffset: 5,
          title: ritualTitle,
          description: ritualDesc,
          category: 'Sacred Cultural Rites',
          isCritical: true,
          adelaideTip: 'EventSphere connects you with verified Adelaide bilingual officiants.',
          dayOfTime: '03:15 PM',
          dayOfPhase: 'ceremony',
        },
        {
          id: 'rituals-day',
          serviceId: 'rituals',
          monthsOffset: 0,
          title: dayOfRitual,
          description: 'Honor dual-heritage lineage with parents and elders before celebration banquet.',
          category: 'Sacred Cultural Rites',
          dayOfTime: '03:45 PM',
          dayOfPhase: 'ceremony',
        }
      );
    }

    // MUSIC & MC
    if (activeServices.includes('music')) {
      items.push(
        {
          id: 'music-4',
          serviceId: 'music',
          monthsOffset: 4,
          title: 'Book Bilingual Master of Ceremonies & DJ',
          description: 'Ensure MC can guide both English-speaking and traditional non-English elders smoothly.',
          category: 'Music & Bilingual MC',
          adelaideTip: 'Bilingual Adelaide MCs bridge generational traditions seamlessly.',
          dayOfTime: '06:00 PM',
          dayOfPhase: 'reception',
        },
        {
          id: 'music-1',
          serviceId: 'music',
          monthsOffset: 1,
          title: 'Ceremony Entrance & First Dance Audio Brief',
          description: 'Submit acoustic entrance track and cultural celebration playlist.',
          category: 'Music & Bilingual MC',
          dayOfTime: '08:30 PM',
          dayOfPhase: 'evening',
        }
      );
    }

    // BEAUTY
    if (activeServices.includes('beauty')) {
      items.push(
        {
          id: 'beauty-3',
          serviceId: 'beauty',
          monthsOffset: 3,
          title: 'Bridal Hair & Makeup Trial Session',
          description: 'Test heat-resistant, tear-proof 16hr makeup and traditional veil/dupatta setting.',
          category: 'Bridal Hair & Makeup',
          adelaideTip: 'Schedule trial during Adelaide warm afternoon light for accurate tone matching.',
          dayOfTime: '07:30 AM',
          dayOfPhase: 'morning',
        }
      );
    }

    return items;
  }, [activeServices, selectedCulture]);

  // Sort and filter milestones
  const filteredMilestones = useMemo(() => {
    let list = [...allMilestones];

    if (categoryFilter !== 'all') {
      list = list.filter((item) => item.serviceId === categoryFilter);
    }

    if (viewMode === 'roadmap') {
      // Sort by monthsOffset descending (12 months out down to 0)
      list.sort((a, b) => b.monthsOffset - a.monthsOffset);
    } else {
      // Day-of: sort by time
      list.sort((a, b) => (a.dayOfTime || '').localeCompare(b.dayOfTime || ''));
    }

    return list;
  }, [allMilestones, categoryFilter, viewMode]);

  // Compute calculated target calendar date for a milestone
  const getCalculatedDate = (monthsOffset: number): string => {
    const d = new Date(eventDate);
    d.setMonth(d.getMonth() - monthsOffset);
    return d.toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Progress metrics
  const totalItemsCount = allMilestones.length;
  const completedCount = allMilestones.filter((m) => completedItems[m.id]).length;
  const progressPercent = totalItemsCount > 0 ? Math.round((completedCount / totalItemsCount) * 100) : 0;

  const handleExport = () => {
    const formattedDate = new Date(eventDate).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const msg = `Event schedule for ${formattedDate} (${viewMode === 'roadmap' ? 'Milestone Roadmap' : 'Day-Of Run Sheet'}) exported to your device!`;
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
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-[#8A5A44]" />
              <h3 className="text-base sm:text-lg font-serif font-bold text-[#724319]">
                Interactive Event Timeline
              </h3>
            </div>
            <p className="text-xs text-[#724319]/75 mt-0.5">
              Dynamically generated from your celebration date and selected service requirements.
            </p>
          </div>

          {/* Date Picker & Days Counter */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-[#EBC1B6] shadow-2xs">
              <Calendar className="w-4 h-4 text-[#8A5A44] shrink-0" />
              <label htmlFor="timeline-event-date" className="text-xs font-semibold text-[#724319] shrink-0">
                Event Date:
              </label>
              <input
                id="timeline-event-date"
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="text-xs font-medium text-[#724319] bg-transparent focus:outline-none cursor-pointer"
              />
            </div>

            <div className="bg-[#F2CCC3]/60 px-3 py-2 rounded-xl text-xs font-medium text-[#724319] border border-[#EBC1B6]">
              <span className="font-bold tabular-nums">{daysUntilEvent}</span> Days to Celebration
            </div>
          </div>
        </div>

        {/* Service Requirement Chips / Multi-select */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8A5A44]">
              Active Service Requirements ({activeServices.length}/{AVAILABLE_SERVICES.length}):
            </span>
            <span className="text-[11px] text-[#724319]/60">
              Click to toggle services on or off
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {AVAILABLE_SERVICES.map((srv) => {
              const isSelected = activeServices.includes(srv.id);
              const Icon = srv.icon;
              return (
                <button
                  key={srv.id}
                  onClick={() => toggleService(srv.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#724319] text-white shadow-2xs'
                      : 'bg-white hover:bg-[#F2CCC3]/40 text-[#724319]/70 border border-[#EBC1B6]/60'
                  }`}
                  title={srv.description}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{srv.name}</span>
                  {isSelected && <span className="text-[10px] ml-0.5 opacity-80">✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* View Mode Switcher & Export */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          {/* View Mode Toggle: Roadmap vs Day-of */}
          <div className="inline-flex p-1 bg-white border border-[#EBC1B6] rounded-xl text-xs shadow-2xs">
            <button
              onClick={() => setViewMode('roadmap')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                viewMode === 'roadmap'
                  ? 'bg-[#724319] text-white font-semibold'
                  : 'text-[#724319]/70 hover:text-[#724319]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Milestone Roadmap</span>
            </button>
            <button
              onClick={() => setViewMode('dayOf')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                viewMode === 'dayOf'
                  ? 'bg-[#724319] text-white font-semibold'
                  : 'text-[#724319]/70 hover:text-[#724319]'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Day-Of Run Sheet</span>
            </button>
          </div>

          {/* Progress bar + Export */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-[11px] font-semibold text-[#724319]">
                {completedCount} of {totalItemsCount} Completed ({progressPercent}%)
              </div>
              <div className="w-32 h-1.5 bg-[#EBC1B6]/60 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-[#724319] rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <button
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-[#FFF8F6] border border-[#EBC1B6] text-[#724319] rounded-xl text-xs font-semibold shadow-2xs hover:shadow-xs transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#8A5A44]" />
              <span>Export Schedule</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-[#8A5A44] font-semibold shrink-0 mr-1 flex items-center gap-1">
          <Filter className="w-3 h-3" /> Filter:
        </span>
        <button
          onClick={() => setCategoryFilter('all')}
          className={`px-3 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            categoryFilter === 'all'
              ? 'bg-[#724319] text-white font-medium'
              : 'bg-white hover:bg-[#F2CCC3]/40 text-[#724319] border border-[#EBC1B6]'
          }`}
        >
          All Requirements ({allMilestones.length})
        </button>
        {AVAILABLE_SERVICES.filter((s) => activeServices.includes(s.id)).map((srv) => (
          <button
            key={srv.id}
            onClick={() => setCategoryFilter(srv.id)}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              categoryFilter === srv.id
                ? 'bg-[#724319] text-white font-medium'
                : 'bg-white hover:bg-[#F2CCC3]/40 text-[#724319] border border-[#EBC1B6]'
            }`}
          >
            {srv.name}
          </button>
        ))}
      </div>

      {/* Timeline Stream Display */}
      {filteredMilestones.length === 0 ? (
        <div className="p-8 text-center bg-[#FFF8F6] rounded-2xl border border-[#EBC1B6] space-y-2">
          <AlertCircle className="w-8 h-8 text-[#8A5A44] mx-auto" />
          <h4 className="text-sm font-semibold text-[#724319]">No Milestones Selected</h4>
          <p className="text-xs text-[#724319]/70">
            Please activate at least one service requirement above to generate your customized schedule.
          </p>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 border-l-2 border-[#EBC1B6] space-y-4">
          {filteredMilestones.map((item, idx) => {
            const isDone = !!completedItems[item.id];
            const targetDateStr = getCalculatedDate(item.monthsOffset);

            return (
              <div
                key={item.id}
                onClick={() => toggleComplete(item.id)}
                className={`relative group bg-white rounded-2xl p-4 sm:p-5 border transition-all duration-200 cursor-pointer ${
                  isDone
                    ? 'border-[#EBC1B6]/60 bg-white/70 opacity-80'
                    : 'border-[#EBC1B6] hover:border-[#8A5A44] shadow-xs hover:shadow-md'
                }`}
              >
                {/* Timeline Node Bullet on the left line */}
                <div
                  className={`absolute -left-[31px] sm:-left-[39px] top-5 w-4 h-4 rounded-full border-2 transition-colors ${
                    isDone
                      ? 'bg-[#724319] border-[#724319]'
                      : item.isCritical
                      ? 'bg-rose-500 border-white ring-2 ring-rose-300'
                      : 'bg-white border-[#8A5A44]'
                  }`}
                />

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* View Mode Tag: Months Out (Roadmap) or Clock Time (Day-of) */}
                    {viewMode === 'roadmap' ? (
                      <span className="text-[11px] font-mono font-bold text-[#8A5A44] bg-[#FFF8F6] border border-[#EBC1B6] px-2.5 py-0.5 rounded-md">
                        {item.monthsOffset === 0 ? 'Day-Of Celebration' : `${item.monthsOffset} Months Prior`}
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono font-bold text-[#724319] bg-[#F2CCC3]/50 border border-[#EBC1B6] px-2.5 py-0.5 rounded-md flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#8A5A44]" />
                        {item.dayOfTime}
                      </span>
                    )}

                    {/* Calculated Target Date */}
                    {viewMode === 'roadmap' && (
                      <span className="text-[11px] text-[#724319]/70 font-mono">
                        Target Date: <strong>{targetDateStr}</strong>
                      </span>
                    )}

                    <span className="text-[10px] text-[#8A5A44] uppercase font-semibold">
                      · {item.category}
                    </span>

                    {item.isCritical && (
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                        Critical Milestone
                      </span>
                    )}
                  </div>

                  {/* Completion status button */}
                  <div className="flex items-center gap-1.5 text-xs text-[#8A5A44] shrink-0">
                    <span className="text-[11px] font-medium hidden sm:inline">
                      {isDone ? 'Completed' : 'Pending'}
                    </span>
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Circle className="w-5 h-5 text-[#8A5A44]/50 group-hover:text-[#8A5A44]" />
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

                {/* Adelaide Insider Tip */}
                {item.adelaideTip && (
                  <div className="mt-3 pt-2.5 border-t border-[#EBC1B6]/40 flex items-start gap-2 text-[11px] text-[#8A5A44] bg-[#FFF8F6]/80 p-2.5 rounded-xl">
                    <Sparkles className="w-3.5 h-3.5 text-[#8A5A44] shrink-0 mt-0.5" />
                    <span>
                      <strong className="font-semibold text-[#724319]">Adelaide Insider Tip:</strong>{' '}
                      {item.adelaideTip}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Banner with CTA to Match Vendors */}
      <div className="p-4 bg-[#FFF8F6] rounded-2xl border border-[#EBC1B6]/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[#724319]">
          <ShieldCheck className="w-4 h-4 text-[#8A5A44] shrink-0" />
          <span>
            Timeline is automatically synchronized across all shortlisted Adelaide vendor portals.
          </span>
        </div>
        <button
          onClick={onExploreVendors}
          className="text-xs font-semibold text-white bg-[#724319] hover:bg-[#8A5A44] px-4 py-2 rounded-full transition-colors whitespace-nowrap cursor-pointer"
        >
          Match Vendors for this Schedule
        </button>
      </div>
    </div>
  );
};
