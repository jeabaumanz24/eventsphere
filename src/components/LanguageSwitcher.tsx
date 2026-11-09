import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage, COMMUNITY_LANGUAGES, LanguageCode } from '../context/LanguageContext';

interface LanguageSwitcherProps {
  isMobile?: boolean;
  onLanguageChange?: (langName: string) => void;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  isMobile = false,
  onLanguageChange,
}) => {
  const { currentLanguage, setLanguage, currentLanguageOption, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleSelect = (code: LanguageCode, nativeName: string) => {
    setLanguage(code);
    setIsOpen(false);
    if (onLanguageChange) {
      onLanguageChange(nativeName);
    }
  };

  if (isMobile) {
    return (
      <div className="pt-2 border-t border-[#EBC1B6]/40 mt-3">
        <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-[#8A5A44] uppercase tracking-wider">
          <Globe className="w-3.5 h-3.5 text-[#8A5A44]" />
          <span>{t('lang.selectCommunity')}</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 mt-2 px-1">
          {COMMUNITY_LANGUAGES.map((lang) => {
            const isActive = currentLanguage === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code, lang.nativeName)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-colors text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#724319] text-white font-medium shadow-xs'
                    : 'bg-white hover:bg-[#F2CCC3]/40 text-[#724319] border border-[#EBC1B6]/50'
                }`}
              >
                <span className="text-sm shrink-0">{lang.flag}</span>
                <span className="truncate">{lang.nativeName}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#724319] hover:text-[#724319] bg-white/80 hover:bg-white border border-[#EBC1B6] hover:border-[#8A5A44] rounded-full shadow-2xs hover:shadow-xs transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Change community language"
      >
        <Globe className="w-3.5 h-3.5 text-[#8A5A44] shrink-0" />
        <span className="text-xs shrink-0">{currentLanguageOption.flag}</span>
        <span className="font-semibold">{currentLanguageOption.code.toUpperCase()}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#8A5A44] transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#EBC1B6] p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-[#EBC1B6]/50 mb-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-serif font-bold text-[#724319]">
                Adelaide Community Languages
              </span>
              <span className="text-[10px] text-[#8A5A44] font-mono">SA Census</span>
            </div>
            <p className="text-[11px] text-[#724319]/70 leading-tight mt-0.5">
              Select your language for tailored multicultural planning.
            </p>
          </div>

          <div className="max-h-72 overflow-y-auto space-y-0.5 py-1 scrollbar-thin">
            {COMMUNITY_LANGUAGES.map((lang) => {
              const isActive = currentLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code, lang.nativeName)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-all cursor-pointer group ${
                    isActive
                      ? 'bg-[#F2CCC3]/50 text-[#724319] font-semibold'
                      : 'hover:bg-[#FFF8F6] text-[#724319]/85'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base shrink-0">{lang.flag}</span>
                    <div className="truncate">
                      <div className="font-medium text-[#724319] group-hover:text-[#724319] flex items-center gap-1.5">
                        <span>{lang.nativeName}</span>
                        {lang.code !== 'en' && (
                          <span className="text-[10px] text-[#8A5A44] font-normal">
                            ({lang.label})
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#8A5A44]/75 truncate">
                        {lang.community}
                      </div>
                    </div>
                  </div>
                  {isActive && (
                    <div className="w-5 h-5 rounded-full bg-[#724319] text-white flex items-center justify-center shrink-0 ml-2">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
