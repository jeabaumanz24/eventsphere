import React from 'react';
import { ArrowRight, Globe2, MapPin, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import {
  christeningTableImg,
  communityFestivalImg,
  diwaliDecorImg,
  eidFeastImg,
  elopementHillsImg,
  heroWeddingImg,
  lunarNewYearImg,
  milestoneBirthdayImg,
} from '../data/mockData';
import { EventTypeTag } from '../types';
import { trackEvent } from '../utils/analytics';
import { getPageHref } from '../utils/navigation';

interface EventTile {
  id: string;
  analyticsName: string;
  titleKey: string;
  descKey: string;
  eventFilter: EventTypeTag;
  image: string;
  alt: string;
}

const EVENT_TILES: EventTile[] = [
  {
    id: 'weddings',
    analyticsName: 'Weddings',
    titleKey: 'home.tile.weddings.title',
    descKey: 'home.tile.weddings.desc',
    eventFilter: 'Weddings',
    image: heroWeddingImg,
    alt: 'Smiling newlywed couple in warm afternoon sunlight during an Adelaide multicultural wedding celebration',
  },
  {
    id: 'diwali',
    analyticsName: 'Diwali and Festival of Lights',
    titleKey: 'home.tile.diwali.title',
    descKey: 'home.tile.diwali.desc',
    eventFilter: 'Diwali & Festival of Lights',
    image: diwaliDecorImg,
    alt: 'Vibrant marigold and floating petal rangoli illuminated by brass diyas for Diwali in Adelaide',
  },
  {
    id: 'lny',
    analyticsName: 'Lunar New Year',
    titleKey: 'home.tile.lny.title',
    descKey: 'home.tile.lny.desc',
    eventFilter: 'Lunar New Year',
    image: lunarNewYearImg,
    alt: 'Festive red lantern and family banquet setup for a Lunar New Year gathering in Adelaide',
  },
  {
    id: 'eid',
    analyticsName: 'Eid Gatherings',
    titleKey: 'home.tile.eid.title',
    descKey: 'home.tile.eid.desc',
    eventFilter: 'Eid',
    image: eidFeastImg,
    alt: 'Warm candlelit Middle Eastern Halal banquet table set for an Adelaide Eid family feast',
  },
  {
    id: 'birthdays',
    analyticsName: 'Milestone Birthdays',
    titleKey: 'home.tile.birthdays.title',
    descKey: 'home.tile.birthdays.desc',
    eventFilter: 'Milestone Birthdays',
    image: milestoneBirthdayImg,
    alt: 'Friends and family raising a toast around a long dinner table for an Adelaide milestone birthday',
  },
  {
    id: 'engagements',
    analyticsName: 'Engagements and Elopements',
    titleKey: 'home.tile.engagements.title',
    descKey: 'home.tile.engagements.desc',
    eventFilter: 'Engagements & Proposals',
    image: elopementHillsImg,
    alt: 'Intimate elopement ceremony among eucalyptus trees and autumn vines in the Adelaide Hills',
  },
  {
    id: 'christenings',
    analyticsName: 'Christenings and Baby Showers',
    titleKey: 'home.tile.christenings.title',
    descKey: 'home.tile.christenings.desc',
    eventFilter: 'Christenings & Baby Showers',
    image: christeningTableImg,
    alt: 'Soft pastel florals, keepsake favours and cake table styled for an Adelaide christening luncheon',
  },
  {
    id: 'corporate',
    analyticsName: 'Corporate and Community Events',
    titleKey: 'home.tile.corporate.title',
    descKey: 'home.tile.corporate.desc',
    eventFilter: 'Corporate Events',
    image: communityFestivalImg,
    alt: 'Community hosts and cultural performers gathered under string lights at an Adelaide festival showcase',
  },
];

export const HomeOverviewStrip: React.FC = () => {
  const { t } = useLanguage();

  const trustCaptions = [
    {
      icon: Globe2,
      label: t('home.stripCard1Title'),
    },
    {
      icon: MapPin,
      label: t('home.stripCard2Title'),
    },
    {
      icon: ShieldCheck,
      label: t('home.stripTrustPricing'),
    },
  ];

  const handleTileClick = (tileName: string) => {
    trackEvent('marketplace_filter_used', {
      filter_type: 'event_type',
      filter_value: tileName,
    });
  };

  return (
    <section
      id="about-overview"
      aria-labelledby="celebrate-tradition-heading"
      className="py-14 md:py-20 bg-[#FFF8F6] relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Centered Header & Intro */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2
            id="celebrate-tradition-heading"
            className="text-3xl sm:text-4xl font-serif font-bold text-[#724319] tracking-tight"
          >
            {t('home.celebrateTitle')}
          </h2>
          <p className="text-sm sm:text-base text-[#4A2B10] leading-relaxed">
            {t('home.celebrateSubtitle')}
          </p>
        </div>

        {/* 8-Tile Responsive Photo Grid (4 cols desktop, 2 cols tablet, 1 col mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {EVENT_TILES.map((tile) => {
            const href = getPageHref(
              'vendors',
              `?eventType=${encodeURIComponent(tile.eventFilter)}`
            );
            return (
              <a
                key={tile.id}
                href={href}
                onClick={() => handleTileClick(tile.analyticsName)}
                className="group relative block rounded-2xl overflow-hidden border border-[#EBC1B6] bg-[#4A2B10] shadow-xs hover:shadow-xl hover:-translate-y-1 focus-visible:-translate-y-1 transition-all duration-300 motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:focus-visible:translate-y-0 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#724319] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF8F6]"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={tile.image}
                    alt={tile.alt}
                    className="w-full h-full object-cover transition-transform duration-500 motion-reduce:transition-none group-hover:scale-105 motion-reduce:group-hover:scale-100"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  {/* High-contrast dark-to-transparent gradient scrim */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#1F1106]/95 via-[#1F1106]/55 to-[#1F1106]/10"
                    aria-hidden="true"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 text-left space-y-1">
                    <h3 className="text-lg font-serif font-bold text-white leading-snug">
                      {t(tile.titleKey)}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-white/95 leading-snug line-clamp-2">
                      {t(tile.descKey)}
                    </p>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* Slim Trust Row + Centered About Link */}
        <div className="pt-2 space-y-6">
          <div className="border-y border-[#EBC1B6]/70 py-4 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-10 text-xs sm:text-sm text-[#4A2B10]">
            {trustCaptions.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="inline-flex items-center gap-2 font-medium">
                  <span className="w-7 h-7 rounded-lg bg-[#F2CCC3]/55 border border-[#EBC1B6] flex items-center justify-center text-[#724319] shrink-0">
                    <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                  </span>
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <a
              href={getPageHref('about')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#724319] hover:text-[#4A2B10] transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#724319] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF8F6] rounded-lg px-2 py-1"
            >
              <span>{t('home.stripAboutLink')}</span>
              <ArrowRight
                className="w-4 h-4 group-hover:translate-x-1 transition-transform motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
