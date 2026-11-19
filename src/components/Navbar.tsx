import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Heart } from 'lucide-react';
import { useLanguage, LanguageCode } from '../context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { PageId } from '../types';
import { getPageHref } from '../utils/navigation';

const logoImg = `${import.meta.env.BASE_URL}assets/aistudio/a_clean_minimal_graphic_logo_image_on_a_transpare_861d7c48.png`;

interface NavbarProps {
  currentPage: PageId;
  hideGetStarted?: boolean;
  onLanguageChange?: (langName: string, langCode?: LanguageCode) => void;
  wishlistCount?: number;
  onOpenWishlist?: () => void;
}

const NAV_ITEMS: Array<{ id: PageId; labelKey: string }> = [
  { id: 'home', labelKey: 'nav.home' },
  { id: 'about', labelKey: 'nav.about' },
  { id: 'services', labelKey: 'nav.services' },
  { id: 'ai-planner', labelKey: 'nav.aiPlanner' },
  { id: 'vendors', labelKey: 'nav.marketplace' },
  { id: 'blog', labelKey: 'nav.blog' },
  { id: 'vendor-insights', labelKey: 'nav.forVendors' },
  { id: 'contact', labelKey: 'nav.contact' },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  hideGetStarted = false,
  onLanguageChange,
  wishlistCount = 0,
  onOpenWishlist,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [mobileMenuOpen]);

  const aiPlannerHref = getPageHref('ai-planner');
  const homeHref = getPageHref('home');
  const showGetStarted =
    !hideGetStarted &&
    currentPage !== 'ai-planner' &&
    currentPage !== 'vendor-insights';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 print:hidden ${
        isScrolled
          ? 'bg-[#FFF8F6]/95 backdrop-blur-md shadow-sm border-b border-[#EBC1B6]/60 py-3'
          : 'bg-[#FFF8F6]/80 backdrop-blur-sm py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar Contract: Zone 1 (Wordmark) — Zone 2 (Nav Links) — Zone 3 (Language Switcher + Floating Wishlist + Primary CTA) */}
        <div className="flex items-center justify-between gap-3 lg:gap-4 xl:gap-8">
          {/* Zone 1: Brand wordmark */}
          <a
            href={homeHref}
            className="flex items-center gap-2 sm:gap-2.5 group text-lg sm:text-2xl font-serif font-bold text-[#724319] tracking-tight whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#724319] rounded-xl"
          >
            <div className="h-14 w-[84px] sm:h-16 sm:w-24 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <img
                src={logoImg}
                alt="EventSphere Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span>EventSphere</span>
          </a>

          {/* Zone 2: Real multi-page navigation links */}
          <nav
            aria-label="Main navigation"
            className="hidden lg:flex items-center gap-2.5 xl:gap-5 text-[12.5px] xl:text-[13px] font-medium text-[#724319]/80"
          >
            {NAV_ITEMS.map((item) => {
              const isForVendors = item.id === 'vendor-insights';
              const isActive =
                currentPage === item.id ||
                (isForVendors && currentPage === 'join-as-a-vendor');
              if (isForVendors) {
                return (
                  <div key={item.id} className="relative group/vendors shrink-0">
                    <a
                      href={getPageHref(item.id)}
                      aria-current={currentPage === 'vendor-insights' ? 'page' : undefined}
                      className={`transition-colors whitespace-nowrap shrink-0 relative py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#724319] rounded-md px-1 inline-block ${
                        isActive ? 'text-[#724319] font-semibold' : 'hover:text-[#724319]'
                      }`}
                    >
                      {t(item.labelKey)}
                      {isActive && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8A5A44] rounded-full animate-fadeIn" />
                      )}
                    </a>
                    <div className="invisible opacity-0 group-hover/vendors:visible group-hover/vendors:opacity-100 group-focus-within/vendors:visible group-focus-within/vendors:opacity-100 transition-all duration-150 absolute left-0 top-full pt-2 z-50">
                      <div className="w-48 rounded-2xl bg-white border border-[#EBC1B6] shadow-lg p-1.5 space-y-0.5">
                        <a
                          href={getPageHref('vendor-insights')}
                          aria-current={currentPage === 'vendor-insights' ? 'page' : undefined}
                          className={`block px-3 py-2 rounded-xl text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#724319] ${
                            currentPage === 'vendor-insights'
                              ? 'bg-[#F2CCC3]/50 text-[#724319] font-semibold'
                              : 'text-[#724319] hover:bg-[#FFF8F6]'
                          }`}
                        >
                          Vendor Insights
                        </a>
                        <a
                          href={getPageHref('join-as-a-vendor')}
                          aria-current={currentPage === 'join-as-a-vendor' ? 'page' : undefined}
                          className={`block px-3 py-2 rounded-xl text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#724319] ${
                            currentPage === 'join-as-a-vendor'
                              ? 'bg-[#F2CCC3]/50 text-[#724319] font-semibold'
                              : 'text-[#724319] hover:bg-[#FFF8F6]'
                          }`}
                        >
                          {t('nav.joinVendor')}
                        </a>
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <a
                  key={item.id}
                  href={getPageHref(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`transition-colors whitespace-nowrap shrink-0 relative py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#724319] rounded-md px-1 ${
                    isActive ? 'text-[#724319] font-semibold' : 'hover:text-[#724319]'
                  }`}
                >
                  {t(item.labelKey)}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8A5A44] rounded-full animate-fadeIn" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Zone 3: Language Switcher + Floating Wishlist Heart Button + Primary CTA */}
          <div className="hidden lg:flex items-center gap-2.5 xl:gap-3 shrink-0">
            <LanguageSwitcher onLanguageChange={onLanguageChange} />
            {onOpenWishlist && (
              <button
                type="button"
                onClick={onOpenWishlist}
                className="relative w-10 h-10 rounded-full bg-white hover:bg-[#FFF8F6] border border-[#EBC1B6] hover:border-[#8A5A44] shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center text-[#724319] cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#724319]"
                aria-label={t('wishlist.headerBtnAria', { count: wishlistCount })}
                title={t('wishlist.headerBtnTooltip', { count: wishlistCount })}
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${
                    wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : 'text-[#724319]'
                  }`}
                />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs ring-2 ring-[#FFF8F6] tabular-nums">
                    {wishlistCount}
                  </span>
                )}
              </button>
            )}
            {showGetStarted && (
              <a
                href={aiPlannerHref}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#724319] hover:bg-[#8A5A44] rounded-full shadow-xs hover:shadow-md transition-all active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#724319]"
              >
                <span>{t('nav.getStarted')}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Mobile controls */}
          <div className="flex lg:hidden items-center gap-1.5 sm:gap-2">
            <LanguageSwitcher onLanguageChange={onLanguageChange} />
            {onOpenWishlist && (
              <button
                type="button"
                onClick={onOpenWishlist}
                className="relative w-9 h-9 rounded-full bg-white hover:bg-[#FFF8F6] border border-[#EBC1B6] shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center text-[#724319] cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#724319]"
                aria-label={t('wishlist.headerBtnAria', { count: wishlistCount })}
                title={t('wishlist.headerBtnTooltip', { count: wishlistCount })}
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${
                    wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : 'text-[#724319]'
                  }`}
                />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs ring-2 ring-[#FFF8F6] tabular-nums">
                    {wishlistCount}
                  </span>
                )}
              </button>
            )}
            {showGetStarted && (
              <a
                href={aiPlannerHref}
                className="hidden sm:inline-flex px-3 py-1.5 text-xs font-medium text-white bg-[#724319] rounded-full shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#724319]"
              >
                {t('nav.getStarted')}
              </a>
            )}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-[#724319] hover:bg-[#EBC1B6]/30 rounded-lg transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#724319]"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer menu */}
        {mobileMenuOpen && (
          <nav
            id="mobile-navigation-drawer"
            aria-label="Mobile navigation"
            className="lg:hidden mt-3 pt-3 border-t border-[#EBC1B6]/40 pb-4 space-y-1 bg-[#FFF8F6] rounded-2xl p-4 shadow-lg border"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <React.Fragment key={item.id}>
                  <a
                    href={getPageHref(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2 text-sm font-medium rounded-xl transition-colors ${
                      isActive
                        ? 'bg-[#F2CCC3]/50 text-[#724319] font-semibold'
                        : 'text-[#724319] hover:bg-[#F2CCC3]/40'
                    }`}
                  >
                    {t(item.labelKey)}
                  </a>
                  {item.id === 'vendor-insights' && (
                    <a
                      href={getPageHref('join-as-a-vendor')}
                      aria-current={currentPage === 'join-as-a-vendor' ? 'page' : undefined}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block pl-6 pr-3 py-2 text-xs font-medium rounded-xl transition-colors ${
                        currentPage === 'join-as-a-vendor'
                          ? 'bg-[#F2CCC3]/50 text-[#724319] font-semibold'
                          : 'text-[#724319]/90 hover:bg-[#F2CCC3]/40'
                      }`}
                    >
                      {t('nav.joinVendor')}
                    </a>
                  )}
                </React.Fragment>
              );
            })}

            {/* Mobile Community Language Selector */}
            <LanguageSwitcher
              isMobile={true}
              onLanguageChange={(langName, langCode) => {
                setMobileMenuOpen(false);
                if (onLanguageChange) onLanguageChange(langName, langCode);
              }}
            />

            {showGetStarted && (
              <div className="pt-3">
                <a
                  href={aiPlannerHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#724319] rounded-xl cursor-pointer"
                >
                  <span>{t('nav.getStarted')}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};
