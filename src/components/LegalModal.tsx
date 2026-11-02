import React from 'react';
import { X, ShieldCheck } from 'lucide-react';

interface LegalModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const isPrivacy = type === 'privacy';
  const title = isPrivacy ? 'Privacy Policy' : 'Terms & Conditions';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl border border-[#EBC1B6] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#FFF8F6] border border-[#EBC1B6] flex items-center justify-center text-[#724319] hover:bg-[#724319] hover:text-white transition-all shadow-sm cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 bg-[#FFF8F6] border-b border-[#EBC1B6]/50">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-4 h-4 text-[#8A5A44]" />
            <span className="text-xs font-semibold uppercase text-[#8A5A44]">EventSphere Governance</span>
          </div>
          <h3 className="text-xl font-serif font-bold text-[#724319]">{title}</h3>
          <p className="text-[11px] text-[#724319]/70 mt-0.5">Last updated: November 2026 · Adelaide, South Australia</p>
        </div>

        <div className="p-6 space-y-3.5 max-h-[60vh] overflow-y-auto text-xs text-[#724319]/80 leading-relaxed">
          {isPrivacy ? (
            <>
              <p>
                At EventSphere Australia Pty Ltd, we respect the cultural traditions and confidential celebration details of our couples and vendors.
              </p>
              <h4 className="font-semibold text-[#724319] text-xs pt-1">1. Information We Collect</h4>
              <p>
                We collect names, contact emails, phone numbers, event locations, cultural requirements, and budget preferences strictly for calculating recommendations and connecting you with authorized vendors.
              </p>
              <h4 className="font-semibold text-[#724319] text-xs pt-1">2. Data Security & Storage</h4>
              <p>
                All data is encrypted in transit and stored in compliance with the Australian Privacy Principles (APPs). We never sell your personal data or celebration details to third-party ad networks.
              </p>
              <h4 className="font-semibold text-[#724319] text-xs pt-1">3. Direct Vendor Communications</h4>
              <p>
                When you request a proposal, only the specific vendor you selected receives your event brief.
              </p>
            </>
          ) : (
            <>
              <p>
                Welcome to EventSphere. By accessing or using our Adelaide event discovery platform, you agree to comply with and be bound by the following terms.
              </p>
              <h4 className="font-semibold text-[#724319] text-xs pt-1">1. Marketplace & Recommendations</h4>
              <p>
                EventSphere acts as an intelligent matchmaker connecting customers with independent South Australian businesses. All contracts and payments are agreed between parties with clear milestone safeguards.
              </p>
              <h4 className="font-semibold text-[#724319] text-xs pt-1">2. Vendor Verification</h4>
              <p>
                All featured vendors hold Australian Business Numbers (ABNs), appropriate public liability insurance, and verified client testimonials.
              </p>
              <h4 className="font-semibold text-[#724319] text-xs pt-1">3. Governing Law</h4>
              <p>
                These terms are governed by the laws of South Australia, Australia.
              </p>
            </>
          )}
        </div>

        <div className="p-4 bg-[#FFF8F6] border-t border-[#EBC1B6]/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#724319] text-white text-xs font-semibold rounded-full hover:bg-[#8A5A44] transition-colors cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
