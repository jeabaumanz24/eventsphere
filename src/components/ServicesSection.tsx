import React from 'react';
import { Sparkles, Calculator, BookOpen, BarChart3, ArrowRight } from 'lucide-react';
import { servicesData } from '../data/mockData';

interface ServicesSectionProps {
  onSelectService?: (serviceId: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const iconMap: Record<string, React.ElementType> = {
    Sparkles,
    Calculator,
    BookOpen,
    BarChart3,
  };

  return (
    <section id="services" className="py-20 md:py-28 bg-[#F2CCC3]/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#8A5A44]">
            Intelligent Platform Suite
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#724319]">
            Comprehensive Event Services
          </h2>
          <p className="text-sm sm:text-base text-[#724319]/80 leading-relaxed [text-wrap:balance]">
            From your very first ceremonial sketch to the final farewell dance, our integrated suite replaces chaotic spreadsheets with intelligent automation.
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {servicesData.map((service, index) => {
            const Icon = iconMap[service.iconName] || Sparkles;
            return (
              <div
                key={service.id}
                className="group relative bg-white rounded-3xl p-8 sm:p-9 border border-[#EBC1B6]/70 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-[#FFF8F6] border border-[#EBC1B6] flex items-center justify-center text-[#724319] group-hover:bg-[#F2CCC3]/50 transition-colors">
                      <Icon className="w-7 h-7 text-[#8A5A44]" />
                    </div>
                    {/* Natural editorial badge */}
                    <span className="text-xs font-medium text-[#8A5A44] bg-[#FFF8F6] border border-[#EBC1B6] px-3 py-1 rounded-full">
                      {service.badge}
                    </span>
                  </div>

                  <span className="text-xs font-semibold uppercase text-[#8A5A44]/80 tracking-wider">
                    0{index + 1} · {service.subtitle}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#724319] mt-1 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-sm text-[#724319]/80 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="mt-8 pt-5 border-t border-[#EBC1B6]/40 flex items-center justify-between text-xs font-medium">
                  <span className="text-[#8A5A44] font-mono tabular-nums">
                    {service.metrics}
                  </span>
                  <a
                    href="#ai-planner"
                    onClick={() => onSelectService && onSelectService(service.id)}
                    className="inline-flex items-center gap-1.5 text-[#724319] hover:text-[#8A5A44] font-semibold group-hover:translate-x-1 transition-all cursor-pointer"
                  >
                    <span>Try in Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
