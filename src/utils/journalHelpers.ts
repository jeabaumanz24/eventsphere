import { BlogPost, EventTypeTag } from '../types';

export const CELEBRATION_CHAPTERS: EventTypeTag[] = [
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

export const CELEBRATION_SHORT_LABELS: Record<EventTypeTag, string> = {
  Weddings: 'Weddings',
  'Engagements & Proposals': 'Engagements & Proposals',
  Elopements: 'Elopements',
  'Milestone Birthdays': 'Milestone Birthdays',
  'Diwali & Festival of Lights': 'Diwali & Lights',
  'Lunar New Year': 'Lunar New Year',
  Eid: 'Eid',
  'Christenings & Baby Showers': 'Christenings & Showers',
  Graduations: 'Graduations',
  'Community Festivals': 'Community Events',
  'Corporate Events': 'Corporate Events',
};

const LEGACY_POST_CELEBRATION_MAP: Record<string, EventTypeTag> = {
  b0: 'Weddings',
  b1: 'Weddings',
  c3: 'Weddings',
  c4: 'Weddings',
  c5: 'Weddings',
  j1: 'Diwali & Festival of Lights',
  j2: 'Milestone Birthdays',
  j3: 'Engagements & Proposals',
  j4: 'Elopements',
  j6: 'Christenings & Baby Showers',
  j7: 'Community Festivals',
  j8: 'Corporate Events',
};

export function getPostCelebrationType(post: BlogPost): EventTypeTag | undefined {
  if (post.celebrationType) return post.celebrationType;
  return LEGACY_POST_CELEBRATION_MAP[post.id];
}

export function resolvePostText(
  t: (key: string, vars?: Record<string, string | number>) => string,
  key: string,
  fallback: string
): string {
  const translated = t(key);
  return translated === key ? fallback : translated;
}
