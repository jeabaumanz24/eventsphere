import React from 'react';
import { ArrowRight, ArrowUpRight, Heart, MapPin, Star } from 'lucide-react';
import { vendorsData } from '../data/mockData';
import { Vendor } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { getPageHref } from '../utils/navigation';
import { VendorImage } from './VendorImage';

interface FeaturedVendorsSectionProps {
  onSelectVendor: (vendor: Vendor) => void;
  wishlistIds?: string[];
  onToggleWishlist?: (vendor: Vendor) => void;
}

export const FeaturedVendorsSection: React.FC<FeaturedVendorsSectionProps> = ({
  onSelectVendor,
  wishlistIds = [],
  onToggleWishlist,
}) => {
  const { t } = useLanguage();
  const featuredVendors = vendorsData.filter((v) => v.featured).slice(0, 6);

  return (
    <section
      id="featured-vendors"
      className="py-20 md:py-24 bg-[#F2CCC3]/20 border-y border-[#EBC1B6]/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-12">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#8A5A44]">
              {t('home.featuredKicker')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#724319] [text-wrap:balance]">
              {t('home.featuredTitle')}
            </h2>
            <p className="text-sm sm:text-base text-[#724319]/80 leading-relaxed">
              {t('home.featuredSubtitle')}
            </p>
          </div>

          <a
            href={getPageHref('vendors')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#724319] hover:bg-[#8A5A44] text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs whitespace-nowrap shrink-0 self-start md:self-auto"
          >
            <span>{t('home.viewAllVendorsBtn')}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {featuredVendors.map((vendor) => {
            const isFav = wishlistIds.includes(vendor.id);
            return (
              <div
                key={vendor.id}
                onClick={() => onSelectVendor(vendor)}
                className="group bg-white rounded-3xl overflow-hidden border border-[#EBC1B6]/70 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#F2CCC3]/50">
                    <VendorImage
                      vendor={vendor}
                      variant="card"
                      imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    {vendor.image && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80" />
                    )}

                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold text-[#724319] shadow-xs">
                      {t(`cat.${vendor.category}`)}
                    </div>

                    {onToggleWishlist && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWishlist(vendor);
                        }}
                        className={`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all shadow-xs cursor-pointer ${
                          isFav
                            ? 'bg-white text-rose-500 ring-2 ring-rose-200 scale-105'
                            : 'bg-white/90 text-[#724319] hover:text-rose-600'
                        }`}
                        aria-label={isFav ? t('wishlist.savedAria') : t('wishlist.saveAria')}
                        aria-pressed={isFav}
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>
                    )}

                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-mono text-white">
                      {t('marketplace.from')} {vendor.startingPrice}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="text-lg font-serif font-bold text-[#724319] group-hover:text-[#8A5A44] transition-colors leading-snug">
                        {vendor.businessName}
                      </h3>
                      {typeof vendor.rating === 'number' && typeof vendor.reviewCount === 'number' && (
                        <div className="flex items-center gap-1 text-xs font-semibold text-[#724319] shrink-0 tabular-nums">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{Number.isInteger(vendor.rating) ? `${vendor.rating}.0` : vendor.rating}</span>
                          <span className="text-[11px] text-[#724319]/50 font-normal">({vendor.reviewCount})</span>
                        </div>
                      )}
                    </div>

                    <div className="text-xs font-medium text-[#8A5A44] mb-2">
                      {t('marketplace.lead')} {vendor.name}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-[#724319]/70 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-[#8A5A44] shrink-0" />
                      <span>{vendor.location}</span>
                    </div>

                    <p className="text-xs text-[#724319]/80 line-clamp-2 leading-relaxed">
                      {(() => {
                        const key = `vendor.${vendor.id}.desc`;
                        const translated = t(key);
                        return translated === key ? vendor.description : translated;
                      })()}
                    </p>
                  </div>
                </div>

                <div className="px-6 py-3.5 bg-[#FFF8F6] border-t border-[#EBC1B6]/40 flex items-center justify-between text-xs font-semibold text-[#724319]">
                  <span>{t('marketplace.viewProfile')}</span>
                  <div className="w-7 h-7 rounded-full bg-white border border-[#EBC1B6] flex items-center justify-center group-hover:bg-[#724319] group-hover:text-white transition-all">
                    <ArrowUpRight className="w-3.5 h-3.5" />
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
