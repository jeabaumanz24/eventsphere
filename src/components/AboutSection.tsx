import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { aiEcosystemImg } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';
import { getPageHref } from '../utils/navigation';

interface AboutSectionProps {
  isPagePrimary?: boolean;
  ctaHref?: string;
  ctaLabel?: string;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  isPagePrimary = false,
  ctaHref,
  ctaLabel,
}) => {
  const { t } = useLanguage();
  const HeadingTag = isPagePrimary ? 'h1' : 'h2';
  const SubHeadingTag = isPagePrimary ? 'h2' : 'h3';
  const resolvedHref = ctaHref || getPageHref('services');
  const resolvedLabel = ctaLabel || t('about.cta');

  return (
    <section
      id="about"
      className={`${
        isPagePrimary ? 'py-16 md:py-24' : 'py-20 md:py-24'
      } bg-[#FFF8F6] relative`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: AI connecting ecosystem illustration */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="relative">
              {/* Outer soft shadow frame */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#EBC1B6] bg-white group">
                <img
                  src={aiEcosystemImg}
                  alt="Isometric illustration showing EventSphere connecting event hosts and Adelaide vendor studios"
                  className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="p-5 bg-white border-t border-[#EBC1B6]/50">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <SubHeadingTag className="text-sm font-semibold text-[#724319]">{t('about.ecoTitle')}</SubHeadingTag>
                      <p className="text-xs text-[#724319] mt-0.5">{t('about.ecoSub')}</p>
                    </div>
                    <span className="text-xs font-medium text-[#724319] bg-[#F2CCC3] px-3 py-1 rounded-full shrink-0">
                      {t('about.ecoBadge')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Decorative background element */}
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-[#F2CCC3]/40 rounded-full blur-2xl -z-10" />
            </div>
          </div>

          {/* Right Column: Narrative content */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-semibold tracking-wider uppercase text-[#724319]">
                {t('about.kicker')}
              </span>
              <HeadingTag className="text-3xl sm:text-4xl font-serif font-bold text-[#724319] leading-tight">
                {t('about.title')}
              </HeadingTag>
            </div>

            <p className="text-base sm:text-lg text-[#4A2B10] leading-relaxed">
              {t('about.description')}
            </p>

            {/* Core differentiators */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#EBC1B6]/60 flex items-center justify-center shrink-0 mt-0.5 text-[#724319]">
                  <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                </div>
                <div>
                  <SubHeadingTag className="text-sm font-semibold text-[#724319]">{t('about.diff1Title')}</SubHeadingTag>
                  <p className="text-xs sm:text-sm text-[#4A2B10] mt-0.5">
                    {t('about.diff1Desc')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#EBC1B6]/60 flex items-center justify-center shrink-0 mt-0.5 text-[#724319]">
                  <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                </div>
                <div>
                  <SubHeadingTag className="text-sm font-semibold text-[#724319]">{t('about.diff2Title')}</SubHeadingTag>
                  <p className="text-xs sm:text-sm text-[#4A2B10] mt-0.5">
                    {t('about.diff2Desc')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#EBC1B6]/60 flex items-center justify-center shrink-0 mt-0.5 text-[#724319]">
                  <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                </div>
                <div>
                  <SubHeadingTag className="text-sm font-semibold text-[#724319]">{t('about.diff3Title')}</SubHeadingTag>
                  <p className="text-xs sm:text-sm text-[#4A2B10] mt-0.5">
                    {t('about.diff3Desc')}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={resolvedHref}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#724319] hover:text-[#4A2B10] transition-colors group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#724319] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF8F6] rounded-lg px-2 py-1 -mx-2"
              >
                <span>{resolvedLabel}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
