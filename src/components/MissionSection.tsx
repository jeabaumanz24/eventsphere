import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const MissionSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section
      id="mission"
      aria-label="Purpose and mission"
      className="pt-32 pb-12 md:pt-36 md:pb-16 bg-gradient-to-b from-[#F2CCC3]/25 to-[#FFF8F6] border-b border-[#EBC1B6]/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <p className="text-xs font-semibold tracking-wider uppercase text-[#724319]">
          {t('mission.kicker')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <div className="bg-white rounded-2xl border border-[#EBC1B6] p-6 sm:p-8 shadow-xs flex flex-col h-full">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#724319] mb-3">
              {t('mission.purposeTitle')}
            </h2>
            <p className="text-sm sm:text-base text-[#4A2B10] leading-relaxed">
              {t('mission.purposeBody')}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#EBC1B6] p-6 sm:p-8 shadow-xs flex flex-col h-full">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#724319] mb-3">
              {t('mission.title')}
            </h2>
            <p className="text-sm sm:text-base text-[#4A2B10] leading-relaxed">
              {t('mission.body')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
