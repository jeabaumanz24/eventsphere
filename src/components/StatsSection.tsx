import React from 'react';
import { Users, CalendarHeart, Globe2, Sparkles } from 'lucide-react';
import { statsData } from '../data/mockData';

export const StatsSection: React.FC = () => {
  const statIcons = [Users, CalendarHeart, Globe2, Sparkles];

  return (
    <section className="py-12 bg-[#F2CCC3]/40 border-y border-[#EBC1B6]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statsData.map((stat, idx) => {
            const Icon = statIcons[idx % statIcons.length];
            return (
              <div
                key={stat.label}
                className="group relative bg-white/80 hover:bg-white rounded-2xl p-6 sm:p-7 border border-[#EBC1B6]/60 shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl sm:text-4xl font-serif font-bold text-[#724319] tabular-nums tracking-tight">
                    {stat.value}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-[#FFF8F6] border border-[#EBC1B6] flex items-center justify-center text-[#8A5A44] group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-[#724319] mb-1">
                  {stat.label}
                </h3>
                <p className="text-xs text-[#724319]/70 leading-relaxed">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
