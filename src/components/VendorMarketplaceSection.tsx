import React, { useState, useMemo } from 'react';
import { Search, Star, MapPin, Heart, ArrowUpRight, Sparkles, Scale, Check, X } from 'lucide-react';
import { vendorsData } from '../data/mockData';
import { EventTypeTag, Vendor } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { VendorCompareModal } from './VendorCompareModal';
import { trackEvent } from '../utils/analytics';

interface VendorMarketplaceSectionProps {
  onSelectVendor: (vendor: Vendor) => void;
  onNotify?: (message: string) => void;
  wishlistIds?: string[];
  onToggleWishlist?: (vendor: Vendor) => void;
}

const EVENT_TYPE_FILTERS: Array<'All Events' | EventTypeTag> = [
  'All Events',
  'Weddings',
  'Engagements & Proposals',
  'Elopements',
  'Milestone Birthdays',
  'Diwali & Festival of Lights',
  'Lunar New Year',
  'Eid',
  'Christenings & Baby Showers',
  'Graduations',
  'Community Festivals',
  'Corporate Events',
];

const VENDOR_CATEGORIES = [
  'All',
  'Caterers',
  'Entertainment & DJs',
  'Venues & Marquees',
  'Decor & Styling',
  'Proposal & Elopement',
  'Photographers',
  'Planners',
  'Florists',
  'Makeup Artists',
  'Cultural Specialists',
];

export const VendorMarketplaceSection: React.FC<VendorMarketplaceSectionProps> = ({
  onSelectVendor,
  onNotify,
  wishlistIds,
  onToggleWishlist,
}) => {
  const { t } = useLanguage();
  const [selectedEventType, setSelectedEventType] = useState<'All Events' | EventTypeTag>('All Events');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [localWishlistIds, setLocalWishlistIds] = useState<string[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);

  const effectiveWishlistIds = wishlistIds ?? localWishlistIds;

  const vendorsMatchingEventAndQuery = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return vendorsData.filter((vendor) => {
      const matchesEvent =
        selectedEventType === 'All Events' || vendor.eventTypes.includes(selectedEventType);

      const translatedDesc = t(`vendor.${vendor.id}.desc`).toLowerCase();
      const matchesSearch =
        q === '' ||
        vendor.name.toLowerCase().includes(q) ||
        vendor.businessName.toLowerCase().includes(q) ||
        vendor.location.toLowerCase().includes(q) ||
        vendor.description.toLowerCase().includes(q) ||
        translatedDesc.includes(q) ||
        vendor.features.some((feat) => feat.toLowerCase().includes(q)) ||
        vendor.culturalSpecialties.some((spec) => spec.toLowerCase().includes(q)) ||
        vendor.eventTypes.some((et) => et.toLowerCase().includes(q));

      return matchesEvent && matchesSearch;
    });
  }, [selectedEventType, searchQuery, t]);

  const filteredVendors = useMemo(() => {
    return vendorsMatchingEventAndQuery.filter(
      (vendor) => selectedCategory === 'All' || vendor.category === selectedCategory
    );
  }, [vendorsMatchingEventAndQuery, selectedCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: vendorsMatchingEventAndQuery.length };
    for (const v of vendorsMatchingEventAndQuery) {
      counts[v.category] = (counts[v.category] || 0) + 1;
    }
    return counts;
  }, [vendorsMatchingEventAndQuery]);

  const toggleFavorite = (e: React.MouseEvent, vendor: Vendor) => {
    e.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist(vendor);
      return;
    }
    setLocalWishlistIds((prev) =>
      prev.includes(vendor.id) ? prev.filter((item) => item !== vendor.id) : [...prev, vendor.id]
    );
  };

  const comparedVendors = useMemo(() => {
    return compareIds
      .map((id) => vendorsData.find((v) => v.id === id))
      .filter((v): v is Vendor => Boolean(v));
  }, [compareIds]);

  const toggleCompare = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        const next = prev.filter((item) => item !== id);
        if (next.length === 0) setIsCompareOpen(false);
        return next;
      }
      if (prev.length >= 3) {
        onNotify?.(t('compare.maxToast'));
        return prev;
      }
      return [...prev, id];
    });
  };

  const removeFromCompare = (id: string) => {
    setCompareIds((prev) => {
      const next = prev.filter((item) => item !== id);
      if (next.length === 0) setIsCompareOpen(false);
      return next;
    });
  };

  const clearCompare = () => {
    setCompareIds([]);
    setIsCompareOpen(false);
  };

  return (
    <section id="marketplace" className="py-20 md:py-28 bg-[#FFF8F6] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#8A5A44]">
            {t('marketplace.kicker')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#724319] [text-wrap:balance]">
            {t('marketplace.title')}
          </h2>
          <p className="text-sm sm:text-base text-[#724319]/80 leading-relaxed [text-wrap:balance]">
            {t('marketplace.subtitle')}
          </p>
        </div>

        {/* Event-Type Filter Row ("What are you celebrating?") */}
        <div className="mb-8 bg-white rounded-3xl p-5 sm:p-6 border border-[#EBC1B6]/80 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8A5A44]">
              {t('eventFilter.label')}
            </span>
            {selectedEventType !== 'All Events' && (
              <button
                type="button"
                onClick={() => setSelectedEventType('All Events')}
                className="text-xs font-medium text-[#724319] hover:text-[#8A5A44] underline decoration-[#EBC1B6] underline-offset-4 cursor-pointer"
              >
                {t('eventType.All Events')}
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {EVENT_TYPE_FILTERS.map((eventOpt) => {
              const isSelected = selectedEventType === eventOpt;
              return (
                <button
                  key={eventOpt}
                  type="button"
                  onClick={() => {
                    setSelectedEventType(eventOpt);
                    trackEvent('marketplace_filter_used', {
                      event_type: eventOpt,
                      category: selectedCategory,
                      source: 'marketplace',
                    });
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#724319] text-white shadow-xs font-semibold'
                      : 'bg-[#FFF8F6] hover:bg-[#F2CCC3]/50 text-[#724319] border border-[#EBC1B6]/70'
                  }`}
                >
                  {t(`eventType.${eventOpt}`)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="mb-10 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8A5A44] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t('marketplace.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-[#EBC1B6] rounded-2xl text-sm text-[#724319] placeholder:text-[#8A5A44]/50 focus:outline-none focus:ring-2 focus:ring-[#8A5A44]/30 focus:border-[#8A5A44] transition-all shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8A5A44] hover:text-[#724319] px-2 py-1 cursor-pointer"
                >
                  {t('marketplace.clear')}
                </button>
              )}
            </div>
          </div>

          {/* Interactive Category Filter Pills (Functional Filter Controls) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {VENDOR_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              const count = categoryCounts[cat] ?? 0;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    trackEvent('marketplace_filter_used', {
                      event_type: selectedEventType,
                      category: cat,
                      source: 'marketplace',
                    });
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-[#724319] text-white shadow-xs font-semibold'
                      : 'bg-white hover:bg-[#F2CCC3]/40 text-[#724319] border border-[#EBC1B6]/60'
                  }`}
                >
                  {t(`cat.${cat}`)} <span className={`ml-1 tabular-nums ${isActive ? 'text-white/75' : 'text-[#8A5A44]'}`}>({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Inline Compare Tray Banner */}
        {comparedVendors.length > 0 && (
          <div className="mb-8 bg-white rounded-2xl border border-[#8A5A44]/50 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#724319] mr-1">
                <Scale className="w-4 h-4 text-[#8A5A44]" />
                <span>{t('compare.selectedCount', { count: comparedVendors.length })}</span>
              </span>
              {comparedVendors.map((v) => (
                <span
                  key={v.id}
                  className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full bg-[#FFF8F6] border border-[#EBC1B6] text-xs font-medium text-[#724319]"
                >
                  <span className="truncate max-w-[160px]">{v.businessName}</span>
                  <button
                    type="button"
                    onClick={() => removeFromCompare(v.id)}
                    className="w-4 h-4 rounded-full hover:bg-[#F2CCC3]/60 flex items-center justify-center text-[#8A5A44] hover:text-[#724319] cursor-pointer"
                    aria-label={`${t('compare.remove')} ${v.businessName}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {comparedVendors.length === 1 && (
                <span className="text-[11px] text-[#8A5A44] italic">
                  {t('compare.addMoreHint')}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={clearCompare}
                className="px-3 py-1.5 rounded-full text-xs font-medium text-[#8A5A44] hover:text-[#724319] bg-[#FFF8F6] border border-[#EBC1B6] transition-colors cursor-pointer"
              >
                {t('compare.clearAll')}
              </button>
              <button
                type="button"
                onClick={() => setIsCompareOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-[#724319] hover:bg-[#8A5A44] text-white transition-colors shadow-xs cursor-pointer"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>{t('compare.openTable')} ({comparedVendors.length})</span>
              </button>
            </div>
          </div>
        )}

        {/* Vendor Grid */}
        {filteredVendors.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#EBC1B6] p-8 max-w-lg mx-auto">
            <Sparkles className="w-8 h-8 text-[#8A5A44] mx-auto mb-3" />
            <h3 className="text-lg font-serif font-bold text-[#724319]">{t('marketplace.noVendors')}</h3>
            <p className="text-xs text-[#724319]/70 mt-1 mb-4">
              {t('marketplace.noVendorsDesc', { query: searchQuery || t(`eventType.${selectedEventType}`) })}
            </p>
            <button
              onClick={() => {
                setSelectedEventType('All Events');
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-[#724319] text-white rounded-full text-xs font-medium cursor-pointer"
            >
              {t('marketplace.resetFilters')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredVendors.map((vendor) => {
              const isFav = effectiveWishlistIds.includes(vendor.id);
              const isCompared = compareIds.includes(vendor.id);
              return (
                <div
                  key={vendor.id}
                  onClick={() => onSelectVendor(vendor)}
                  className={`group bg-white rounded-3xl overflow-hidden border shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between cursor-pointer ${
                    isCompared
                      ? 'border-[#724319] ring-2 ring-[#724319]/25'
                      : 'border-[#EBC1B6]/70'
                  }`}
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
                        {t(`cat.${vendor.category}`)}
                      </div>

                      {/* Heart Favorite button */}
                      <button
                        type="button"
                        onClick={(e) => toggleFavorite(e, vendor)}
                        className={`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all shadow-xs cursor-pointer ${
                          isFav
                            ? 'bg-white text-rose-500 ring-2 ring-rose-200 scale-105'
                            : 'bg-white/90 text-[#724319] hover:text-rose-600'
                        }`}
                        aria-label={isFav ? t('wishlist.savedAria') : t('wishlist.saveAria')}
                        aria-pressed={isFav}
                        title={isFav ? t('wishlist.savedAria') : t('wishlist.saveAria')}
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>

                      {/* Starting Price tag */}
                      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-mono text-white">
                        {t('marketplace.from')} {vendor.startingPrice}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h3 className="text-lg font-serif font-bold text-[#724319] group-hover:text-[#8A5A44] transition-colors leading-snug">
                          {vendor.businessName}
                        </h3>
                        <div className="flex items-center gap-1 text-xs font-semibold text-[#724319] shrink-0 tabular-nums">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{Number.isInteger(vendor.rating) ? `${vendor.rating}.0` : vendor.rating}</span>
                          <span className="text-[11px] text-[#724319]/50 font-normal">({vendor.reviewCount})</span>
                        </div>
                      </div>

                      {/* Lead Artisan Name */}
                      <div className="text-xs font-medium text-[#8A5A44] mb-2.5">
                        {t('marketplace.lead')} {vendor.name}
                      </div>

                      {/* Location text */}
                      <div className="flex items-center gap-1.5 text-xs text-[#724319]/70 mb-3">
                        <MapPin className="w-3.5 h-3.5 text-[#8A5A44] shrink-0" />
                        <span>{vendor.location}</span>
                      </div>

                      <p className="text-xs text-[#724319]/80 line-clamp-2 leading-relaxed mb-3.5">
                        {t(`vendor.${vendor.id}.desc`)}
                      </p>

                      {/* Event-Type Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {vendor.eventTypes.map((evType) => (
                          <span
                            key={evType}
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                              selectedEventType === evType
                                ? 'bg-[#724319] text-white border-[#724319]'
                                : 'bg-[#FFF8F6] text-[#724319]/85 border-[#EBC1B6]/70'
                            }`}
                          >
                            {t(`eventType.${evType}`)}
                          </span>
                        ))}
                      </div>

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
                  <div className="px-5 py-3.5 bg-[#FFF8F6] border-t border-[#EBC1B6]/40 flex items-center justify-between gap-2 text-xs font-semibold text-[#724319]">
                    <button
                      type="button"
                      onClick={(e) => toggleCompare(e, vendor.id)}
                      aria-pressed={isCompared}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-semibold transition-all cursor-pointer shrink-0 ${
                        isCompared
                          ? 'bg-[#724319] text-white border-[#724319] shadow-2xs'
                          : 'bg-white text-[#724319] border-[#EBC1B6] hover:border-[#8A5A44] hover:bg-[#F2CCC3]/30'
                      }`}
                    >
                      {isCompared ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Scale className="w-3.5 h-3.5 text-[#8A5A44]" />
                      )}
                      <span>{isCompared ? t('compare.btnAdded') : t('compare.btnAdd')}</span>
                    </button>

                    <div className="inline-flex items-center gap-2 ml-auto">
                      <span>{t('marketplace.viewProfile')}</span>
                      <div className="w-7 h-7 rounded-full bg-white border border-[#EBC1B6] flex items-center justify-center group-hover:bg-[#724319] group-hover:text-white transition-all shrink-0">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Bottom Compare Tray (Visible Whenever 1–3 Vendors Are Selected) */}
      {comparedVendors.length > 0 && !isCompareOpen && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-1.5rem)] max-w-3xl bg-white/95 backdrop-blur-md border border-[#8A5A44]/50 rounded-2xl shadow-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex -space-x-2 shrink-0">
              {comparedVendors.map((v) => (
                <img
                  key={v.id}
                  src={v.image}
                  alt={v.businessName}
                  className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-xs"
                  referrerPolicy="no-referrer"
                />
              ))}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-[#724319]">
                {t('compare.selectedCount', { count: comparedVendors.length })}
              </div>
              <div className="text-[11px] text-[#8A5A44] truncate max-w-[220px] sm:max-w-[340px]">
                {comparedVendors.map((v) => v.businessName).join(' · ')}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto shrink-0">
            <button
              type="button"
              onClick={clearCompare}
              className="px-3 py-1.5 rounded-full text-xs font-medium text-[#8A5A44] hover:text-[#724319] bg-[#FFF8F6] border border-[#EBC1B6] transition-colors cursor-pointer"
            >
              {t('compare.clearAll')}
            </button>
            <button
              type="button"
              onClick={() => setIsCompareOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[#724319] hover:bg-[#8A5A44] text-white transition-colors shadow-xs cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{t('compare.openTable')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Side-by-Side Vendor Comparison Table Modal */}
      <VendorCompareModal
        isOpen={isCompareOpen}
        vendors={comparedVendors}
        onClose={() => setIsCompareOpen(false)}
        onRemoveVendor={removeFromCompare}
        onClearAll={clearCompare}
        onSelectVendor={onSelectVendor}
      />
    </section>
  );
};
