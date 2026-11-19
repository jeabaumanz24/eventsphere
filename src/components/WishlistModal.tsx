import React, { useEffect } from 'react';
import {
  X,
  Heart,
  Star,
  MapPin,
  ArrowUpRight,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { Vendor } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { VendorImage } from './VendorImage';

interface WishlistModalProps {
  isOpen: boolean;
  vendors: Vendor[];
  onClose: () => void;
  onRemoveVendor: (vendorId: string) => void;
  onClearAll: () => void;
  onSelectVendor: (vendor: Vendor) => void;
  onExploreMarketplace: () => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  vendors,
  onClose,
  onRemoveVendor,
  onClearAll,
  onSelectVendor,
  onExploreMarketplace,
}) => {
  const { t } = useLanguage();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="wishlist-modal-title"
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-3xl border border-[#EBC1B6] shadow-2xl overflow-hidden my-4 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header */}
        <div className="px-6 sm:px-8 py-5 bg-gradient-to-r from-[#FFF8F6] via-white to-[#F2CCC3]/35 border-b border-[#EBC1B6]/70 flex items-start justify-between gap-4 shrink-0">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#8A5A44]">
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>{t('wishlist.modalKicker')}</span>
              <span className="ml-1 px-2 py-0.5 rounded-full bg-[#F2CCC3]/60 text-[#724319] font-mono text-[10px]">
                {t('wishlist.savedCount', { count: vendors.length })}
              </span>
            </div>
            <h3
              id="wishlist-modal-title"
              className="text-xl sm:text-2xl font-serif font-bold text-[#724319]"
            >
              {t('wishlist.modalTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-[#724319]/75">
              {t('wishlist.modalSubtitle')}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {vendors.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold text-[#8A5A44] hover:text-[#724319] bg-white hover:bg-[#FFF8F6] border border-[#EBC1B6] transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t('wishlist.clearAll')}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white border border-[#EBC1B6] flex items-center justify-center text-[#724319] hover:bg-[#F2CCC3]/40 transition-colors cursor-pointer"
              aria-label={t('wishlist.close')}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Wishlist Body */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-grow bg-[#FFF8F6]/50">
          {vendors.length === 0 ? (
            <div className="text-center py-14 px-6 bg-white rounded-3xl border border-[#EBC1B6]/80 max-w-md mx-auto shadow-2xs space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#F2CCC3]/50 border border-[#EBC1B6] flex items-center justify-center mx-auto text-rose-500">
                <Heart className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-lg font-serif font-bold text-[#724319]">
                  {t('wishlist.emptyTitle')}
                </h4>
                <p className="text-xs sm:text-sm text-[#724319]/75 leading-relaxed">
                  {t('wishlist.emptyDesc')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onExploreMarketplace();
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#724319] hover:bg-[#8A5A44] text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('wishlist.emptyCta')}</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {vendors.map((vendor) => (
                <div
                  key={vendor.id}
                  onClick={() => {
                    onClose();
                    onSelectVendor(vendor);
                  }}
                  className="group bg-white rounded-2xl border border-[#EBC1B6]/80 shadow-xs hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <div className="relative aspect-[16/9] overflow-hidden bg-[#F2CCC3]/40">
                      <VendorImage
                        vendor={vendor}
                        variant="card"
                        imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {vendor.image && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                      )}

                      <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-[#724319] shadow-2xs">
                        {t(`cat.${vendor.category}`)}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveVendor(vendor.id);
                        }}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-rose-500 hover:bg-rose-50 transition-colors shadow-2xs cursor-pointer"
                        aria-label={`${t('wishlist.remove')} ${vendor.businessName}`}
                        title={t('wishlist.remove')}
                      >
                        <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                      </button>

                      <div className="absolute bottom-2.5 right-3 bg-black/65 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-mono text-white">
                        {t('marketplace.from')} {vendor.startingPrice}
                      </div>
                    </div>

                    <div className="p-4 sm:p-5 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-base font-serif font-bold text-[#724319] group-hover:text-[#8A5A44] transition-colors leading-snug">
                          {vendor.businessName}
                        </h4>
                        <div className="flex items-center gap-1 text-xs font-semibold text-[#724319] shrink-0 tabular-nums">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>
                            {Number.isInteger(vendor.rating) ? `${vendor.rating}.0` : vendor.rating}
                          </span>
                          <span className="text-[11px] text-[#724319]/50 font-normal">
                            ({vendor.reviewCount})
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#8A5A44]">
                        <span className="font-medium">
                          {t('marketplace.lead')} {vendor.name}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-1 text-[#724319]/70">
                          <MapPin className="w-3 h-3 text-[#8A5A44] shrink-0" />
                          <span>{vendor.location}</span>
                        </span>
                      </div>

                      <p className="text-xs text-[#724319]/80 line-clamp-2 leading-relaxed">
                        {t(`vendor.${vendor.id}.desc`)}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {vendor.eventTypes.slice(0, 3).map((evType) => (
                          <span
                            key={evType}
                            className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#FFF8F6] text-[#724319]/85 border border-[#EBC1B6]/70"
                          >
                            {t(`eventType.${evType}`)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="px-4 sm:px-5 py-3 bg-[#FFF8F6] border-t border-[#EBC1B6]/50 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveVendor(vendor.id);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white hover:bg-rose-50 border border-[#EBC1B6] text-[11px] font-medium text-[#8A5A44] hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>{t('wishlist.remove')}</span>
                    </button>

                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#724319] group-hover:text-[#8A5A44]">
                      <span>{t('wishlist.viewInquire')}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Footer */}
        <div className="px-6 py-3.5 bg-[#FFF8F6] border-t border-[#EBC1B6]/70 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {vendors.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="sm:hidden inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#8A5A44] bg-white border border-[#EBC1B6] cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t('wishlist.clearAll')}</span>
            </button>
          )}
          <span className="hidden sm:inline text-xs text-[#8A5A44]">
            {t('wishlist.savedCount', { count: vendors.length })}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto px-5 py-2 rounded-full bg-white hover:bg-[#F2CCC3]/40 border border-[#EBC1B6] text-xs font-semibold text-[#724319] transition-colors cursor-pointer"
          >
            {t('wishlist.close')}
          </button>
        </div>
      </div>
    </div>
  );
};
