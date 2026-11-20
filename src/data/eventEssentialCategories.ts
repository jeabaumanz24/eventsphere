import { EventTypeTag, VendorCategory } from '../types';

export interface EventCategoryPlan {
  essentialCategories: VendorCategory[];
  niceToHaveCategories: VendorCategory[];
  optionalCategories: VendorCategory[];
}

export const ALL_EVENT_TYPES: EventTypeTag[] = [
  'Weddings',
  'Engagements & Proposals',
  'Elopements',
  'Milestone Birthdays',
  'Diwali & Festival of Lights',
  'Lunar New Year',
  'Eid',
  'Christenings & Baby Showers',
  'Graduations',
  'Community Festivals',
  'Corporate Events',
];

export const DEFAULT_OPTIONAL_CATEGORIES: VendorCategory[] = [
  'Florists',
  'Decor & Styling',
  'Makeup Artists',
  'Planners',
  'Entertainment & DJs',
];

export const EVENT_ESSENTIAL_CATEGORIES: Record<EventTypeTag, EventCategoryPlan> = {
  Weddings: {
    essentialCategories: [
      'Photographers',
      'Caterers',
      'Venues & Marquees',
      'Cultural Specialists',
    ],
    niceToHaveCategories: [
      'Florists',
      'Makeup Artists',
      'Entertainment & DJs',
    ],
    optionalCategories: [
      'Florists',
      'Makeup Artists',
      'Entertainment & DJs',
      'Decor & Styling',
      'Planners',
      'Proposal & Elopement',
    ],
  },
  'Engagements & Proposals': {
    essentialCategories: ['Photographers', 'Proposal & Elopement'],
    niceToHaveCategories: [
      'Florists',
      'Decor & Styling',
      'Caterers',
      'Makeup Artists',
    ],
    optionalCategories: [
      'Florists',
      'Decor & Styling',
      'Caterers',
      'Makeup Artists',
      'Planners',
      'Entertainment & DJs',
      'Venues & Marquees',
      'Cultural Specialists',
    ],
  },
  Elopements: {
    essentialCategories: ['Cultural Specialists', 'Photographers'],
    niceToHaveCategories: ['Florists', 'Venues & Marquees'],
    optionalCategories: [
      'Florists',
      'Venues & Marquees',
      'Proposal & Elopement',
      'Decor & Styling',
      'Makeup Artists',
      'Planners',
      'Entertainment & DJs',
      'Caterers',
    ],
  },
  'Milestone Birthdays': {
    essentialCategories: ['Caterers', 'Venues & Marquees'],
    niceToHaveCategories: [
      'Decor & Styling',
      'Entertainment & DJs',
      'Photographers',
    ],
    optionalCategories: [
      'Decor & Styling',
      'Entertainment & DJs',
      'Photographers',
      'Florists',
      'Planners',
      'Makeup Artists',
      'Cultural Specialists',
    ],
  },
  'Diwali & Festival of Lights': {
    essentialCategories: [
      'Caterers',
      'Decor & Styling',
      'Entertainment & DJs',
    ],
    niceToHaveCategories: ['Venues & Marquees', 'Photographers'],
    optionalCategories: [
      'Venues & Marquees',
      'Photographers',
      'Florists',
      'Makeup Artists',
      'Planners',
      'Cultural Specialists',
    ],
  },
  'Lunar New Year': {
    essentialCategories: [
      'Caterers',
      'Decor & Styling',
      'Entertainment & DJs',
    ],
    niceToHaveCategories: ['Venues & Marquees', 'Photographers'],
    optionalCategories: [
      'Venues & Marquees',
      'Photographers',
      'Florists',
      'Makeup Artists',
      'Planners',
      'Cultural Specialists',
    ],
  },
  Eid: {
    essentialCategories: ['Caterers', 'Venues & Marquees'],
    niceToHaveCategories: ['Decor & Styling', 'Photographers'],
    optionalCategories: [
      'Decor & Styling',
      'Photographers',
      'Florists',
      'Makeup Artists',
      'Planners',
      'Entertainment & DJs',
      'Cultural Specialists',
    ],
  },
  'Christenings & Baby Showers': {
    essentialCategories: ['Caterers', 'Venues & Marquees', 'Photographers'],
    niceToHaveCategories: ['Decor & Styling'],
    optionalCategories: [
      'Decor & Styling',
      'Florists',
      'Makeup Artists',
      'Planners',
      'Entertainment & DJs',
      'Cultural Specialists',
    ],
  },
  Graduations: {
    essentialCategories: ['Venues & Marquees', 'Caterers', 'Photographers'],
    niceToHaveCategories: ['Decor & Styling'],
    optionalCategories: [
      'Decor & Styling',
      'Florists',
      'Makeup Artists',
      'Planners',
      'Entertainment & DJs',
      'Cultural Specialists',
    ],
  },
  'Community Festivals': {
    essentialCategories: [
      'Entertainment & DJs',
      'Venues & Marquees',
      'Caterers',
    ],
    niceToHaveCategories: ['Decor & Styling'],
    optionalCategories: [
      'Decor & Styling',
      'Photographers',
      'Florists',
      'Planners',
      'Cultural Specialists',
      'Makeup Artists',
    ],
  },
  'Corporate Events': {
    essentialCategories: [
      'Venues & Marquees',
      'Caterers',
      'Entertainment & DJs',
    ],
    niceToHaveCategories: ['Photographers'],
    optionalCategories: [
      'Photographers',
      'Decor & Styling',
      'Florists',
      'Planners',
      'Cultural Specialists',
      'Makeup Artists',
    ],
  },
};

export function getEssentialCategoriesForEvent(eventType: EventTypeTag): VendorCategory[] {
  return EVENT_ESSENTIAL_CATEGORIES[eventType].essentialCategories;
}

export function getNiceToHaveCategoriesForEvent(eventType: EventTypeTag): VendorCategory[] {
  return EVENT_ESSENTIAL_CATEGORIES[eventType].niceToHaveCategories;
}

export function getOptionalCategoriesForEvent(eventType: EventTypeTag): VendorCategory[] {
  return EVENT_ESSENTIAL_CATEGORIES[eventType].optionalCategories;
}
