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

export interface Vendor {
  id: string;
  name: string;
  businessName: string;
  category: 'Photographers' | 'Planners' | 'Caterers' | 'Florists' | 'Makeup Artists' | 'Cultural Specialists';
  rating: number;
  reviewCount: number;
  location: string;
  startingPrice: string;
  image: string;
  culturalSpecialties: string[];
  description: string;
  features: string[];
  featured?: boolean;
  reviews?: VendorReview[];
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
  title: string;
  category: string;
  readTime: string;
  publishedDate: string;
  summary: string;
  content: string[];
  sections?: BlogArticleSection[];
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
