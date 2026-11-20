import React from 'react';
import { ArrowRight, CheckSquare } from 'lucide-react';
import { CELEBRATION_CHECKLISTS } from '../data/checklistsData';
import { trackEvent } from '../utils/analytics';
import { getChecklistHref, getPageHref } from '../utils/navigation';

export const ChecklistsHubPage: React.FC = () => {
  const handleTileClick = (eventSlug: string) => {
    trackEvent('checklist_hub_click', {
      event_type: eventSlug,
    });
  };

  return (
    <section
      id="checklists-hub"
      aria-labelledby="checklists-hub-heading"
      className="pt-32 pb-20 md:pt-36 md:pb-24 bg-[#FFF8F6] relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Centered Header & Single Short Intro Line */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-[#8A5A44]">
            <CheckSquare className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Celebration Checklists</span>
          </span>
          <h1
            id="checklists-hub-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#724319] tracking-tight"
          >
            Vendor Checklists for Every Celebration
          </h1>
          <p className="text-sm sm:text-base text-[#4A2B10] leading-relaxed">
            Choose your celebration to see which Adelaide vendors to book first, typical lead times, and direct marketplace links.
          </p>
        </div>

        {/* 11-Tile Grid (4 cols desktop, 2 cols tablet, 1 col mobile) */}
        <div className="space-y-6">
          <h2
            id="what-are-you-celebrating-heading"
            className="text-2xl sm:text-3xl font-serif font-bold text-[#724319] tracking-tight"
          >
            What are you celebrating?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CELEBRATION_CHECKLISTS.map((checklist) => {
              const href = getChecklistHref(checklist.slug);
              const essentialsCount = checklist.essentials.length;
              return (
                <a
                  key={checklist.slug}
                  href={href}
                  onClick={() => handleTileClick(checklist.slug)}
                  aria-label={`${checklist.displayName} Vendor Checklist — ${essentialsCount} essentials to book first`}
                  className="group relative block rounded-2xl overflow-hidden border border-[#EBC1B6] bg-[#4A2B10] shadow-xs hover:shadow-xl hover:-translate-y-1 focus-visible:-translate-y-1 transition-all duration-300 motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:focus-visible:translate-y-0 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#724319] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF8F6]"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <img
                      src={checklist.image}
                      alt={checklist.imageAlt}
                      className="w-full h-full object-cover transition-transform duration-500 motion-reduce:transition-none group-hover:scale-105 motion-reduce:group-hover:scale-100"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-[#1F1106]/95 via-[#1F1106]/55 to-[#1F1106]/10"
                      aria-hidden="true"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 text-left space-y-1.5">
                      <h3 className="text-lg font-serif font-bold text-white leading-snug">
                        {checklist.displayName}
                      </h3>
                      <p className="text-xs sm:text-[13px] text-white/95 leading-snug line-clamp-2">
                        {checklist.tileDescription}
                      </p>
                      <p className="pt-0.5 text-[11px] font-semibold text-[#F2CCC3] tracking-wide">
                        {essentialsCount} essentials to book first
                      </p>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Helpful Secondary Link Row */}
        <div className="pt-4 border-t border-[#EBC1B6]/70 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-[#4A2B10]">
            Want a budget breakdown and timeline matched to your guest count?
          </p>
          <a
            href={getPageHref('ai-planner')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#724319] hover:bg-[#8A5A44] text-white text-sm font-medium transition-colors shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#724319] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF8F6] shrink-0"
          >
            <span>Open AI Planner</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
};
