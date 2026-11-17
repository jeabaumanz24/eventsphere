import React, { createContext, useContext, useState, useEffect } from 'react';
import { translationsPart1 } from '../data/translationsPart1';
import { translationsPart2 } from '../data/translationsPart2';
import { translationsPart3 } from '../data/translationsPart3';

export type LanguageCode = 'en' | 'it' | 'el' | 'zh' | 'vi' | 'tl' | 'hi';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeName: string;
  flag: string;
  community: string;
}

export const COMMUNITY_LANGUAGES: LanguageOption[] = [
  {
    code: 'en',
    label: 'English',
    nativeName: 'English (AU)',
    flag: '🇦🇺',
    community: 'Standard English',
  },
  {
    code: 'it',
    label: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    community: 'Campbelltown & Norwood',
  },
  {
    code: 'el',
    label: 'Greek',
    nativeName: 'Ελληνικά',
    flag: '🇬🇷',
    community: 'Thebarton & West Torrens',
  },
  {
    code: 'zh',
    label: 'Mandarin',
    nativeName: '中文 (简体)',
    flag: '🇨🇳',
    community: 'Adelaide CBD & East',
  },
  {
    code: 'vi',
    label: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    flag: '🇻🇳',
    community: 'Woodville & Arndale',
  },
  {
    code: 'tl',
    label: 'Filipino / Tagalog',
    nativeName: 'Tagalog',
    flag: '🇵🇭',
    community: 'Prospect & Metro Adelaide',
  },
  {
    code: 'hi',
    label: 'Hindi / South Asian',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    community: 'Northern & Western Adelaide',
  },
];

const translations: Record<string, Record<LanguageCode, string>> = {
  ...translationsPart1,
  ...translationsPart2,
  ...translationsPart3,
};

interface LanguageContextType {
  currentLanguage: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  currentLanguageOption: LanguageOption;
  t: (key: string, vars?: Record<string, string | number>) => string;
  tFor: (lang: LanguageCode, key: string, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');

  // Load saved preference if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem('eventsphere_lang') as LanguageCode;
      if (saved && COMMUNITY_LANGUAGES.some((l) => l.code === saved)) {
        setCurrentLanguage(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  // Keep <html lang="..."> synchronized with selected community language
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = currentLanguage;
    }
  }, [currentLanguage]);

  const handleSetLanguage = (lang: LanguageCode) => {
    setCurrentLanguage(lang);
    try {
      localStorage.setItem('eventsphere_lang', lang);
    } catch {
      // ignore
    }
  };

  const tFor = (lang: LanguageCode, key: string, vars?: Record<string, string | number>): string => {
    let text =
      (translations[key] && translations[key][lang]) ||
      (translations[key] && translations[key]['en']) ||
      key;

    if (vars) {
      for (const [varKey, varVal] of Object.entries(vars)) {
        text = text.replace(new RegExp(`\\{${varKey}\\}`, 'g'), String(varVal));
      }
    }
    return text;
  };

  const t = (key: string, vars?: Record<string, string | number>): string =>
    tFor(currentLanguage, key, vars);

  const currentLanguageOption =
    COMMUNITY_LANGUAGES.find((l) => l.code === currentLanguage) || COMMUNITY_LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage: handleSetLanguage,
        currentLanguageOption,
        t,
        tFor,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
