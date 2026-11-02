import React from 'react';
import { ArrowRight, Search, MapPin, Sparkles, Heart, ShieldCheck, Award } from 'lucide-react';
import { heroWeddingImg } from '../data/mockData';

interface HeroSectionProps {
  onStartPlanning: () => void;
  onExploreVendors: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartPlanning,
  onExploreVendors,
}) => {
  return (
    <section id="home" className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-gradient-to-b from-[#FFF8F6] via-[#FFF8F6] to-[#F2CCC3]/25">
      {/* Subtle background ambient glow */}
      <div className="absolute top-10 right-[-10%] w-[500px] h-[500px] rounded-full bg-[#F2CCC3]/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-[-5%] w-[420px] h-[420px] rounded-full bg-[#EBC1B6]/25 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Value proposition and actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Context location badge (text kicker, zero-pill discipline) */}
            <div className="inline-flex items-center gap-2 text-xs font-medium tracking-wide uppercase text-[#8A5A44]">
              <span className="w-2 h-2 rounded-full bg-[#8A5A44]/60" />
              <span>Adelaide, South Australia</span>
              <span aria-hidden="true" className="text-[#8A5A44]/40">·</span>
              <span>Next-Gen Celebration Platform</span>
            </div>

            {/* Headline with balanced wrap */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#724319] leading-[1.12] tracking-tight [text-wrap:balance]">
              AI-Powered Event Planning for <span className="italic font-normal text-[#8A5A44]">Modern Celebrations</span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-[#724319]/85 leading-relaxed max-w-2xl">
              Discover trusted vendors, plan smarter, and create unforgettable multicultural events with intelligent recommendations and planning tools.
            </p>

            {/* Dual CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onStartPlanning}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 text-base font-semibold text-white bg-[#724319] hover:bg-[#8A5A44] rounded-full shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap"
              >
                <span>Start Planning</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreVendors}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-medium text-[#724319] bg-white/90 hover:bg-white border border-[#EBC1B6] hover:border-[#8A5A44] rounded-full shadow-xs hover:shadow-sm transition-all cursor-pointer whitespace-nowrap"
              >
                <span>Explore Vendors</span>
              </button>
            </div>

            {/* Quick trust statement / metadata */}
            <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#724319]/75">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#8A5A44]" />
                <span>100% Verified Adelaide Vendors</span>
              </div>
              <span aria-hidden="true" className="text-[#EBC1B6]">·</span>
              <div className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-[#8A5A44]" />
                <span>Multicultural Traditions Welcomed</span>
              </div>
              <span aria-hidden="true" className="text-[#EBC1B6]">·</span>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#8A5A44]" />
                <span>Zero Hidden Commissions</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset + Animated Floating Badges */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main image container with luxury frame */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] group bg-[#F2CCC3]">
                <img
                  src={heroWeddingImg}
                  alt="Luxury multicultural wedding celebration in Adelaide botanical glasshouse and vineyard"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  loading="eager"
                />
                {/* Contrast scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-4 left-4 right-4 text-white p-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20">
                  <p className="text-xs font-serif italic text-white/95">Adelaide Botanic Gardens & Barossa Celebrations</p>
                  <p className="text-[11px] text-white/80 font-sans">Dual-heritage couple matching with local artisans</p>
                </div>
              </div>

              {/* Floating element 1: AI Match Badge (Top Left) */}
              <div className="absolute -top-6 -left-6 sm:-left-8 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-[#EBC1B6] max-w-[210px] animate-bounce-slow">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#F2CCC3] flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-[#724319]" />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-[#724319] leading-tight">AI Match Found</div>
                    <div className="text-[10px] text-[#8A5A44]">Barossa Fusion & Photography</div>
                  </div>
                </div>
              </div>

              {/* Floating element 2: Verified Vendor Badge (Bottom Right) */}
              <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-[#EBC1B6] max-w-[220px]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#FFF8F6] border border-[#8A5A44]/30 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4 text-[#724319]" />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-[#724319]">500+ Verified Vendors</div>
                    <div className="text-[10px] text-[#8A5A44] flex items-center gap-1">
                      <MapPin className="w-3 h-3 inline" />
                      <span>Greater Adelaide, SA</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
