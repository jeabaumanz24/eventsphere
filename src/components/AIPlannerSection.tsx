import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Calendar,
  Sparkles,
  TrendingDown,
  TrendingUp,
  CheckCircle2,
  Clock,
  DollarSign,
  Download,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface AIPlannerSectionProps {
  onExploreVendors?: () => void;
  onOpenConsult?: () => void;
}

export const AIPlannerSection: React.FC<AIPlannerSectionProps> = ({
  onExploreVendors,
  onOpenConsult,
}) => {
  const [totalBudget, setTotalBudget] = useState<number>(55000);
  const [guestCount, setGuestCount] = useState<number>(180);
  const [selectedCulture, setSelectedCulture] = useState<string>('filipino');
  const [activeTab, setActiveTab] = useState<'budget' | 'timeline' | 'insights'>('budget');
  const [completedMilestones, setCompletedMilestones] = useState<Record<string, boolean>>({
    m1: true,
    m2: true,
  });

  const cultures = [
    { id: 'filipino', label: 'Filipino-Australian Fusion', ritualFocus: 'Veil, Cord & Arras Coins' },
    { id: 'southasian', label: 'South Asian & Barossa Vineyard', ritualFocus: 'Sangeet & Sacred Fire Mandap' },
    { id: 'mediterranean', label: 'Mediterranean & Italian Gala', ritualFocus: 'Stefana Crowning & Feast Banquet' },
    { id: 'botanical', label: 'Modern Australian Botanical', ritualFocus: 'Native Floral Pavilion & Cellar Tasting' },
  ];

  // Dynamic budget percentage allocations
  const allocations = useMemo(() => {
    return [
      { name: 'Venue & Banquet Catering', pct: 0.44, icon: '🍷' },
      { name: 'Photography & Documentary Film', pct: 0.16, icon: '📷' },
      { name: 'Floral Artistry & Tablescape', pct: 0.14, icon: '🌸' },
      { name: 'Cultural Specialists & Bilingual MC', pct: 0.09, icon: '✨' },
      { name: 'Bridal Attire, Hair & Makeup', pct: 0.09, icon: '💄' },
      { name: 'Planning Buffer & Contingency', pct: 0.08, icon: '🛡️' },
    ];
  }, []);

  const costPerGuest = Math.round(totalBudget / guestCount);

  // Timeline events dynamic to culture
  const timelineMilestones = useMemo(() => {
    const base = [
      { id: 'm1', time: '12 Months Out', task: 'Lock Adelaide Venue Estate & Date Hold', category: 'Venue' },
      { id: 'm2', time: '9 Months Out', task: 'Book Photographer & Videographer (Maria Santos shortlisted)', category: 'Media' },
      { id: 'm3', time: '6 Months Out', task: 'Custom Floristry & Native Tablescape Mockup', category: 'Styling' },
      { id: 'm4', time: '4 Months Out', task: 'Tasting Menu & Adelaide Hills Wine Pairings', category: 'Catering' },
    ];

    if (selectedCulture === 'filipino') {
      base.splice(3, 0, {
        id: 'm-fil',
        time: '5 Months Out',
        task: 'Confirm Ninong/Ninang Sponsors and Heirloom Veil & Cord artisans',
        category: 'Tradition',
      });
    } else if (selectedCulture === 'southasian') {
      base.splice(3, 0, {
        id: 'm-sa',
        time: '5 Months Out',
        task: 'Coordinate Sangeet Choreography & Fire Safety permit for Mandap',
        category: 'Tradition',
      });
    } else if (selectedCulture === 'mediterranean') {
      base.splice(3, 0, {
        id: 'm-med',
        time: '5 Months Out',
        task: 'Source Artisan Koufeta Favors & Orthodox Crowning Ribbons',
        category: 'Tradition',
      });
    }

    base.push({
      id: 'm5',
      time: 'Day-Of Timeline',
      task: 'EventSphere Synchronized Master Schedule deployed to all vendor mobile apps',
      category: 'Coordination',
    });

    return base;
  }, [selectedCulture]);

  const toggleMilestone = (id: string) => {
    setCompletedMilestones((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="ai-planner" className="py-20 md:py-28 bg-[#F2CCC3]/25 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#8A5A44]">
            Intelligent Studio Preview
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#724319]">
            AI Event Planner Dashboard
          </h2>
          <p className="text-sm sm:text-base text-[#724319]/80 leading-relaxed [text-wrap:balance]">
            Experience how our intelligent assistant forecasts real Adelaide market pricing, balances multi-ritual schedules, and prevents costly planning blindspots.
          </p>
        </div>

        {/* SaaS-Style Interface Mockup Window */}
        <div className="bg-white rounded-3xl border border-[#EBC1B6] shadow-2xl overflow-hidden max-w-5xl mx-auto">
          {/* Top Browser / App Toolbar Header */}
          <div className="bg-[#FFF8F6] px-6 py-4 border-b border-[#EBC1B6]/60 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-400/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-400/80 inline-block" />
              </div>
              <span className="text-xs font-semibold text-[#724319] pl-2 border-l border-[#EBC1B6]">
                EventSphere Planning Studio · Adelaide Edition
              </span>
            </div>

            {/* Dashboard Navigation Tabs */}
            <div className="flex items-center gap-1 bg-[#F2CCC3]/30 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('budget')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'budget'
                    ? 'bg-white text-[#724319] shadow-xs font-semibold'
                    : 'text-[#724319]/70 hover:text-[#724319]'
                }`}
              >
                Budget Calculator
              </button>
              <button
                onClick={() => setActiveTab('timeline')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'timeline'
                    ? 'bg-white text-[#724319] shadow-xs font-semibold'
                    : 'text-[#724319]/70 hover:text-[#724319]'
                }`}
              >
                Timeline Generator
              </button>
              <button
                onClick={() => setActiveTab('insights')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'insights'
                    ? 'bg-white text-[#724319] shadow-xs font-semibold'
                    : 'text-[#724319]/70 hover:text-[#724319]'
                }`}
              >
                AI Insights & Forecasting
              </button>
            </div>
          </div>

          {/* Culture Preset Switcher */}
          <div className="px-6 py-3.5 bg-white border-b border-[#EBC1B6]/30 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-[#8A5A44] shrink-0">Celebration Tradition:</span>
            {cultures.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCulture(c.id)}
                className={`px-3 py-1 rounded-full text-xs transition-all cursor-pointer ${
                  selectedCulture === c.id
                    ? 'bg-[#724319] text-white font-medium'
                    : 'bg-[#FFF8F6] text-[#724319] hover:bg-[#F2CCC3]/50 border border-[#EBC1B6]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Budget Calculator & Cost Forecasting */}
          {activeTab === 'budget' && (
            <div className="p-6 sm:p-8 space-y-8">
              {/* Sliders Control Bar */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-[#FFF8F6] rounded-2xl border border-[#EBC1B6]/60">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#724319]">Estimated Overall Budget</span>
                    <span className="font-mono font-bold text-base text-[#724319]">
                      ${totalBudget.toLocaleString()} AUD
                    </span>
                  </div>
                  <input
                    type="range"
                    min={20000}
                    max={120000}
                    step={2500}
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(Number(e.target.value))}
                    className="w-full accent-[#724319] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#8A5A44] font-mono">
                    <span>$20k</span>
                    <span>$50k</span>
                    <span>$80k</span>
                    <span>$120k+</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#724319]">Invited Guests</span>
                    <span className="font-mono font-bold text-base text-[#724319]">
                      {guestCount} Guests
                    </span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={400}
                    step={10}
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full accent-[#724319] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#8A5A44] font-mono">
                    <span>50 (Intimate)</span>
                    <span>180 (Standard)</span>
                    <span>400 (Grand)</span>
                  </div>
                </div>
              </div>

              {/* Key Summary KPI Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-[#EBC1B6]/70 shadow-xs">
                  <span className="text-[11px] text-[#8A5A44] uppercase font-semibold">Cost Per Guest</span>
                  <div className="text-xl font-bold font-serif text-[#724319] mt-1 tabular-nums">
                    ${costPerGuest} AUD
                  </div>
                  <span className="text-[10px] text-emerald-700 flex items-center gap-1 mt-0.5">
                    <TrendingDown className="w-3 h-3 inline" /> 8% below SA average
                  </span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#EBC1B6]/70 shadow-xs">
                  <span className="text-[11px] text-[#8A5A44] uppercase font-semibold">Recommended Buffer</span>
                  <div className="text-xl font-bold font-serif text-[#724319] mt-1 tabular-nums">
                    ${Math.round(totalBudget * 0.08).toLocaleString()} AUD
                  </div>
                  <span className="text-[10px] text-[#8A5A44]">Protects against overtime fees</span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#EBC1B6]/70 shadow-xs">
                  <span className="text-[11px] text-[#8A5A44] uppercase font-semibold">Vendor Fits in SA</span>
                  <div className="text-xl font-bold font-serif text-[#724319] mt-1 tabular-nums">
                    42 Verified
                  </div>
                  <span className="text-[10px] text-[#8A5A44]">Matching this price tier</span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#EBC1B6]/70 shadow-xs">
                  <span className="text-[11px] text-[#8A5A44] uppercase font-semibold">Projected Savings</span>
                  <div className="text-xl font-bold font-serif text-[#724319] mt-1 tabular-nums">
                    $3,850 AUD
                  </div>
                  <span className="text-[10px] text-emerald-700">Via bundled packages</span>
                </div>
              </div>

              {/* Visual Breakdown of Categories */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A5A44] mb-3">
                  AI Recommended Category Breakdown
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {allocations.map((item) => {
                    const amount = Math.round(totalBudget * item.pct);
                    return (
                      <div
                        key={item.name}
                        className="p-3.5 bg-[#FFF8F6] rounded-xl border border-[#EBC1B6]/50 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">{item.icon}</span>
                          <div>
                            <div className="text-xs font-semibold text-[#724319] leading-tight">
                              {item.name}
                            </div>
                            <div className="text-[10px] text-[#8A5A44] font-mono">
                              {(item.pct * 100).toFixed(0)}% of total
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold font-mono text-[#724319]">
                            ${amount.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Timeline Generator */}
          {activeTab === 'timeline' && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-[#724319]">
                    Personalized Cultural Event Milestones
                  </h4>
                  <p className="text-xs text-[#8A5A44]">
                    Configured for {cultures.find((c) => c.id === selectedCulture)?.label}
                  </p>
                </div>
                <span className="text-xs text-[#724319] bg-[#FFF8F6] border border-[#EBC1B6] px-3 py-1 rounded-full">
                  Auto-synced with Adelaide seasons
                </span>
              </div>

              <div className="space-y-3">
                {timelineMilestones.map((m) => {
                  const isDone = !!completedMilestones[m.id];
                  return (
                    <div
                      key={m.id}
                      onClick={() => toggleMilestone(m.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                        isDone
                          ? 'bg-white border-[#EBC1B6]/80'
                          : 'bg-[#FFF8F6] border-[#8A5A44]/30 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                            isDone ? 'bg-[#724319] text-white' : 'border border-[#8A5A44] text-transparent'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[11px] font-mono font-bold text-[#8A5A44] uppercase">
                            {m.time} · {m.category}
                          </span>
                          <p className={`text-xs sm:text-sm font-medium mt-0.5 ${
                            isDone ? 'line-through text-[#724319]/50' : 'text-[#724319]'
                          }`}>
                            {m.task}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-medium text-[#8A5A44] bg-white px-2 py-0.5 rounded border border-[#EBC1B6]">
                        {isDone ? 'Completed' : 'Action Required'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 3: Insights & AI Forecasting */}
          {activeTab === 'insights' && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="p-5 bg-[#F2CCC3]/30 rounded-2xl border border-[#EBC1B6] flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#EBC1B6] flex items-center justify-center shrink-0 text-[#724319]">
                  <Sparkles className="w-5 h-5 text-[#8A5A44]" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-serif font-bold text-[#724319]">
                    AI Planning Assistant Recommendation
                  </h4>
                  <p className="text-xs text-[#724319]/85 leading-relaxed">
                    Based on your selected <strong>${totalBudget.toLocaleString()} AUD</strong> budget and cultural ceremony requirements in Adelaide, booking your photographer and venue 9+ months ahead is recommended to lock in prime golden-hour sunset slots in the Adelaide Hills or Barossa.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-[#FFF8F6] rounded-2xl border border-[#EBC1B6]/60 space-y-2">
                  <span className="font-semibold text-[#724319] flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-amber-600" />
                    Seasonal Adelaide Floral Pricing
                  </span>
                  <p className="text-[11px] text-[#724319]/80 leading-relaxed">
                    South Australian king proteas and eucalyptus foliage peak in October–March, yielding an estimated $600 AUD savings compared to importing off-season Dutch peonies.
                  </p>
                </div>

                <div className="p-4 bg-[#FFF8F6] rounded-2xl border border-[#EBC1B6]/60 space-y-2">
                  <span className="font-semibold text-[#724319] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#8A5A44]" />
                    Dual-Culture Ceremony Timing
                  </span>
                  <p className="text-[11px] text-[#724319]/80 leading-relaxed">
                    Allowing 45 minutes of guest buffer time between morning tea ceremony and church/vineyard vows reduces bridal fatigue and photographer overtime charges by up to 2 hours.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Action Footer */}
          <div className="px-6 py-4 bg-[#FFF8F6] border-t border-[#EBC1B6]/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-[#8A5A44]">
              Ready to turn this simulation into your live wedding workspace?
            </span>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <a
                href="#marketplace"
                className="w-full sm:w-auto text-center px-4 py-2 bg-[#724319] hover:bg-[#8A5A44] text-white font-medium rounded-full transition-colors cursor-pointer"
              >
                Match Vendors to this Budget
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
