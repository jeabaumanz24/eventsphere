import { EventTypeTag } from '../types';

export type AdelaideSeasonTier = 'peak' | 'shoulder' | 'quieter';

export const ADELAIDE_TIMEZONE = 'Australia/Adelaide';
export const PEAK_LEAD_TIME_EXTRA_DAYS = 28; // +4 weeks for venue, catering, photography

export interface AdelaideMonthSeasonInfo {
  monthIndex: number; // 0 = Jan ... 11 = Dec
  monthName: string;
  shortName: string;
  tier: AdelaideSeasonTier;
  seasonLabel: string;
  demandSummary: string;
  bookingWindowTip: string;
  weatherSummary: string;
}

export const ADELAIDE_MONTH_SEASONS: AdelaideMonthSeasonInfo[] = [
  {
    monthIndex: 0,
    monthName: 'January',
    shortName: 'Jan',
    tier: 'shoulder',
    seasonLabel: 'Shoulder · Summer Window',
    demandSummary: 'Typically balanced vendor availability ahead of peak autumn demand.',
    bookingWindowTip: 'Book shaded lawns or air-conditioned halls and schedule outdoor ceremonies after 5:30 PM.',
    weatherSummary: 'Typically warm dry summer (~29–35°C) with coastal breezes.',
  },
  {
    monthIndex: 1,
    monthName: 'February',
    shortName: 'Feb',
    tier: 'shoulder',
    seasonLabel: 'Shoulder · Late Summer',
    demandSummary: 'Moderate demand; Lunar New Year gatherings typically fall around Jan–Feb.',
    bookingWindowTip: 'Confirm AV, marquee shade, and cultural performers early before March ramps up.',
    weatherSummary: 'Typically warm evenings (~28–33°C) suited to twilight courtyard banquets.',
  },
  {
    monthIndex: 2,
    monthName: 'March',
    shortName: 'Mar',
    tier: 'peak',
    seasonLabel: 'Peak Autumn Season',
    demandSummary: 'Typically peak demand — festival hospitality and prime autumn weddings.',
    bookingWindowTip: 'Top Adelaide Hills wineries, marquees, and photographers typically book 9–12+ months ahead.',
    weatherSummary: 'Typically balmy ~25–27°C days with soft golden-hour light.',
  },
  {
    monthIndex: 3,
    monthName: 'April',
    shortName: 'Apr',
    tier: 'peak',
    seasonLabel: 'Peak Autumn Season',
    demandSummary: 'Typically peak demand — mild autumn foliage and school holiday gatherings.',
    bookingWindowTip: 'Reserve Saturday caterers and vineyard estates early; Friday dates offer extra flexibility.',
    weatherSummary: 'Typically crisp mild ~22°C days across Barossa and Adelaide Hills.',
  },
  {
    monthIndex: 4,
    monthName: 'May',
    shortName: 'May',
    tier: 'shoulder',
    seasonLabel: 'Shoulder · Late Autumn',
    demandSummary: 'Typically balanced availability across halls, caterers and planners.',
    bookingWindowTip: 'Good middle ground with easier Saturday scheduling and wet-weather marquee backups.',
    weatherSummary: 'Typically cooler ~18–20°C days suited to candlelit stone halls.',
  },
  {
    monthIndex: 5,
    monthName: 'June',
    shortName: 'Jun',
    tier: 'quieter',
    seasonLabel: 'Quieter Winter Season',
    demandSummary: 'Typically quieter demand — stronger Saturday availability & flexible venue minimums.',
    bookingWindowTip: 'Well suited to indoor civic stone halls, dry-hire banquets and winter micro-weddings.',
    weatherSummary: 'Typically cool winter ~15–16°C; indoor heating or sheltered marquees recommended.',
  },
  {
    monthIndex: 6,
    monthName: 'July',
    shortName: 'Jul',
    tier: 'quieter',
    seasonLabel: 'Quieter Winter Season',
    demandSummary: 'Typically highest Saturday availability across photographers, caterers & venues.',
    bookingWindowTip: 'Shorter planning windows are often more feasible with dry-hire halls and winter menus.',
    weatherSummary: 'Typically crisp ~15°C winter days with atmospheric hills backdrops.',
  },
  {
    monthIndex: 7,
    monthName: 'August',
    shortName: 'Aug',
    tier: 'quieter',
    seasonLabel: 'Quieter Late-Winter Window',
    demandSummary: 'Typically quieter demand before the spring celebration rush begins.',
    bookingWindowTip: 'Book indoor dining rooms or heated pavilions with broad short-notice vendor choice.',
    weatherSummary: 'Typically cool ~16–17°C with early wattle blossoms in southern vales.',
  },
  {
    monthIndex: 8,
    monthName: 'September',
    shortName: 'Sep',
    tier: 'peak',
    seasonLabel: 'Peak Spring Season',
    demandSummary: 'Typically peak demand — spring garden ceremonies and outdoor milestone events.',
    bookingWindowTip: 'Confirm outdoor permits, celebrants, and florists early as spring Saturdays fill fast.',
    weatherSummary: 'Typically fresh ~19–21°C spring blooms across Adelaide gardens.',
  },
  {
    monthIndex: 9,
    monthName: 'October',
    shortName: 'Oct',
    tier: 'peak',
    seasonLabel: 'Peak Spring Season',
    demandSummary: 'Typically peak demand — weddings, spring milestones and Diwali celebrations.',
    bookingWindowTip: 'One of Adelaide’s busiest periods; consider Friday or Sunday dates if planning closer in.',
    weatherSummary: 'Typically mild sunny ~22–24°C days ideal for marquees and garden receptions.',
  },
  {
    monthIndex: 10,
    monthName: 'November',
    shortName: 'Nov',
    tier: 'peak',
    seasonLabel: 'Peak Spring Season',
    demandSummary: 'Typically peak demand — weddings, cultural festivals and year-end showcases.',
    bookingWindowTip: 'Lock in cultural specialists, caterers, and photographers early for weekend slots.',
    weatherSummary: 'Typically warm ~25°C twilight evenings suited to courtyard receptions.',
  },
  {
    monthIndex: 11,
    monthName: 'December',
    shortName: 'Dec',
    tier: 'peak',
    seasonLabel: 'Peak Festive Season',
    demandSummary: 'Typically peak festive demand — graduations, corporate parties & summer vows.',
    bookingWindowTip: 'End-of-year functions overlap with weddings; reserve AV, catering and venues early.',
    weatherSummary: 'Typically warm ~27–30°C days with long summer daylight past 8 PM.',
  },
];

export function parseIsoDateLocal(isoDate: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return null;
  const [yStr, mStr, dStr] = isoDate.split('-');
  const y = Number(yStr);
  const m = Number(mStr);
  const d = Number(dStr);
  const dt = new Date(y, m - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) {
    return null;
  }
  return dt;
}

/**
 * Parses either YYYY-MM-DD or DD/MM/YYYY user text input into validated YYYY-MM-DD.
 */
export function parseFlexibleDateInput(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const valid = parseIsoDateLocal(trimmed);
    return valid ? formatLocalDateToIso(valid) : null;
  }

  const auMatch = trimmed.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (auMatch) {
    const day = Number(auMatch[1]);
    const month = Number(auMatch[2]);
    const year = Number(auMatch[3]);
    const dt = new Date(year, month - 1, day);
    if (
      dt.getFullYear() === year &&
      dt.getMonth() === month - 1 &&
      dt.getDate() === day
    ) {
      return formatLocalDateToIso(dt);
    }
  }

  return null;
}

export function formatLocalDateToIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getTodayAdelaideIso(): string {
  try {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: ADELAIDE_TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(new Date());
    const year = parts.find((p) => p.type === 'year')?.value;
    const month = parts.find((p) => p.type === 'month')?.value;
    const day = parts.find((p) => p.type === 'day')?.value;
    if (year && month && day) {
      return `${year}-${month}-${day}`;
    }
  } catch {
    // Fallback to device date if Intl timeZone is unavailable
  }
  const now = new Date();
  return formatLocalDateToIso(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
}

export function getTodayAdelaideDate(): Date {
  return parseIsoDateLocal(getTodayAdelaideIso()) ?? new Date();
}

export function isIsoBeforeAdelaideToday(isoDate: string): boolean {
  const parsed = parseIsoDateLocal(isoDate);
  if (!parsed) return true;
  return parsed.getTime() < getTodayAdelaideDate().getTime();
}

export function buildDefaultDateFromLeadDays(leadDays: number): string {
  const today = getTodayAdelaideDate();
  today.setDate(today.getDate() + Math.max(7, leadDays));
  return formatLocalDateToIso(today);
}

export function getSeasonInfoForMonth(monthIndex: number): AdelaideMonthSeasonInfo {
  const safeIdx = ((monthIndex % 12) + 12) % 12;
  return ADELAIDE_MONTH_SEASONS[safeIdx];
}

export function getSeasonInfoForIsoDate(isoDate: string): AdelaideMonthSeasonInfo {
  const parsed = parseIsoDateLocal(isoDate);
  if (!parsed) {
    return getSeasonInfoForMonth(getTodayAdelaideDate().getMonth());
  }
  return getSeasonInfoForMonth(parsed.getMonth());
}

export function getSeasonTierDisplayName(tier: AdelaideSeasonTier): string {
  switch (tier) {
    case 'peak':
      return 'Peak';
    case 'quieter':
      return 'Quieter';
    case 'shoulder':
    default:
      return 'Shoulder';
  }
}

export function formatLeadLabelFromDays(days: number): string {
  if (days <= 0) return 'Event Day';
  if (days >= 60) {
    const months = Math.round(days / 30);
    return `${months} ${months === 1 ? 'month' : 'months'} before`;
  }
  const weeks = Math.max(1, Math.round(days / 7));
  return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} before`;
}

export interface DateAlignmentAssessment {
  daysUntilEvent: number;
  isWeekend: boolean;
  isSaturday: boolean;
  seasonInfo: AdelaideMonthSeasonInfo;
  statusLevel: 'optimal' | 'caution' | 'tight';
  headline: string;
  guidance: string;
}

export function assessAdelaideDateAlignment(
  isoDate: string,
  eventType: EventTypeTag,
  recommendedLeadDays: number
): DateAlignmentAssessment {
  const parsed = parseIsoDateLocal(isoDate) ?? getTodayAdelaideDate();
  const today = getTodayAdelaideDate();
  const diffMs = parsed.getTime() - today.getTime();
  const daysUntilEvent = Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));
  const dayOfWeek = parsed.getDay(); // 0 = Sun, 6 = Sat
  const isSaturday = dayOfWeek === 6;
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const seasonInfo = getSeasonInfoForMonth(parsed.getMonth());

  if (seasonInfo.tier === 'peak') {
    if (daysUntilEvent < Math.max(45, Math.round(recommendedLeadDays * 0.65))) {
      return {
        daysUntilEvent,
        isWeekend,
        isSaturday,
        seasonInfo,
        statusLevel: 'tight',
        headline: `${seasonInfo.seasonLabel} · Tight booking lead time (${daysUntilEvent} days out)`,
        guidance: `${seasonInfo.monthName} is typically a peak Adelaide period for ${eventType.toLowerCase()}. ${
          isSaturday
            ? 'Weekends book first — consider a Friday/Sunday slot or enquire with multiple vendors soon.'
            : seasonInfo.bookingWindowTip
        }`,
      };
    }

    return {
      daysUntilEvent,
      isWeekend,
      isSaturday,
      seasonInfo,
      statusLevel: 'caution',
      headline: `${seasonInfo.seasonLabel}${isWeekend ? ' · Weekends book first' : ''}`,
      guidance: `${seasonInfo.demandSummary} ${seasonInfo.bookingWindowTip}`,
    };
  }

  if (seasonInfo.tier === 'quieter') {
    return {
      daysUntilEvent,
      isWeekend,
      isSaturday,
      seasonInfo,
      statusLevel: 'optimal',
      headline: `${seasonInfo.seasonLabel} · Typically broader vendor availability`,
      guidance: `${seasonInfo.demandSummary} ${seasonInfo.bookingWindowTip}`,
    };
  }

  // Shoulder season
  if (daysUntilEvent < Math.max(30, Math.round(recommendedLeadDays * 0.45))) {
    return {
      daysUntilEvent,
      isWeekend,
      isSaturday,
      seasonInfo,
      statusLevel: 'caution',
      headline: `${seasonInfo.seasonLabel} · Short lead time (${daysUntilEvent} days)`,
      guidance: `${seasonInfo.bookingWindowTip} Shortlisting dry-hire halls and flexible vendors early will help lock dates.`,
    };
  }

  return {
    daysUntilEvent,
    isWeekend,
    isSaturday,
    seasonInfo,
    statusLevel: 'optimal',
    headline: `${seasonInfo.seasonLabel} · Typically balanced vendor availability`,
    guidance: `${seasonInfo.demandSummary} ${seasonInfo.bookingWindowTip}`,
  };
}
