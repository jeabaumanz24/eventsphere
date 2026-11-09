import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import logoImg from '../assets/images/eventsphere_logo_transparent.png';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

interface NavbarProps {
  onGetStarted: () => void;
  onLanguageChange?: (langName: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onGetStarted, onLanguageChange }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['home', 'about', 'services', 'ai-planner', 'marketplace', 'blog', 'contact'];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: t('nav.home'), href: '#home', id: 'home' },
    { label: t('nav.about'), href: '#about', id: 'about' },
    { label: t('nav.services'), href: '#services', id: 'services' },
    { label: t('nav.aiPlanner'), href: '#ai-planner', id: 'ai-planner' },
    { label: t('nav.marketplace'), href: '#marketplace', id: 'marketplace' },
    { label: t('nav.blog'), href: '#blog', id: 'blog' },
    { label: t('nav.contact'), href: '#contact', id: 'contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FFF8F6]/95 backdrop-blur-md shadow-sm border-b border-[#EBC1B6]/60 py-3'
          : 'bg-[#FFF8F6]/80 backdrop-blur-sm py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar Contract: Zone 1 (Wordmark) — Zone 2 (Nav Links) — Zone 3 (Language Switcher + Primary CTA) */}
        <div className="flex items-center justify-between gap-6 lg:gap-8">
          {/* Zone 1: Brand wordmark (single element in display face) */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="flex items-center gap-2.5 group text-2xl font-serif font-bold text-[#724319] tracking-tight whitespace-nowrap shrink-0"
          >
            <div className="w-10 h-10 rounded-full bg-[#F2CCC3]/60 border border-[#8A5A44]/25 flex items-center justify-center p-1 shadow-xs group-hover:scale-105 transition-transform overflow-hidden">
              <img
                src={logoImg}
                alt="EventSphere Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span>EventSphere</span>
          </a>

          {/* Zone 2: 4-7 single-line concise navigation links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-[13px] font-medium text-[#724319]/80">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`transition-colors whitespace-nowrap shrink-0 relative py-1 ${
                    isActive ? 'text-[#724319] font-semibold' : 'hover:text-[#724319]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8A5A44] rounded-full animate-fadeIn" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Zone 3: Language Switcher Dropdown + 1 primary action */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <LanguageSwitcher onLanguageChange={onLanguageChange} />
            <button
              onClick={onGetStarted}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#724319] hover:bg-[#8A5A44] rounded-full shadow-xs hover:shadow-md transition-all active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>{t('nav.getStarted')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile controls */}
          <div className="flex lg:hidden items-center gap-2">
            <LanguageSwitcher onLanguageChange={onLanguageChange} />
            <button
              onClick={onGetStarted}
              className="px-3 py-1.5 text-xs font-medium text-white bg-[#724319] rounded-full shrink-0"
            >
              {t('nav.getStarted')}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-[#724319] hover:bg-[#EBC1B6]/30 rounded-lg transition-colors cursor-pointer shrink-0"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-[#EBC1B6]/40 pb-4 space-y-1 bg-[#FFF8F6] rounded-2xl p-4 shadow-lg border">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="block px-3 py-2 text-sm font-medium text-[#724319] hover:bg-[#F2CCC3]/40 rounded-xl transition-colors"
              >
                {link.label}
              </a>
            ))}

            {/* Mobile Community Language Selector */}
            <LanguageSwitcher
              isMobile={true}
              onLanguageChange={(langName) => {
                setMobileMenuOpen(false);
                if (onLanguageChange) onLanguageChange(langName);
              }}
            />

            <div className="pt-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onGetStarted();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#724319] rounded-xl cursor-pointer"
              >
                <span>{t('nav.getStarted')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
