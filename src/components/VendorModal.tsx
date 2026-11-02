import React, { useState } from 'react';
import { X, Star, MapPin, CheckCircle2, ShieldCheck, Send, Calendar, Clock, DollarSign } from 'lucide-react';
import { Vendor } from '../types';

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

  const [date, setDate] = useState('');
  const [guestCount, setGuestCount] = useState('150');
  const [message, setMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-[#EBC1B6] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#724319] hover:bg-white hover:text-black transition-all shadow-md cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Hero Image */}
        <div className="relative h-56 sm:h-64 bg-[#F2CCC3] overflow-hidden">
          <img
            src={vendor.image}
            alt={vendor.businessName}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <span className="text-[11px] font-semibold bg-white/90 text-[#724319] px-2.5 py-0.5 rounded-full inline-block mb-1.5 shadow-xs">
              {vendor.category}
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold leading-tight">
              {vendor.businessName}
            </h3>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/90 mt-1">
              <span>Lead: {vendor.name}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 inline" />
                {vendor.rating.toFixed(2)} ({vendor.reviewCount} reviews)
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 inline" />
                {vendor.location}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[calc(85vh-16rem)] overflow-y-auto">
          {sent ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#F2CCC3] flex items-center justify-center text-[#724319] mx-auto">
                <CheckCircle2 className="w-8 h-8 text-[#724319]" />
              </div>
              <h4 className="text-xl font-serif font-bold text-[#724319]">
                Inquiry Sent to {vendor.name}!
              </h4>
              <p className="text-xs text-[#724319]/80 max-w-sm mx-auto">
                Your event brief has been dispatched directly. {vendor.name} will review availability for your date and respond through your EventSphere portal.
              </p>
            </div>
          ) : (
            <>
              {/* Description & Cultural Specialties */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A5A44] mb-2">
                  Artisan Overview
                </h4>
                <p className="text-xs sm:text-sm text-[#724319]/85 leading-relaxed">
                  {vendor.description}
                </p>
              </div>

              {/* Cultural Specialties */}
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

              {/* Package Features */}
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

              {/* Fast Quote Form */}
              <div className="p-5 bg-[#FFF8F6] rounded-2xl border border-[#EBC1B6]/70">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#EBC1B6]/40">
                  <h4 className="text-sm font-semibold text-[#724319]">
                    Request Custom Date & Pricing Proposal
                  </h4>
                  <span className="text-xs font-mono font-bold text-[#8A5A44]">
                    Starting {vendor.startingPrice}
                  </span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3.5 text-xs text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-[#EBC1B6] rounded-xl text-xs text-[#724319] focus:outline-none focus:ring-1 focus:ring-[#8A5A44]"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Your Email Address"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-[#EBC1B6] rounded-xl text-xs text-[#724319] focus:outline-none focus:ring-1 focus:ring-[#8A5A44]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-[#EBC1B6] rounded-xl text-xs text-[#724319] focus:outline-none focus:ring-1 focus:ring-[#8A5A44]"
                    />
                    <input
                      type="number"
                      placeholder="Estimated Guests (e.g. 180)"
                      value={guestCount}
                      onChange={(e) => setGuestCount(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-[#EBC1B6] rounded-xl text-xs text-[#724319] focus:outline-none focus:ring-1 focus:ring-[#8A5A44]"
                    />
                  </div>

                  <textarea
                    rows={2}
                    placeholder="Specific requests, cultural customs, or venue location..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#EBC1B6] rounded-xl text-xs text-[#724319] focus:outline-none focus:ring-1 focus:ring-[#8A5A44] resize-none"
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 bg-[#724319] hover:bg-[#8A5A44] text-white font-semibold rounded-full flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Sending Request...' : 'Send Direct Proposal Request'}</span>
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
