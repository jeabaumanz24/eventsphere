import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Sparkles,
  MessageCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  MapPin,
  Clock,
  Star,
  AlertCircle,
} from 'lucide-react';
import { howItWorksSteps, vendorsData } from '../data/mockData';
import { CulturalTradition, EventTypeTag, PlanPreviewContextData, Vendor } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { trackEvent } from '../utils/analytics';
import { getPageHref } from '../utils/navigation';
import { getEventSlug, marketplaceTraditionToSlug } from '../utils/plannerMatching';
import { PlanSummaryActions } from './PlanSummaryActions';
import { VendorImage } from './VendorImage';

type HeadcountOption = 'Under 30' | '30-60' | '60-100' | '100-200' | '200+';

type LocationOption =
  | 'Adelaide CBD'
  | 'Adelaide Hills'
  | 'Barossa'
  | 'McLaren Vale'
  | 'Fleurieu Peninsula'
  | 'Glenelg and beaches'
  | 'Northern suburbs'
  | 'Southern suburbs';

type BudgetOption =
  | ''
  | 'under-2500'
  | '2500-5000'
  | '5000-12000'
  | '12000-25000'
  | '25000-plus';

type TraditionDropdownValue = CulturalTradition | 'Other or Fusion';

interface CulturalChipOption {
  id: string;
  label: string;
  keywords: string[];
  preferredCategories: string[];
  tradition?: CulturalTradition;
  defaultSelected?: boolean;
}

interface MatchedPackageItem {
  vendor: Vendor;
  fitScore: number;
  unitPriceLabel: string;
  scaledEstimate: number;
  scaledPriceSummary: string;
  matchedChips: CulturalChipOption[];
  quoteLineItems: string[];
}

const EVENT_TYPE_OPTIONS: EventTypeTag[] = [
  'Diwali & Festival of Lights',
  'Lunar New Year',
  'Eid',
  'Milestone Birthdays',
  'Weddings',
  'Engagements & Proposals',
  'Elopements',
  'Christenings & Baby Showers',
  'Graduations',
  'Community Festivals',
  'Corporate Events',
];

const SPECIFIC_TRADITIONS: CulturalTradition[] = [
  'Filipino',
  'Greek',
  'Indian',
  'Chinese',
  'Italian',
  'Middle Eastern or Muslim',
  'Pacific Islander',
  'Vietnamese',
  'Korean',
];

const TRADITION_DROPDOWN_OPTIONS: TraditionDropdownValue[] = [
  ...SPECIFIC_TRADITIONS,
  'Other or Fusion',
];

const HEADCOUNT_OPTIONS: { value: HeadcountOption; midpoint: number; looks: number }[] = [
  { value: 'Under 30', midpoint: 20, looks: 1 },
  { value: '30-60', midpoint: 45, looks: 2 },
  { value: '60-100', midpoint: 80, looks: 3 },
  { value: '100-200', midpoint: 150, looks: 4 },
  { value: '200+', midpoint: 240, looks: 5 },
];

const LOCATION_OPTIONS: LocationOption[] = [
  'Adelaide CBD',
  'Adelaide Hills',
  'Barossa',
  'McLaren Vale',
  'Fleurieu Peninsula',
  'Glenelg and beaches',
  'Northern suburbs',
  'Southern suburbs',
];

const BUDGET_OPTIONS: { value: BudgetOption; label: string; maxAud: number }[] = [
  { value: 'under-2500', label: 'Under $2,500 AUD', maxAud: 2500 },
  { value: '2500-5000', label: '$2,500 – $5,000 AUD', maxAud: 5000 },
  { value: '5000-12000', label: '$5,000 – $12,000 AUD', maxAud: 12000 },
  { value: '12000-25000', label: '$12,000 – $25,000 AUD', maxAud: 25000 },
  { value: '25000-plus', label: '$25,000+ AUD', maxAud: 60000 },
];

const SERVICE_TIME_OPTIONS = [
  '12:30 PM Daytime Service',
  '5:15 PM Sunset Slot',
  '6:30 PM Evening Reception',
  '7:30 PM Late Gala',
];

const DEFAULT_SERVICE_TIME: Record<EventTypeTag, string> = {
  'Diwali & Festival of Lights': '6:30 PM Evening Reception',
  'Lunar New Year': '6:30 PM Evening Reception',
  Eid: '6:30 PM Evening Reception',
  'Milestone Birthdays': '6:30 PM Evening Reception',
  Weddings: '5:15 PM Sunset Slot',
  'Engagements & Proposals': '5:15 PM Sunset Slot',
  Elopements: '5:15 PM Sunset Slot',
  'Christenings & Baby Showers': '12:30 PM Daytime Service',
  Graduations: '6:30 PM Evening Reception',
  'Community Festivals': '12:30 PM Daytime Service',
  'Corporate Events': '6:30 PM Evening Reception',
};

const GENERIC_CHIPS: Omit<CulturalChipOption, 'id' | 'tradition'>[] = [
  {
    label: 'Cultural catering',
    keywords: ['banquet', 'catering', 'feast', 'menu', 'halal', 'roast', 'buffet'],
    preferredCategories: ['Caterers'],
    defaultSelected: true,
  },
  {
    label: 'MC',
    keywords: ['mc', 'bilingual', 'hosting', 'dj', 'coordination'],
    preferredCategories: ['Entertainment & DJs', 'Planners', 'Cultural Specialists'],
    defaultSelected: true,
  },
  {
    label: 'Decor',
    keywords: ['decor', 'styling', 'floral', 'arch', 'lantern', 'balloon', 'backdrop'],
    preferredCategories: ['Decor & Styling', 'Florists'],
    defaultSelected: true,
  },
  {
    label: 'Photographer',
    keywords: ['photography', 'photographer', 'gallery', 'film', 'documentary'],
    preferredCategories: ['Photographers', 'Proposal & Elopement'],
  },
];

// Event Type x Cultural Tradition specific chips; missing combos cleanly fall back to GENERIC_CHIPS
const EVENT_TRADITION_CHIPS: Partial<
  Record<EventTypeTag, Partial<Record<CulturalTradition, Omit<CulturalChipOption, 'id' | 'tradition'>[]>>>
> = {
  Weddings: {
    Greek: [
      {
        label: 'Stefana crowning',
        keywords: ['stefana', 'orthodox', 'crown', 'ceremony'],
        preferredCategories: ['Cultural Specialists', 'Planners'],
        defaultSelected: true,
      },
      {
        label: 'Koumbaro & koumbara',
        keywords: ['koumbaro', 'etiquette', 'greek orthodox', 'ceremony'],
        preferredCategories: ['Cultural Specialists', 'Planners'],
        defaultSelected: true,
      },
      {
        label: 'Greek dancing',
        keywords: ['bouzouki', 'kalamatiano', 'zorba', 'folk dance', 'greek'],
        preferredCategories: ['Entertainment & DJs', 'Cultural Specialists'],
        defaultSelected: true,
      },
      {
        label: 'Traditional catering',
        keywords: ['greek', 'lamb spit', 'spanakopita', 'loukoumades', 'feast'],
        preferredCategories: ['Caterers'],
      },
    ],
    Filipino: [
      {
        label: 'Veil and cord rites',
        keywords: ['veil', 'cord', 'filipino', 'arras', 'sponsor'],
        preferredCategories: ['Planners', 'Photographers', 'Makeup Artists', 'Proposal & Elopement'],
        defaultSelected: true,
      },
      {
        label: 'Money dance',
        keywords: ['money dance', 'karaoke', 'pinoy', 'choreography'],
        preferredCategories: ['Entertainment & DJs', 'Planners'],
        defaultSelected: true,
      },
      {
        label: 'Lechon feast',
        keywords: ['lechon', 'pancit', 'kare-kare', 'halo-halo', 'filipino'],
        preferredCategories: ['Caterers'],
        defaultSelected: true,
      },
      {
        label: 'Barong attire protocols',
        keywords: ['barong', 'filipiniana', 'tagalog', 'principal sponsor'],
        preferredCategories: ['Planners', 'Makeup Artists', 'Photographers'],
      },
    ],
    Indian: [
      {
        label: 'Baraat procession',
        keywords: ['baraat', 'dhol', 'drummer', 'procession'],
        preferredCategories: ['Entertainment & DJs', 'Planners'],
        defaultSelected: true,
      },
      {
        label: 'Mehndi night',
        keywords: ['mehndi', 'henna', 'marigold', 'dupatta'],
        preferredCategories: ['Makeup Artists', 'Florists', 'Photographers'],
        defaultSelected: true,
      },
      {
        label: 'Sangeet & Bollywood',
        keywords: ['sangeet', 'bollywood', 'bhangra', 'dhol'],
        preferredCategories: ['Entertainment & DJs', 'Decor & Styling'],
        defaultSelected: true,
      },
      {
        label: 'Pheras & Mandap',
        keywords: ['mandap', 'pandit', 'haar', 'garland', 'vegetarian', 'jain'],
        preferredCategories: ['Florists', 'Cultural Specialists', 'Caterers'],
      },
    ],
    Chinese: [
      {
        label: 'Tea ceremony',
        keywords: ['tea ceremony', 'tea ceremonies', 'qipao', 'cantonese', 'mandarin'],
        preferredCategories: ['Cultural Specialists', 'Planners', 'Photographers', 'Florists'],
        defaultSelected: true,
      },
      {
        label: 'Lion dance',
        keywords: ['lion dance', 'gong', 'drum', 'cai qing'],
        preferredCategories: ['Entertainment & DJs'],
        defaultSelected: true,
      },
      {
        label: 'Banquet menu',
        keywords: ['cantonese', '8-course', 'barramundi', 'yum cha', 'roast'],
        preferredCategories: ['Caterers'],
        defaultSelected: true,
      },
      {
        label: 'Red envelope customs',
        keywords: ['lantern', 'calligraphy', 'silk', 'auspicious', 'moon gate'],
        preferredCategories: ['Decor & Styling', 'Planners'],
      },
    ],
    Italian: [
      {
        label: 'Porchetta & antipasti banquet',
        keywords: ['porchetta', 'antipasti', 'pasta', 'cannoli', 'italian'],
        preferredCategories: ['Caterers'],
        defaultSelected: true,
      },
      {
        label: 'Bomboniere & confetti table',
        keywords: ['bomboniere', 'confetti', 'italian'],
        preferredCategories: ['Cultural Specialists', 'Planners'],
        defaultSelected: true,
      },
      {
        label: 'Vineyard long-table venue',
        keywords: ['olive', 'pergola', 'vineyard', 'mclaren vale', 'courtyard'],
        preferredCategories: ['Venues & Marquees', 'Planners'],
        defaultSelected: true,
      },
      {
        label: 'Italian classics DJ & MC',
        keywords: ['mediterranean', 'mc', 'dj', 'bilingual'],
        preferredCategories: ['Entertainment & DJs'],
      },
    ],
    'Middle Eastern or Muslim': [
      {
        label: 'Nikah ceremony & modest styling',
        keywords: ['nikah', 'hijab', 'modest', 'prayer', 'halal'],
        preferredCategories: ['Makeup Artists', 'Venues & Marquees', 'Planners'],
        defaultSelected: true,
      },
      {
        label: 'Halal lamb & mezze banquet',
        keywords: ['halal', 'lamb', 'mezze', 'knafeh', 'mandi'],
        preferredCategories: ['Caterers'],
        defaultSelected: true,
      },
      {
        label: 'Zaffe drummers & Dabke',
        keywords: ['zaffe', 'dabke', 'arabic', 'drummer'],
        preferredCategories: ['Entertainment & DJs', 'Cultural Specialists', 'Planners'],
        defaultSelected: true,
      },
      {
        label: 'Henna night & glam',
        keywords: ['henna', 'glam', 'middle eastern'],
        preferredCategories: ['Makeup Artists'],
      },
    ],
    'Pacific Islander': [
      {
        label: 'Polynesian blessing & Karakia',
        keywords: ['karakia', 'polynesian', 'blessing', 'waiata'],
        preferredCategories: ['Cultural Specialists', 'Proposal & Elopement'],
        defaultSelected: true,
      },
      {
        label: 'Umu island feast',
        keywords: ['umu', 'hangi', 'ota ika', 'palusami', 'pacific'],
        preferredCategories: ['Caterers'],
        defaultSelected: true,
      },
      {
        label: 'Siva & log drumming troupe',
        keywords: ['siva', 'taualuga', 'drumming', 'fire-knife', 'polynesian'],
        preferredCategories: ['Entertainment & DJs'],
        defaultSelected: true,
      },
      {
        label: 'Gift exchange & protocol',
        keywords: ['gift exchange', 'protocol', 'bilingual mc'],
        preferredCategories: ['Cultural Specialists'],
      },
    ],
    Vietnamese: [
      {
        label: 'Đám Hỏi & tea ceremony',
        keywords: ['tea ceremony', 'trilingual', 'vietnamese', 'bilingual'],
        preferredCategories: ['Photographers', 'Entertainment & DJs', 'Caterers'],
        defaultSelected: true,
      },
      {
        label: '8-course Vietnamese banquet',
        keywords: ['vietnamese', 'phở', 'banquet', 'roast', 'bánh mì'],
        preferredCategories: ['Caterers'],
        defaultSelected: true,
      },
      {
        label: 'Áo dài attire & glam',
        keywords: ['east asian', 'makeup', 'monolid', 'lantern', 'silk'],
        preferredCategories: ['Makeup Artists', 'Decor & Styling', 'Florists'],
        defaultSelected: true,
      },
      {
        label: 'Lion dance & bilingual MC',
        keywords: ['lion dance', 'tết', 'vietnamese', 'karaoke', 'mc'],
        preferredCategories: ['Entertainment & DJs'],
      },
    ],
    Korean: [
      {
        label: 'Pyebaek bowing ritual',
        keywords: ['pyebaek', 'korean', 'east asian'],
        preferredCategories: ['Photographers', 'Caterers'],
        defaultSelected: true,
      },
      {
        label: 'Korean BBQ & banquet',
        keywords: ['korean', 'bulgogi', 'galbi', 'japchae', 'rice cake'],
        preferredCategories: ['Caterers'],
        defaultSelected: true,
      },
      {
        label: 'Hanbok hair & makeup',
        keywords: ['hanbok', 'monolid', 'skin-first', 'korean'],
        preferredCategories: ['Makeup Artists'],
        defaultSelected: true,
      },
      {
        label: 'Samulnori drums & bilingual MC',
        keywords: ['samulnori', 'korean', 'karaoke', 'trilingual'],
        preferredCategories: ['Entertainment & DJs'],
      },
    ],
  },
  'Milestone Birthdays': {
    Chinese: [
      {
        label: 'Roast banquet',
        keywords: ['cantonese', 'roast', '8-course', 'barramundi'],
        preferredCategories: ['Caterers'],
        defaultSelected: true,
      },
      {
        label: 'Longevity buns',
        keywords: ['longevity', 'shou tao', 'peach buns', 'noodle'],
        preferredCategories: ['Caterers'],
        defaultSelected: true,
      },
      {
        label: 'Bilingual MC and karaoke',
        keywords: ['bilingual', 'cantonese', 'mandarin', 'choreography', 'mc', 'lion dance'],
        preferredCategories: ['Planners', 'Entertainment & DJs'],
        defaultSelected: true,
      },
      {
        label: 'Red & gold lantern decor',
        keywords: ['lantern', 'calligraphy', 'peach', 'silk'],
        preferredCategories: ['Decor & Styling'],
      },
    ],
    Filipino: [
      {
        label: '18th Debut & 18 Roses waltz',
        keywords: ['debut', '18th', 'roses', 'choreography', 'tagalog'],
        preferredCategories: ['Planners', 'Caterers'],
        defaultSelected: true,
      },
      {
        label: 'Lechon & pancit fiesta',
        keywords: ['lechon', 'pancit', 'halo-halo', 'leche flan'],
        preferredCategories: ['Caterers'],
        defaultSelected: true,
      },
      {
        label: 'Pinoy karaoke & MC',
        keywords: ['karaoke', 'pinoy', 'mc', 'dj'],
        preferredCategories: ['Entertainment & DJs'],
        defaultSelected: true,
      },
      {
        label: 'Milestone numerals & balloons',
        keywords: ['milestone', 'balloon', 'numerals', 'signage'],
        preferredCategories: ['Decor & Styling'],
      },
    ],
    Greek: [
      {
        label: 'Lamb spit & spanakopita feast',
        keywords: ['lamb', 'spit', 'greek', 'spanakopita', 'loukoumades'],
        preferredCategories: ['Caterers'],
        defaultSelected: true,
      },
      {
        label: 'Live Bouzouki & Greek dancing',
        keywords: ['bouzouki', 'kalamatiano', 'zorba', 'greek'],
        preferredCategories: ['Entertainment & DJs', 'Cultural Specialists'],
        defaultSelected: true,
      },
      {
        label: 'Olive courtyard or BYO stone hall',
        keywords: ['olive', 'hall', 'spit-roast', 'byo'],
        preferredCategories: ['Venues & Marquees'],
        defaultSelected: true,
      },
      {
        label: 'Milestone balloon & floral tables',
        keywords: ['balloon', 'milestone', 'floral', 'signage'],
        preferredCategories: ['Decor & Styling', 'Florists'],
      },
    ],
    Italian: [
      {
        label: 'Wood-fired porchetta & pasta',
        keywords: ['porchetta', 'pasta', 'antipasti', 'italian'],
        preferredCategories: ['Caterers'],
        defaultSelected: true,
      },
      {
        label: 'Live-piped cannoli bar',
        keywords: ['cannoli', 'dessert', 'italian'],
        preferredCategories: ['Caterers'],
        defaultSelected: true,
      },
      {
        label: 'Vineyard villa or courtyard hall',
        keywords: ['olive', 'pergola', 'pizza', 'hall', 'byo'],
        preferredCategories: ['Venues & Marquees'],
        defaultSelected: true,
      },
      {
        label: 'Mediterranean DJ & MC',
        keywords: ['mediterranean', 'dj', 'mc'],
        preferredCategories: ['Entertainment & DJs'],
      },
    ],
    Indian: [
      {
        label: 'Live tandoor & chaat feast',
        keywords: ['tandoor', 'chaat', 'indian', 'jain', 'vegetarian'],
        preferredCategories: ['Caterers'],
        defaultSelected: true,
      },
      {
        label: 'Bollywood DJ or Dhol',
        keywords: ['dhol', 'bollywood', 'bhangra', 'dj'],
        preferredCategories: ['Entertainment & DJs'],
        defaultSelected: true,
      },
      {
        label: 'Marigold & warm light styling',
        keywords: ['marigold', 'diya', 'lighting', 'stage'],
        preferredCategories: ['Decor & Styling', 'Florists'],
        defaultSelected: true,
      },
      {
        label: 'Civic hall or marquee hire',
        keywords: ['hall', 'marquee', 'kitchen', 'pavilion'],
        preferredCategories: ['Venues & Marquees'],
      },
    ],
    'Middle Eastern or Muslim': [
      {
        label: 'Halal roast lamb & mezze',
        keywords: ['halal', 'lamb', 'mezze', 'mandi'],
        preferredCategories: ['Caterers'],
        defaultSelected: true,
      },
      {
        label: 'Warm knafeh dessert bar',
        keywords: ['knafeh', 'baklava', 'halal'],
        preferredCategories: ['Caterers'],
        defaultSelected: true,
      },
      {
        label: 'Arabic Dabke & bilingual DJ',
        keywords: ['dabke', 'arabic', 'zaffe', 'dj', 'mc'],
        preferredCategories: ['Entertainment & DJs'],
        defaultSelected: true,
      },
      {
        label: 'Halal-friendly hall or marquee',
        keywords: ['halal', 'prayer', 'marquee', 'hall'],
        preferredCategories: ['Venues & Marquees'],
      },
    ],
    'Pacific Islander': [
      {
        label: 'Umu & island feast table',
        keywords: ['umu', 'hangi', 'ota ika', 'palusami', 'taro'],
        preferredCategories: ['Caterers'],
        defaultSelected: true,
      },
      {
        label: '21st Key blessing & Siva dancers',
        keywords: ['21st key', 'siva', 'taualuga', 'blessing', 'drumming'],
        preferredCategories: ['Entertainment & DJs', 'Cultural Specialists'],
        defaultSelected: true,
      },
      {
        label: 'Milestone balloon & photo wall',
        keywords: ['milestone', 'balloon', 'numerals', 'photo wall'],
        preferredCategories: ['Decor & Styling'],
        defaultSelected: true,
      },
      {
        label: 'BYO hall or marquee hire',
        keywords: ['hall', 'kitchen', 'marquee'],
        preferredCategories: ['Venues & Marquees'],
      },
    ],
    Vietnamese: [
      {
        label: 'Vietnamese roast & Phở bar',
        keywords: ['vietnamese', 'phở', 'banquet', 'roast'],
        preferredCategories: ['Caterers'],
        defaultSelected: true,
      },
      {
        label: 'Bilingual MC & live karaoke',
        keywords: ['vietnamese', 'karaoke', 'acoustic', 'trilingual', 'mc'],
        preferredCategories: ['Entertainment & DJs'],
        defaultSelected: true,
      },
      {
        label: 'Lantern & silk banner decor',
        keywords: ['lantern', 'silk', 'calligraphy'],
        preferredCategories: ['Decor & Styling'],
        defaultSelected: true,
      },
      {
        label: 'BYO hall hire',
        keywords: ['hall', 'kitchen', 'pavilion', 'marquee'],
        preferredCategories: ['Venues & Marquees'],
      },
    ],
    Korean: [
      {
        label: 'Korean BBQ & rice cake tower',
        keywords: ['korean', 'bulgogi', 'galbi', 'rice cake', 'japchae'],
        preferredCategories: ['Caterers'],
        defaultSelected: true,
      },
      {
        label: 'Korean karaoke & bilingual MC',
        keywords: ['korean', 'karaoke', 'acoustic', 'trilingual', 'samulnori'],
        preferredCategories: ['Entertainment & DJs'],
        defaultSelected: true,
      },
      {
        label: 'Milestone numerals & backdrop',
        keywords: ['milestone', 'balloon', 'signage'],
        preferredCategories: ['Decor & Styling'],
        defaultSelected: true,
      },
      {
        label: 'BYO hall or pavilion',
        keywords: ['hall', 'kitchen', 'pavilion'],
        preferredCategories: ['Venues & Marquees'],
      },
    ],
  },
  'Diwali & Festival of Lights': {
    Indian: [
      {
        label: 'Rangoli',
        keywords: ['rangoli', 'kolam', 'petal', 'marigold'],
        preferredCategories: ['Decor & Styling', 'Florists'],
        defaultSelected: true,
      },
      {
        label: 'Diya lighting',
        keywords: ['diya', 'flame-free', 'lighting', 'urlis'],
        preferredCategories: ['Decor & Styling'],
        defaultSelected: true,
      },
      {
        label: 'Vegetarian catering',
        keywords: ['vegetarian', 'jain', 'chaat', 'tandoor', 'indian'],
        preferredCategories: ['Caterers'],
        defaultSelected: true,
      },
      {
        label: 'Dhol',
        keywords: ['dhol', 'bollywood', 'bhangra', 'drummer'],
        preferredCategories: ['Entertainment & DJs'],
      },
    ],
  },
  'Lunar New Year': {
    Chinese: [
      {
        label: 'Lion dance',
        keywords: ['lion dance', 'drum', 'gong', 'cai qing'],
        preferredCategories: ['Entertainment & DJs'],
        defaultSelected: true,
      },
      {
        label: 'Cantonese 8-course banquet',
        keywords: ['cantonese', '8-course', 'yum cha', 'roast', 'banquet'],
        preferredCategories: ['Caterers'],
        defaultSelected: true,
      },
      {
        label: 'Red envelope & silk lantern decor',
        keywords: ['lantern', 'calligraphy', 'peach', 'silk', 'auspicious'],
        preferredCategories: ['Decor & Styling'],
        defaultSelected: true,
      },
      {
        label: 'Bilingual MC',
        keywords: ['cantonese', 'mandarin', 'bilingual', 'mc'],
        preferredCategories: ['Planners', 'Cultural Specialists'],
      },
    ],
    Vietnamese: [
      {
        label: 'Tết Lân (Lion dance)',
        keywords: ['tết', 'lion dance', 'drum', 'cai qing'],
        preferredCategories: ['Entertainment & DJs'],
        defaultSelected: true,
      },
      {
        label: 'Tết Bánh Chưng & Phở feast',
        keywords: ['tết', 'bánh chưng', 'vietnamese', 'phở'],
        preferredCategories: ['Caterers'],
        defaultSelected: true,
      },
      {
        label: 'Peach blossom & lantern decor',
        keywords: ['peach', 'lantern', 'calligraphy', 'silk'],
        preferredCategories: ['Decor & Styling'],
        defaultSelected: true,
      },
      {
        label: 'Vietnamese MC & acoustic duo',
        keywords: ['vietnamese', 'trilingual', 'acoustic', 'karaoke'],
        preferredCategories: ['Entertainment & DJs'],
      },
    ],
    Korean: [
      {
        label: 'Seollal feast & rice cakes',
        keywords: ['korean', 'bulgogi', 'rice cake', 'songpyeon'],
        preferredCategories: ['Caterers'],
        defaultSelected: true,
      },
      {
        label: 'Samulnori drums & Korean MC',
        keywords: ['samulnori', 'korean', 'trilingual', 'acoustic'],
        preferredCategories: ['Entertainment & DJs'],
        defaultSelected: true,
      },
      {
        label: 'Hanbok-ready styling',
        keywords: ['hanbok', 'monolid', 'korean'],
        preferredCategories: ['Makeup Artists'],
        defaultSelected: true,
      },
      {
        label: 'Photographer',
        keywords: ['korean', 'documentary', 'photography'],
        preferredCategories: ['Photographers'],
      },
    ],
  },
  Eid: {
    'Middle Eastern or Muslim': [
      {
        label: 'Halal catering',
        keywords: ['halal', 'lamb', 'mezze', 'knafeh', 'mandi'],
        preferredCategories: ['Caterers'],
        defaultSelected: true,
      },
      {
        label: 'Henna & modest styling',
        keywords: ['henna', 'eid', 'hijab', 'dupatta'],
        preferredCategories: ['Makeup Artists'],
        defaultSelected: true,
      },
      {
        label: 'Family-style feast',
        keywords: ['family-style', 'platter', 'mezze', 'moon-sighting'],
        preferredCategories: ['Caterers'],
        defaultSelected: true,
      },
      {
        label: 'Modest-friendly venue',
        keywords: ['prayer', 'halal-compliant', 'quiet', 'marquee'],
        preferredCategories: ['Venues & Marquees'],
      },
    ],
    Indian: [
      {
        label: 'Halal Indian banquet & biryani',
        keywords: ['halal', 'indian', 'tandoor', 'chaat'],
        preferredCategories: ['Caterers'],
        defaultSelected: true,
      },
      {
        label: 'Chand Raat bridal/festive glam',
        keywords: ['dupatta', 'skin tone', 'makeup'],
        preferredCategories: ['Makeup Artists'],
        defaultSelected: true,
      },
      {
        label: 'Halal-compliant hall or marquee',
        keywords: ['halal', 'prayer', 'marquee', 'pavilion'],
        preferredCategories: ['Venues & Marquees'],
        defaultSelected: true,
      },
      {
        label: 'Bollywood & festive DJ',
        keywords: ['bollywood', 'dj', 'dhol'],
        preferredCategories: ['Entertainment & DJs'],
      },
    ],
  },
  'Christenings & Baby Showers': {
    Greek: [
      {
        label: 'Greek baptism favours & martyrika',
        keywords: ['greek orthodox', 'baptism', 'bomboniere', 'name day'],
        preferredCategories: ['Cultural Specialists', 'Planners'],
        defaultSelected: true,
      },
      {
        label: 'Lamb spit & spanakopita lunch',
        keywords: ['lamb', 'greek', 'spanakopita', 'loukoumades'],
        preferredCategories: ['Caterers'],
        defaultSelected: true,
      },
      {
        label: 'Dry-hire hall or olive courtyard',
        keywords: ['hall', 'olive', 'courtyard', 'byo'],
        preferredCategories: ['Venues & Marquees'],
        defaultSelected: true,
      },
      {
        label: 'Pastel balloon arch & signage',
        keywords: ['balloon', 'pastel', 'christening', 'signage'],
        preferredCategories: ['Decor & Styling'],
      },
    ],
    Filipino: [
      {
        label: 'Binyag lechon & leche flan feast',
        keywords: ['lechon', 'filipino', 'christening', 'leche flan'],
        preferredCategories: ['Caterers'],
        defaultSelected: true,
      },
      {
        label: 'Pastel balloon arch & backdrop',
        keywords: ['balloon', 'pastel', 'christening', 'photo wall'],
        preferredCategories: ['Decor & Styling'],
        defaultSelected: true,
      },
      {
        label: 'Bilingual family coordination',
        keywords: ['tagalog', 'bilingual', 'christening', 'planner'],
        preferredCategories: ['Planners', 'Proposal & Elopement'],
        defaultSelected: true,
      },
      {
        label: 'Family documentary photography',
        keywords: ['photography', 'candid', 'filipino'],
        preferredCategories: ['Photographers'],
      },
    ],
    Chinese: [
      {
        label: 'Red Egg & 100-day banquet',
        keywords: ['cantonese', 'yum cha', 'roast', 'banquet'],
        preferredCategories: ['Caterers'],
        defaultSelected: true,
      },
      {
        label: 'Red Egg lantern & calligraphy scroll',
        keywords: ['red egg', 'calligraphy', 'lantern', 'peach'],
        preferredCategories: ['Decor & Styling'],
        defaultSelected: true,
      },
      {
        label: 'Bilingual MC & family logistics',
        keywords: ['bilingual', 'cantonese', 'mandarin', 'planner'],
        preferredCategories: ['Planners'],
        defaultSelected: true,
      },
      {
        label: 'Civic pavilion with kitchen',
        keywords: ['pavilion', 'kitchen', 'hall'],
        preferredCategories: ['Venues & Marquees'],
      },
    ],
    Italian: [
      {
        label: 'Italian bomboniere & blessing styling',
        keywords: ['bomboniere', 'confetti', 'italian'],
        preferredCategories: ['Cultural Specialists', 'Planners'],
        defaultSelected: true,
      },
      {
        label: 'Porchetta, antipasti & cannoli',
        keywords: ['porchetta', 'antipasti', 'pasta', 'cannoli'],
        preferredCategories: ['Caterers'],
        defaultSelected: true,
      },
      {
        label: 'Pastel balloon & floral backdrop',
        keywords: ['balloon', 'pastel', 'floral', 'native'],
        preferredCategories: ['Decor & Styling', 'Florists'],
        defaultSelected: true,
      },
      {
        label: 'Vineyard or courtyard hall',
        keywords: ['olive', 'courtyard', 'hall', 'byo'],
        preferredCategories: ['Venues & Marquees'],
      },
    ],
    Indian: [
      {
        label: 'Pure veg / Sattvic family lunch',
        keywords: ['vegetarian', 'indian', 'jain', 'chaat'],
        preferredCategories: ['Caterers'],
        defaultSelected: true,
      },
      {
        label: 'Native & colourful floral styling',
        keywords: ['indian', 'floral', 'vibrant', 'photography'],
        preferredCategories: ['Photographers', 'Venues & Marquees'],
        defaultSelected: true,
      },
      {
        label: 'Garden or civic hall venue',
        keywords: ['hall', 'garden', 'courtyard'],
        preferredCategories: ['Venues & Marquees'],
        defaultSelected: true,
      },
      {
        label: 'Photography',
        keywords: ['photography', 'family'],
        preferredCategories: ['Photographers'],
      },
    ],
    'Middle Eastern or Muslim': [
      {
        label: 'Aqiqah Halal roast & knafeh feast',
        keywords: ['halal', 'lamb', 'mezze', 'knafeh'],
        preferredCategories: ['Caterers'],
        defaultSelected: true,
      },
      {
        label: 'Pastel balloon & welcome wall',
        keywords: ['balloon', 'pastel', 'christening', 'photo wall'],
        preferredCategories: ['Decor & Styling'],
        defaultSelected: true,
      },
      {
        label: 'Quiet hall or marquee setup',
        keywords: ['hall', 'marquee', 'prayer'],
        preferredCategories: ['Venues & Marquees'],
        defaultSelected: true,
      },
    ],
    'Pacific Islander': [
      {
        label: 'Polynesian baby blessing & Karakia',
        keywords: ['karakia', 'blessing', 'polynesian'],
        preferredCategories: ['Cultural Specialists', 'Proposal & Elopement'],
        defaultSelected: true,
      },
      {
        label: 'Island umu family lunch',
        keywords: ['umu', 'pacific', 'palusami', 'island'],
        preferredCategories: ['Caterers'],
        defaultSelected: true,
      },
      {
        label: 'Pastel arch & welcome signage',
        keywords: ['balloon', 'pastel', 'signage'],
        preferredCategories: ['Decor & Styling'],
        defaultSelected: true,
      },
    ],
    Vietnamese: [
      {
        label: 'Đầy Tháng Vietnamese feast',
        keywords: ['vietnamese', 'roast', 'banquet', 'phở'],
        preferredCategories: ['Caterers'],
        defaultSelected: true,
      },
      {
        label: 'Silk lantern & scroll backdrop',
        keywords: ['lantern', 'silk', 'calligraphy'],
        preferredCategories: ['Decor & Styling'],
        defaultSelected: true,
      },
      {
        label: 'Vietnamese MC & acoustic music',
        keywords: ['vietnamese', 'acoustic', 'trilingual'],
        preferredCategories: ['Entertainment & DJs'],
        defaultSelected: true,
      },
    ],
    Korean: [
      {
        label: 'Baek-il / Doljabi rice cakes & feast',
        keywords: ['doljabi', '100-day', 'rice cake', 'korean'],
        preferredCategories: ['Caterers'],
        defaultSelected: true,
      },
      {
        label: 'Pastel balloon & Doljabi photo wall',
        keywords: ['balloon', 'pastel', 'photo wall', 'signage'],
        preferredCategories: ['Decor & Styling'],
        defaultSelected: true,
      },
      {
        label: 'Korean MC & acoustic set',
        keywords: ['korean', 'acoustic', 'trilingual'],
        preferredCategories: ['Entertainment & DJs'],
        defaultSelected: true,
      },
    ],
  },
  'Engagements & Proposals': {
    Filipino: [
      {
        label: 'Pamamanhikan family dinner',
        keywords: ['lechon', 'filipino', 'pancit', 'tagalog'],
        preferredCategories: ['Caterers', 'Planners'],
        defaultSelected: true,
      },
      {
        label: 'Cliffside secret proposal setup',
        keywords: ['cliffside', 'sunset', 'proposal', 'permit'],
        preferredCategories: ['Proposal & Elopement'],
        defaultSelected: true,
      },
      {
        label: 'Undercover & engagement photographer',
        keywords: ['undercover', 'photography', 'filipino'],
        preferredCategories: ['Photographers', 'Proposal & Elopement'],
        defaultSelected: true,
      },
    ],
    Greek: [
      {
        label: 'Mediterranean engagement feast',
        keywords: ['greek', 'porchetta', 'antipasti', 'lamb'],
        preferredCategories: ['Caterers'],
        defaultSelected: true,
      },
      {
        label: 'Greek bouzouki or coastal proposal',
        keywords: ['bouzouki', 'proposal', 'sunset', 'vineyard'],
        preferredCategories: ['Entertainment & DJs', 'Proposal & Elopement', 'Venues & Marquees'],
        defaultSelected: true,
      },
      {
        label: 'Candid photography',
        keywords: ['photography', 'mediterranean'],
        preferredCategories: ['Photographers'],
        defaultSelected: true,
      },
    ],
    Indian: [
      {
        label: 'Roka floral & marigold stage',
        keywords: ['marigold', 'floral', 'rangoli', 'garland'],
        preferredCategories: ['Florists', 'Decor & Styling'],
        defaultSelected: true,
      },
      {
        label: 'Chaat & Indian canapé feast',
        keywords: ['chaat', 'indian', 'vegetarian', 'tandoor'],
        preferredCategories: ['Caterers'],
        defaultSelected: true,
      },
      {
        label: 'Dhol welcome & glam',
        keywords: ['dhol', 'bollywood', 'skin tone', 'makeup'],
        preferredCategories: ['Entertainment & DJs', 'Makeup Artists'],
        defaultSelected: true,
      },
    ],
    Chinese: [
      {
        label: 'Engagement tea & floral arch',
        keywords: ['floral', 'moon gate', 'tea', 'sunset'],
        preferredCategories: ['Florists', 'Proposal & Elopement', 'Planners'],
        defaultSelected: true,
      },
      {
        label: 'Cantonese banquet dinner',
        keywords: ['cantonese', 'yum cha', 'roast', 'banquet'],
        preferredCategories: ['Caterers'],
        defaultSelected: true,
      },
      {
        label: 'Mandarin / Cantonese photographer',
        keywords: ['mandarin', 'cantonese', 'photography', 'pre-wedding'],
        preferredCategories: ['Photographers'],
        defaultSelected: true,
      },
    ],
    Italian: [
      {
        label: 'Italian engagement long lunch',
        keywords: ['italian', 'vineyard', 'antipasti', 'porchetta', 'cannoli'],
        preferredCategories: ['Planners', 'Caterers', 'Venues & Marquees'],
        defaultSelected: true,
      },
      {
        label: 'Coastal or hills proposal styling',
        keywords: ['proposal', 'cliffside', 'olive', 'vineyard'],
        preferredCategories: ['Proposal & Elopement', 'Venues & Marquees'],
        defaultSelected: true,
      },
      {
        label: 'Photography & native florals',
        keywords: ['photography', 'native', 'floral'],
        preferredCategories: ['Photographers', 'Florists'],
        defaultSelected: true,
      },
    ],
    'Middle Eastern or Muslim': [
      {
        label: 'Halal engagement mezze & knafeh',
        keywords: ['halal', 'mezze', 'knafeh', 'lamb'],
        preferredCategories: ['Caterers'],
        defaultSelected: true,
      },
      {
        label: 'Modest-friendly glam & styling',
        keywords: ['glam', 'hijab', 'henna', 'middle eastern'],
        preferredCategories: ['Makeup Artists'],
        defaultSelected: true,
      },
      {
        label: 'Proposal planning & coordination',
        keywords: ['proposal', 'family liaison', 'bilingual'],
        preferredCategories: ['Proposal & Elopement', 'Planners'],
        defaultSelected: true,
      },
    ],
  },
  Elopements: {
    Greek: [
      {
        label: 'Intimate Stefana vow styling',
        keywords: ['elopement', 'vows', 'intimate', 'vineyard'],
        preferredCategories: ['Proposal & Elopement', 'Planners'],
        defaultSelected: true,
      },
      {
        label: 'Mediterranean olive courtyard',
        keywords: ['olive', 'courtyard', 'pergola'],
        preferredCategories: ['Venues & Marquees'],
        defaultSelected: true,
      },
      {
        label: 'Seasonal botanical bouquet',
        keywords: ['native', 'bouquet', 'foam-free', 'flora'],
        preferredCategories: ['Florists'],
        defaultSelected: true,
      },
    ],
    Filipino: [
      {
        label: 'Bilingual Tagalog/English celebrant',
        keywords: ['tagalog', 'celebrant', 'noim', 'bilingual'],
        preferredCategories: ['Proposal & Elopement'],
        defaultSelected: true,
      },
      {
        label: 'Native seasonal bouquet',
        keywords: ['native', 'bouquet', 'foam-free'],
        preferredCategories: ['Florists'],
        defaultSelected: true,
      },
      {
        label: 'All-inclusive hills elopement',
        keywords: ['elopements', 'noim', 'photographer'],
        preferredCategories: ['Proposal & Elopement'],
        defaultSelected: true,
      },
    ],
    Chinese: [
      {
        label: 'Mandarin / Cantonese documentary photo',
        keywords: ['mandarin', 'cantonese', 'elopements', 'tea'],
        preferredCategories: ['Photographers'],
        defaultSelected: true,
      },
      {
        label: 'All-inclusive hills or vineyard elopement',
        keywords: ['elopements', 'noim', 'conservatory'],
        preferredCategories: ['Proposal & Elopement'],
        defaultSelected: true,
      },
      {
        label: 'East Asian natural glam',
        keywords: ['east asian', 'makeup', 'qipao'],
        preferredCategories: ['Makeup Artists'],
      },
    ],
  },
};

function getChipsForTraditionAndEvent(
  eventType: EventTypeTag,
  tradition: CulturalTradition
): CulturalChipOption[] {
  const custom = EVENT_TRADITION_CHIPS[eventType]?.[tradition];
  const base = custom && custom.length > 0 ? custom : GENERIC_CHIPS;
  return base.map((item, idx) => ({
    ...item,
    id: `${eventType}::${tradition}::${idx}`,
    tradition,
  }));
}

function getAvailableChips(
  eventType: EventTypeTag,
  traditionSelection: TraditionDropdownValue,
  fusionTraditions: CulturalTradition[]
): CulturalChipOption[] {
  if (traditionSelection !== 'Other or Fusion') {
    return getChipsForTraditionAndEvent(eventType, traditionSelection);
  }

  if (fusionTraditions.length === 0) {
    return GENERIC_CHIPS.map((item, idx) => ({
      ...item,
      id: `${eventType}::other::${idx}`,
    }));
  }

  const combined: CulturalChipOption[] = [];
  for (const tr of fusionTraditions) {
    const trChips = getChipsForTraditionAndEvent(eventType, tr);
    for (const c of trChips) {
      combined.push(c);
    }
  }
  return combined;
}

function getDefaultElementIds(chips: CulturalChipOption[]): string[] {
  const defaults = chips.filter((c) => c.defaultSelected).map((c) => c.id);
  return defaults.length > 0 ? defaults : chips.slice(0, 2).map((c) => c.id);
}

// Words belonging exclusively to another tradition (prevents e.g. Italian wording appearing for Greek-only brief)
const OTHER_TRADITION_MARKERS: Record<CulturalTradition, RegExp[]> = {
  Filipino: [/filipino/i, /lechon/i, /tagalog/i, /pinoy/i, /debut/i, /veil/i, /cord/i],
  Greek: [/greek/i, /stefana/i, /bouzouki/i, /kalamatiano/i, /koumbaro/i, /spanakopita/i, /loukoumades/i, /aegean/i],
  Indian: [/indian/i, /diwali/i, /rangoli/i, /dhol/i, /bollywood/i, /mandap/i, /mehndi/i, /sikh/i, /hindu/i, /jain/i, /sangeet/i],
  Chinese: [/chinese/i, /cantonese/i, /mandarin/i, /qipao/i, /yum cha/i, /longevity/i, /red egg/i, /lion dance/i],
  Italian: [/italian/i, /porchetta/i, /cannoli/i, /bomboniere/i, /amalfi/i, /antipasti/i],
  'Middle Eastern or Muslim': [/halal/i, /eid/i, /nikah/i, /hijab/i, /dabke/i, /zaffe/i, /lebanese/i, /knafeh/i, /middle eastern/i],
  'Pacific Islander': [/pacific/i, /polynesian/i, /māori/i, /maori/i, /karakia/i, /umu/i, /samoan/i, /tongan/i, /siva/i],
  Vietnamese: [/vietnamese/i, /phở/i, /pho\b/i, /bánh mì/i, /tết/i, /tet\b/i, /đám hỏi/i, /áo dài/i],
  Korean: [/korean/i, /pyebaek/i, /hanbok/i, /doljabi/i, /bulgogi/i, /kimchi/i, /samulnori/i, /seollal/i],
};

function specialtyMatchesActiveTraditions(
  text: string,
  vendorTraditions: CulturalTradition[],
  activeTraditions: CulturalTradition[]
): boolean {
  if (activeTraditions.length === 0) return true;
  const inactiveTraditions = SPECIFIC_TRADITIONS.filter((tr) => !activeTraditions.includes(tr));
  for (const inactive of inactiveTraditions) {
    // Only filter out lines that name another specific tradition covered by multi-tradition vendor
    if (vendorTraditions.includes(inactive) && OTHER_TRADITION_MARKERS[inactive].some((re) => re.test(text))) {
      // Allow only if the text ALSO mentions one of the active traditions
      const mentionsActive = activeTraditions.some((act) =>
        OTHER_TRADITION_MARKERS[act].some((re) => re.test(text))
      );
      if (!mentionsActive) return false;
    }
  }
  return true;
}

function matchesLocation(vendorLocation: string, chosenLocation: LocationOption): { score: number; exact: boolean } {
  const loc = vendorLocation.toLowerCase();
  const isMetroWide = loc.includes('metro') || loc.includes('state-wide') || loc.includes('mobile') || loc.includes('greater');

  const keywordsByLocation: Record<LocationOption, string[]> = {
    'Adelaide CBD': ['cbd', 'chinatown', 'north adelaide', 'norwood', 'unley', 'thebarton', 'prospect'],
    'Adelaide Hills': ['hills', 'stirling', 'mount barker', 'foothills'],
    Barossa: ['barossa', 'tanunda'],
    'McLaren Vale': ['mclaren vale', 'southern vales'],
    'Fleurieu Peninsula': ['fleurieu', 'willunga', 'victor harbor'],
    'Glenelg and beaches': ['glenelg', 'henley', 'port adelaide', 'coast'],
    'Northern suburbs': ['northern', 'salisbury', 'kilburn', 'mawson lakes', 'woodville', 'prospect', 'elizabeth', 'campbelltown'],
    'Southern suburbs': ['southern', 'torrensville', 'thebarton', 'unley', 'glenelg'],
  };

  const directHits = keywordsByLocation[chosenLocation];
  if (directHits.some((kw) => loc.includes(kw))) {
    return { score: 24, exact: true };
  }
  if (isMetroWide) {
    return { score: 14, exact: false };
  }
  return { score: 4, exact: false };
}

function estimateVendorCost(
  vendor: Vendor,
  headcount: HeadcountOption
): { scaledEstimate: number; unitPriceLabel: string; summary: string } {
  const hcMeta = HEADCOUNT_OPTIONS.find((h) => h.value === headcount) || HEADCOUNT_OPTIONS[2];
  const numericMatch = vendor.startingPrice.replace(/,/g, '').match(/\d+/);
  const baseNum = numericMatch ? parseInt(numericMatch[0], 10) : 1000;
  const priceLower = vendor.startingPrice.toLowerCase();

  if (priceLower.includes('/ guest')) {
    const scaled = baseNum * hcMeta.midpoint;
    return {
      scaledEstimate: scaled,
      unitPriceLabel: `$${baseNum} / guest`,
      summary: `$${baseNum} / guest · ~$${scaled.toLocaleString()} AUD (${hcMeta.midpoint} guests)`,
    };
  }

  if (priceLower.includes('/ look')) {
    const scaled = baseNum * hcMeta.looks;
    return {
      scaledEstimate: scaled,
      unitPriceLabel: `$${baseNum} / look`,
      summary: `$${baseNum} / look · ~$${scaled.toLocaleString()} AUD (${hcMeta.looks} looks)`,
    };
  }

  if (vendor.category === 'Venues & Marquees' && vendor.id === 'v24' && (headcount === '100-200' || headcount === '200+')) {
    const scaled = headcount === '200+' ? Math.round(baseNum * 1.75) : Math.round(baseNum * 1.35);
    return {
      scaledEstimate: scaled,
      unitPriceLabel: `~$${scaled.toLocaleString()} AUD`,
      summary: `~$${scaled.toLocaleString()} AUD est. (${headcount} span)`,
    };
  }

  return {
    scaledEstimate: baseNum,
    unitPriceLabel: `$${baseNum.toLocaleString()} AUD`,
    summary: `$${baseNum.toLocaleString()} AUD flat base`,
  };
}

function getScopedVendorDetails(
  vendor: Vendor,
  selectedChips: CulturalChipOption[],
  activeTraditions: CulturalTradition[]
): { matchedChips: CulturalChipOption[]; quoteLineItems: string[] } {
  // Never attribute elements from a tradition this vendor does NOT serve, nor categories outside their own services
  const searchable = [
    vendor.businessName,
    vendor.category,
    vendor.description,
    ...vendor.culturalSpecialties,
    ...vendor.features,
  ]
    .join(' ')
    .toLowerCase();

  const traditionAllowedChips = selectedChips.filter(
    (chip) => !chip.tradition || vendor.traditions.includes(chip.tradition)
  );

  const serviceMatchedChips = traditionAllowedChips.filter(
    (chip) =>
      chip.preferredCategories.includes(vendor.category) ||
      chip.keywords.some((kw) => searchable.includes(kw.toLowerCase()))
  );

  // Build quote line items strictly from matched chips for THIS vendor + vendor's own aligned specialties/features
  const items: string[] = [];
  for (const c of serviceMatchedChips) {
    if (!items.includes(c.label)) {
      items.push(c.label);
    }
  }

  // Add aligned cultural specialties from this vendor (excluding specialties mentioning non-selected traditions)
  const relevantTraditions =
    activeTraditions.length > 0
      ? activeTraditions.filter((tr) => vendor.traditions.includes(tr))
      : vendor.traditions;

  for (const spec of vendor.culturalSpecialties) {
    if (items.length >= 3) break;
    if (specialtyMatchesActiveTraditions(spec, vendor.traditions, relevantTraditions) && !items.includes(spec)) {
      items.push(spec);
    }
  }

  // Top up with vendor's own practical inclusions if still short
  for (const feat of vendor.features) {
    if (items.length >= 3) break;
    if (!items.includes(feat)) {
      items.push(feat);
    }
  }

  return {
    matchedChips: serviceMatchedChips,
    quoteLineItems: items.slice(0, 3),
  };
}

export const HowItWorksSection: React.FC = () => {
  const { t } = useLanguage();
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [selectedEventType, setSelectedEventType] = useState<EventTypeTag>(
    'Diwali & Festival of Lights'
  );
  const [selectedTradition, setSelectedTradition] = useState<TraditionDropdownValue>('Indian');
  const [fusionTraditions, setFusionTraditions] = useState<CulturalTradition[]>([
    'Filipino',
    'Chinese',
  ]);
  const [selectedElementIds, setSelectedElementIds] = useState<string[]>(() => {
    const initialChips = getAvailableChips('Diwali & Festival of Lights', 'Indian', []);
    return getDefaultElementIds(initialChips);
  });
  const [headcount, setHeadcount] = useState<HeadcountOption>('60-100');
  const [location, setLocation] = useState<LocationOption>('Adelaide CBD');
  const [budget, setBudget] = useState<BudgetOption>('');
  const [preferredTime, setPreferredTime] = useState<string>(
    DEFAULT_SERVICE_TIME['Diwali & Festival of Lights']
  );
  const [chosenStep3VendorId, setChosenStep3VendorId] = useState<string>('');

  const stepIcons = [Calendar, Sparkles, MessageCircle];
  const activeStep = howItWorksSteps[activeStepIndex];

  const activeTraditions: CulturalTradition[] = useMemo(() => {
    if (selectedTradition === 'Other or Fusion') {
      return fusionTraditions;
    }
    return [selectedTradition];
  }, [selectedTradition, fusionTraditions]);

  const availableChips = useMemo(
    () => getAvailableChips(selectedEventType, selectedTradition, fusionTraditions),
    [selectedEventType, selectedTradition, fusionTraditions]
  );

  const selectedChipObjects = useMemo(
    () => availableChips.filter((c) => selectedElementIds.includes(c.id)),
    [availableChips, selectedElementIds]
  );

  const fireTimelineEvent = (
    nextEventType: EventTypeTag,
    nextTradition: TraditionDropdownValue,
    nextFusion: CulturalTradition[],
    nextHeadcount: HeadcountOption,
    nextLocation: LocationOption,
    nextBudget: BudgetOption,
    nextElementIds: string[],
    stepIndex: number
  ) => {
    const resolvedTraditionLabel =
      nextTradition === 'Other or Fusion'
        ? nextFusion.length > 0
          ? `Fusion: ${nextFusion.join(' + ')}`
          : 'Other'
        : nextTradition;

    trackEvent('timeline_generated', {
      event_type: nextEventType,
      cultural_tradition: resolvedTraditionLabel,
      headcount: nextHeadcount,
      location: nextLocation,
      budget: nextBudget || 'flexible',
      cultural_elements_count: nextElementIds.length,
      step: stepIndex + 1,
    });
  };

  const handleEventTypeChange = (nextType: EventTypeTag) => {
    const nextChips = getAvailableChips(nextType, selectedTradition, fusionTraditions);
    const nextDefaults = getDefaultElementIds(nextChips);
    const nextTime = DEFAULT_SERVICE_TIME[nextType] || '6:30 PM Evening Reception';

    let nextHeadcount = headcount;
    if (nextType === 'Engagements & Proposals' || nextType === 'Elopements') {
      nextHeadcount = 'Under 30';
    } else if (nextType === 'Community Festivals' && (headcount === 'Under 30' || headcount === '30-60')) {
      nextHeadcount = '200+';
    } else if (headcount === 'Under 30') {
      nextHeadcount = '60-100';
    }

    setSelectedEventType(nextType);
    setSelectedElementIds(nextDefaults);
    setHeadcount(nextHeadcount);
    setPreferredTime(nextTime);
    setChosenStep3VendorId('');

    trackEvent('marketplace_filter_used', {
      event_type: nextType,
      cultural_tradition: selectedTradition,
      source: 'how_it_works_step1',
    });
    fireTimelineEvent(
      nextType,
      selectedTradition,
      fusionTraditions,
      nextHeadcount,
      location,
      budget,
      nextDefaults,
      activeStepIndex
    );
  };

  const handleTraditionChange = (nextTradition: TraditionDropdownValue) => {
    const nextChips = getAvailableChips(selectedEventType, nextTradition, fusionTraditions);
    const nextDefaults = getDefaultElementIds(nextChips);

    setSelectedTradition(nextTradition);
    setSelectedElementIds(nextDefaults);
    setChosenStep3VendorId('');

    fireTimelineEvent(
      selectedEventType,
      nextTradition,
      fusionTraditions,
      headcount,
      location,
      budget,
      nextDefaults,
      activeStepIndex
    );
  };

  const handleToggleFusionTradition = (tradition: CulturalTradition) => {
    let nextFusion: CulturalTradition[];
    if (fusionTraditions.includes(tradition)) {
      nextFusion = fusionTraditions.filter((item) => item !== tradition);
    } else if (fusionTraditions.length >= 2) {
      return;
    } else {
      nextFusion = [...fusionTraditions, tradition];
    }

    const nextChips = getAvailableChips(selectedEventType, 'Other or Fusion', nextFusion);
    const nextDefaults = getDefaultElementIds(nextChips);

    setFusionTraditions(nextFusion);
    setSelectedElementIds(nextDefaults);
    setChosenStep3VendorId('');

    fireTimelineEvent(
      selectedEventType,
      'Other or Fusion',
      nextFusion,
      headcount,
      location,
      budget,
      nextDefaults,
      activeStepIndex
    );
  };

  const handleToggleElement = (chipId: string) => {
    const nextIds = selectedElementIds.includes(chipId)
      ? selectedElementIds.filter((id) => id !== chipId)
      : [...selectedElementIds, chipId];
    setSelectedElementIds(nextIds);
    setChosenStep3VendorId('');
    fireTimelineEvent(
      selectedEventType,
      selectedTradition,
      fusionTraditions,
      headcount,
      location,
      budget,
      nextIds,
      activeStepIndex
    );
  };

  const handleHeadcountChange = (nextHeadcount: HeadcountOption) => {
    setHeadcount(nextHeadcount);
    fireTimelineEvent(
      selectedEventType,
      selectedTradition,
      fusionTraditions,
      nextHeadcount,
      location,
      budget,
      selectedElementIds,
      activeStepIndex
    );
  };

  const handleLocationChange = (nextLocation: LocationOption) => {
    setLocation(nextLocation);
    fireTimelineEvent(
      selectedEventType,
      selectedTradition,
      fusionTraditions,
      headcount,
      nextLocation,
      budget,
      selectedElementIds,
      activeStepIndex
    );
  };

  const handleBudgetChange = (nextBudget: BudgetOption) => {
    setBudget(nextBudget);
    fireTimelineEvent(
      selectedEventType,
      selectedTradition,
      fusionTraditions,
      headcount,
      location,
      nextBudget,
      selectedElementIds,
      activeStepIndex
    );
  };

  const handleSelectStep = (idx: number) => {
    setActiveStepIndex(idx);
    if (idx === 1 || idx === 2) {
      fireTimelineEvent(
        selectedEventType,
        selectedTradition,
        fusionTraditions,
        headcount,
        location,
        budget,
        selectedElementIds,
        idx
      );
    }
  };

  // Generate culturally strict 2-3 vendor package directly from vendorsData using vendor.traditions
  const {
    recommendedPackage,
    overallFitScore,
    packageEstimatedTotal,
    exceedsSelectedBudget,
    isClosestFallback,
  } = useMemo(() => {
    const budgetMax = BUDGET_OPTIONS.find((b) => b.value === budget)?.maxAud ?? null;

    // Step A: Find exact matches for eventType + tradition(s)
    const eventPool = vendorsData.filter((v) => v.eventTypes.includes(selectedEventType));
    let exactPool: Vendor[] = [];

    if (activeTraditions.length === 0) {
      // "Other" (no specific tradition picked inside Other or Fusion)
      exactPool = eventPool;
    } else if (activeTraditions.length === 1) {
      exactPool = eventPool.filter((v) => v.traditions.includes(activeTraditions[0]));
    } else {
      // Fusion: vendor must cover BOTH selected traditions
      exactPool = eventPool.filter((v) =>
        activeTraditions.every((tr) => v.traditions.includes(tr))
      );
    }

    let usingClosestFallback = false;
    let candidatePool = exactPool;

    // Step B: Friendly closest fallback if no exact vendor matches (e.g. uncommon Fusion combo or off-season event)
    if (candidatePool.length === 0 && activeTraditions.length > 0) {
      usingClosestFallback = true;
      const partialEventMatch = eventPool.filter((v) =>
        activeTraditions.some((tr) => v.traditions.includes(tr))
      );
      if (partialEventMatch.length > 0) {
        candidatePool = partialEventMatch;
      } else {
        // Fallback to vendors covering the tradition across adjacent celebration types
        const traditionAnyEvent = vendorsData.filter((v) =>
          activeTraditions.some((tr) => v.traditions.includes(tr))
        );
        candidatePool = traditionAnyEvent.length > 0 ? traditionAnyEvent : eventPool;
      }
    }

    // Step C: Score candidates strictly within their own matching traditions & services
    const scored = candidatePool.map((vendor) => {
      const { matchedChips, quoteLineItems } = getScopedVendorDetails(
        vendor,
        selectedChipObjects,
        activeTraditions
      );

      // Relevant chips this vendor could possibly serve (belonging to vendor.traditions or generic)
      const eligibleChipCount = Math.max(
        selectedChipObjects.filter((c) => !c.tradition || vendor.traditions.includes(c.tradition)).length,
        1
      );
      const elementRatio = Math.min(1, matchedChips.length / eligibleChipCount);

      // Prioritize vendors that specialize specifically in the chosen tradition (fewer unrelated traditions = higher cultural specificity)
      const matchedTraditionCount = activeTraditions.filter((tr) => vendor.traditions.includes(tr)).length;
      const culturalSpecificityBonus =
        vendor.traditions.length <= 2
          ? 16
          : vendor.traditions.length <= 4
            ? 8
            : 0;

      // Ensure at least one core service category (Caterer / Venue / Planner / Entertainment) surfaces cleanly
      const coreCategoryPriority =
        vendor.category === 'Caterers'
          ? 12
          : vendor.category === 'Entertainment & DJs' ||
              vendor.category === 'Planners' ||
              vendor.category === 'Cultural Specialists'
            ? 10
            : vendor.category === 'Venues & Marquees' || vendor.category === 'Decor & Styling'
              ? 8
              : 5;

      const locMatch = matchesLocation(vendor.location, location);
      const costInfo = estimateVendorCost(vendor, headcount);

      let budgetAdjust = 0;
      if (budgetMax !== null) {
        budgetAdjust =
          costInfo.scaledEstimate <= budgetMax * 0.65
            ? 8
            : costInfo.scaledEstimate <= budgetMax
              ? 2
              : -10;
      }

      let capacityAdjust = 0;
      if (vendor.id === 'v22' && headcount === '200+') capacityAdjust = -15;
      if (vendor.id === 'v23' && (headcount === '100-200' || headcount === '200+')) capacityAdjust = +10;

      const rawFit =
        (usingClosestFallback ? 54 : 62) +
        matchedTraditionCount * 10 +
        elementRatio * 18 +
        (locMatch.exact ? 8 : locMatch.score >= 12 ? 5 : 2) +
        (matchedChips.length > 0 ? 5 : 0) +
        (budgetAdjust > 0 ? 3 : 0);

      const fitScore = Math.max(68, Math.min(99, Math.round(rawFit)));

      const rankScore =
        matchedTraditionCount * 28 +
        matchedChips.length * 22 +
        culturalSpecificityBonus +
        coreCategoryPriority +
        locMatch.score +
        capacityAdjust +
        budgetAdjust +
        vendor.rating * 3;

      return {
        vendor,
        fitScore,
        rankScore,
        unitPriceLabel: costInfo.unitPriceLabel,
        scaledEstimate: costInfo.scaledEstimate,
        scaledPriceSummary: costInfo.summary,
        matchedChips,
        quoteLineItems,
      };
    });

    scored.sort((a, b) => b.rankScore - a.rankScore);

    // Step D: Pick up to 3 distinct-category vendors
    const chosen: MatchedPackageItem[] = [];
    const seenCategories = new Set<string>();

    for (const item of scored) {
      if (chosen.length >= 3) break;
      if (seenCategories.has(item.vendor.category)) continue;
      seenCategories.add(item.vendor.category);
      chosen.push({
        vendor: item.vendor,
        fitScore: item.fitScore,
        unitPriceLabel: item.unitPriceLabel,
        scaledEstimate: item.scaledEstimate,
        scaledPriceSummary: item.scaledPriceSummary,
        matchedChips: item.matchedChips,
        quoteLineItems: item.quoteLineItems,
      });
    }

    const avgFit =
      chosen.length > 0
        ? Math.round(chosen.reduce((acc, item) => acc + item.fitScore, 0) / chosen.length)
        : 85;
    const totalAud = chosen.reduce((acc, item) => acc + item.scaledEstimate, 0);

    return {
      recommendedPackage: chosen,
      overallFitScore: avgFit,
      packageEstimatedTotal: totalAud,
      exceedsSelectedBudget: budgetMax !== null && totalAud > budgetMax,
      isClosestFallback: usingClosestFallback,
    };
  }, [selectedEventType, activeTraditions, selectedChipObjects, location, headcount, budget]);

  const activeStep3Item = useMemo(() => {
    if (recommendedPackage.length === 0) return null;
    const found = recommendedPackage.find((item) => item.vendor.id === chosenStep3VendorId);
    return found || recommendedPackage[0];
  }, [recommendedPackage, chosenStep3VendorId]);

  const traditionDisplayLabel = useMemo(() => {
    if (selectedTradition !== 'Other or Fusion') {
      return t(`tradition.${selectedTradition}`);
    }
    if (fusionTraditions.length === 0) {
      return t('tradition.Other or Fusion');
    }
    return fusionTraditions.map((tr) => t(`tradition.${tr}`)).join(' + ');
  }, [selectedTradition, fusionTraditions, t]);

  const packageCategoriesLabel = useMemo(() => {
    const uniqueCats = Array.from(new Set(recommendedPackage.map((item) => item.vendor.category)));
    return uniqueCats.map((cat) => t(`cat.${cat}`)).join(' · ');
  }, [recommendedPackage, t]);

  const buildVendorChatMessage = (item: MatchedPackageItem): string => {
    // Strictly reference only matched elements from THIS vendor's tradition(s) and own services
    const matchedTraditionNames =
      activeTraditions.length > 0
        ? activeTraditions.filter((tr) => item.vendor.traditions.includes(tr))
        : [];

    const traditionPhrase =
      matchedTraditionNames.length > 0
        ? `${matchedTraditionNames.join(' & ')} `
        : '';

    const servicePhrase =
      item.matchedChips.length > 0
        ? item.matchedChips.map((c) => c.label).join(', ')
        : item.quoteLineItems.slice(0, 2).join(', ');

    return `"Hi there! Thanks for your ${traditionPhrase}${t(`eventType.${selectedEventType}`)} inquiry for ${headcount} guests in ${location} (${preferredTime}). Within our ${t(`cat.${item.vendor.category}`)} scope, we can quote for ${servicePhrase}—estimated sample guide: ${item.scaledPriceSummary}."`;
  };

  const budgetDisplayLabel = useMemo(() => {
    if (!budget) return t('how.mock1BudgetFlexible');
    return BUDGET_OPTIONS.find((b) => b.value === budget)?.label || t('how.mock1BudgetFlexible');
  }, [budget, t]);

  const findVendorsHref = useMemo(() => {
    const params = new URLSearchParams();
    const eventSlug = getEventSlug(selectedEventType);
    if (eventSlug) {
      params.set('event', eventSlug);
    }

    const singleTradition =
      selectedTradition !== 'Other or Fusion'
        ? selectedTradition
        : fusionTraditions.length === 1
          ? fusionTraditions[0]
          : null;
    if (singleTradition) {
      const traditionSlug = marketplaceTraditionToSlug(singleTradition);
      if (traditionSlug) {
        params.set('tradition', traditionSlug);
      }
    }

    const selectedBudgetOption = BUDGET_OPTIONS.find((b) => b.value === budget);
    if (selectedBudgetOption) {
      params.set('budget', String(Math.round(selectedBudgetOption.maxAud)));
    }

    const selectedHeadcountOption = HEADCOUNT_OPTIONS.find((h) => h.value === headcount);
    if (selectedHeadcountOption) {
      params.set('guests', String(selectedHeadcountOption.midpoint));
    }

    const query = params.toString();
    return getPageHref('vendors', query ? `?${query}` : '');
  }, [selectedEventType, selectedTradition, fusionTraditions, budget, headcount]);

  const currentPlanPreviewData: PlanPreviewContextData | null = useMemo(() => {
    if (!activeStep3Item) return null;
    return {
      eventType: selectedEventType,
      traditionLabel: traditionDisplayLabel,
      culturalElements: selectedChipObjects.map((c) => c.label),
      headcount,
      location,
      budgetLabel: budgetDisplayLabel,
      preferredTime,
      overallFitScore,
      packageEstimatedTotal,
      selectedVendorId: activeStep3Item.vendor.id,
      selectedVendorName: activeStep3Item.vendor.businessName,
      selectedVendorCategory: activeStep3Item.vendor.category,
      selectedVendorFitScore: activeStep3Item.fitScore,
      selectedVendorPriceSummary: activeStep3Item.scaledPriceSummary,
      quoteLineItems: activeStep3Item.quoteLineItems,
      sampleQuoteText: buildVendorChatMessage(activeStep3Item),
      recommendedVendors: recommendedPackage.map((item) => ({
        id: item.vendor.id,
        businessName: item.vendor.businessName,
        category: item.vendor.category,
        location: item.vendor.location,
        fitScore: item.fitScore,
        unitPriceLabel: item.unitPriceLabel,
        scaledPriceSummary: item.scaledPriceSummary,
      })),
    };
  }, [
    activeStep3Item,
    selectedEventType,
    traditionDisplayLabel,
    selectedChipObjects,
    headcount,
    location,
    budgetDisplayLabel,
    preferredTime,
    overallFitScore,
    packageEstimatedTotal,
    recommendedPackage,
  ]);

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-[#FFF8F6] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#8A5A44]">
            {t('how.kicker')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#724319] [text-wrap:balance]">
            {t('how.title')}
          </h2>
          <p className="text-sm sm:text-base text-[#724319]/80 leading-relaxed [text-wrap:balance]">
            {t('how.subtitle')}
          </p>
        </div>

        {/* Step Selector Tabs */}
        <div className="flex justify-center mb-12">
          <div
            className="inline-flex p-1.5 bg-[#F2CCC3]/40 border border-[#EBC1B6] rounded-2xl max-w-2xl w-full"
            role="tablist"
            aria-label="How It Works Steps"
          >
            {howItWorksSteps.map((s, idx) => {
              const Icon = stepIcons[idx];
              const isActive = activeStepIndex === idx;
              return (
                <button
                  key={s.step}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleSelectStep(idx)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 sm:px-5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#724319] shadow-sm font-semibold'
                      : 'text-[#724319]/70 hover:text-[#724319]'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold ${
                      isActive ? 'bg-[#724319] text-white' : 'bg-[#EBC1B6] text-[#724319]'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <Icon className="w-3.5 h-3.5 hidden sm:inline" />
                  <span className="hidden sm:inline">
                    {t('how.stepLabel')} {idx + 1}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Step Showcase Card */}
        <div className="bg-white rounded-3xl border border-[#EBC1B6] p-6 sm:p-10 lg:p-12 shadow-md relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Step Explanation */}
            <div className="lg:col-span-5 space-y-5 text-left">
              <div className="flex items-center gap-3">
                <span className="text-4xl sm:text-5xl font-serif font-bold text-[#8A5A44]/60 tabular-nums">
                  {activeStep.step}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8A5A44] bg-[#FFF8F6] border border-[#EBC1B6] px-3 py-1 rounded-full">
                  {t(`how.${activeStep.step}.badge`)}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#724319]">
                {t(`how.${activeStep.step}.title`)}
              </h3>

              <p className="text-base text-[#724319]/85 leading-relaxed">
                {t(`how.${activeStep.step}.desc`)}
              </p>

              <div className="p-4 bg-[#FFF8F6] rounded-2xl border border-[#EBC1B6]/60">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#8A5A44] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#724319]/85 leading-relaxed">
                    {t(`how.${activeStep.step}.detail`)}
                  </p>
                </div>
              </div>

              {activeStepIndex < 2 && (
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleSelectStep(activeStepIndex + 1)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#724319] hover:bg-[#8A5A44] rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#724319] focus-visible:ring-offset-2"
                  >
                    <span>{t('how.nextStep')}</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>

            {/* Interactive Step Preview Mockup */}
            <div className="lg:col-span-7">
              <div className="bg-[#FFF8F6] rounded-2xl p-5 sm:p-6 border border-[#EBC1B6]/70 shadow-inner space-y-3">
                {/* STEP 1: INTERACTIVE EVENT INTAKE */}
                {activeStepIndex === 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b border-[#EBC1B6]/50">
                      <span className="text-xs font-semibold text-[#724319]">
                        {t('how.mock1Header')}
                      </span>
                      <span className="text-[11px] text-[#8A5A44]">{t('how.mock1Region')}</span>
                    </div>

                    <div className="space-y-3 text-xs">
                      {/* Celebration Type & Cultural Tradition Dropdowns */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div className="p-3 bg-white rounded-xl border border-[#EBC1B6]/50">
                          <label
                            htmlFor="how-event-type-select"
                            className="text-[10px] text-[#8A5A44] uppercase font-bold block mb-1.5"
                          >
                            {t('how.mock1TypeLabel')}
                          </label>
                          <select
                            id="how-event-type-select"
                            value={selectedEventType}
                            onChange={(e) => handleEventTypeChange(e.target.value as EventTypeTag)}
                            className="w-full text-xs sm:text-sm font-semibold text-[#724319] bg-[#FFF8F6] border border-[#EBC1B6] rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-[#8A5A44]/40 cursor-pointer"
                          >
                            {EVENT_TYPE_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>
                                {t(`eventType.${opt}`)}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-[#EBC1B6]/50">
                          <label
                            htmlFor="how-tradition-select"
                            className="text-[10px] text-[#8A5A44] uppercase font-bold block mb-1.5"
                          >
                            {t('how.mock1TraditionLabel')}
                          </label>
                          <select
                            id="how-tradition-select"
                            value={selectedTradition}
                            onChange={(e) =>
                              handleTraditionChange(e.target.value as TraditionDropdownValue)
                            }
                            className="w-full text-xs sm:text-sm font-semibold text-[#724319] bg-[#FFF8F6] border border-[#EBC1B6] rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-[#8A5A44]/40 cursor-pointer"
                          >
                            {TRADITION_DROPDOWN_OPTIONS.map((trOpt) => (
                              <option key={trOpt} value={trOpt}>
                                {t(`tradition.${trOpt}`)}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Fusion Multi-Pick Sub-Control (Up to 2 traditions) */}
                      {selectedTradition === 'Other or Fusion' && (
                        <div className="p-3 bg-white rounded-xl border border-[#EBC1B6]/60 space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-1">
                            <span className="text-[10px] text-[#8A5A44] font-semibold">
                              {t('how.mock1FusionHint')}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-[#724319]">
                              {t('how.mock1FusionCount', { count: fusionTraditions.length })}
                            </span>
                          </div>
                          <div
                            className="flex flex-wrap gap-1.5"
                            role="group"
                            aria-label={t('how.mock1FusionHint')}
                          >
                            {SPECIFIC_TRADITIONS.map((tr) => {
                              const isPicked = fusionTraditions.includes(tr);
                              const isDisabled = !isPicked && fusionTraditions.length >= 2;
                              return (
                                <button
                                  key={tr}
                                  type="button"
                                  disabled={isDisabled}
                                  aria-pressed={isPicked}
                                  onClick={() => handleToggleFusionTradition(tr)}
                                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${
                                    isPicked
                                      ? 'bg-[#8A5A44] text-white border-[#8A5A44] cursor-pointer'
                                      : isDisabled
                                        ? 'bg-[#FFF8F6] text-[#724319]/40 border-[#EBC1B6]/50 cursor-not-allowed'
                                        : 'bg-[#FFF8F6] text-[#724319] border-[#EBC1B6] hover:bg-[#F2CCC3]/40 cursor-pointer'
                                  }`}
                                >
                                  {isPicked && <Check className="w-3 h-3 shrink-0" />}
                                  <span>{t(`tradition.${tr}`)}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Cultural Elements & Requests Multi-Select Chips (scoped strictly to event + tradition) */}
                      <div className="p-3 bg-white rounded-xl border border-[#EBC1B6]/50 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-1">
                          <span className="text-[10px] text-[#8A5A44] uppercase font-bold">
                            {t('how.mock1RitualsLabel')}
                          </span>
                          <span className="text-[10px] text-[#8A5A44]">
                            {t('how.mock1SelectHint')}
                          </span>
                        </div>
                        <div
                          className="flex flex-wrap gap-1.5 pt-0.5"
                          role="group"
                          aria-label={t('how.mock1RitualsLabel')}
                        >
                          {availableChips.map((chip) => {
                            const isChecked = selectedElementIds.includes(chip.id);
                            return (
                              <button
                                key={chip.id}
                                type="button"
                                aria-pressed={isChecked}
                                onClick={() => handleToggleElement(chip.id)}
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all cursor-pointer ${
                                  isChecked
                                    ? 'bg-[#724319] text-white border-[#724319] shadow-2xs'
                                    : 'bg-[#FFF8F6] text-[#724319] border-[#EBC1B6] hover:bg-[#F2CCC3]/40'
                                }`}
                              >
                                {isChecked && <Check className="w-3 h-3 shrink-0" />}
                                <span>{chip.label}</span>
                                {selectedTradition === 'Other or Fusion' &&
                                  fusionTraditions.length === 2 &&
                                  chip.tradition && (
                                    <span
                                      className={`text-[9px] px-1.5 py-0.2 rounded-full ${
                                        isChecked
                                          ? 'bg-white/20 text-white'
                                          : 'bg-[#F2CCC3]/50 text-[#724319]'
                                      }`}
                                    >
                                      {chip.tradition}
                                    </span>
                                  )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Headcount + Location + Budget Real Inputs */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <div className="p-2.5 bg-white rounded-xl border border-[#EBC1B6]/50">
                          <label
                            htmlFor="how-headcount-select"
                            className="text-[10px] text-[#8A5A44] uppercase font-bold block mb-1"
                          >
                            {t('how.mock1Guests')}
                          </label>
                          <select
                            id="how-headcount-select"
                            value={headcount}
                            onChange={(e) => handleHeadcountChange(e.target.value as HeadcountOption)}
                            className="w-full text-xs font-semibold text-[#724319] bg-[#FFF8F6] border border-[#EBC1B6] rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#8A5A44]/40 cursor-pointer"
                          >
                            {HEADCOUNT_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.value}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="p-2.5 bg-white rounded-xl border border-[#EBC1B6]/50">
                          <label
                            htmlFor="how-location-select"
                            className="text-[10px] text-[#8A5A44] uppercase font-bold block mb-1"
                          >
                            {t('how.mock1Location')}
                          </label>
                          <select
                            id="how-location-select"
                            value={location}
                            onChange={(e) => handleLocationChange(e.target.value as LocationOption)}
                            className="w-full text-xs font-semibold text-[#724319] bg-[#FFF8F6] border border-[#EBC1B6] rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#8A5A44]/40 cursor-pointer"
                          >
                            {LOCATION_OPTIONS.map((locOpt) => (
                              <option key={locOpt} value={locOpt}>
                                {locOpt}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="p-2.5 bg-white rounded-xl border border-[#EBC1B6]/50">
                          <label
                            htmlFor="how-budget-select"
                            className="text-[10px] text-[#8A5A44] uppercase font-bold block mb-1"
                          >
                            {t('how.mock1BudgetLabel')}
                          </label>
                          <select
                            id="how-budget-select"
                            value={budget}
                            onChange={(e) => handleBudgetChange(e.target.value as BudgetOption)}
                            className="w-full text-xs font-semibold text-[#724319] bg-[#FFF8F6] border border-[#EBC1B6] rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#8A5A44]/40 cursor-pointer"
                          >
                            <option value="">{t('how.mock1BudgetFlexible')}</option>
                            {BUDGET_OPTIONS.map((bOpt) => (
                              <option key={bOpt.value} value={bOpt.value}>
                                {bOpt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: GENERATED SAMPLE VENDOR PACKAGE */}
                {activeStepIndex === 1 && (
                  <div className="space-y-3.5">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#EBC1B6]/50">
                      <div>
                        <span className="text-xs font-semibold text-[#724319] block">
                          {t('how.mock2Header')}
                        </span>
                        <span className="text-[11px] text-[#8A5A44]">
                          {traditionDisplayLabel} · {t(`eventType.${selectedEventType}`)} · {headcount} · {location}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#724319] bg-[#F2CCC3]/60 border border-[#EBC1B6] px-2.5 py-0.5 rounded-full font-mono font-semibold tabular-nums">
                        {t('how.mock2OverallFit', { score: overallFitScore })}
                      </span>
                    </div>

                    {isClosestFallback && (
                      <div
                        role="status"
                        aria-live="polite"
                        className="p-2.5 bg-amber-50 border border-amber-200 text-[#724319] rounded-xl text-[11px] flex items-start gap-2"
                      >
                        <AlertCircle className="w-4 h-4 text-[#8A5A44] shrink-0 mt-0.5" />
                        <span>
                          {t('how.mock2NoExactMatch')} —{' '}
                          {t('how.mock2CoversLabel', {
                            traditions: Array.from(
                              new Set(recommendedPackage.flatMap((item) => item.vendor.traditions))
                            )
                              .slice(0, 5)
                              .join(', '),
                          })}
                        </span>
                      </div>
                    )}

                    <div className="space-y-2.5 text-xs">
                      {recommendedPackage.map((item) => {
                        const isSelectedForStep3 = activeStep3Item?.vendor.id === item.vendor.id;
                        const displayedTraditions = item.vendor.traditions
                          .filter(
                            (tr) =>
                              activeTraditions.length === 0 ||
                              activeTraditions.includes(tr) ||
                              isClosestFallback
                          )
                          .slice(0, 3)
                          .join(', ');

                        return (
                          <div
                            key={item.vendor.id}
                            className={`p-3 bg-white rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                              isSelectedForStep3
                                ? 'border-[#724319] ring-1 ring-[#724319]/20'
                                : 'border-[#EBC1B6]/50'
                            }`}
                          >
                            <div className="flex items-start gap-3 min-w-0">
                              <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#EBC1B6]/70 bg-[#FFF8F6] shrink-0">
                                <VendorImage
                                  vendor={item.vendor}
                                  variant="thumb"
                                  className="w-full h-full"
                                  imgClassName="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              </div>
                              <div className="min-w-0 space-y-0.5">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span className="text-[10px] font-semibold uppercase tracking-wide text-[#8A5A44]">
                                    {t(`cat.${item.vendor.category}`)}
                                  </span>
                                  <span aria-hidden="true" className="text-[#EBC1B6]">·</span>
                                  <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-[#724319] tabular-nums">
                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                    {Number.isInteger(item.vendor.rating)
                                      ? `${item.vendor.rating}.0`
                                      : item.vendor.rating}
                                  </span>
                                  <span className="text-[10px] font-mono font-semibold bg-[#FFF8F6] border border-[#EBC1B6] text-[#724319] px-1.5 py-0.5 rounded">
                                    {t('how.mock2VendorFit', { score: item.fitScore })}
                                  </span>
                                </div>
                                <div className="font-semibold text-[#724319] truncate">
                                  {item.vendor.businessName}
                                </div>
                                <div className="text-[11px] text-[#724319]/75 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                                  <span className="inline-flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-[#8A5A44] shrink-0" />
                                    <span>{item.vendor.location}</span>
                                  </span>
                                  <span className="text-[10px] font-medium text-[#8A5A44]">
                                    {t('how.mock2CoversLabel', {
                                      traditions:
                                        displayedTraditions || item.vendor.traditions.slice(0, 2).join(', '),
                                    })}
                                  </span>
                                </div>
                                {item.quoteLineItems.length > 0 && (
                                  <div className="text-[10px] text-[#724319]/70 pt-0.5 truncate">
                                    {item.quoteLineItems.join(' · ')}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1.5 shrink-0">
                              <div className="text-right">
                                <div className="text-xs font-bold text-[#724319] tabular-nums">
                                  {item.unitPriceLabel}
                                </div>
                                {item.vendor.startingPrice.toLowerCase().includes('/ guest') && (
                                  <div className="text-[10px] text-[#8A5A44] font-mono tabular-nums">
                                    ~$
                                    {item.scaledEstimate.toLocaleString()} AUD
                                  </div>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setChosenStep3VendorId(item.vendor.id);
                                  handleSelectStep(2);
                                }}
                                aria-pressed={isSelectedForStep3}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-colors cursor-pointer ${
                                  isSelectedForStep3
                                    ? 'bg-[#724319] text-white border-[#724319]'
                                    : 'bg-[#FFF8F6] text-[#724319] border-[#EBC1B6] hover:bg-[#F2CCC3]/50'
                                }`}
                              >
                                {isSelectedForStep3
                                  ? t('how.mock2SelectedForStep3')
                                  : t('how.mock2Step3Select')}
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      {/* Package Total & Accurate Category-Specific Note */}
                      <div className="p-3 bg-[#F2CCC3]/40 rounded-xl text-[11px] text-[#724319] space-y-1.5">
                        <div className="flex items-center justify-between gap-2 font-semibold">
                          <span>{t('how.mock2PackageTotal')}</span>
                          <span className="font-mono text-xs tabular-nums">
                            ~${packageEstimatedTotal.toLocaleString()} AUD
                          </span>
                        </div>
                        {recommendedPackage.length >= 2 && (
                          <div className="flex items-start gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-[#8A5A44] shrink-0 mt-0.5" />
                            <span>
                              {t('how.mock2BundleDynamic', {
                                categories: packageCategoriesLabel,
                                count: recommendedPackage.length,
                              })}
                            </span>
                          </div>
                        )}
                        {exceedsSelectedBudget && (
                          <p className="text-[10px] text-[#724319]/85 italic pt-0.5">
                            {t('how.mock2BudgetHint')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: EXAMPLE VENDOR REPLY, SAMPLE QUOTE & FIND VENDORS CTA */}
                {activeStepIndex === 2 && activeStep3Item && (
                  <div className="space-y-3.5">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#EBC1B6]/50">
                      <h4 className="text-xs font-semibold text-[#724319]">
                        {t('how.mock3Header')}
                      </h4>
                    </div>

                    {isClosestFallback && (
                      <div className="p-2.5 bg-amber-50 border border-amber-200 text-[#724319] rounded-xl text-[11px] flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-[#8A5A44] shrink-0 mt-0.5" />
                        <span>
                          {t('how.mock2NoExactMatch')} —{' '}
                          {t('how.mock2CoversLabel', {
                            traditions: activeStep3Item.vendor.traditions.join(', '),
                          })}
                        </span>
                      </div>
                    )}

                    {/* Vendor switcher + Preferred service time */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-semibold uppercase text-[#8A5A44] mr-0.5">
                          {t('how.mock3ChooseVendor')}
                        </span>
                        {recommendedPackage.map((item) => {
                          const active = item.vendor.id === activeStep3Item.vendor.id;
                          return (
                            <button
                              key={item.vendor.id}
                              type="button"
                              aria-pressed={active}
                              onClick={() => {
                                setChosenStep3VendorId(item.vendor.id);
                              }}
                              className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#724319] ${
                                active
                                  ? 'bg-[#724319] text-white border-[#724319]'
                                  : 'bg-white text-[#724319] border-[#EBC1B6] hover:bg-[#F2CCC3]/40'
                              }`}
                            >
                              {item.vendor.businessName}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <label
                          htmlFor="how-service-time-select"
                          className="text-[10px] font-semibold uppercase text-[#8A5A44] flex items-center gap-1"
                        >
                          <Clock className="w-3 h-3" aria-hidden="true" />
                          <span className="sr-only">{t('how.mock3ServiceTime')}</span>
                        </label>
                        <select
                          id="how-service-time-select"
                          value={preferredTime}
                          onChange={(e) => setPreferredTime(e.target.value)}
                          className="text-[11px] font-semibold text-[#724319] bg-white border border-[#EBC1B6] rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#8A5A44]/30 cursor-pointer"
                        >
                          {SERVICE_TIME_OPTIONS.map((slot) => (
                            <option key={slot} value={slot}>
                              {slot}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Synchronized Vendor Chat + Custom Sample Quote (Strictly Tradition & Service Scoped) */}
                    <div className="space-y-2.5 text-xs">
                      <div className="p-3.5 bg-white rounded-xl border border-[#EBC1B6]/50 space-y-2.5">
                        <div className="flex items-start gap-3 text-[11px] text-[#724319]/85 leading-relaxed">
                          <div className="w-11 h-11 rounded-xl overflow-hidden border border-[#EBC1B6]/70 bg-[#FFF8F6] shrink-0">
                            <VendorImage
                              vendor={activeStep3Item.vendor}
                              variant="thumb"
                              className="w-full h-full"
                              imgClassName="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <div>
                            <div className="font-bold text-[#724319] mb-0.5">
                              {activeStep3Item.vendor.businessName} · {activeStep3Item.vendor.name}
                            </div>
                            <span>{buildVendorChatMessage(activeStep3Item)}</span>
                          </div>
                        </div>

                        <div className="bg-[#FFF8F6] p-2.5 rounded-lg border border-[#EBC1B6]/50 space-y-1.5 text-[11px] text-[#724319]">
                          <div className="flex items-center justify-between gap-2 font-semibold">
                            <span className="inline-flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
                              <span>{t('how.mock3CustomQuoteLabel')}</span>
                            </span>
                            <span className="font-mono text-[#724319]">
                              {activeStep3Item.scaledPriceSummary}
                            </span>
                          </div>
                          <div className="text-[10px] text-[#8A5A44]">
                            {t(`cat.${activeStep3Item.vendor.category}`)} ·{' '}
                            {t('how.mock2CoversLabel', {
                              traditions: activeStep3Item.vendor.traditions
                                .filter(
                                  (tr) =>
                                    activeTraditions.length === 0 ||
                                    activeTraditions.includes(tr) ||
                                    isClosestFallback
                                )
                                .join(', '),
                            })}{' '}
                            · {headcount} · {location} · {preferredTime}
                          </div>
                          <div className="pt-0.5">
                            <span className="text-[10px] font-semibold uppercase text-[#8A5A44] block mb-1">
                              {t('how.mock3QuoteLineItems')}
                            </span>
                            <ul className="space-y-0.5 text-[10px] text-[#724319]/85">
                              {activeStep3Item.quoteLineItems.map((line) => (
                                <li key={line} className="flex items-center gap-1.5">
                                  <Check className="w-3 h-3 text-[#8A5A44] shrink-0" aria-hidden="true" />
                                  <span>{line}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Plain non-interactive informational milestone note */}
                      <div className="p-3 bg-white rounded-xl border border-[#EBC1B6]/60 text-[11px] text-[#724319]/85 flex items-start gap-2">
                        <CheckCircle2
                          className="w-3.5 h-3.5 text-[#8A5A44] shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <p>{t('how.mock3Escrow')}</p>
                      </div>

                      {currentPlanPreviewData && (
                        <PlanSummaryActions plan={currentPlanPreviewData} variant="step3" />
                      )}

                      {/* Step 3 Primary CTA + Secondary Back Button */}
                      <div className="pt-1 flex flex-wrap items-center gap-3">
                        <a
                          href={findVendorsHref}
                          onClick={() => {
                            trackEvent('marketplace_filter_used', {
                              filter_type: 'demo_match',
                              event_type: getEventSlug(selectedEventType),
                            });
                          }}
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#724319] hover:bg-[#8A5A44] rounded-full transition-colors shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#724319] focus-visible:ring-offset-2"
                        >
                          <span>{t('how.mock3FindVendors')}</span>
                          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </a>
                        <button
                          type="button"
                          onClick={() => handleSelectStep(0)}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#724319] bg-white hover:bg-[#F2CCC3]/40 border border-[#EBC1B6] rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#724319] focus-visible:ring-offset-2"
                        >
                          <span>{t('how.backToStep1')}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Required Simulation Disclaimer Caption */}
                <p className="text-[11px] text-[#8A5A44] text-center pt-1">
                  {t('how.simulationCaption')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Step Timeline Cards in one cohesive grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {howItWorksSteps.map((step, idx) => (
            <div
              key={step.step}
              role="button"
              tabIndex={0}
              onClick={() => handleSelectStep(idx)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelectStep(idx);
                }
              }}
              aria-current={activeStepIndex === idx ? 'step' : undefined}
              className={`p-6 rounded-2xl border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#8A5A44]/40 ${
                activeStepIndex === idx
                  ? 'bg-white border-[#724319] shadow-md -translate-y-1'
                  : 'bg-white/60 border-[#EBC1B6]/60 hover:bg-white hover:border-[#8A5A44]/40'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-[#8A5A44]">
                  {t('how.stepUpper')} {step.step}
                </span>
                {activeStepIndex === idx && (
                  <span className="text-[10px] font-bold text-[#724319] bg-[#F2CCC3] px-2 py-0.5 rounded-full">
                    {t('how.activeBadge')}
                  </span>
                )}
              </div>
              <h4 className="text-base font-serif font-bold text-[#724319] mb-2">
                {t(`how.${step.step}.title`)}
              </h4>
              <p className="text-xs text-[#724319]/75 line-clamp-3 leading-relaxed">
                {t(`how.${step.step}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
