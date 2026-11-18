import React from 'react';
import { Instagram, Facebook, Linkedin, Pin as Pinterest, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getPageHref } from '../utils/navigation';

const logoImg = `${import.meta.env.BASE_URL}assets/aistudio/a_clean_minimal_graphic_logo_image_on_a_transpare_861d7c48.png`;

interface FooterProps {
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacy, onOpenTerms }) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#FFF8F6] border-t border-[#EBC1B6] pt-16 pb-12 text-[#724319] print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#EBC1B6]/60">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <a
              href={getPageHref('home')}
              className="inline-flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#724319] rounded-xl"
            >
              <div className="h-12 w-[72px] sm:h-14 sm:w-20 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105">
                <img
                  src={logoImg}
                  alt="EventSphere Logo"
                  className="w-full h-full object-contain animate-logo-float"
                />
              </div>
              <span className="text-2xl font-serif font-bold text-[#724319] tracking-tight">
                EventSphere
              </span>
            </a>
            <p className="text-xs text-[#724319]/80 max-w-sm leading-relaxed">
              {t('footer.tagline')}
            </p>
            <div className="pt-2 text-[11px] text-[#8A5A44]">
              <span>{t('footer.kaurna')}</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8A5A44] mb-4">
              {t('footer.explore')}
            </h3>
            <ul className="space-y-2.5 text-xs text-[#724319]/80">
              <li>
                <a
                  href={getPageHref('home')}
                  className="hover:text-[#724319] transition-colors"
                >
                  {t('nav.home')}
                </a>
              </li>
              <li>
                <a
                  href={getPageHref('about')}
                  className="hover:text-[#724319] transition-colors"
                >
                  {t('footer.aboutLink')}
                </a>
              </li>
              <li>
                <a
                  href={getPageHref('services')}
                  className="hover:text-[#724319] transition-colors"
                >
                  {t('nav.services')}
                </a>
              </li>
              <li>
                <a
                  href={getPageHref('ai-planner')}
                  className="hover:text-[#724319] transition-colors"
                >
                  {t('nav.aiPlanner')}
                </a>
              </li>
              <li>
                <a
                  href={getPageHref('vendors')}
                  className="hover:text-[#724319] transition-colors"
                >
                  {t('nav.marketplace')}
                </a>
              </li>
            </ul>
          </div>

          {/* Resources & Editorial */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8A5A44] mb-4">
              {t('footer.resources')}
            </h3>
            <ul className="space-y-2.5 text-xs text-[#724319]/80">
              <li>
                <a
                  href={getPageHref('blog')}
                  className="hover:text-[#724319] transition-colors"
                >
                  {t('footer.blogEditorial')}
                </a>
              </li>
              <li>
                <a
                  href={getPageHref('ai-planner', '#faq')}
                  className="hover:text-[#724319] transition-colors"
                >
                  {t('footer.faqLink')}
                </a>
              </li>
              <li>
                <a
                  href={getPageHref('vendor-insights')}
                  className="hover:text-[#724319] transition-colors"
                >
                  {t('nav.forVendors')}
                </a>
              </li>
              <li>
                <a
                  href={getPageHref('join-as-a-vendor')}
                  className="hover:text-[#724319] transition-colors"
                >
                  {t('nav.joinVendor')}
                </a>
              </li>
              <li>
                <a
                  href={getPageHref('contact')}
                  className="hover:text-[#724319] transition-colors"
                >
                  {t('footer.contactSupport')}
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenPrivacy}
                  className="hover:text-[#724319] transition-colors cursor-pointer text-left"
                >
                  {t('footer.privacy')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenTerms}
                  className="hover:text-[#724319] transition-colors cursor-pointer text-left"
                >
                  {t('footer.terms')}
                </button>
              </li>
            </ul>
          </div>

          {/* Social Channels */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8A5A44] mb-4">
              {t('footer.followUs')}
            </h3>
            <p className="text-xs text-[#724319]/75 mb-4">{t('footer.followSub')}</p>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white border border-[#EBC1B6] flex items-center justify-center text-[#724319] hover:bg-[#724319] hover:text-white transition-all shadow-xs"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white border border-[#EBC1B6] flex items-center justify-center text-[#724319] hover:bg-[#724319] hover:text-white transition-all shadow-xs"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white border border-[#EBC1B6] flex items-center justify-center text-[#724319] hover:bg-[#724319] hover:text-white transition-all shadow-xs"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white border border-[#EBC1B6] flex items-center justify-center text-[#724319] hover:bg-[#724319] hover:text-white transition-all shadow-xs"
                aria-label="Pinterest"
              >
                <Pinterest className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Prototype Sample Data Notice */}
        <div className="mt-8 rounded-xl bg-[#F2CCC3]/35 border border-[#EBC1B6] px-4 py-2.5 text-center text-xs font-medium text-[#724319]">
          {t('footer.prototypeNote')}
        </div>

        {/* Bottom Bar: Copyright & Location */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#724319]/70">
          <div>{t('footer.copyright')}</div>
          <div className="flex items-center gap-1 text-[11px] text-[#8A5A44]">
            <span>{t('footer.crafted')}</span>
            <Heart className="w-3 h-3 fill-rose-400 text-rose-400 inline" />
            <span>{t('footer.inAdelaide')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
