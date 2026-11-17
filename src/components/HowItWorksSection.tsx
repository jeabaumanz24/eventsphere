import React, { useState } from 'react';
import { Calendar, Sparkles, MessageCircle, ArrowRight, Check, CheckCircle2 } from 'lucide-react';
import { howItWorksSteps } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

export const HowItWorksSection: React.FC = () => {
  const { t } = useLanguage();
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const stepIcons = [Calendar, Sparkles, MessageCircle];
  const activeStep = howItWorksSteps[activeStepIndex];

  return (
    <section className="py-20 md:py-28 bg-[#FFF8F6] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#8A5A44]">
            {t('how.kicker')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#724319]">
            {t('how.title')}
          </h2>
          <p className="text-sm sm:text-base text-[#724319]/80 leading-relaxed [text-wrap:balance]">
            {t('how.subtitle')}
          </p>
        </div>

        {/* Step Selector Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 bg-[#F2CCC3]/40 border border-[#EBC1B6] rounded-2xl max-w-2xl w-full">
            {howItWorksSteps.map((s, idx) => {
              const Icon = stepIcons[idx];
              const isActive = activeStepIndex === idx;
              return (
                <button
                  key={s.step}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 sm:px-5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#724319] shadow-sm font-semibold'
                      : 'text-[#724319]/70 hover:text-[#724319]'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold ${
                    isActive ? 'bg-[#724319] text-white' : 'bg-[#EBC1B6] text-[#724319]'
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="hidden sm:inline">{t('how.stepLabel')} {idx + 1}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Step Showcase Card */}
        <div className="bg-white rounded-3xl border border-[#EBC1B6] p-8 sm:p-12 shadow-md relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Step Explanation */}
            <div className="lg:col-span-6 space-y-5 text-left">
              <div className="flex items-center gap-3">
                <span className="text-4xl sm:text-5xl font-serif font-bold text-[#8A5A44]/60 tabular-nums">
                  {activeStep.step}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8A5A44] bg-[#FFF8F6] border border-[#EBC1B6] px-3 py-1 rounded-full">
                  {t(`how.${activeStep.step}.badge`)}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#724319]">
                {t(`how.${activeStep.step}.title`)}
              </h3>

              <p className="text-base text-[#724319]/85 leading-relaxed">
                {t(`how.${activeStep.step}.desc`)}
              </p>

              <div className="p-4 bg-[#FFF8F6] rounded-2xl border border-[#EBC1B6]/60">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#8A5A44] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#724319]/85 leading-relaxed">
                    {t(`how.${activeStep.step}.detail`)}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => setActiveStepIndex((prev) => (prev + 1) % howItWorksSteps.length)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#724319] hover:bg-[#8A5A44] rounded-full transition-colors cursor-pointer"
                >
                  <span>{activeStepIndex === 2 ? t('how.backToStep1') : t('how.nextStep')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Interactive Step Preview Mockup */}
            <div className="lg:col-span-6">
              <div className="bg-[#FFF8F6] rounded-2xl p-6 border border-[#EBC1B6]/70 shadow-inner">
                {activeStepIndex === 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#EBC1B6]/50">
                      <span className="text-xs font-semibold text-[#724319]">{t('how.mock1Header')}</span>
                      <span className="text-[11px] text-[#8A5A44]">{t('how.mock1Region')}</span>
                    </div>
                    <div className="space-y-2.5 text-xs">
                      <div className="p-3 bg-white rounded-xl border border-[#EBC1B6]/40">
                        <span className="text-[10px] text-[#8A5A44] uppercase font-bold">{t('how.mock1TypeLabel')}</span>
                        <p className="text-sm font-semibold text-[#724319] mt-0.5">{t('how.mock1TypeVal')}</p>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-[#EBC1B6]/40">
                        <span className="text-[10px] text-[#8A5A44] uppercase font-bold">{t('how.mock1RitualsLabel')}</span>
                        <div className="flex flex-wrap gap-1.5 mt-1 text-[11px]">
                          <span className="bg-[#F2CCC3]/50 px-2 py-0.5 rounded text-[#724319]">Veil & Cord Rites</span>
                          <span className="bg-[#F2CCC3]/50 px-2 py-0.5 rounded text-[#724319]">Barossa Wine Tasting</span>
                          <span className="bg-[#F2CCC3]/50 px-2 py-0.5 rounded text-[#724319]">Dual-Language MC</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2.5 bg-white rounded-xl border border-[#EBC1B6]/40">
                          <span className="text-[10px] text-[#8A5A44] uppercase">{t('how.mock1Guests')}</span>
                          <p className="text-xs font-bold text-[#724319]">{t('how.mock1GuestsVal')}</p>
                        </div>
                        <div className="p-2.5 bg-white rounded-xl border border-[#EBC1B6]/40">
                          <span className="text-[10px] text-[#8A5A44] uppercase">{t('how.mock1Location')}</span>
                          <p className="text-xs font-bold text-[#724319]">Barossa Valley / Adelaide</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeStepIndex === 1 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#EBC1B6]/50">
                      <span className="text-xs font-semibold text-[#724319]">{t('how.mock2Header')}</span>
                      <span className="text-[11px] text-[#8A5A44] font-mono">{t('how.mock2Score')}</span>
                    </div>
                    <div className="space-y-2.5 text-xs">
                      <div className="p-3 bg-white rounded-xl border border-[#EBC1B6]/40 flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-[#724319]">Maria Santos Photography</div>
                          <div className="text-[11px] text-[#8A5A44]">Multicultural Specialist · 4.98 ★</div>
                        </div>
                        <span className="text-xs font-bold text-[#724319]">$2,850 AUD</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-[#EBC1B6]/40 flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-[#724319]">Aria & Co. Floral Design</div>
                          <div className="text-[11px] text-[#8A5A44]">Native SA & Terracotta Ceramics · 4.95 ★</div>
                        </div>
                        <span className="text-xs font-bold text-[#724319]">$1,900 AUD</span>
                      </div>
                      <div className="p-2.5 bg-[#F2CCC3]/40 rounded-xl text-[11px] text-[#724319] flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-[#8A5A44] shrink-0" />
                        <span>{t('how.mock2Savings')}</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeStepIndex === 2 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#EBC1B6]/50">
                      <span className="text-xs font-semibold text-[#724319]">{t('how.mock3Header')}</span>
                      <span className="text-[11px] text-[#8A5A44]">{t('how.mock3Encrypted')}</span>
                    </div>
                    <div className="space-y-3 text-xs">
                      <div className="p-3 bg-white rounded-xl border border-[#EBC1B6]/40 space-y-2">
                        <div className="flex items-center gap-2 text-[11px] text-[#8A5A44]">
                          <span className="font-bold text-[#724319]">Maria Santos:</span>
                          <span>"Hi Diwata! I would love to capture your veil ceremony at Adelaide Botanic."</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-[#724319] bg-[#FFF8F6] p-2 rounded-lg">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>{t('how.mock3ProposalNote')}</span>
                        </div>
                      </div>
                      <div className="p-3 bg-[#724319] text-white rounded-xl flex items-center justify-between">
                        <div>
                          <div className="text-xs font-semibold">{t('how.mock3Booking')}</div>
                          <div className="text-[10px] text-white/80">{t('how.mock3Escrow')}</div>
                        </div>
                        <span className="px-3 py-1 bg-white text-[#724319] text-xs font-bold rounded-full">
                          {t('how.mock3Approve')}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3 Step Timeline Cards in one cohesive grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {howItWorksSteps.map((step, idx) => (
            <div
              key={step.step}
              onClick={() => setActiveStepIndex(idx)}
              className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                activeStepIndex === idx
                  ? 'bg-white border-[#724319] shadow-md -translate-y-1'
                  : 'bg-white/60 border-[#EBC1B6]/60 hover:bg-white hover:border-[#8A5A44]/40'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-[#8A5A44]">{t('how.stepUpper')} {step.step}</span>
                {activeStepIndex === idx && (
                  <span className="text-[10px] font-bold text-[#724319] bg-[#F2CCC3] px-2 py-0.5 rounded-full">
                    {t('how.activeBadge')}
                  </span>
                )}
              </div>
              <h4 className="text-base font-serif font-bold text-[#724319] mb-2">{t(`how.${step.step}.title`)}</h4>
              <p className="text-xs text-[#724319]/75 line-clamp-3 leading-relaxed">{t(`how.${step.step}.desc`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
