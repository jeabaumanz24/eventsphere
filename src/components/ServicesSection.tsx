import React from 'react';
import { Sparkles, Calculator, BookOpen, BarChart3, ArrowRight } from 'lucide-react';
import { blogPostsData, servicesData } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';
import { getPageHref } from '../utils/navigation';
import { trackEvent } from '../utils/analytics';

interface ServicesSectionProps {
  isPagePrimary?: boolean;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ isPagePrimary = false }) => {
  const { t } = useLanguage();
  const HeadingTag = isPagePrimary ? 'h1' : 'h2';
  const guideCount = blogPostsData.length;

  const iconMap: Record<string, React.ElementType> = {
    Sparkles,
    Calculator,
    BookOpen,
    BarChart3,
  };

  const getServiceHref = (id: string): string => {
    switch (id) {
      case 'vendor-matching':
        return getPageHref('vendors');
      case 'budget-tools':
        return getPageHref('ai-planner', '?tab=budget');
      case 'event-resources':
        return getPageHref('blog');
      case 'analytics-insights':
        return getPageHref('ai-planner', '?tab=insights');
      default:
        return getPageHref('ai-planner');
    }
  };

  return (
    <section
      id="services"
      className={`${
        isPagePrimary ? 'pt-32 pb-20 md:pt-36 md:pb-24' : 'py-20 md:py-28'
      } bg-[#F2CCC3]/20 relative`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#8A5A44]">
            {t('services.kicker')}
          </span>
          <HeadingTag className="text-3xl sm:text-4xl font-serif font-bold text-[#724319]">
            {t('services.title')}
          </HeadingTag>
          <p className="text-sm sm:text-base text-[#724319]/80 leading-relaxed [text-wrap:balance]">
            {t('services.subtitle')}
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {servicesData.map((service, index) => {
            const Icon = iconMap[service.iconName] || Sparkles;
            const titleText = t(`service.${service.id}.title`);
            const ctaLabel = t(`service.${service.id}.cta`);
            const metricsText =
              service.id === 'event-resources'
                ? t(`service.${service.id}.metrics`, { count: guideCount })
                : t(`service.${service.id}.metrics`);

            return (
              <div
                key={service.id}
                className="group relative bg-white rounded-3xl p-8 sm:p-9 border border-[#EBC1B6]/70 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-[#FFF8F6] border border-[#EBC1B6] flex items-center justify-center text-[#724319] group-hover:bg-[#F2CCC3]/50 transition-colors">
                      <Icon className="w-7 h-7 text-[#8A5A44]" aria-hidden="true" />
                    </div>
                    <span className="text-xs font-medium text-[#8A5A44] bg-[#FFF8F6] border border-[#EBC1B6] px-3 py-1 rounded-full">
                      {t(`service.${service.id}.badge`)}
                    </span>
                  </div>

                  <span className="text-xs font-semibold uppercase text-[#8A5A44]/80 tracking-wider">
                    0{index + 1} · {t(`service.${service.id}.subtitle`)}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#724319] mt-1 mb-3">
                    {titleText}
                  </h2>
                  <p className="text-sm text-[#724319]/80 leading-relaxed">
                    {t(`service.${service.id}.desc`)}
                  </p>
                </div>

                <div className="mt-8 pt-5 border-t border-[#EBC1B6]/40 flex items-center justify-between gap-4 text-xs font-medium">
                  <span className="text-[#8A5A44] font-mono tabular-nums">
                    {metricsText}
                  </span>
                  <a
                    href={getServiceHref(service.id)}
                    aria-label={`${ctaLabel}, ${titleText}`}
                    onClick={() => {
                      trackEvent('service_card_click', {
                        service_name: service.title,
                      });
                    }}
                    className="inline-flex items-center gap-1.5 text-[#724319] hover:text-[#8A5A44] font-semibold group-hover:translate-x-1 transition-all cursor-pointer rounded-lg px-1.5 py-1 -mr-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#724319] focus-visible:ring-offset-2 shrink-0"
                  >
                    <span>{ctaLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
