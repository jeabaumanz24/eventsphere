import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  X,
  Star,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Send,
  ThumbsUp,
  Filter,
  Plus,
  Heart,
  Sparkles,
} from 'lucide-react';
import { PlanPreviewContextData, Vendor, VendorReview } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { PlanSummaryActions } from './PlanSummaryActions';
import { VendorImage } from './VendorImage';
import { trackEvent } from '../utils/analytics';

function headcountToNumericEstimate(headcount: string): string {
  switch (headcount) {
    case 'Under 30':
      return '25';
    case '30-60':
      return '45';
    case '60-100':
      return '80';
    case '100-200':
      return '150';
    case '200+':
      return '240';
    default:
      return '80';
  }
}

function buildPrefilledInquiryMessage(preview: PlanPreviewContextData): string {
  const elements =
    preview.culturalElements.length > 0
      ? preview.culturalElements.join(', ')
      : 'General celebration styling';
  return [
    `Event Type: ${preview.eventType}`,
    `Cultural Tradition: ${preview.traditionLabel}`,
    `Cultural Elements: ${elements}`,
    `Headcount: ${preview.headcount} (${preview.preferredTime})`,
    `Location: ${preview.location}`,
    `Budget: ${preview.budgetLabel}`,
    `Selected Vendor: ${preview.selectedVendorName} (${preview.selectedVendorCategory})`,
    `Sample Quote Guide: ${preview.selectedVendorPriceSummary}`,
  ].join('\n');
}

interface VendorModalProps {
  vendor: Vendor | null;
  onClose: () => void;
  onRequestSent: (vendorName: string) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (vendor: Vendor) => void;
  initialTab?: 'overview' | 'reviews' | 'proposal';
  previewContext?: PlanPreviewContextData | null;
}

export const VendorModal: React.FC<VendorModalProps> = ({
  vendor,
  onClose,
  onRequestSent,
  isWishlisted = false,
  onToggleWishlist,
  initialTab = 'overview',
  previewContext = null,
}) => {
  if (!vendor) return null;
  const modalKey = `${vendor.id}-${initialTab}-${previewContext ? 'sample' : 'std'}`;
  return (
    <VendorModalContent
      key={modalKey}
      vendor={vendor}
      onClose={onClose}
      onRequestSent={onRequestSent}
      isWishlisted={isWishlisted}
      onToggleWishlist={onToggleWishlist}
      initialTab={previewContext ? 'proposal' : initialTab}
      previewContext={previewContext}
    />
  );
};

interface VendorModalContentProps {
  vendor: Vendor;
  onClose: () => void;
  onRequestSent: (vendorName: string) => void;
  isWishlisted: boolean;
  onToggleWishlist?: (vendor: Vendor) => void;
  initialTab: 'overview' | 'reviews' | 'proposal';
  previewContext: PlanPreviewContextData | null;
}

const VendorModalContent: React.FC<VendorModalContentProps> = ({
  vendor,
  onClose,
  onRequestSent,
  isWishlisted,
  onToggleWishlist,
  initialTab,
  previewContext,
}) => {
  const { t } = useLanguage();
  const isSamplePreview = Boolean(previewContext);

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  // Tabs: overview, reviews, proposal
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'proposal'>(initialTab);

  // Proposal form state
  const [date, setDate] = useState('');
  const [guestCount, setGuestCount] = useState(() =>
    previewContext ? headcountToNumericEstimate(previewContext.headcount) : '150'
  );
  const [message, setMessage] = useState(() =>
    previewContext ? buildPrefilledInquiryMessage(previewContext) : ''
  );
  const [userName, setUserName] = useState(() => (previewContext ? 'Sample Host (Preview)' : ''));
  const [userEmail, setUserEmail] = useState(() => (previewContext ? 'sample@example.com.au' : ''));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  // Modal lifecycle: fire GA4 inquiry_modal_open, manage focus trap & Escape, restore focus on close
  useEffect(() => {
    previousActiveElementRef.current = document.activeElement as HTMLElement | null;

    trackEvent('inquiry_modal_open', {
      vendor_name: vendor.businessName,
      vendor_category: vendor.category,
    });

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 30);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => el.offsetParent !== null);

        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first || !dialogRef.current.contains(document.activeElement)) {
            e.preventDefault();
            last.focus();
          }
        } else if (document.activeElement === last || !dialogRef.current.contains(document.activeElement)) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
      const returnTarget = previousActiveElementRef.current;
      if (returnTarget && typeof returnTarget.focus === 'function') {
        window.requestAnimationFrame(() => {
          returnTarget.focus();
        });
      }
    };
  }, [vendor.businessName, vendor.category, onClose]);

  // Reviews state with local storage / custom additions
  const initialReviews: VendorReview[] = useMemo(() => {
    if (vendor.reviews && vendor.reviews.length > 0) {
      return vendor.reviews;
    }
    // Fallback verified reviews for any vendor without explicit list
    return [
      {
        id: `rev-default-1-${vendor.id}`,
        author: 'Sarah & Daniel K.',
        role: 'Verified Host',
        eventDate: 'September 2026',
        eventType: 'Adelaide Cultural Celebration',
        location: `${vendor.location}`,
        rating: 5,
        comment: `${vendor.businessName} was an absolute dream to work with. Highly responsive, deeply respectful of our traditions, and delivered flawless quality on our special day.`,
        culturalElements: vendor.culturalSpecialties.slice(0, 2),
        helpfulCount: 16,
      },
      {
        id: `rev-default-2-${vendor.id}`,
        author: 'Hannah & James P.',
        role: 'Verified Host',
        eventDate: 'August 2026',
        eventType: 'Private Barossa Celebration',
        location: 'Barossa Valley, SA',
        rating: 5,
        comment: `Outstanding service from start to finish. Every detail was handled with care, punctuality, and true South Australian hospitality.`,
        culturalElements: vendor.culturalSpecialties.slice(1, 3),
        helpfulCount: 9,
      },
    ];
  }, [vendor]);

  const [reviewsList, setReviewsList] = useState<VendorReview[]>(initialReviews);
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, boolean>>({});
  const [selectedStarFilter, setSelectedStarFilter] = useState<number | 'all'>('all');
  const [showReviewForm, setShowReviewForm] = useState(false);

  // New review form state
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewEvent, setNewReviewEvent] = useState('');
  const [newReviewLocation, setNewReviewLocation] = useState('Adelaide Botanic Gardens');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewSubmittedToast, setReviewSubmittedToast] = useState(false);

  const [addedReviews, setAddedReviews] = useState<VendorReview[]>([]);

  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSent(true);
      trackEvent('inquiry_submit', {
        vendor_name: vendor.businessName,
        vendor_category: vendor.category,
        event_type: previewContext?.eventType || 'Marketplace Inquiry',
        sample_preview: isSamplePreview,
      });
      onRequestSent(vendor.businessName);
      if (!isSamplePreview) {
        setTimeout(() => {
          onClose();
        }, 1800);
      }
    }, 350);
  };

  const handleVoteHelpful = (reviewId: string) => {
    const hasVoted = !!helpfulVotes[reviewId];
    setHelpfulVotes((prev) => ({ ...prev, [reviewId]: !hasVoted }));
    const updateFn = (prev: VendorReview[]) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          const current = r.helpfulCount || 0;
          return { ...r, helpfulCount: hasVoted ? Math.max(0, current - 1) : current + 1 };
        }
        return r;
      });
    setReviewsList(updateFn);
    setAddedReviews(updateFn);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    const newRev: VendorReview = {
      id: `custom-rev-${Date.now()}`,
      author: newReviewAuthor,
      role: 'Verified Client',
      eventDate: 'November 2026',
      eventType: newReviewEvent || 'Adelaide Multicultural Celebration',
      location: newReviewLocation || vendor.location,
      rating: newReviewRating,
      comment: newReviewComment,
      culturalElements: vendor.culturalSpecialties.slice(0, 2),
      helpfulCount: 1,
    };

    setAddedReviews((prev) => [newRev, ...prev]);
    setNewReviewAuthor('');
    setNewReviewEvent('');
    setNewReviewComment('');
    setShowReviewForm(false);
    setReviewSubmittedToast(true);
    setTimeout(() => setReviewSubmittedToast(false), 3500);
  };

  const combinedReviews = useMemo(
    () => [...addedReviews, ...reviewsList],
    [addedReviews, reviewsList]
  );

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    if (selectedStarFilter === 'all') return combinedReviews;
    return combinedReviews.filter((r) => r.rating === selectedStarFilter);
  }, [combinedReviews, selectedStarFilter]);

  // Accurate total count & average rating anchored to vendor baseline
  const totalReviewsCount = vendor.reviewCount + addedReviews.length;
  const averageRating = useMemo(() => {
    if (addedReviews.length === 0) {
      return Number.isInteger(vendor.rating) ? `${vendor.rating}.0` : vendor.rating.toString();
    }
    const baseTotal = vendor.rating * vendor.reviewCount;
    const addedTotal = addedReviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = (baseTotal + addedTotal) / totalReviewsCount;
    return avg.toFixed(1);
  }, [vendor.rating, vendor.reviewCount, addedReviews, totalReviewsCount]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto print:static print:bg-white print:p-0"
      role="dialog"
      aria-modal="true"
      aria-labelledby="vendor-modal-title"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-white rounded-3xl border border-[#EBC1B6] shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:border-0"
      >
        {/* Wishlist Save + Close Buttons */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2 print:hidden">
          {onToggleWishlist && (
            <button
              type="button"
              onClick={() => onToggleWishlist(vendor)}
              className={`h-9 px-3 rounded-full backdrop-blur-md flex items-center gap-1.5 text-xs font-semibold transition-all shadow-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                isWishlisted
                  ? 'bg-rose-500 text-white hover:bg-rose-600'
                  : 'bg-white/90 text-[#724319] hover:bg-white hover:text-rose-600'
              }`}
              aria-label={isWishlisted ? t('wishlist.savedAria') : t('wishlist.saveAria')}
              aria-pressed={isWishlisted}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white text-white' : ''}`} />
              <span className="hidden sm:inline">
                {isWishlisted ? t('wishlist.savedBtn') : t('wishlist.saveBtn')}
              </span>
            </button>
          )}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#724319] hover:bg-white hover:text-black transition-all shadow-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#724319]"
            aria-label={t('vendorModal.close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Header Hero Image & Trust Stats */}
        <div
          className={`relative h-48 sm:h-56 shrink-0 overflow-hidden print:hidden ${
            vendor.image ? 'bg-[#F2CCC3]' : 'bg-[#FFF8F6] border-b border-[#EBC1B6]'
          }`}
        >
          <VendorImage
            vendor={vendor}
            variant="card"
            offsetBottomForOverlay
            imgClassName="w-full h-full object-cover"
          />
          <div
            className={`absolute inset-0 ${
              vendor.image
                ? 'bg-gradient-to-t from-black/80 via-black/30 to-transparent'
                : 'bg-gradient-to-t from-[#724319]/90 via-[#724319]/25 to-transparent'
            }`}
          />
          <div className="absolute bottom-4 left-5 right-5 text-white">
            <span className="text-[11px] font-semibold bg-white/90 text-[#724319] px-2.5 py-0.5 rounded-full inline-block mb-1.5 shadow-xs">
              {t(`cat.${vendor.category}`)}
            </span>
            <h2 id="vendor-modal-title" className="text-2xl sm:text-3xl font-serif font-bold leading-tight">
              {vendor.businessName}
            </h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/90 mt-1">
              <span>{t('marketplace.lead')} {vendor.name}</span>
              <span aria-hidden="true">·</span>
              <button
                onClick={() => setActiveTab('reviews')}
                className="flex items-center gap-1 hover:underline cursor-pointer group"
              >
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 inline" />
                <span className="font-semibold">{averageRating}</span>
                <span className="text-[11px] text-white/80 font-normal">
                  {t('vendorModal.verifiedReviewsCount', { count: totalReviewsCount })}
                </span>
              </button>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 inline text-[#EBC1B6]" />
                {vendor.location}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="bg-[#FFF8F6] px-5 sm:px-8 py-2.5 border-b border-[#EBC1B6]/60 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#724319] ${
                activeTab === 'overview'
                  ? 'bg-[#724319] text-white shadow-2xs'
                  : 'text-[#724319]/75 hover:bg-[#F2CCC3]/40'
              }`}
            >
              {t('vendorModal.overviewTab')}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#724319] ${
                activeTab === 'reviews'
                  ? 'bg-[#724319] text-white shadow-2xs'
                  : 'text-[#724319]/75 hover:bg-[#F2CCC3]/40'
              }`}
            >
              <span>{t('vendorModal.reviewsTab')}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeTab === 'reviews'
                    ? 'bg-white/20 text-white'
                    : 'bg-[#F2CCC3] text-[#724319]'
                }`}
              >
                {totalReviewsCount}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('proposal')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#724319] ${
                activeTab === 'proposal'
                  ? 'bg-[#724319] text-white shadow-2xs'
                  : 'text-[#724319]/75 hover:bg-[#F2CCC3]/40'
              }`}
            >
              {t('vendorModal.proposalTab')}
            </button>
          </div>

          <div className="hidden sm:block text-xs font-mono font-bold text-[#8A5A44]">
            {t('marketplace.from')} {vendor.startingPrice}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-8 space-y-6 overflow-y-auto flex-grow print:overflow-visible">
          {sent ? (
            <div className="py-8 text-center space-y-4" aria-live="polite">
              <div className="w-16 h-16 rounded-full bg-[#F2CCC3] flex items-center justify-center text-[#724319] mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8 text-[#724319]" />
              </div>
              {isSamplePreview && (
                <div className="space-y-1">
                  <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-[#8A5A44]">
                    {t('vendorModal.samplePreviewHeading')}
                  </span>
                  <p className="text-xs text-[#8A5A44]">{t('how.simulationCaption')}</p>
                </div>
              )}
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#724319]">
                {t('vendorModal.inquirySentTo', { name: vendor.name })}
              </h3>
              <p className="text-xs sm:text-sm text-[#724319]/80 max-w-sm mx-auto leading-relaxed">
                {t('vendorModal.inquirySentDesc', { name: vendor.name })}
              </p>
              {previewContext && (
                <div className="text-left max-w-xl mx-auto pt-2">
                  <PlanSummaryActions plan={previewContext} variant="modal" />
                </div>
              )}
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW & INCLUSIONS */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A5A44] mb-2">
                      {t('vendorModal.artisanOverview')}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#724319]/85 leading-relaxed">
                      {t(`vendor.${vendor.id}.desc`)}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A5A44] mb-2">
                      {t('vendorModal.eventTypesLabel')}
                    </h4>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {vendor.eventTypes.map((evType) => (
                        <span
                          key={evType}
                          className="px-3 py-1 bg-[#F2CCC3]/45 border border-[#EBC1B6] rounded-full text-[#724319] font-medium"
                        >
                          {t(`eventType.${evType}`)}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A5A44] mb-2">
                      {t('vendorModal.culturalComp')}
                    </h4>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {vendor.culturalSpecialties.map((spec) => (
                        <span
                          key={spec}
                          className="px-3 py-1 bg-[#FFF8F6] border border-[#EBC1B6] rounded-full text-[#724319] font-medium"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A5A44] mb-2">
                      {t('vendorModal.inclusions')}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#724319]/85">
                      {vendor.features.map((feat) => (
                        <div key={feat} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#8A5A44] shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Highlights of Verified Reviews Banner */}
                  <div className="p-4 bg-[#FFF8F6] rounded-2xl border border-[#EBC1B6]/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-[#EBC1B6] flex items-center justify-center text-amber-500 font-bold shrink-0">
                        <Star className="w-5 h-5 fill-amber-400" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-[#724319]">
                          {t('vendorModal.ratedBy', { rating: averageRating, count: totalReviewsCount })}
                        </div>
                        <div className="text-[11px] text-[#8A5A44]">
                          {t('vendorModal.verifiedCeremonies')}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('reviews')}
                      className="px-3.5 py-1.5 bg-white border border-[#EBC1B6] hover:bg-[#F2CCC3]/40 text-[#724319] rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
                    >
                      {t('vendorModal.readReviews')}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: VERIFIED REVIEWS */}
              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {/* Reviews Summary Header Card */}
                  <div className="p-5 bg-[#FFF8F6] rounded-2xl border border-[#EBC1B6]/80 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                    {/* Overall Score */}
                    <div className="md:col-span-5 text-center md:text-left md:border-r md:border-[#EBC1B6]/60 md:pr-4">
                      <div className="flex items-baseline justify-center md:justify-start gap-2">
                        <span className="text-4xl sm:text-5xl font-serif font-bold text-[#724319] tabular-nums">
                          {averageRating}
                        </span>
                        <span className="text-xs text-[#8A5A44] font-medium">/ 5.0</span>
                      </div>
                      <div className="flex items-center justify-center md:justify-start gap-1 my-1.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <div className="text-xs font-semibold text-[#724319] flex items-center justify-center md:justify-start gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#8A5A44]" />
                        <span>{t('vendorModal.verifiedEventReviews')}</span>
                      </div>
                      <p className="text-[11px] text-[#724319]/70 mt-0.5">
                        {t('vendorModal.basedOnWeddings', { count: totalReviewsCount })}
                      </p>
                    </div>

                    {/* Criteria Sub-Scores */}
                    <div className="md:col-span-7 grid grid-cols-2 gap-2.5 text-xs">
                      <div className="p-2.5 bg-white rounded-xl border border-[#EBC1B6]/50">
                        <span className="text-[10px] text-[#8A5A44] uppercase font-semibold">{t('vendorModal.culturalRespect')}</span>
                        <div className="text-sm font-bold text-[#724319] tabular-nums">5.0 ★</div>
                        <div className="w-full bg-[#EBC1B6]/40 h-1 rounded-full mt-1">
                          <div className="bg-[#724319] h-full rounded-full w-full" />
                        </div>
                      </div>

                      <div className="p-2.5 bg-white rounded-xl border border-[#EBC1B6]/50">
                        <span className="text-[10px] text-[#8A5A44] uppercase font-semibold">{t('vendorModal.artisticCraft')}</span>
                        <div className="text-sm font-bold text-[#724319] tabular-nums">4.98 ★</div>
                        <div className="w-full bg-[#EBC1B6]/40 h-1 rounded-full mt-1">
                          <div className="bg-[#724319] h-full rounded-full w-[99%]" />
                        </div>
                      </div>

                      <div className="p-2.5 bg-white rounded-xl border border-[#EBC1B6]/50">
                        <span className="text-[10px] text-[#8A5A44] uppercase font-semibold">{t('vendorModal.punctuality')}</span>
                        <div className="text-sm font-bold text-[#724319] tabular-nums">4.95 ★</div>
                        <div className="w-full bg-[#EBC1B6]/40 h-1 rounded-full mt-1">
                          <div className="bg-[#724319] h-full rounded-full w-[98%]" />
                        </div>
                      </div>

                      <div className="p-2.5 bg-white rounded-xl border border-[#EBC1B6]/50">
                        <span className="text-[10px] text-[#8A5A44] uppercase font-semibold">{t('vendorModal.valueBudget')}</span>
                        <div className="text-sm font-bold text-[#724319] tabular-nums">4.92 ★</div>
                        <div className="w-full bg-[#EBC1B6]/40 h-1 rounded-full mt-1">
                          <div className="bg-[#724319] h-full rounded-full w-[97%]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Filter and Leave Review Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-[#8A5A44] font-semibold flex items-center gap-1">
                        <Filter className="w-3 h-3" /> {t('timeline.filterLabel')}
                      </span>
                      <button
                        onClick={() => setSelectedStarFilter('all')}
                        className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                          selectedStarFilter === 'all'
                            ? 'bg-[#724319] text-white font-medium'
                            : 'bg-white hover:bg-[#F2CCC3]/40 text-[#724319] border border-[#EBC1B6]'
                        }`}
                      >
                        {t('vendorModal.allReviews', { count: combinedReviews.length })}
                      </button>
                      <button
                        onClick={() => setSelectedStarFilter(5)}
                        className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                          selectedStarFilter === 5
                            ? 'bg-[#724319] text-white font-medium'
                            : 'bg-white hover:bg-[#F2CCC3]/40 text-[#724319] border border-[#EBC1B6]'
                        }`}
                      >
                        {t('vendorModal.fiveStars', { count: combinedReviews.filter((r) => r.rating === 5).length })}
                      </button>
                    </div>

                    <button
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#FFF8F6] border border-[#EBC1B6] text-[#724319] rounded-xl text-xs font-semibold shadow-2xs transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#8A5A44]" />
                      <span>{showReviewForm ? t('vendorModal.closeReviewForm') : t('vendorModal.writeReview')}</span>
                    </button>
                  </div>

                  {/* Toast announcement on submitted review */}
                  {reviewSubmittedToast && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Thank you! Your verified client review has been recorded.</span>
                    </div>
                  )}

                  {/* Interactive Review Form */}
                  {showReviewForm && (
                    <form
                      onSubmit={handleAddReview}
                      className="p-5 bg-[#FFF8F6] rounded-2xl border border-[#EBC1B6] space-y-3.5 text-xs text-left animate-in fade-in duration-200"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-[#EBC1B6]/40">
                        <h5 className="font-semibold text-[#724319]">
                          {t('vendorModal.writeReview')} — {vendor.name}
                        </h5>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setNewReviewRating(star)}
                              className="cursor-pointer"
                            >
                              <Star
                                className={`w-4 h-4 ${
                                  star <= newReviewRating
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          type="text"
                          required
                          placeholder="Your Names (e.g. Maya & Leo)"
                          value={newReviewAuthor}
                          onChange={(e) => setNewReviewAuthor(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-[#EBC1B6] rounded-xl text-xs text-[#724319] focus:outline-none focus:ring-1 focus:ring-[#8A5A44]"
                        />
                        <input
                          type="text"
                          placeholder="Event Type (e.g. Diwali Night or 50th Birthday)"
                          value={newReviewEvent}
                          onChange={(e) => setNewReviewEvent(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-[#EBC1B6] rounded-xl text-xs text-[#724319] focus:outline-none focus:ring-1 focus:ring-[#8A5A44]"
                        />
                        <input
                          type="text"
                          placeholder="Adelaide Location / Venue"
                          value={newReviewLocation}
                          onChange={(e) => setNewReviewLocation(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-[#EBC1B6] rounded-xl text-xs text-[#724319] focus:outline-none focus:ring-1 focus:ring-[#8A5A44]"
                        />
                      </div>

                      <textarea
                        required
                        rows={3}
                        placeholder="Share your experience regarding communication, cultural understanding, and quality on the day..."
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#EBC1B6] rounded-xl text-xs text-[#724319] focus:outline-none focus:ring-1 focus:ring-[#8A5A44] resize-none"
                      />

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setShowReviewForm(false)}
                          className="px-4 py-2 bg-white border border-[#EBC1B6] text-[#724319] rounded-full text-xs font-medium cursor-pointer"
                        >
                          {t('vendorModal.cancel')}
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-[#724319] hover:bg-[#8A5A44] text-white rounded-full text-xs font-semibold cursor-pointer"
                        >
                          {t('vendorModal.postReview')}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Reviews List */}
                  <div className="space-y-4">
                    {filteredReviews.map((rev) => {
                      const isVoted = !!helpfulVotes[rev.id];
                      return (
                        <div
                          key={rev.id}
                          className="p-5 bg-white rounded-2xl border border-[#EBC1B6]/70 shadow-2xs space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#EBC1B6]/30">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-serif font-bold text-sm text-[#724319]">
                                  {rev.author}
                                </span>
                                <span className="text-[10px] font-semibold text-[#8A5A44] bg-[#FFF8F6] border border-[#EBC1B6] px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                  <span>{rev.role}</span>
                                </span>
                              </div>
                              <div className="text-[11px] text-[#724319]/70 mt-0.5 flex items-center gap-1.5 flex-wrap">
                                <span>{rev.eventType}</span>
                                <span aria-hidden="true">·</span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-[#8A5A44]" />
                                  {rev.location}
                                </span>
                                <span aria-hidden="true">·</span>
                                <span>{rev.eventDate}</span>
                              </div>
                            </div>

                            {/* Star Rating */}
                            <div className="flex items-center gap-1">
                              {[...Array(rev.rating)].map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              ))}
                            </div>
                          </div>

                          {/* Review comment */}
                          <p className="text-xs text-[#724319]/85 leading-relaxed">
                            "{rev.comment}"
                          </p>

                          {/* Cultural tags + Helpful counter */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
                            <div className="flex flex-wrap gap-1.5">
                              {rev.culturalElements?.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2.5 py-0.5 bg-[#FFF8F6] border border-[#EBC1B6]/60 rounded-md text-[10px] text-[#8A5A44] font-medium"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>

                            <button
                              onClick={() => handleVoteHelpful(rev.id)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] transition-colors cursor-pointer ${
                                isVoted
                                  ? 'bg-[#F2CCC3] border-[#8A5A44] text-[#724319] font-semibold'
                                  : 'bg-white border-[#EBC1B6] text-[#724319]/75 hover:bg-[#FFF8F6]'
                              }`}
                            >
                              <ThumbsUp className="w-3 h-3 text-[#8A5A44]" />
                              <span>{t('vendorModal.helpful', { count: rev.helpfulCount || 0 })}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: REQUEST PROPOSAL */}
              {activeTab === 'proposal' && (
                <div className="space-y-4">
                  {previewContext && (
                    <div className="p-4 sm:p-5 bg-[#F2CCC3]/30 rounded-2xl border border-[#8A5A44]/40 space-y-3 text-left">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#724319]">
                            <Sparkles className="w-3.5 h-3.5 text-[#8A5A44]" />
                            <span>{t('vendorModal.samplePreviewHeading')}</span>
                          </div>
                          <p className="text-[11px] font-medium text-[#8A5A44] mt-0.5">
                            {t('how.simulationCaption')}
                          </p>
                        </div>
                        <span className="text-[11px] font-mono font-semibold bg-white border border-[#EBC1B6] text-[#724319] px-2.5 py-0.5 rounded-full">
                          {t('how.mock2VendorFit', { score: previewContext.selectedVendorFitScore })}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] bg-white/85 p-3 rounded-xl border border-[#EBC1B6]/70">
                        <div>
                          <span className="text-[10px] uppercase font-semibold text-[#8A5A44] block">
                            {t('how.mock1TypeLabel')}
                          </span>
                          <span className="font-semibold text-[#724319]">
                            {t(`eventType.${previewContext.eventType}`)}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-semibold text-[#8A5A44] block">
                            {t('how.mock1TraditionLabel')}
                          </span>
                          <span className="font-semibold text-[#724319]">
                            {previewContext.traditionLabel}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-semibold text-[#8A5A44] block">
                            {t('how.mock1Guests')}
                          </span>
                          <span className="font-semibold text-[#724319]">
                            {previewContext.headcount}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-semibold text-[#8A5A44] block">
                            {t('how.mock1Location')}
                          </span>
                          <span className="font-semibold text-[#724319]">
                            {previewContext.location}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-semibold text-[#8A5A44] block">
                            {t('how.mock1BudgetLabel')}
                          </span>
                          <span className="font-semibold text-[#724319]">
                            {previewContext.budgetLabel}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-semibold text-[#8A5A44] block">
                            {t('how.mock3ChooseVendor')}
                          </span>
                          <span className="font-semibold text-[#724319]">
                            {previewContext.selectedVendorName} ({t(`cat.${previewContext.selectedVendorCategory}`)})
                          </span>
                        </div>
                      </div>

                      <PlanSummaryActions plan={previewContext} variant="modal" />
                    </div>
                  )}

                  <div className="p-5 bg-[#FFF8F6] rounded-2xl border border-[#EBC1B6]/70 print:hidden">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#EBC1B6]/40">
                      <div>
                        <h4 className="text-sm font-semibold text-[#724319]">
                          {isSamplePreview
                            ? `${t('vendorModal.samplePreviewHeading')} — ${vendor.businessName}`
                            : t('vendorModal.requestHeading')}
                        </h4>
                        <p className="text-xs text-[#8A5A44]">
                          {isSamplePreview
                            ? t('vendorModal.samplePreviewMeta')
                            : t('vendorModal.directEncrypted', { name: vendor.name })}
                        </p>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#8A5A44]">
                        {previewContext
                          ? previewContext.selectedVendorPriceSummary
                          : t('vendorModal.starting', { price: vendor.startingPrice })}
                      </span>
                    </div>

                    <form onSubmit={handleSubmitProposal} className="space-y-3.5 text-xs text-left">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label htmlFor="proposal-user-name" className="text-[11px] font-semibold text-[#724319]">
                            {t('vendorModal.yourName')}
                          </label>
                          <input
                            id="proposal-user-name"
                            type="text"
                            required={!isSamplePreview}
                            placeholder="e.g. Diwata dela Cruz"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="w-full px-3 py-2.5 bg-white border border-[#EBC1B6] rounded-xl text-xs text-[#724319] focus:outline-none focus:ring-2 focus:ring-[#8A5A44]/40"
                          />
                        </div>
                        <div className="space-y-1">
                          <label htmlFor="proposal-user-email" className="text-[11px] font-semibold text-[#724319]">
                            {t('contact.emailLabel')}
                          </label>
                          <input
                            id="proposal-user-email"
                            type="email"
                            required={!isSamplePreview}
                            placeholder="diwata@example.com.au"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            className="w-full px-3 py-2.5 bg-white border border-[#EBC1B6] rounded-xl text-xs text-[#724319] focus:outline-none focus:ring-2 focus:ring-[#8A5A44]/40"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label htmlFor="proposal-target-date" className="text-[11px] font-semibold text-[#724319]">
                            {t('vendorModal.targetDate')}
                          </label>
                          <input
                            id="proposal-target-date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-3 py-2.5 bg-white border border-[#EBC1B6] rounded-xl text-xs text-[#724319] focus:outline-none focus:ring-2 focus:ring-[#8A5A44]/40 cursor-pointer"
                          />
                        </div>
                        <div className="space-y-1">
                          <label htmlFor="proposal-guest-count" className="text-[11px] font-semibold text-[#724319]">
                            {t('vendorModal.guestCount')}
                          </label>
                          <input
                            id="proposal-guest-count"
                            type="number"
                            placeholder="Estimated Guests (e.g. 80)"
                            value={guestCount}
                            onChange={(e) => setGuestCount(e.target.value)}
                            className="w-full px-3 py-2.5 bg-white border border-[#EBC1B6] rounded-xl text-xs text-[#724319] focus:outline-none focus:ring-2 focus:ring-[#8A5A44]/40"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="proposal-message" className="text-[11px] font-semibold text-[#724319]">
                          {t('vendorModal.specificRequests')}
                        </label>
                        <textarea
                          id="proposal-message"
                          rows={isSamplePreview ? 5 : 3}
                          placeholder="Tell the artisan about your venue, ceremony elements, or desired aesthetic..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-[#EBC1B6] rounded-xl text-xs text-[#724319] focus:outline-none focus:ring-2 focus:ring-[#8A5A44]/40 resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-[#724319] hover:bg-[#8A5A44] text-white font-semibold rounded-full flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#724319]"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isSubmitting ? t('vendorModal.sendingRequest') : t('vendorModal.sendBtn')}</span>
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Bottom Bar */}
        <div className="px-6 py-3.5 bg-[#FFF8F6] border-t border-[#EBC1B6]/60 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-1.5 text-[#8A5A44]">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{t('vendorModal.escrowFooter')}</span>
          </div>

          <div className="flex items-center gap-2">
            {activeTab !== 'proposal' && !sent && (
              <button
                type="button"
                onClick={() => setActiveTab('proposal')}
                className="px-4 py-1.5 bg-[#724319] hover:bg-[#8A5A44] text-white font-semibold rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#724319]"
              >
                {t('vendorModal.inquireNow')}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-white border border-[#EBC1B6] text-[#724319] font-medium rounded-full hover:bg-[#F2CCC3]/40 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#724319]"
            >
              {t('vendorModal.close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
