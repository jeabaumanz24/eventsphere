import React from 'react';
import { MapPin, CheckCircle2, Quote, Sparkles, User, Briefcase } from 'lucide-react';
import { customerPersona, vendorPersona } from '../data/mockData';

export const PersonasSection: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-[#FFF8F6] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#8A5A44]">
            Who EventSphere Empowers
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#724319]">
            Designed for Both Sides of the Aisle
          </h2>
          <p className="text-sm sm:text-base text-[#724319]/80 leading-relaxed [text-wrap:balance]">
            Our two-sided marketplace solves the real frictions faced by modern multicultural hosts and passionate local wedding artisans in South Australia.
          </p>
        </div>

        {/* 2 Personas Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Persona 1: Event Customer - Diwata dela Cruz */}
          <div className="bg-white rounded-3xl border border-[#EBC1B6] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div>
              {/* Header Profile Banner */}
              <div className="p-6 sm:p-8 bg-gradient-to-br from-[#FFF8F6] to-[#F2CCC3]/40 border-b border-[#EBC1B6]/50">
                <div className="flex items-center gap-5">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-white shadow-md shrink-0 bg-[#EBC1B6]">
                    <img
                      src={customerPersona.image}
                      alt={customerPersona.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold bg-[#724319] text-white mb-1.5">
                      <User className="w-3 h-3" />
                      <span>{customerPersona.title}</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#724319]">
                      {customerPersona.name}
                    </h3>
                    <div className="text-xs text-[#8A5A44] font-medium flex items-center gap-2 mt-0.5">
                      <span>{customerPersona.age} years old</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 inline" />
                        {customerPersona.location}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Persona Body Details */}
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A5A44] mb-1.5">
                    Primary Goal
                  </h4>
                  <p className="text-sm text-[#724319]/90 font-medium leading-relaxed">
                    Planning a multicultural wedding. Wants convenience, budget transparency, and trusted vendors who respect cultural heritage.
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A5A44] mb-2">
                    Frustrations with Traditional Planning
                  </h4>
                  <ul className="space-y-2 text-xs text-[#724319]/80">
                    {customerPersona.painPoints.map((pain, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-rose-500 font-bold shrink-0">✕</span>
                        <span>{pain}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A5A44] mb-2">
                    How EventSphere Helps Diwata
                  </h4>
                  <ul className="space-y-2 text-xs text-[#724319]/90">
                    {customerPersona.eventSphereSolutions.map((sol, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#8A5A44] shrink-0 mt-0.5" />
                        <span>{sol}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Testimonial Quote Footer */}
            <div className="p-6 bg-[#FFF8F6] border-t border-[#EBC1B6]/50">
              <div className="flex items-start gap-3">
                <Quote className="w-5 h-5 text-[#8A5A44] shrink-0 opacity-60" />
                <p className="text-xs italic text-[#724319]/85 leading-relaxed">
                  "{customerPersona.quote}"
                </p>
              </div>
            </div>
          </div>

          {/* Persona 2: Event Vendor - Maria Santos */}
          <div className="bg-white rounded-3xl border border-[#EBC1B6] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div>
              {/* Header Profile Banner */}
              <div className="p-6 sm:p-8 bg-gradient-to-br from-[#FFF8F6] to-[#F2CCC3]/40 border-b border-[#EBC1B6]/50">
                <div className="flex items-center gap-5">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-white shadow-md shrink-0 bg-[#EBC1B6]">
                    <img
                      src={vendorPersona.image}
                      alt={vendorPersona.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold bg-[#8A5A44] text-white mb-1.5">
                      <Briefcase className="w-3 h-3" />
                      <span>{vendorPersona.title}</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#724319]">
                      {vendorPersona.name}
                    </h3>
                    <div className="text-xs text-[#8A5A44] font-medium flex items-center gap-2 mt-0.5">
                      <span>{vendorPersona.role}</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 inline" />
                        {vendorPersona.location}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Persona Body Details */}
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A5A44] mb-1.5">
                    Primary Goal
                  </h4>
                  <p className="text-sm text-[#724319]/90 font-medium leading-relaxed">
                    Wants qualified high-ticket leads, higher business visibility across multicultural couples, and streamlined client bookings.
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A5A44] mb-2">
                    Frustrations with Traditional Marketing
                  </h4>
                  <ul className="space-y-2 text-xs text-[#724319]/80">
                    {vendorPersona.painPoints.map((pain, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-rose-500 font-bold shrink-0">✕</span>
                        <span>{pain}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A5A44] mb-2">
                    How EventSphere Helps Maria
                  </h4>
                  <ul className="space-y-2 text-xs text-[#724319]/90">
                    {vendorPersona.eventSphereSolutions.map((sol, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#8A5A44] shrink-0 mt-0.5" />
                        <span>{sol}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Testimonial Quote Footer */}
            <div className="p-6 bg-[#FFF8F6] border-t border-[#EBC1B6]/50">
              <div className="flex items-start gap-3">
                <Quote className="w-5 h-5 text-[#8A5A44] shrink-0 opacity-60" />
                <p className="text-xs italic text-[#724319]/85 leading-relaxed">
                  "{vendorPersona.quote}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
