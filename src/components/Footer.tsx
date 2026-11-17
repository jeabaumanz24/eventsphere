import React from 'react';
import { Instagram, Facebook, Linkedin, Pin as Pinterest, Heart } from 'lucide-react';
import logoImg from '../assets/images/eventsphere_logo_transparent.png';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
  onOpenBlogPage?: () => void;
  onNavigateHomeSection?: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPrivacy,
  onOpenTerms,
  onOpenBlogPage,
  onNavigateHomeSection,
}) => {
  const { t } = useLanguage();

  const scrollTo = (id: string) => {
    if (onNavigateHomeSection) {
      onNavigateHomeSection(id);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#FFF8F6] border-t border-[#EBC1B6] pt-16 pb-12 text-[#724319]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#EBC1B6]/60">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5 group cursor-pointer" onClick={() => scrollTo('home')}>
              <div className="w-10 h-10 rounded-full bg-[#F2CCC3]/60 border border-[#8A5A44]/25 flex items-center justify-center p-1 shadow-xs overflow-hidden">
                <img
                  src={logoImg}
                  alt="Event Sphere Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-2xl font-serif font-bold text-[#724319] tracking-tight">Event Sphere</span>
            </div>
            <p className="text-xs text-[#724319]/80 max-w-sm leading-relaxed">
              {t('footer.tagline')}
            </p>
            <div className="pt-2 text-[11px] text-[#8A5A44]">
              <span>{t('footer.kaurna')}</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A5A44] mb-4">
              {t('footer.explore')}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#724319]/80">
              <li>
                <button onClick={() => scrollTo('home')} className="hover:text-[#724319] transition-colors cursor-pointer">
                  {t('nav.home')}
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('about')} className="hover:text-[#724319] transition-colors cursor-pointer">
                  {t('footer.aboutLink')}
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('services')} className="hover:text-[#724319] transition-colors cursor-pointer">
                  {t('nav.services')}
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('ai-planner')} className="hover:text-[#724319] transition-colors cursor-pointer">
                  {t('nav.aiPlanner')}
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('marketplace')} className="hover:text-[#724319] transition-colors cursor-pointer">
                  {t('nav.marketplace')}
                </button>
              </li>
            </ul>
          </div>

          {/* Resources & Editorial */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A5A44] mb-4">
              {t('footer.resources')}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#724319]/80">
              <li>
                <button
                  onClick={() => (onOpenBlogPage ? onOpenBlogPage() : scrollTo('blog'))}
                  className="hover:text-[#724319] transition-colors cursor-pointer"
                >
                  {t('footer.blogEditorial')}
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('faq')} className="hover:text-[#724319] transition-colors cursor-pointer">
                  {t('footer.faqLink')}
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('contact')} className="hover:text-[#724319] transition-colors cursor-pointer">
                  {t('footer.contactSupport')}
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPrivacy}
                  className="hover:text-[#724319] transition-colors cursor-pointer text-left"
                >
                  {t('footer.privacy')}
                </button>
              </li>
              <li>
                <button
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
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A5A44] mb-4">
              {t('footer.followUs')}
            </h4>
            <p className="text-xs text-[#724319]/75 mb-4">
              {t('footer.followSub')}
            </p>
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

        {/* Bottom Bar: Copyright & Location */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#724319]/70">
          <div>
            {t('footer.copyright')}
          </div>
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
