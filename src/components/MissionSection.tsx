import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export const MissionSection: React.FC = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const [jsArmed, setJsArmed] = useState(false);
  const [hasEntered, setHasEntered] = useState(true);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      setJsArmed(false);
      setHasEntered(true);
      return;
    }

    setJsArmed(true);
    setHasEntered(false);
  }, []);

  useEffect(() => {
    if (!jsArmed || hasEntered) return;
    const node = sectionRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setHasEntered(true);
      return;
    }

    let rafId1 = 0;
    let rafId2 = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          rafId1 = window.requestAnimationFrame(() => {
            rafId2 = window.requestAnimationFrame(() => {
              setHasEntered(true);
            });
          });
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (rafId1) window.cancelAnimationFrame(rafId1);
      if (rafId2) window.cancelAnimationFrame(rafId2);
    };
  }, [jsArmed, hasEntered]);

  const hiddenByJs = jsArmed && !hasEntered;
  const fadeStateClass = hiddenByJs ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0';
  const revealTransitionClass = jsArmed
    ? 'transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none motion-reduce:transform-none'
    : '';

  const cardSurfaceClass =
    'bg-white rounded-2xl border border-[#EBC1B6] p-6 sm:p-8 shadow-xs flex flex-col h-full transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:shadow-lg focus-visible:-translate-y-1 focus-visible:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#724319] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF8F6] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:focus-visible:translate-y-0';

  return (
    <section
      ref={sectionRef}
      id="mission"
      aria-labelledby="who-we-are-heading"
      className="pt-32 pb-12 md:pt-36 md:pb-16 bg-gradient-to-b from-[#F2CCC3]/25 to-[#FFF8F6] border-b border-[#EBC1B6]/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="sr-only">{t('about.pageHeading')}</h1>

        <div
          className={`text-center max-w-3xl mx-auto mb-12 md:mb-16 ${revealTransitionClass} ${fadeStateClass}`}
        >
          <h2
            id="who-we-are-heading"
            className="text-3xl sm:text-4xl font-serif font-bold text-[#724319] [text-wrap:balance]"
          >
            {t('mission.sectionTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <div
            className={`${revealTransitionClass} ${fadeStateClass}`}
            style={jsArmed ? { transitionDelay: '150ms' } : undefined}
          >
            <div tabIndex={0} aria-labelledby="mission-purpose-heading" className={cardSurfaceClass}>
              <h3
                id="mission-purpose-heading"
                className="text-2xl sm:text-3xl font-serif font-bold text-[#724319] mb-3"
              >
                {t('mission.purposeTitle')}
              </h3>
              <p className="text-sm sm:text-base text-[#4A2B10] leading-relaxed">
                {t('mission.purposeBody')}
              </p>
            </div>
          </div>

          <div
            className={`${revealTransitionClass} ${fadeStateClass}`}
            style={jsArmed ? { transitionDelay: '300ms' } : undefined}
          >
            <div tabIndex={0} aria-labelledby="mission-statement-heading" className={cardSurfaceClass}>
              <h3
                id="mission-statement-heading"
                className="text-2xl sm:text-3xl font-serif font-bold text-[#724319] mb-3"
              >
                {t('mission.title')}
              </h3>
              <p className="text-sm sm:text-base text-[#4A2B10] leading-relaxed">
                {t('mission.body')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
