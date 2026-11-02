import React from 'react';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { aiEcosystemImg } from '../data/mockData';

interface AboutSectionProps {
  onLearnMore?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onLearnMore }) => {
  return (
    <section id="about" className="py-20 md:py-28 bg-[#FFF8F6] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: AI connecting ecosystem illustration */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="relative">
              {/* Outer soft shadow frame */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#EBC1B6] bg-white group">
                <img
                  src={aiEcosystemImg}
                  alt="3D isometric conceptual architectural illustration showing AI connecting event couples and boutique vendor studios"
                  className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="p-5 bg-white border-t border-[#EBC1B6]/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-[#724319]">Unified EventSphere Ecosystem</h4>
                      <p className="text-xs text-[#8A5A44]">Vendor Studios · Budgeting Core · Cultural Checklists</p>
                    </div>
                    <span className="text-xs font-medium text-[#724319] bg-[#F2CCC3] px-3 py-1 rounded-full">
                      Zero Friction
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
              <span className="text-xs font-semibold tracking-wider uppercase text-[#8A5A44]">
                The Platform Advantage
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#724319] leading-tight">
                Why EventSphere
              </h2>
            </div>

            <p className="text-base sm:text-lg text-[#724319]/85 leading-relaxed">
              Planning events often requires users to search across multiple websites, social platforms, and vendor directories. EventSphere simplifies the process by bringing vendor discovery, budgeting tools, planning resources, and AI-driven recommendations together in one platform.
            </p>

            {/* Core differentiators */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#EBC1B6]/60 flex items-center justify-center shrink-0 mt-0.5 text-[#724319]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#724319]">Multicultural Heritage by Design</h4>
                  <p className="text-xs text-[#724319]/75 mt-0.5">
                    Purpose-built protocols for dual-tradition ceremonies, multi-day celebrations, and bespoke cultural dietary guidelines.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#EBC1B6]/60 flex items-center justify-center shrink-0 mt-0.5 text-[#724319]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#724319]">South Australian Local Intelligence</h4>
                  <p className="text-xs text-[#724319]/75 mt-0.5">
                    Deep regional calibration spanning Adelaide CBD, Adelaide Hills, Barossa Valley, McLaren Vale, and coastal Fleurieu.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#EBC1B6]/60 flex items-center justify-center shrink-0 mt-0.5 text-[#724319]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#724319]">Transparent Quotes, Zero Hidden Markups</h4>
                  <p className="text-xs text-[#724319]/75 mt-0.5">
                    Clear baseline package pricing with real-time budget forecasting and verified direct vendor communications.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="#services"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#724319] hover:text-[#8A5A44] transition-colors group cursor-pointer"
              >
                <span>Explore all 4 core services</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
