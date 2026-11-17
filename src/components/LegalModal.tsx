import React from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface LegalModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  const { t } = useLanguage();
  if (!type) return null;

  const isPrivacy = type === 'privacy';
  const title = isPrivacy ? t('footer.privacy') : t('footer.terms');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl border border-[#EBC1B6] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#FFF8F6] border border-[#EBC1B6] flex items-center justify-center text-[#724319] hover:bg-[#724319] hover:text-white transition-all shadow-sm cursor-pointer"
          aria-label={t('vendorModal.close')}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 bg-[#FFF8F6] border-b border-[#EBC1B6]/50">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-4 h-4 text-[#8A5A44]" />
            <span className="text-xs font-semibold uppercase text-[#8A5A44]">{t('legal.governance')}</span>
          </div>
          <h3 className="text-xl font-serif font-bold text-[#724319]">{title}</h3>
          <p className="text-[11px] text-[#724319]/70 mt-0.5">{t('legal.updated')}</p>
        </div>

        <div className="p-6 space-y-3.5 max-h-[60vh] overflow-y-auto text-xs text-[#724319]/80 leading-relaxed">
          {isPrivacy ? (
            <>
              <p>{t('legal.privacyIntro')}</p>
              <h4 className="font-semibold text-[#724319] text-xs pt-1">{t('legal.privacyH1')}</h4>
              <p>{t('legal.privacyP1')}</p>
              <h4 className="font-semibold text-[#724319] text-xs pt-1">{t('legal.privacyH2')}</h4>
              <p>{t('legal.privacyP2')}</p>
              <h4 className="font-semibold text-[#724319] text-xs pt-1">{t('legal.privacyH3')}</h4>
              <p>{t('legal.privacyP3')}</p>
            </>
          ) : (
            <>
              <p>{t('legal.termsIntro')}</p>
              <h4 className="font-semibold text-[#724319] text-xs pt-1">{t('legal.termsH1')}</h4>
              <p>{t('legal.termsP1')}</p>
              <h4 className="font-semibold text-[#724319] text-xs pt-1">{t('legal.termsH2')}</h4>
              <p>{t('legal.termsP2')}</p>
              <h4 className="font-semibold text-[#724319] text-xs pt-1">{t('legal.termsH3')}</h4>
              <p>{t('legal.termsP3')}</p>
            </>
          )}
        </div>

        <div className="p-4 bg-[#FFF8F6] border-t border-[#EBC1B6]/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#724319] text-white text-xs font-semibold rounded-full hover:bg-[#8A5A44] transition-colors cursor-pointer"
          >
            {t('legal.understand')}
          </button>
        </div>
      </div>
    </div>
  );
};
