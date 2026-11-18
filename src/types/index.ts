export interface VendorReview {
  id: string;
  author: string;
  role: string;
  eventDate: string;
  eventType: string;
  location: string;
  rating: number;
  comment: string;
  culturalElements?: string[];
  helpfulCount?: number;
}

export type EventTypeTag =
  | 'Weddings'
  | 'Engagements & Proposals'
  | 'Elopements'
  | 'Milestone Birthdays'
  | 'Diwali & Festival of Lights'
  | 'Lunar New Year'
  | 'Eid'
  | 'Christenings & Baby Showers'
  | 'Graduations'
  | 'Community Festivals'
  | 'Corporate Events';

export type VendorCategory =
  | 'Photographers'
  | 'Planners'
  | 'Caterers'
  | 'Florists'
  | 'Makeup Artists'
  | 'Cultural Specialists'
  | 'Entertainment & DJs'
  | 'Venues & Marquees'
  | 'Decor & Styling'
  | 'Proposal & Elopement';

export type JournalCategory =
  | 'Weddings'
  | 'Festivals'
  | 'Birthdays'
  | 'Proposals & Elopements'
  | 'Corporate'
  | 'Planning Tips';

export type CulturalTradition =
  | 'Filipino'
  | 'Greek'
  | 'Indian'
  | 'Chinese'
  | 'Italian'
  | 'Middle Eastern or Muslim'
  | 'Pacific Islander'
  | 'Vietnamese'
  | 'Korean';

export interface Vendor {
  id: string;
  name: string;
  businessName: string;
  category: VendorCategory;
  rating: number;
  reviewCount: number;
  location: string;
  startingPrice: string;
  image: string;
  traditions: CulturalTradition[];
  culturalSpecialties: string[];
  eventTypes: EventTypeTag[];
  description: string;
  features: string[];
  featured?: boolean;
  reviews?: VendorReview[];
}

export interface BlogBudgetItem {
  category: string;
  estimateAud: string;
  notes: string;
}

export interface BlogArticleGroup {
  title: string;
  subtitle?: string;
  items: string[];
}

export interface BlogArticleSubsection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface BlogArticleCalloutLink {
  promptPrefix: string;
  linkLabel: string;
  targetSlug: string;
}

export interface BlogArticleSection {
  id: string;
  heading: string;
  paragraphs?: string[];
  subsections?: BlogArticleSubsection[];
  bulletLabel?: string;
  bullets?: string[];
  groupIntro?: string;
  groups?: BlogArticleGroup[];
  closingNote?: string;
  calloutLink?: BlogArticleCalloutLink;
  isChecklist?: boolean;
}

export interface BlogFAQ {
  question: string;
  answer: string;
}

export interface BlogSEOMetadata {
  seoTitle: string;
  metaDescription: string;
  urlSlug: string;
  primaryKeyword: string;
  secondaryKeywords?: string[];
  featuredImageRecommendation: string;
  featuredImageAlt: string;
  internalLinkingOpportunities: {
    anchorText: string;
    targetSlug: string;
    context: string;
  }[];
}

export interface BlogPost {
  id: string;
  slug?: string;
  clusterRole?: 'pillar' | 'cluster' | 'editorial';
  journalCategory?: JournalCategory;
  title: string;
  category: string;
  readTime: string;
  publishedDate: string;
  summary: string;
  content: string[];
  sections?: BlogArticleSection[];
  budgetGuide?: {
    title: string;
    subtitle: string;
    items: BlogBudgetItem[];
  };
  recommendedVendorIds?: string[];
  faqs?: BlogFAQ[];
  seo?: BlogSEOMetadata;
  featuredImage?: string;
  author: string;
  featured?: boolean;
}

export interface Testimonial {
  id: string;
  quote: string;
  clientNames: string;
  role: string;
  eventDetails: string;
  rating: number;
  highlight: string;
}

export interface Persona {
  id: 'customer' | 'vendor';
  title: string;
  name: string;
  age?: number;
  role: string;
  location: string;
  image: string;
  goal: string;
  painPoints: string[];
  eventSphereSolutions: string[];
  quote: string;
}

export type PageId =
  | 'home'
  | 'about'
  | 'services'
  | 'ai-planner'
  | 'vendors'
  | 'blog'
  | 'contact'
  | 'vendor-insights';

export interface PlanPreviewVendorSummary {
  id: string;
  businessName: string;
  category: VendorCategory;
  location: string;
  fitScore: number;
  unitPriceLabel: string;
  scaledPriceSummary: string;
}

export interface PlanPreviewContextData {
  eventType: EventTypeTag;
  traditionLabel: string;
  culturalElements: string[];
  headcount: string;
  location: string;
  budgetLabel: string;
  preferredTime: string;
  overallFitScore: number;
  packageEstimatedTotal: number;
  selectedVendorId: string;
  selectedVendorName: string;
  selectedVendorCategory: VendorCategory;
  selectedVendorFitScore: number;
  selectedVendorPriceSummary: string;
  quoteLineItems: string[];
  sampleQuoteText: string;
  recommendedVendors: PlanPreviewVendorSummary[];
}
