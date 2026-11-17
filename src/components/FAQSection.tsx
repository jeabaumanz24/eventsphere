import React, { useState } from 'react';
import { ChevronDown, MessageCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

type FaqCategory = 'all' | 'venues' | 'rituals' | 'budget';

interface FaqItemConfig {
  id: string;
  category: Exclude<FaqCategory, 'all'>;
  number: string;
}

const FAQ_ITEMS: FaqItemConfig[] = [
  { id: 'q1', category: 'rituals', number: '01' },
  { id: 'q2', category: 'venues', number: '02' },
  { id: 'q3', category: 'venues', number: '03' },
  { id: 'q4', category: 'rituals', number: '04' },
  { id: 'q5', category: 'budget', number: '05' },
  { id: 'q6', category: 'budget', number: '06' },
  { id: 'q7', category: 'rituals', number: '07' },
];

interface FAQSectionProps {
  onOpenContact?: () => void;
  onOpenPlanner?: () => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({
  onOpenContact,
  onOpenPlanner,
}) => {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<FaqCategory>('all');
  const [openId, setOpenId] = useState<string>('q1');

  const categories: FaqCategory[] = ['all', 'venues', 'rituals', 'budget'];

  const visibleItems =
    activeCategory === 'all'
      ? FAQ_ITEMS
      : FAQ_ITEMS.filter((item) => item.category === activeCategory);

  const handleSelectCategory = (category: FaqCategory) => {
    setActiveCategory(category);
    const nextItems =
      category === 'all'
        ? FAQ_ITEMS
        : FAQ_ITEMS.filter((item) => item.category === category);
    if (!nextItems.some((item) => item.id === openId) && nextItems.length > 0) {
      setOpenId(nextItems[0].id);
    }
  };

  const handleToggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? '' : id));
  };

  return (
    <section id="faq" className="py-20 md:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Editorial Header & Concierge Callout */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            <div className="space-y-3">
              <span className="block text-xs font-semibold tracking-wider uppercase text-[#8A5A44]">
                {t('faq.kicker')}
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#724319] leading-tight [text-wrap:balance]">
                {t('faq.title')}
              </h2>
              <p className="text-sm sm:text-base text-[#724319]/80 leading-relaxed">
                {t('faq.subtitle')}
              </p>
            </div>

            <div className="bg-[#FFF8F6] rounded-3xl p-6 sm:p-7 border border-[#EBC1B6]/80 space-y-4">
              <h3 className="text-base font-serif font-bold text-[#724319]">
                {t('faq.ctaTitle')}
              </h3>
              <p className="text-xs sm:text-sm text-[#724319]/80 leading-relaxed">
                {t('faq.ctaDesc')}
              </p>
              <div className="flex flex-col gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={onOpenContact}
                  className="w-full py-3 px-5 rounded-full bg-[#724319] hover:bg-[#8A5A44] text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>{t('faq.ctaContactBtn')}</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenPlanner}
                  className="w-full py-2.5 px-5 rounded-full bg-white hover:bg-[#F2CCC3]/35 text-[#724319] border border-[#EBC1B6] text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#8A5A44] shrink-0" />
                  <span>{t('faq.ctaPlannerBtn')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Category Filter Tabs + Expandable FAQ Accordion */}
          <div className="lg:col-span-8">
            {/* Interactive Category Filter Controls */}
            <div
              role="tablist"
              aria-label={t('faq.kicker')}
              className="flex flex-wrap items-center gap-2 mb-6"
            >
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => handleSelectCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-[#724319] text-white shadow-xs'
                        : 'bg-[#FFF8F6] text-[#724319]/80 border border-[#EBC1B6]/80 hover:bg-[#F2CCC3]/35 hover:text-[#724319]'
                    }`}
                  >
                    {t(`faq.cat.${cat}`)}
                  </button>
                );
              })}
            </div>

            {/* Accordion List with Clean Hairline Dividers */}
            <div className="divide-y divide-[#EBC1B6]/60 border-y border-[#EBC1B6]/70">
              {visibleItems.map((item) => {
                const isOpen = openId === item.id;
                const buttonId = `faq-btn-${item.id}`;
                const panelId = `faq-panel-${item.id}`;

                return (
                  <div key={item.id} className="py-5 sm:py-6">
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => handleToggleItem(item.id)}
                      className="w-full text-left flex items-start justify-between gap-4 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8A5A44]/40 rounded-xl"
                    >
                      <div className="space-y-1.5">
                        <span className="block text-[11px] font-semibold tracking-wider uppercase text-[#8A5A44]/85">
                          {item.number} · {t(`faq.cat.${item.category}`)}
                        </span>
                        <span className="block text-base sm:text-lg font-serif font-bold text-[#724319] group-hover:text-[#8A5A44] transition-colors leading-snug">
                          {t(`faq.${item.id}.q`)}
                        </span>
                      </div>

                      <span
                        className={`mt-1 w-8 h-8 rounded-full border border-[#EBC1B6] flex items-center justify-center shrink-0 transition-colors ${
                          isOpen
                            ? 'bg-[#724319] text-white border-[#724319]'
                            : 'bg-[#FFF8F6] text-[#724319] group-hover:bg-[#F2CCC3]/40'
                        }`}
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </span>
                    </button>

                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
                        isOpen
                          ? 'grid-rows-[1fr] opacity-100 mt-3'
                          : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="text-sm text-[#724319]/85 leading-relaxed max-w-3xl pr-10">
                          {t(`faq.${item.id}.a`)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
