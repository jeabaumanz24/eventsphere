import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarHeart, Globe2, Sparkles, Users } from 'lucide-react';
import { COMMUNITY_LANGUAGES, useLanguage } from '../context/LanguageContext';
import { vendorsData } from '../data/mockData';

const ANIMATION_DURATION_MS = 1200;

export const StatsSection: React.FC = () => {
  const { t, currentLanguage, setLanguage } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);

  const vendorCount = vendorsData.length;
  const eventTypeCount = useMemo(
    () => new Set(vendorsData.flatMap((v) => v.eventTypes)).size,
    []
  );
  const traditionCount = useMemo(
    () => new Set(vendorsData.flatMap((v) => v.traditions)).size,
    []
  );
  const languageCount = COMMUNITY_LANGUAGES.length;

  const targets = useMemo(
    () => [vendorCount, eventTypeCount, traditionCount, languageCount],
    [vendorCount, eventTypeCount, traditionCount, languageCount]
  );

  const [displayValues, setDisplayValues] = useState<number[]>(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return [vendorCount, eventTypeCount, traditionCount, languageCount];
    }
    return [0, 0, 0, 0];
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      setDisplayValues(targets);
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      hasAnimatedRef.current = true;
      setDisplayValues(targets);
      return;
    }

    if (hasAnimatedRef.current) {
      setDisplayValues(targets);
      return;
    }

    const node = sectionRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      hasAnimatedRef.current = true;
      setDisplayValues(targets);
      return;
    }

    let rafId = 0;

    const startCountUp = () => {
      if (hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;

      const startTime = performance.now();
      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / ANIMATION_DURATION_MS, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        setDisplayValues(targets.map((target) => Math.round(target * eased)));

        if (progress < 1) {
          rafId = window.requestAnimationFrame(step);
        } else {
          setDisplayValues(targets);
        }
      };

      rafId = window.requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          startCountUp();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [targets]);

  const avatarVendors = useMemo(() => vendorsData.slice(0, 5), []);
  const remainingVendors = Math.max(0, vendorCount - avatarVendors.length);
  const remainingEventTypes = Math.max(0, eventTypeCount - 3);
  const remainingTraditions = Math.max(0, traditionCount - 3);

  const eventSamplePills = ['Weddings', 'Diwali', 'Eid'];
  const traditionSamplePills = ['Greek', 'Filipino', 'Indian'];

  const pillClass =
    'inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#5A3412] text-[#FFF8F6] border border-[#EBC1B6]/35 whitespace-nowrap';

  const stats = [
    {
      id: 'vendors',
      icon: Users,
      target: vendorCount,
      label: t('stats.stat1'),
      description: t('stats.stat1Desc'),
      detail: (
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center -space-x-2" aria-hidden="true">
            {avatarVendors.map((vendor) => (
              <img
                key={vendor.id}
                src={vendor.image}
                alt=""
                className="w-7 h-7 rounded-full object-cover object-center ring-2 ring-[#724319] bg-[#5A3412] shrink-0"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            ))}
          </div>
          <span className="text-[11px] font-semibold text-[#FFF8F6] whitespace-nowrap">
            {t('stats.moreVendors', { count: remainingVendors })}
          </span>
        </div>
      ),
    },
    {
      id: 'event-types',
      icon: CalendarHeart,
      target: eventTypeCount,
      label: t('stats.stat2'),
      description: t('stats.stat2Desc'),
      detail: (
        <div className="flex flex-wrap items-center gap-1.5">
          {eventSamplePills.map((pill) => (
            <span key={pill} className={pillClass}>
              {pill}
            </span>
          ))}
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#FFF8F6]/15 text-[#FFF8F6] border border-[#EBC1B6]/45 whitespace-nowrap">
            +{remainingEventTypes}
          </span>
        </div>
      ),
    },
    {
      id: 'traditions',
      icon: Globe2,
      target: traditionCount,
      label: t('stats.stat3'),
      description: t('stats.stat3Desc'),
      detail: (
        <div className="flex flex-wrap items-center gap-1.5">
          {traditionSamplePills.map((pill) => (
            <span key={pill} className={pillClass}>
              {pill}
            </span>
          ))}
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#FFF8F6]/15 text-[#FFF8F6] border border-[#EBC1B6]/45 whitespace-nowrap">
            +{remainingTraditions}
          </span>
        </div>
      ),
    },
    {
      id: 'languages',
      icon: Sparkles,
      target: languageCount,
      label: t('stats.stat4'),
      description: t('stats.stat4Desc'),
      detail: (
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label={t('stats.stat4')}>
          {COMMUNITY_LANGUAGES.map((lang) => {
            const shortLabel = lang.label.split(' / ')[0];
            const isActive = currentLanguage === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => setLanguage(lang.code)}
                aria-pressed={isActive}
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFF8F6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#724319] ${
                  isActive
                    ? 'bg-[#FFF8F6] text-[#724319] font-semibold border border-[#FFF8F6]'
                    : 'bg-[#5A3412] text-[#FFF8F6] border border-[#EBC1B6]/35 hover:bg-[#4A2B10]'
                }`}
              >
                {shortLabel}
              </button>
            );
          })}
        </div>
      ),
    },
  ];

  return (
    <section
      aria-label="EventSphere platform metrics"
      className="py-10 sm:py-12 bg-[#FFF8F6]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={sectionRef}
          className="bg-[#724319] rounded-3xl px-5 py-8 sm:px-9 sm:py-10 lg:px-12 lg:py-12 shadow-lg border border-[#8A5A44]/40 overflow-hidden"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-8 sm:gap-x-8 lg:gap-0 lg:divide-x lg:divide-[#EBC1B6]/25">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.id}
                  className="flex flex-col justify-between lg:px-7 lg:first:pl-0 lg:last:pr-0 min-w-0"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        aria-hidden="true"
                        className="font-serif font-bold text-5xl sm:text-[3.5rem] lg:text-[3.75rem] text-[#FFF8F6] tabular-nums leading-none tracking-tight"
                      >
                        {displayValues[idx]}
                      </span>
                      <span className="sr-only">{stat.target}</span>
                      <div
                        className="w-9 h-9 rounded-full border border-[#EBC1B6]/45 bg-[#5A3412]/70 flex items-center justify-center text-[#FFF8F6] shrink-0"
                        aria-hidden="true"
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-[#FFF8F6] leading-snug">
                      {stat.label}
                    </h3>

                    <p className="mt-1 text-xs sm:text-[13px] text-[#FFF8F6]/90 leading-snug">
                      {stat.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-1">{stat.detail}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
