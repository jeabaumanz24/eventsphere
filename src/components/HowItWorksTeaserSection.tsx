import React from 'react';
import { ArrowRight, Calendar, Sparkles, MessageCircle } from 'lucide-react';
import { howItWorksSteps } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';
import { getPageHref } from '../utils/navigation';

export const HowItWorksTeaserSection: React.FC = () => {
  const { t } = useLanguage();
  const icons = [Calendar, Sparkles, MessageCircle];

  return (
    <section id="how-it-works-teaser" className="py-20 md:py-24 bg-[#FFF8F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#8A5A44]">
            {t('how.kicker')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#724319] [text-wrap:balance]">
            {t('how.title')}
          </h2>
          <p className="text-sm sm:text-base text-[#724319]/80 leading-relaxed [text-wrap:balance]">
            {t('how.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {howItWorksSteps.map((step, idx) => {
            const Icon = icons[idx % icons.length];
            return (
              <div
                key={step.step}
                className="bg-white rounded-3xl p-7 border border-[#EBC1B6]/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-serif font-bold text-[#8A5A44]/60 tabular-nums">
                      {step.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#FFF8F6] border border-[#EBC1B6] flex items-center justify-center text-[#724319]">
                      <Icon className="w-5 h-5 text-[#8A5A44]" />
                    </div>
                  </div>
                  <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-[#8A5A44] bg-[#FFF8F6] border border-[#EBC1B6]/70 px-2.5 py-0.5 rounded-full">
                    {t(`how.${step.step}.badge`)}
                  </span>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-[#724319]">
                    {t(`how.${step.step}.title`)}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#724319]/80 leading-relaxed">
                    {t(`how.${step.step}.desc`)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href={getPageHref('services', '#how-it-works')}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#724319] hover:bg-[#8A5A44] text-white text-xs sm:text-sm font-semibold transition-colors shadow-sm"
          >
            <span>{t('home.howTeaserCta')}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href={getPageHref('ai-planner')}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-[#F2CCC3]/35 text-[#724319] border border-[#EBC1B6] text-xs sm:text-sm font-semibold transition-colors"
          >
            <span>{t('nav.aiPlanner')}</span>
          </a>
        </div>
      </div>
    </section>
  );
};
