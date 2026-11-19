import React, { useEffect } from 'react';
import {
  X,
  Star,
  MapPin,
  CheckCircle2,
  Scale,
  ArrowUpRight,
  Trash2,
  Award,
} from 'lucide-react';
import { Vendor } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { VendorImage } from './VendorImage';

interface VendorCompareModalProps {
  isOpen: boolean;
  vendors: Vendor[];
  onClose: () => void;
  onRemoveVendor: (vendorId: string) => void;
  onClearAll: () => void;
  onSelectVendor: (vendor: Vendor) => void;
}

export const VendorCompareModal: React.FC<VendorCompareModalProps> = ({
  isOpen,
  vendors,
  onClose,
  onRemoveVendor,
  onClearAll,
  onSelectVendor,
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

  if (!isOpen || vendors.length === 0) return null;

  const maxRating = Math.max(...vendors.map((v) => v.rating));
  const hasDifferentRatings = vendors.some((v) => v.rating !== maxRating);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="vendor-compare-modal-title"
    >
      <div
        className="relative w-full max-w-6xl bg-white rounded-3xl border border-[#EBC1B6] shadow-2xl overflow-hidden my-4 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header */}
        <div className="px-6 sm:px-8 py-5 bg-gradient-to-r from-[#FFF8F6] via-white to-[#F2CCC3]/35 border-b border-[#EBC1B6]/70 flex items-start justify-between gap-4 shrink-0">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#8A5A44]">
              <Scale className="w-3.5 h-3.5" />
              <span>{t('compare.modalKicker')}</span>
            </div>
            <h3
              id="vendor-compare-modal-title"
              className="text-xl sm:text-2xl font-serif font-bold text-[#724319]"
            >
              {t('compare.modalTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-[#724319]/75">
              {t('compare.modalSubtitle')}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                onClearAll();
                onClose();
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold text-[#8A5A44] hover:text-[#724319] bg-white hover:bg-[#FFF8F6] border border-[#EBC1B6] transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t('compare.clearAll')}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white border border-[#EBC1B6] flex items-center justify-center text-[#724319] hover:bg-[#F2CCC3]/40 transition-colors cursor-pointer"
              aria-label={t('compare.close')}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Comparison Table Body */}
        <div className="overflow-auto flex-grow p-4 sm:p-6 bg-[#FFF8F6]/50">
          <div className="overflow-x-auto rounded-2xl border border-[#EBC1B6]/80 bg-white shadow-xs">
            <table className="w-full min-w-[680px] text-left border-collapse table-fixed">
              <colgroup>
                <col className="w-40 sm:w-48" />
                {vendors.map((v) => (
                  <col key={v.id} className="w-64 sm:w-auto" />
                ))}
              </colgroup>

              {/* Vendor Column Headers */}
              <thead>
                <tr className="border-b border-[#EBC1B6]/70 bg-[#FFF8F6]">
                  <th className="p-4 sm:p-5 align-bottom text-xs font-semibold uppercase tracking-wider text-[#8A5A44] border-r border-[#EBC1B6]/50">
                    {t('compare.selectedCount', { count: vendors.length })}
                  </th>
                  {vendors.map((vendor) => {
                    const isTopRated = hasDifferentRatings && vendor.rating === maxRating;
                    return (
                      <th
                        key={vendor.id}
                        className="p-4 sm:p-5 align-top border-r last:border-r-0 border-[#EBC1B6]/40"
                      >
                        <div className="space-y-3">
                          <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-[#F2CCC3]/40 border border-[#EBC1B6]/60">
                            <VendorImage
                              vendor={vendor}
                              variant="card"
                              imgClassName="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => onRemoveVendor(vendor.id)}
                              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/95 text-[#724319] hover:text-rose-600 shadow-xs flex items-center justify-center transition-colors cursor-pointer"
                              aria-label={`${t('compare.remove')} ${vendor.businessName}`}
                              title={t('compare.remove')}
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                            {isTopRated && (
                              <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#724319] text-white text-[10px] font-semibold shadow-xs">
                                <Award className="w-3 h-3 text-[#F2CCC3]" />
                                {t('compare.topRatedBadge')}
                              </span>
                            )}
                          </div>

                          <div>
                            <span className="text-[10px] font-semibold uppercase tracking-wide text-[#8A5A44]">
                              {t(`cat.${vendor.category}`)}
                            </span>
                            <h4 className="text-base font-serif font-bold text-[#724319] leading-snug mt-0.5">
                              {vendor.businessName}
                            </h4>
                            <p className="text-xs font-normal text-[#8A5A44] mt-0.5">
                              {t('marketplace.lead')} {vendor.name}
                            </p>
                          </div>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#EBC1B6]/50 text-xs sm:text-sm">
                {/* Starting Price */}
                <tr className="bg-white">
                  <th className="p-4 sm:px-5 font-semibold text-[#724319] bg-[#FFF8F6]/70 border-r border-[#EBC1B6]/50 align-top">
                    {t('compare.row.price')}
                  </th>
                  {vendors.map((vendor) => (
                    <td
                      key={vendor.id}
                      className="p-4 sm:px-5 border-r last:border-r-0 border-[#EBC1B6]/40 align-top"
                    >
                      <span className="inline-block font-mono font-bold text-[#724319] bg-[#F2CCC3]/35 border border-[#EBC1B6] px-3 py-1 rounded-lg tabular-nums">
                        {vendor.startingPrice}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Verified Rating & Reviews */}
                <tr className="bg-[#FFF8F6]/25">
                  <th className="p-4 sm:px-5 font-semibold text-[#724319] bg-[#FFF8F6]/70 border-r border-[#EBC1B6]/50 align-top">
                    {t('compare.row.rating')}
                  </th>
                  {vendors.map((vendor) => (
                    <td
                      key={vendor.id}
                      className="p-4 sm:px-5 border-r last:border-r-0 border-[#EBC1B6]/40 align-top"
                    >
                      <div className="flex items-center gap-1.5 font-semibold text-[#724319] tabular-nums">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
                        <span>
                          {Number.isInteger(vendor.rating)
                            ? `${vendor.rating}.0`
                            : vendor.rating}
                        </span>
                        <span className="text-xs font-normal text-[#8A5A44]">
                          ({t('compare.reviewsCount', { count: vendor.reviewCount })})
                        </span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Location */}
                <tr className="bg-white">
                  <th className="p-4 sm:px-5 font-semibold text-[#724319] bg-[#FFF8F6]/70 border-r border-[#EBC1B6]/50 align-top">
                    {t('compare.row.location')}
                  </th>
                  {vendors.map((vendor) => (
                    <td
                      key={vendor.id}
                      className="p-4 sm:px-5 border-r last:border-r-0 border-[#EBC1B6]/40 align-top text-xs sm:text-sm text-[#724319]/85"
                    >
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#8A5A44] shrink-0 mt-0.5" />
                        <span>{vendor.location}</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Overview / Details */}
                <tr className="bg-[#FFF8F6]/25">
                  <th className="p-4 sm:px-5 font-semibold text-[#724319] bg-[#FFF8F6]/70 border-r border-[#EBC1B6]/50 align-top">
                    {t('compare.row.overview')}
                  </th>
                  {vendors.map((vendor) => (
                    <td
                      key={vendor.id}
                      className="p-4 sm:px-5 border-r last:border-r-0 border-[#EBC1B6]/40 align-top text-xs text-[#724319]/85 leading-relaxed"
                    >
                      {t(`vendor.${vendor.id}.desc`)}
                    </td>
                  ))}
                </tr>

                {/* Supported Event Types */}
                <tr className="bg-white">
                  <th className="p-4 sm:px-5 font-semibold text-[#724319] bg-[#FFF8F6]/70 border-r border-[#EBC1B6]/50 align-top">
                    {t('compare.row.eventTypes')}
                  </th>
                  {vendors.map((vendor) => (
                    <td
                      key={vendor.id}
                      className="p-4 sm:px-5 border-r last:border-r-0 border-[#EBC1B6]/40 align-top"
                    >
                      <div className="flex flex-wrap gap-1.5">
                        {vendor.eventTypes.map((evType) => (
                          <span
                            key={evType}
                            className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#FFF8F6] text-[#724319] border border-[#EBC1B6]/70"
                          >
                            {t(`eventType.${evType}`)}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Cultural Specialties */}
                <tr className="bg-[#FFF8F6]/25">
                  <th className="p-4 sm:px-5 font-semibold text-[#724319] bg-[#FFF8F6]/70 border-r border-[#EBC1B6]/50 align-top">
                    {t('compare.row.specialties')}
                  </th>
                  {vendors.map((vendor) => (
                    <td
                      key={vendor.id}
                      className="p-4 sm:px-5 border-r last:border-r-0 border-[#EBC1B6]/40 align-top"
                    >
                      <ul className="space-y-1 text-xs text-[#8A5A44] font-medium">
                        {vendor.culturalSpecialties.map((spec) => (
                          <li key={spec} className="flex items-start gap-1.5">
                            <span aria-hidden="true" className="text-[#8A5A44]">·</span>
                            <span>{spec}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                {/* Key Inclusions */}
                <tr className="bg-white">
                  <th className="p-4 sm:px-5 font-semibold text-[#724319] bg-[#FFF8F6]/70 border-r border-[#EBC1B6]/50 align-top">
                    {t('compare.row.inclusions')}
                  </th>
                  {vendors.map((vendor) => (
                    <td
                      key={vendor.id}
                      className="p-4 sm:px-5 border-r last:border-r-0 border-[#EBC1B6]/40 align-top"
                    >
                      <ul className="space-y-1.5 text-xs text-[#724319]/85">
                        {vendor.features.map((feat) => (
                          <li key={feat} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#8A5A44] shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                {/* Actions Row */}
                <tr className="bg-[#FFF8F6]/60">
                  <th className="p-4 sm:px-5 font-semibold text-[#724319] bg-[#FFF8F6]/90 border-r border-[#EBC1B6]/50 align-middle">
                    {t('compare.row.actions')}
                  </th>
                  {vendors.map((vendor) => (
                    <td
                      key={vendor.id}
                      className="p-4 sm:px-5 border-r last:border-r-0 border-[#EBC1B6]/40 align-middle"
                    >
                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onSelectVendor(vendor);
                          }}
                          className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-[#724319] hover:bg-[#8A5A44] text-white text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                        >
                          <span>{t('compare.viewInquire')}</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveVendor(vendor.id)}
                          className="w-full inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-full bg-white hover:bg-[#F2CCC3]/30 border border-[#EBC1B6] text-[#8A5A44] hover:text-[#724319] text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>{t('compare.remove')}</span>
                        </button>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="px-6 py-3.5 bg-[#FFF8F6] border-t border-[#EBC1B6]/70 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              onClearAll();
              onClose();
            }}
            className="sm:hidden inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#8A5A44] bg-white border border-[#EBC1B6] cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t('compare.clearAll')}</span>
          </button>
          <span className="hidden sm:inline text-xs text-[#8A5A44]">
            {t('compare.selectedCount', { count: vendors.length })}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto px-5 py-2 rounded-full bg-white hover:bg-[#F2CCC3]/40 border border-[#EBC1B6] text-xs font-semibold text-[#724319] transition-colors cursor-pointer"
          >
            {t('compare.close')}
          </button>
        </div>
      </div>
    </div>
  );
};
