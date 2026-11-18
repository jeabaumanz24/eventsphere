import React from 'react';
import { Star, Clock, CheckCircle, HeartHandshake } from 'lucide-react';
import { testimonialsData } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

export const TestimonialsSection: React.FC = () => {
  const { t } = useLanguage();
  const highlightIcons = [Clock, CheckCircle, HeartHandshake];

  return (
    <section className="py-20 md:py-28 bg-[#F2CCC3]/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#8A5A44]">
            {t('testimonials.kicker')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#724319] [text-wrap:balance]">
            {t('testimonials.title')}
          </h2>
          <p className="text-sm sm:text-base text-[#724319]/80 leading-relaxed [text-wrap:balance]">
            {t('testimonials.subtitle')}
          </p>
        </div>

        {/* 8 Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonialsData.map((item, idx) => {
            const Icon = highlightIcons[idx % highlightIcons.length];
            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 border border-[#EBC1B6]/70 shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  {/* Rating Stars + Highlight badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-1">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[11px] font-semibold text-[#8A5A44] bg-[#FFF8F6] px-2.5 py-1 rounded-full border border-[#EBC1B6]">
                      {t('testimonials.verifiedHost')}
                    </span>
                  </div>

                  {/* Concrete metric pill badge (interactive proof) */}
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#724319] bg-[#F2CCC3]/40 p-2.5 rounded-xl mb-4">
                    <Icon className="w-4 h-4 text-[#8A5A44] shrink-0" />
                    <span>{t(`testimonial.${item.id}.highlight`)}</span>
                  </div>

                  {/* Quote text */}
                  <p className="text-xs sm:text-sm text-[#4A2B10] leading-relaxed italic">
                    "{t(`testimonial.${item.id}.quote`)}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="pt-6 mt-6 border-t border-[#EBC1B6]/40 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-serif font-bold text-[#724319]">
                      {item.clientNames}
                    </h3>
                    <p className="text-xs text-[#724319] mt-0.5">
                      {t(`testimonial.${item.id}.role`)} · {item.eventDetails}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
