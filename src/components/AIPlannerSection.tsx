import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';
import { EventTimeline } from './EventTimeline';
import { useLanguage } from '../context/LanguageContext';

interface AIPlannerSectionProps {
  onExploreVendors?: () => void;
  onOpenConsult?: () => void;
  onScheduleExported?: (msg: string) => void;
}

export const AIPlannerSection: React.FC<AIPlannerSectionProps> = ({
  onExploreVendors,
  onOpenConsult,
  onScheduleExported,
}) => {
  const { t } = useLanguage();
  const [totalBudget, setTotalBudget] = useState<number>(55000);
  const [guestCount, setGuestCount] = useState<number>(180);
  const [selectedCulture, setSelectedCulture] = useState<string>('filipino');
  const [activeTab, setActiveTab] = useState<'budget' | 'timeline' | 'insights'>('budget');

  const cultures = [
    { id: 'filipino', label: t('planner.culture.filipino') },
    { id: 'southasian', label: t('planner.culture.southasian') },
    { id: 'mediterranean', label: t('planner.culture.mediterranean') },
    { id: 'botanical', label: t('planner.culture.botanical') },
  ];

  // Dynamic budget percentage allocations
  const allocations = useMemo(() => {
    return [
      { key: 'venue', pct: 0.44, icon: '🍷' },
      { key: 'photo', pct: 0.16, icon: '📷' },
      { key: 'floral', pct: 0.14, icon: '🌸' },
      { key: 'cultural', pct: 0.09, icon: '✨' },
      { key: 'beauty', pct: 0.09, icon: '💄' },
      { key: 'buffer', pct: 0.08, icon: '🛡️' },
    ];
  }, []);

  const costPerGuest = Math.round(totalBudget / guestCount);

  return (
    <section id="ai-planner" className="py-20 md:py-28 bg-[#F2CCC3]/25 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#8A5A44]">
            {t('planner.kicker')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#724319]">
            {t('planner.title')}
          </h2>
          <p className="text-sm sm:text-base text-[#724319]/80 leading-relaxed [text-wrap:balance]">
            {t('planner.subtitle')}
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
                {t('planner.studioBar')}
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
                {t('planner.tabBudget')}
              </button>
              <button
                onClick={() => setActiveTab('timeline')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'timeline'
                    ? 'bg-white text-[#724319] shadow-xs font-semibold'
                    : 'text-[#724319]/70 hover:text-[#724319]'
                }`}
              >
                {t('planner.tabTimeline')}
              </button>
              <button
                onClick={() => setActiveTab('insights')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'insights'
                    ? 'bg-white text-[#724319] shadow-xs font-semibold'
                    : 'text-[#724319]/70 hover:text-[#724319]'
                }`}
              >
                {t('planner.tabInsights')}
              </button>
            </div>
          </div>

          {/* Culture Preset Switcher */}
          <div className="px-6 py-3.5 bg-white border-b border-[#EBC1B6]/30 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-[#8A5A44] shrink-0">{t('planner.traditionLabel')}</span>
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
                    <span className="font-semibold text-[#724319]">{t('planner.estBudget')}</span>
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
                    <span className="font-semibold text-[#724319]">{t('planner.invitedGuests')}</span>
                    <span className="font-mono font-bold text-base text-[#724319]">
                      {guestCount} {t('planner.guestsUnit')}
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
                    <span>{t('planner.rangeIntimate')}</span>
                    <span>{t('planner.rangeStandard')}</span>
                    <span>{t('planner.rangeGrand')}</span>
                  </div>
                </div>
              </div>

              {/* Key Summary KPI Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-[#EBC1B6]/70 shadow-xs">
                  <span className="text-[11px] text-[#8A5A44] uppercase font-semibold">{t('planner.costPerGuest')}</span>
                  <div className="text-xl font-bold font-serif text-[#724319] mt-1 tabular-nums">
                    ${costPerGuest} AUD
                  </div>
                  <span className="text-[10px] text-emerald-700 flex items-center gap-1 mt-0.5">
                    <TrendingDown className="w-3 h-3 inline" /> {t('planner.belowAvg')}
                  </span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#EBC1B6]/70 shadow-xs">
                  <span className="text-[11px] text-[#8A5A44] uppercase font-semibold">{t('planner.buffer')}</span>
                  <div className="text-xl font-bold font-serif text-[#724319] mt-1 tabular-nums">
                    ${Math.round(totalBudget * 0.08).toLocaleString()} AUD
                  </div>
                  <span className="text-[10px] text-[#8A5A44]">{t('planner.bufferSub')}</span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#EBC1B6]/70 shadow-xs">
                  <span className="text-[11px] text-[#8A5A44] uppercase font-semibold">{t('planner.vendorFits')}</span>
                  <div className="text-xl font-bold font-serif text-[#724319] mt-1 tabular-nums">
                    {t('planner.vendorFitsVal')}
                  </div>
                  <span className="text-[10px] text-[#8A5A44]">{t('planner.vendorFitsSub')}</span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#EBC1B6]/70 shadow-xs">
                  <span className="text-[11px] text-[#8A5A44] uppercase font-semibold">{t('planner.savings')}</span>
                  <div className="text-xl font-bold font-serif text-[#724319] mt-1 tabular-nums">
                    $3,850 AUD
                  </div>
                  <span className="text-[10px] text-emerald-700">{t('planner.savingsSub')}</span>
                </div>
              </div>

              {/* Visual Breakdown of Categories */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A5A44] mb-3">
                  {t('planner.breakdownTitle')}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {allocations.map((item) => {
                    const amount = Math.round(totalBudget * item.pct);
                    return (
                      <div
                        key={item.key}
                        className="p-3.5 bg-[#FFF8F6] rounded-xl border border-[#EBC1B6]/50 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">{item.icon}</span>
                          <div>
                            <div className="text-xs font-semibold text-[#724319] leading-tight">
                              {t(`planner.cat.${item.key}`)}
                            </div>
                            <div className="text-[10px] text-[#8A5A44] font-mono">
                              {(item.pct * 100).toFixed(0)}{t('planner.ofTotal')}
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

          {/* Tab 2: Event Timeline Component */}
          {activeTab === 'timeline' && (
            <div className="p-6 sm:p-8">
              <EventTimeline
                selectedCulture={selectedCulture}
                onExploreVendors={onExploreVendors}
                onExportSchedule={onScheduleExported}
              />
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
                    {t('planner.insightRecTitle')}
                  </h4>
                  <p className="text-xs text-[#724319]/85 leading-relaxed">
                    {t('planner.insightRecBody', { budget: totalBudget.toLocaleString() })}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-[#FFF8F6] rounded-2xl border border-[#EBC1B6]/60 space-y-2">
                  <span className="font-semibold text-[#724319] flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-amber-600" />
                    {t('planner.insightFloralTitle')}
                  </span>
                  <p className="text-[11px] text-[#724319]/80 leading-relaxed">
                    {t('planner.insightFloralBody')}
                  </p>
                </div>

                <div className="p-4 bg-[#FFF8F6] rounded-2xl border border-[#EBC1B6]/60 space-y-2">
                  <span className="font-semibold text-[#724319] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#8A5A44]" />
                    {t('planner.insightTimingTitle')}
                  </span>
                  <p className="text-[11px] text-[#724319]/80 leading-relaxed">
                    {t('planner.insightTimingBody')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Action Footer */}
          <div className="px-6 py-4 bg-[#FFF8F6] border-t border-[#EBC1B6]/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-[#8A5A44]">
              {t('planner.footerPrompt')}
            </span>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <a
                href="#marketplace"
                onClick={() => onExploreVendors && onExploreVendors()}
                className="w-full sm:w-auto text-center px-4 py-2 bg-[#724319] hover:bg-[#8A5A44] text-white font-medium rounded-full transition-colors cursor-pointer"
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
