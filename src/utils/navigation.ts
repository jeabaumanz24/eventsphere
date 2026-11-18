import { PageId } from '../types';

export interface PageMetaConfig {
  id: PageId;
  slug: string;
  navKey: string;
  title: string;
  description: string;
}

export const PAGE_CONFIGS: Record<PageId, PageMetaConfig> = {
  home: {
    id: 'home',
    slug: '',
    navKey: 'nav.home',
    title: 'EventSphere | Wedding and Event Planning Adelaide',
    description:
      'Plan weddings, Diwali and Lunar New Year celebrations, Eid gatherings, milestone birthdays, proposals and elopements with Adelaide vendors.',
  },
  about: {
    id: 'about',
    slug: 'about',
    navKey: 'nav.about',
    title: 'About EventSphere | Multicultural Event Platform',
    description:
      'Learn how EventSphere supports Adelaide couples, multicultural families, hosts and workplaces celebrating weddings, festivals, birthdays and elopements.',
  },
  services: {
    id: 'services',
    slug: 'services',
    navKey: 'nav.services',
    title: 'Services | AI Vendor Matching and Budget Tools',
    description:
      'Explore AI vendor matching, AUD budget tools and interactive workflows for Adelaide weddings, Diwali, Lunar New Year, Eid, birthdays and proposals.',
  },
  'ai-planner': {
    id: 'ai-planner',
    slug: 'ai-planner',
    navKey: 'nav.aiPlanner',
    title: 'AI Event Planner | Budget and Timeline Tools',
    description:
      'Model AUD budgets and celebration timelines for Adelaide weddings, Diwali, Eid, Lunar New Year, milestone birthdays, elopements and community festivals.',
  },
  vendors: {
    id: 'vendors',
    slug: 'vendors',
    navKey: 'nav.marketplace',
    title: 'Event Vendors Adelaide | Verified Suppliers',
    description:
      'Browse verified Adelaide caterers, venues, entertainers and planners for weddings, cultural festivals, milestone birthdays, proposals and elopements.',
  },
  blog: {
    id: 'blog',
    slug: 'blog',
    navKey: 'nav.blog',
    title: 'Event Planning Guides Adelaide | EventSphere',
    description:
      'Read Adelaide planning guides, AUD budgets and checklists for weddings, Diwali, Lunar New Year, Eid, birthdays, proposals and corporate events.',
  },
  contact: {
    id: 'contact',
    slug: 'contact',
    navKey: 'nav.contact',
    title: 'Contact EventSphere | Book a Planning Consultation',
    description:
      'Contact our Adelaide team for event planning guidance across Greater Adelaide for weddings, cultural festivals, birthdays, proposals and elopements.',
  },
  'vendor-insights': {
    id: 'vendor-insights',
    slug: 'vendor-insights',
    navKey: 'nav.forVendors',
    title: 'Vendor Insights | EventSphere Adelaide Vendors',
    description:
      'See how Adelaide event vendors could track enquiries, views and conversion on EventSphere. Sample dashboard using fictional data.',
  },
  'join-as-a-vendor': {
    id: 'join-as-a-vendor',
    slug: 'join-as-a-vendor',
    navKey: 'nav.joinVendor',
    title: 'Join as a Vendor | EventSphere Adelaide',
    description:
      'Apply to list your event business on EventSphere. Adelaide caterers, photographers, planners, venues and cultural specialists welcome.',
  },
};

export function getBaseUrl(): string {
  const base = import.meta.env.BASE_URL || '/';
  return base.endsWith('/') ? base : `${base}/`;
}

export function getPageHref(page: PageId, suffix = ''): string {
  const base = getBaseUrl();
  const slug = PAGE_CONFIGS[page].slug;
  const pagePath = slug ? `${base}${slug}/` : base;
  return `${pagePath}${suffix}`;
}

export function detectCurrentPage(): PageId {
  if (typeof document !== 'undefined') {
    const declared = document.documentElement.dataset.page as PageId | undefined;
    if (declared && declared in PAGE_CONFIGS) {
      return declared;
    }
  }

  if (typeof window !== 'undefined') {
    const hash = window.location.hash || '';
    if (hash.startsWith('#/blog')) {
      return 'blog';
    }

    const pathname = window.location.pathname.toLowerCase();
    const candidates: PageId[] = [
      'about',
      'services',
      'ai-planner',
      'vendors',
      'blog',
      'contact',
      'vendor-insights',
      'join-as-a-vendor',
    ];
    for (const id of candidates) {
      if (
        pathname.includes(`/${id}/`) ||
        pathname.endsWith(`/${id}`) ||
        pathname.endsWith(`/${id}.html`)
      ) {
        return id;
      }
    }
  }

  return 'home';
}
