import React, { useState, useMemo } from 'react';
import {
  X,
  Star,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Send,
  Calendar,
  ThumbsUp,
  MessageSquare,
  Sparkles,
  Filter,
  Plus,
  Heart,
  Award,
} from 'lucide-react';
import { Vendor, VendorReview } from '../types';

interface VendorModalProps {
  vendor: Vendor | null;
  onClose: () => void;
  onRequestSent: (vendorName: string) => void;
}

export const VendorModal: React.FC<VendorModalProps> = ({
  vendor,
  onClose,
  onRequestSent,
}) => {
  if (!vendor) return null;

  // Tabs: overview, reviews, proposal
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'proposal'>('overview');

  // Proposal form state
  const [date, setDate] = useState('');
  const [guestCount, setGuestCount] = useState('150');
  const [message, setMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

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
        role: 'Verified Couple',
        eventDate: 'September 2026',
        eventType: 'Bespoke Adelaide Wedding',
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

  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSent(true);
      onRequestSent(vendor.businessName);
      setTimeout(() => {
        onClose();
      }, 1800);
    }, 600);
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
      eventType: newReviewEvent || 'Multicultural Wedding',
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

  const [addedReviews, setAddedReviews] = useState<VendorReview[]>([]);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl border border-[#EBC1B6] shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#724319] hover:bg-white hover:text-black transition-all shadow-md cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Hero Image & Trust Stats */}
        <div className="relative h-48 sm:h-56 bg-[#F2CCC3] shrink-0 overflow-hidden">
          <img
            src={vendor.image}
            alt={vendor.businessName}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-4 left-5 right-5 text-white">
            <span className="text-[11px] font-semibold bg-white/90 text-[#724319] px-2.5 py-0.5 rounded-full inline-block mb-1.5 shadow-xs">
              {vendor.category}
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold leading-tight">
              {vendor.businessName}
            </h3>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/90 mt-1">
              <span>Lead: {vendor.name}</span>
              <span aria-hidden="true">·</span>
              <button
                onClick={() => setActiveTab('reviews')}
                className="flex items-center gap-1 hover:underline cursor-pointer group"
              >
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 inline" />
                <span className="font-semibold">{averageRating}</span>
                <span className="text-[11px] text-white/80 font-normal">
                  ({totalReviewsCount} Verified Reviews)
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
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#724319] text-white shadow-2xs'
                  : 'text-[#724319]/75 hover:bg-[#F2CCC3]/40'
              }`}
            >
              Overview & Inclusions
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'reviews'
                  ? 'bg-[#724319] text-white shadow-2xs'
                  : 'text-[#724319]/75 hover:bg-[#F2CCC3]/40'
              }`}
            >
              <span>Verified Reviews</span>
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
              onClick={() => setActiveTab('proposal')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'proposal'
                  ? 'bg-[#724319] text-white shadow-2xs'
                  : 'text-[#724319]/75 hover:bg-[#F2CCC3]/40'
              }`}
            >
              Request Proposal
            </button>
          </div>

          <div className="hidden sm:block text-xs font-mono font-bold text-[#8A5A44]">
            From {vendor.startingPrice}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-8 space-y-6 overflow-y-auto flex-grow">
          {sent ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#F2CCC3] flex items-center justify-center text-[#724319] mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8 text-[#724319]" />
              </div>
              <h4 className="text-xl sm:text-2xl font-serif font-bold text-[#724319]">
                Inquiry Sent to {vendor.name}!
              </h4>
              <p className="text-xs sm:text-sm text-[#724319]/80 max-w-sm mx-auto leading-relaxed">
                Your event brief has been dispatched directly. {vendor.name} will review availability for your Adelaide date and respond within 24 hours.
              </p>
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW & INCLUSIONS */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A5A44] mb-2">
                      Artisan Overview
                    </h4>
                    <p className="text-xs sm:text-sm text-[#724319]/85 leading-relaxed">
                      {vendor.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A5A44] mb-2">
                      Cultural Competencies & Ritual Experience
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
                      Signature Inclusions
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
                          Rated {averageRating} / 5.0 by {totalReviewsCount} South Australian Couples
                        </div>
                        <div className="text-[11px] text-[#8A5A44]">
                          100% verified previous multicultural ceremonies & receptions
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('reviews')}
                      className="px-3.5 py-1.5 bg-white border border-[#EBC1B6] hover:bg-[#F2CCC3]/40 text-[#724319] rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
                    >
                      Read All Reviews
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
                        <span>100% Verified Event Reviews</span>
                      </div>
                      <p className="text-[11px] text-[#724319]/70 mt-0.5">
                        Based on {totalReviewsCount} weddings & galas in South Australia
                      </p>
                    </div>

                    {/* Criteria Sub-Scores */}
                    <div className="md:col-span-7 grid grid-cols-2 gap-2.5 text-xs">
                      <div className="p-2.5 bg-white rounded-xl border border-[#EBC1B6]/50">
                        <span className="text-[10px] text-[#8A5A44] uppercase font-semibold">Cultural Respect</span>
                        <div className="text-sm font-bold text-[#724319] tabular-nums">5.0 ★</div>
                        <div className="w-full bg-[#EBC1B6]/40 h-1 rounded-full mt-1">
                          <div className="bg-[#724319] h-full rounded-full w-full" />
                        </div>
                      </div>

                      <div className="p-2.5 bg-white rounded-xl border border-[#EBC1B6]/50">
                        <span className="text-[10px] text-[#8A5A44] uppercase font-semibold">Artistic Craft</span>
                        <div className="text-sm font-bold text-[#724319] tabular-nums">4.98 ★</div>
                        <div className="w-full bg-[#EBC1B6]/40 h-1 rounded-full mt-1">
                          <div className="bg-[#724319] h-full rounded-full w-[99%]" />
                        </div>
                      </div>

                      <div className="p-2.5 bg-white rounded-xl border border-[#EBC1B6]/50">
                        <span className="text-[10px] text-[#8A5A44] uppercase font-semibold">Punctuality</span>
                        <div className="text-sm font-bold text-[#724319] tabular-nums">4.95 ★</div>
                        <div className="w-full bg-[#EBC1B6]/40 h-1 rounded-full mt-1">
                          <div className="bg-[#724319] h-full rounded-full w-[98%]" />
                        </div>
                      </div>

                      <div className="p-2.5 bg-white rounded-xl border border-[#EBC1B6]/50">
                        <span className="text-[10px] text-[#8A5A44] uppercase font-semibold">Value for Budget</span>
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
                        <Filter className="w-3 h-3" /> Filter:
                      </span>
                      <button
                        onClick={() => setSelectedStarFilter('all')}
                        className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                          selectedStarFilter === 'all'
                            ? 'bg-[#724319] text-white font-medium'
                            : 'bg-white hover:bg-[#F2CCC3]/40 text-[#724319] border border-[#EBC1B6]'
                        }`}
                      >
                        All ({combinedReviews.length})
                      </button>
                      <button
                        onClick={() => setSelectedStarFilter(5)}
                        className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                          selectedStarFilter === 5
                            ? 'bg-[#724319] text-white font-medium'
                            : 'bg-white hover:bg-[#F2CCC3]/40 text-[#724319] border border-[#EBC1B6]'
                        }`}
                      >
                        5 Stars ({combinedReviews.filter((r) => r.rating === 5).length})
                      </button>
                    </div>

                    <button
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#FFF8F6] border border-[#EBC1B6] text-[#724319] rounded-xl text-xs font-semibold shadow-2xs transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#8A5A44]" />
                      <span>{showReviewForm ? 'Close Review Form' : 'Write a Verified Review'}</span>
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
                          Submit a Review for {vendor.name}
                        </h5>
                        <div className="flex items-center gap-1">
                          <span className="text-[#8A5A44] mr-1">Rating:</span>
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
                          placeholder="Event Type (e.g. Barossa Wedding)"
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
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-[#724319] hover:bg-[#8A5A44] text-white rounded-full text-xs font-semibold cursor-pointer"
                        >
                          Post Review
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
                              <span>Helpful ({rev.helpfulCount || 0})</span>
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
                <div className="p-5 bg-[#FFF8F6] rounded-2xl border border-[#EBC1B6]/70">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#EBC1B6]/40">
                    <div>
                      <h4 className="text-sm font-semibold text-[#724319]">
                        Request Date & Package Proposal
                      </h4>
                      <p className="text-xs text-[#8A5A44]">
                        Direct encrypted inquiry to {vendor.name}
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#8A5A44]">
                      Starting {vendor.startingPrice}
                    </span>
                  </div>

                  <form onSubmit={handleSubmitProposal} className="space-y-3.5 text-xs text-left">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-[#724319]">Your Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Diwata dela Cruz"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          className="w-full px-3 py-2.5 bg-white border border-[#EBC1B6] rounded-xl text-xs text-[#724319] focus:outline-none focus:ring-1 focus:ring-[#8A5A44]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-[#724319]">Email Address</label>
                        <input
                          type="email"
                          required
                          placeholder="diwata@example.com.au"
                          value={userEmail}
                          onChange={(e) => setUserEmail(e.target.value)}
                          className="w-full px-3 py-2.5 bg-white border border-[#EBC1B6] rounded-xl text-xs text-[#724319] focus:outline-none focus:ring-1 focus:ring-[#8A5A44]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-[#724319]">Target Date</label>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full px-3 py-2.5 bg-white border border-[#EBC1B6] rounded-xl text-xs text-[#724319] focus:outline-none focus:ring-1 focus:ring-[#8A5A44] cursor-pointer"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-[#724319]">Guest Count</label>
                        <input
                          type="number"
                          placeholder="Estimated Guests (e.g. 180)"
                          value={guestCount}
                          onChange={(e) => setGuestCount(e.target.value)}
                          className="w-full px-3 py-2.5 bg-white border border-[#EBC1B6] rounded-xl text-xs text-[#724319] focus:outline-none focus:ring-1 focus:ring-[#8A5A44]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-[#724319]">
                        Specific Requests & Cultural Traditions
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Tell the artisan about your venue, ceremony elements, or desired aesthetic..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#EBC1B6] rounded-xl text-xs text-[#724319] focus:outline-none focus:ring-1 focus:ring-[#8A5A44] resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 bg-[#724319] hover:bg-[#8A5A44] text-white font-semibold rounded-full flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-70"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? 'Sending Request...' : 'Send Direct Proposal Request'}</span>
                    </button>
                  </form>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Bottom Bar */}
        <div className="px-6 py-3.5 bg-[#FFF8F6] border-t border-[#EBC1B6]/60 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-1.5 text-[#8A5A44]">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Escrow-Protected Milestone Booking · South Australia</span>
          </div>

          <div className="flex items-center gap-2">
            {activeTab !== 'proposal' && !sent && (
              <button
                onClick={() => setActiveTab('proposal')}
                className="px-4 py-1.5 bg-[#724319] hover:bg-[#8A5A44] text-white font-semibold rounded-full transition-colors cursor-pointer"
              >
                Inquire Now
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-white border border-[#EBC1B6] text-[#724319] font-medium rounded-full hover:bg-[#F2CCC3]/40 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
