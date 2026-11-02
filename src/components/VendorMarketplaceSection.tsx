import React, { useState, useMemo } from 'react';
import { Search, Star, MapPin, Heart, ArrowUpRight, Sparkles, Filter } from 'lucide-react';
import { vendorsData } from '../data/mockData';
import { Vendor } from '../types';

interface VendorMarketplaceSectionProps {
  onSelectVendor: (vendor: Vendor) => void;
}

export const VendorMarketplaceSection: React.FC<VendorMarketplaceSectionProps> = ({
  onSelectVendor,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const categories = [
    'All',
    'Photographers',
    'Planners',
    'Caterers',
    'Florists',
    'Makeup Artists',
    'Cultural Specialists',
  ];

  const filteredVendors = useMemo(() => {
    return vendorsData.filter((vendor) => {
      const matchesCategory =
        selectedCategory === 'All' || vendor.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        vendor.name.toLowerCase().includes(q) ||
        vendor.businessName.toLowerCase().includes(q) ||
        vendor.location.toLowerCase().includes(q) ||
        vendor.culturalSpecialties.some((spec) => spec.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="marketplace" className="py-20 md:py-28 bg-[#FFF8F6] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#8A5A44]">
            Curated Artisans & Vendors
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#724319]">
            Adelaide Vendor Marketplace
          </h2>
          <p className="text-sm sm:text-base text-[#724319]/80 leading-relaxed [text-wrap:balance]">
            Explore verified South Australian wedding professionals and cultural specialists celebrated for artistic excellence and cross-cultural warmth.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-10 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8A5A44] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by vendor name, Barossa, tea ceremony, floral, catering..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-[#EBC1B6] rounded-2xl text-sm text-[#724319] placeholder:text-[#8A5A44]/50 focus:outline-none focus:ring-2 focus:ring-[#8A5A44]/30 focus:border-[#8A5A44] transition-all shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8A5A44] hover:text-[#724319] px-2 py-1"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Interactive Category Filter Pills (Functional Filter Controls) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#724319] text-white shadow-xs font-semibold'
                      : 'bg-white hover:bg-[#F2CCC3]/40 text-[#724319] border border-[#EBC1B6]/60'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Vendor Grid */}
        {filteredVendors.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#EBC1B6] p-8 max-w-lg mx-auto">
            <Sparkles className="w-8 h-8 text-[#8A5A44] mx-auto mb-3" />
            <h3 className="text-lg font-serif font-bold text-[#724319]">No Vendors Found</h3>
            <p className="text-xs text-[#724319]/70 mt-1 mb-4">
              We couldn't find matches for "{searchQuery}". Try searching for "Adelaide", "Florist", or clear your filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-[#724319] text-white rounded-full text-xs font-medium"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredVendors.map((vendor) => {
              const isFav = !!favorites[vendor.id];
              return (
                <div
                  key={vendor.id}
                  onClick={() => onSelectVendor(vendor)}
                  className="group bg-white rounded-3xl overflow-hidden border border-[#EBC1B6]/70 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    {/* Image with overlay badge and bookmark */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#F2CCC3]/50">
                      <img
                        src={vendor.image}
                        alt={vendor.businessName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80" />

                      {/* Category Label */}
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold text-[#724319] shadow-xs">
                        {vendor.category}
                      </div>

                      {/* Heart Favorite button */}
                      <button
                        onClick={(e) => toggleFavorite(e, vendor.id)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#724319] hover:text-rose-600 transition-colors shadow-xs cursor-pointer"
                        aria-label="Save vendor"
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>

                      {/* Starting Price tag */}
                      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-mono text-white">
                        From {vendor.startingPrice}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h3 className="text-lg font-serif font-bold text-[#724319] group-hover:text-[#8A5A44] transition-colors leading-snug">
                          {vendor.businessName}
                        </h3>
                        <div className="flex items-center gap-1 text-xs font-semibold text-[#724319] shrink-0">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{vendor.rating.toFixed(2)}</span>
                          <span className="text-[11px] text-[#724319]/50 font-normal">({vendor.reviewCount})</span>
                        </div>
                      </div>

                      {/* Lead Artisan Name */}
                      <div className="text-xs font-medium text-[#8A5A44] mb-2.5">
                        Lead: {vendor.name}
                      </div>

                      {/* Location text */}
                      <div className="flex items-center gap-1.5 text-xs text-[#724319]/70 mb-3">
                        <MapPin className="w-3.5 h-3.5 text-[#8A5A44] shrink-0" />
                        <span>{vendor.location}</span>
                      </div>

                      <p className="text-xs text-[#724319]/80 line-clamp-2 leading-relaxed mb-4">
                        {vendor.description}
                      </p>

                      {/* Cultural Specialties unboxed text with dot separator */}
                      <div className="text-[11px] text-[#8A5A44] flex flex-wrap items-center gap-x-1.5 gap-y-1">
                        {vendor.culturalSpecialties.map((spec, i) => (
                          <React.Fragment key={spec}>
                            <span>{spec}</span>
                            {i < vendor.culturalSpecialties.length - 1 && (
                              <span aria-hidden="true" className="text-[#EBC1B6]">·</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Action footer */}
                  <div className="px-6 py-4 bg-[#FFF8F6] border-t border-[#EBC1B6]/40 flex items-center justify-between text-xs font-semibold text-[#724319]">
                    <span>View Profile & Quote</span>
                    <div className="w-7 h-7 rounded-full bg-white border border-[#EBC1B6] flex items-center justify-center group-hover:bg-[#724319] group-hover:text-white transition-all">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
