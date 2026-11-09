import React, { createContext, useContext, useState, useEffect } from 'react';

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

type Translations = Record<string, Record<LanguageCode, string>>;

const translations: Translations = {
  // Navigation
  'nav.home': {
    en: 'Home',
    it: 'Home',
    el: 'Αρχική',
    zh: '首页',
    vi: 'Trang chủ',
    tl: 'Tahanan',
    hi: 'होम',
  },
  'nav.about': {
    en: 'About',
    it: 'Chi Siamo',
    el: 'Σχετικά',
    zh: '关于我们',
    vi: 'Giới thiệu',
    tl: 'Tungkol sa Amin',
    hi: 'हमारे बारे में',
  },
  'nav.services': {
    en: 'Services',
    it: 'Servizi',
    el: 'Υπηρεσίες',
    zh: '核心服务',
    vi: 'Dịch vụ',
    tl: 'Mga Serbisyo',
    hi: 'सेवाएं',
  },
  'nav.aiPlanner': {
    en: 'AI Planner',
    it: 'Planner AI',
    el: 'AI Σχεδιαστής',
    zh: 'AI 策划师',
    vi: 'Công cụ AI',
    tl: 'AI Planner',
    hi: 'एआई प्लानर',
  },
  'nav.marketplace': {
    en: 'Vendor Marketplace',
    it: 'Mercato Fornitori',
    el: 'Αγορά Προμηθευτών',
    zh: '供应商市场',
    vi: 'Thị trường Nhà cung cấp',
    tl: 'Vendor Marketplace',
    hi: 'वेंडर मार्केटप्लेस',
  },
  'nav.blog': {
    en: 'Blog',
    it: 'Blog',
    el: 'Άρθρα',
    zh: '博客指南',
    vi: 'Bài viết',
    tl: 'Blog',
    hi: 'ब्लॉग',
  },
  'nav.contact': {
    en: 'Contact',
    it: 'Contatti',
    el: 'Επικοινωνία',
    zh: '联系我们',
    vi: 'Liên hệ',
    tl: 'Makipag-ugnayan',
    hi: 'संपर्क',
  },
  'nav.getStarted': {
    en: 'Get Started',
    it: 'Inizia Ora',
    el: 'Ξεκινήστε',
    zh: '立即开始',
    vi: 'Bắt đầu',
    tl: 'Magsimula Na',
    hi: 'शुरू करें',
  },

  // Hero Section
  'hero.locationKicker': {
    en: 'Adelaide, South Australia · Next-Gen Celebration Platform',
    it: 'Adelaide, South Australia · Piattaforma Eventi di Nuova Generazione',
    el: 'Αδελαΐδα, Νότια Αυστραλία · Πλατφόρμα Εκδηλώσεων Νέας Γενιάς',
    zh: '南澳大利亚阿德莱德 · 新一代多元文化庆典平台',
    vi: 'Adelaide, Nam Úc · Nền tảng tổ chức sự kiện thế hệ mới',
    tl: 'Adelaide, South Australia · Makabagong Plataporma para sa Pagdiriwang',
    hi: 'एडिलेड, दक्षिण ऑस्ट्रेलिया · अगली पीढ़ी का उत्सव मंच',
  },
  'hero.titleMain': {
    en: 'AI-Powered Event Planning for',
    it: 'Pianificazione Eventi con AI per',
    el: 'Σχεδιασμός Εκδηλώσεων με AI για',
    zh: 'AI智能驱动的高端',
    vi: 'Lập kế hoạch sự kiện thông minh cho',
    tl: 'AI-Powered Pagpaplano para sa',
    hi: 'आधुनिक समारोहों के लिए',
  },
  'hero.titleHighlight': {
    en: 'Modern Celebrations',
    it: 'Celebrazioni Moderne',
    el: 'Σύγχρονες Γιορτές',
    zh: '现代跨文化盛典',
    vi: 'Lễ kỷ niệm Hiện đại',
    tl: 'Makabagong Pagdiriwang',
    hi: 'एआई-संचालित योजना',
  },
  'hero.subtitle': {
    en: 'Discover trusted vendors, plan smarter, and create unforgettable multicultural events with intelligent recommendations and planning tools.',
    it: 'Scopri fornitori fidati, pianifica in modo intelligente e crea eventi multiculturali indimenticabili con raccomandazioni e strumenti AI.',
    el: 'Ανακαλύψτε αξιόπιστους προμηθευτές, σχεδιάστε έξυπνα και δημιουργήστε αξέχαστες πολυπολιτισμικές εκδηλώσεις με ευφυείς συστάσεις.',
    zh: '发现值得信赖的南澳供应商，更智能地规划预算，通过AI精准推荐打造难忘的多元文化婚礼与私人盛典。',
    vi: 'Khám phá các nhà cung cấp đáng tin cậy, lập ngân sách thông minh và tạo nên những sự kiện đa văn hóa khó quên với sự trợ giúp của AI.',
    tl: 'Tumuklas ng mga mapagkakatiwalaang vendor, magplano nang mas matalino, at lumikha ng di-malilimutang multicultural na kasal gamit ang AI.',
    hi: 'विश्वसनीय वेंडरों को खोजें, समझदारी से योजना बनाएं और बुद्धिमान अनुशंसाओं के साथ अविस्मरणीय बहुसांस्कृतिक कार्यक्रम बनाएं।',
  },
  'hero.startPlanning': {
    en: 'Start Planning',
    it: 'Inizia a Pianificare',
    el: 'Έναρξη Σχεδιασμού',
    zh: '开始智能规划',
    vi: 'Bắt đầu Lập kế hoạch',
    tl: 'Simulan ang Pagpaplano',
    hi: 'योजना शुरू करें',
  },
  'hero.exploreVendors': {
    en: 'Explore Vendors',
    it: 'Esplora i Fornitori',
    el: 'Εξερεύνηση Προμηθευτών',
    zh: '探索优质供应商',
    vi: 'Khám phá Nhà cung cấp',
    tl: 'Tingnan ang mga Vendor',
    hi: 'वेंडर देखें',
  },
  'hero.trust1': {
    en: '100% Verified Adelaide Vendors',
    it: '100% Fornitori Verificati di Adelaide',
    el: '100% Επαληθευμένοι Προμηθευτές Αδελαΐδας',
    zh: '100% 阿德莱德实名认证供应商',
    vi: '100% Nhà cung cấp Adelaide đã xác minh',
    tl: '100% Beripikadong Vendor sa Adelaide',
    hi: '100% सत्यापित एडिलेड वेंडर',
  },
  'hero.trust2': {
    en: 'Multicultural Traditions Welcomed',
    it: 'Tradizioni Multiculturali Accolte',
    el: 'Σεβασμός στις Πολυπολιτισμικές Παραδόσεις',
    zh: '深谙多元文化礼俗与仪式',
    vi: 'Tôn vinh mọi truyền thống đa văn hóa',
    tl: 'Iginagalang ang Tradisyong Kultural',
    hi: 'बहुसांस्कृतिक परंपराओं का सम्मान',
  },
  'hero.trust3': {
    en: 'Zero Hidden Commissions',
    it: 'Zero Commissioni Nascoste',
    el: 'Χωρίς Κρυφές Προμήθειες',
    zh: '零隐形差价与中间佣金',
    vi: 'Không chi phí ẩn',
    tl: 'Walang Nakatagong Bayarin',
    hi: 'कोई छिपा हुआ शुल्क नहीं',
  },

  // Stats Section
  'stats.stat1': {
    en: 'Verified Vendors',
    it: 'Fornitori Verificati',
    el: 'Επαληθευμένοι Προμηθευτές',
    zh: '认证优质供应商',
    vi: 'Nhà cung cấp đã kiểm duyệt',
    tl: 'Beripikadong Vendor',
    hi: 'सत्यापित वेंडर',
  },
  'stats.stat2': {
    en: 'Events Planned',
    it: 'Eventi Pianificati',
    el: 'Εκδηλώσεις Σχεδιασμένες',
    zh: '已筹备盛典场次',
    vi: 'Sự kiện đã lên kế hoạch',
    tl: 'Mga Nakaplanong Kaganapan',
    hi: 'आयोजित कार्यक्रम',
  },
  'stats.stat3': {
    en: 'Cultural Categories',
    it: 'Categorie Culturali',
    el: 'Πολιτιστικές Κατηγορίες',
    zh: '覆盖文化礼俗门类',
    vi: 'Hạng mục Văn hóa',
    tl: 'Kategoryang Kultural',
    hi: 'सांस्कृतिक श्रेणियां',
  },
  'stats.stat4': {
    en: 'Customer Satisfaction',
    it: 'Soddisfazione Clienti',
    el: 'Ικανοποίηση Πελατών',
    zh: '客户好评满意率',
    vi: 'Hài lòng của khách hàng',
    tl: 'Kasiyahan ng Kustomer',
    hi: 'ग्राहक संतुष्टि',
  },

  // Language dropdown UI labels
  'lang.selectCommunity': {
    en: 'Community Language',
    it: 'Lingua della Comunità',
    el: 'Γλώσσα Κοινότητας',
    zh: '社区语言切换',
    vi: 'Ngôn ngữ cộng đồng',
    tl: 'Wika ng Komunidad',
    hi: 'सामुदायिक भाषा',
  },
  'lang.adelaideHub': {
    en: 'Adelaide Multicultural Hub',
    it: 'Hub Multiculturale di Adelaide',
    el: 'Πολυπολιτισμικός Κόμβος Αδελαΐδας',
    zh: '阿德莱德多元文化中心',
    vi: 'Trung tâm Đa văn hóa Adelaide',
    tl: 'Multicultural Hub ng Adelaide',
    hi: 'एडिलेड बहुसांस्कृतिक केंद्र',
  },
};

interface LanguageContextType {
  currentLanguage: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  currentLanguageOption: LanguageOption;
  t: (key: string) => string;
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

  const handleSetLanguage = (lang: LanguageCode) => {
    setCurrentLanguage(lang);
    try {
      localStorage.setItem('eventsphere_lang', lang);
    } catch {
      // ignore
    }
  };

  const t = (key: string): string => {
    if (translations[key] && translations[key][currentLanguage]) {
      return translations[key][currentLanguage];
    }
    // Fallback to English
    if (translations[key] && translations[key]['en']) {
      return translations[key]['en'];
    }
    return key;
  };

  const currentLanguageOption =
    COMMUNITY_LANGUAGES.find((l) => l.code === currentLanguage) || COMMUNITY_LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage: handleSetLanguage,
        currentLanguageOption,
        t,
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
