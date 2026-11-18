import React, { useState, useEffect, useLayoutEffect, useRef, useMemo, useId } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';
import {
  ADELAIDE_MONTH_SEASONS,
  AdelaideSeasonTier,
  formatLocalDateToIso,
  getSeasonInfoForIsoDate,
  getSeasonInfoForMonth,
  getSeasonTierDisplayName,
  getTodayAdelaideDate,
  getTodayAdelaideIso,
  isIsoBeforeAdelaideToday,
  parseFlexibleDateInput,
  parseIsoDateLocal,
} from '../utils/adelaideSeasons';

interface AdelaideDatePickerProps {
  id: string;
  label?: string;
  value: string; // YYYY-MM-DD
  onChange: (nextIsoDate: string) => void;
  locale?: string;
  compact?: boolean;
}

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DESKTOP_POPOVER_WIDTH = 384;

function getSeasonBadgeClasses(tier: AdelaideSeasonTier): string {
  switch (tier) {
    case 'peak':
      return 'bg-amber-50 text-[#7C2D12] border-amber-400';
    case 'quieter':
      return 'bg-emerald-50 text-[#064E3B] border-emerald-400';
    case 'shoulder':
    default:
      return 'bg-[#FFF8F6] text-[#724319] border-[#EBC1B6]';
  }
}

interface SeasonMarkerProps {
  tier: AdelaideSeasonTier;
  inverted?: boolean;
}

const SeasonMarker: React.FC<SeasonMarkerProps> = ({ tier, inverted = false }) => {
  if (tier === 'peak') {
    return (
      <span
        aria-hidden="true"
        className={`inline-block w-2 h-2 rounded-full shrink-0 ${
          inverted ? 'bg-white' : 'bg-[#9A3412]'
        }`}
      />
    );
  }
  if (tier === 'quieter') {
    return (
      <span
        aria-hidden="true"
        className={`inline-block w-2 h-2 rounded-full border-2 bg-transparent shrink-0 ${
          inverted ? 'border-white' : 'border-[#065F46]'
        }`}
      />
    );
  }
  return null;
};

export const AdelaideDatePicker: React.FC<AdelaideDatePickerProps> = ({
  id,
  label,
  value,
  onChange,
  locale = 'en-AU',
  compact = false,
}) => {
  const titleId = useId();
  const descId = useId();
  const monthHeadingId = useId();
  const textInputId = useId();
  const textErrorId = useId();

  const [isOpen, setIsOpen] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );
  const [desktopPos, setDesktopPos] = useState<{
    left: number;
    top?: number;
    bottom?: number;
    maxHeight: number;
  }>({ left: 16, top: 80, maxHeight: 520 });

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const pendingFocusIsoRef = useRef<string | null>(null);

  const todayAdelaideIso = useMemo(() => getTodayAdelaideIso(), []);
  const todayAdelaide = useMemo(() => getTodayAdelaideDate(), []);
  const selectedDate = useMemo(
    () => parseIsoDateLocal(value) ?? todayAdelaide,
    [value, todayAdelaide]
  );

  const [viewYear, setViewYear] = useState<number>(() => selectedDate.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(() => selectedDate.getMonth());
  const [focusedIso, setFocusedIso] = useState<string>(() =>
    isIsoBeforeAdelaideToday(value) ? todayAdelaideIso : value
  );
  const [textDateValue, setTextDateValue] = useState<string>(value);
  const [textDateError, setTextDateError] = useState<string | null>(null);

  // Keep local states synchronized when parent updates `value`
  useEffect(() => {
    const parsed = parseIsoDateLocal(value);
    if (parsed) {
      setViewYear(parsed.getFullYear());
      setViewMonth(parsed.getMonth());
      setFocusedIso(isIsoBeforeAdelaideToday(value) ? todayAdelaideIso : value);
    }
    setTextDateValue(value);
    setTextDateError(null);
  }, [value, todayAdelaideIso]);

  // Compute responsive layout & viewport-clamped desktop coordinates without covering the trigger
  const updatePosition = () => {
    if (typeof window === 'undefined') return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const mobile = vw < 640;
    setIsMobileViewport(mobile);

    if (mobile || !triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const width = Math.min(DESKTOP_POPOVER_WIDTH, vw - 32);
    const left = Math.max(16, Math.min(rect.left, vw - width - 16));
    const spaceBelow = vh - rect.bottom - 16;
    const spaceAbove = rect.top - 16;

    if (spaceBelow >= 380 || spaceBelow >= spaceAbove) {
      setDesktopPos({
        left,
        top: Math.round(rect.bottom + 8),
        maxHeight: Math.max(260, Math.round(spaceBelow)),
      });
    } else {
      setDesktopPos({
        left,
        bottom: Math.round(vh - rect.top + 8),
        maxHeight: Math.max(260, Math.round(spaceAbove)),
      });
    }
  };

  useLayoutEffect(() => {
    if (!isOpen) return;
    updatePosition();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleViewportChange = () => updatePosition();
    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('scroll', handleViewportChange, true);
    return () => {
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('scroll', handleViewportChange, true);
    };
  }, [isOpen]);

  const closeDialog = (restoreFocus = true) => {
    setIsOpen(false);
    setTextDateError(null);
    if (restoreFocus) {
      requestAnimationFrame(() => {
        triggerRef.current?.focus();
      });
    }
  };

  // Focus first meaningful control inside dialog when opened (selected day button if visible, else text input)
  useEffect(() => {
    if (!isOpen) return;
    const initialTargetIso =
      !isIsoBeforeAdelaideToday(value) ? value : todayAdelaideIso;
    const parsed = parseIsoDateLocal(initialTargetIso) ?? todayAdelaide;
    setViewYear(parsed.getFullYear());
    setViewMonth(parsed.getMonth());
    setFocusedIso(formatLocalDateToIso(parsed));
    setTextDateValue(value);
    setTextDateError(null);

    requestAnimationFrame(() => {
      const dialog = dialogRef.current;
      if (!dialog) return;
      const dayBtn = dialog.querySelector<HTMLButtonElement>(
        `button[data-iso="${formatLocalDateToIso(parsed)}"]:not(:disabled)`
      );
      if (dayBtn) {
        dayBtn.focus();
      } else {
        const inputEl = dialog.querySelector<HTMLInputElement>(`#${CSS.escape(textInputId)}`);
        inputEl?.focus();
      }
    });
  }, [isOpen, value, todayAdelaideIso, todayAdelaide, textInputId]);

  // Move focus to newly navigated day button after month switch
  useEffect(() => {
    if (!isOpen || !pendingFocusIsoRef.current) return;
    const targetIso = pendingFocusIsoRef.current;
    pendingFocusIsoRef.current = null;
    requestAnimationFrame(() => {
      const btn = dialogRef.current?.querySelector<HTMLButtonElement>(
        `button[data-iso="${targetIso}"]:not(:disabled)`
      );
      btn?.focus();
    });
  }, [isOpen, viewMonth, viewYear, focusedIso]);

  // Outside click, Escape close, and Focus Trap inside dialog
  useEffect(() => {
    if (!isOpen) return;

    const handleMouseDown = (event: MouseEvent) => {
      if (
        dialogRef.current &&
        !dialogRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        closeDialog(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        closeDialog(true);
        return;
      }

      if (event.key === 'Tab' && dialogRef.current) {
        const focusables = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            'button:not(:disabled), input:not(:disabled), select:not(:disabled), [href], [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => el.offsetParent !== null || el.getClientRects().length > 0);

        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;

        if (event.shiftKey) {
          if (!active || active === first || !dialogRef.current.contains(active)) {
            event.preventDefault();
            last.focus();
          }
        } else {
          if (!active || active === last || !dialogRef.current.contains(active)) {
            event.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isOpen]);

  const selectedSeasonInfo = useMemo(() => getSeasonInfoForIsoDate(value), [value]);
  const viewedSeasonInfo = useMemo(() => getSeasonInfoForMonth(viewMonth), [viewMonth]);

  const formattedSelectedDate = useMemo(() => {
    return selectedDate.toLocaleDateString(locale || 'en-AU', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }, [selectedDate, locale]);

  const selectedAnnouncementText = useMemo(() => {
    const fullDate = selectedDate.toLocaleDateString('en-AU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const tierName = getSeasonTierDisplayName(selectedSeasonInfo.tier);
    return `Selected date: ${fullDate}. ${tierName} season (${selectedSeasonInfo.seasonLabel}). Weekends book first.`;
  }, [selectedDate, selectedSeasonInfo]);

  const canGoPrevMonth =
    viewYear > todayAdelaide.getFullYear() ||
    (viewYear === todayAdelaide.getFullYear() && viewMonth > todayAdelaide.getMonth());

  const handlePrevMonth = () => {
    if (!canGoPrevMonth) return;
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleJumpToMonth = (targetMonthIndex: number) => {
    const currentYear = todayAdelaide.getFullYear();
    const currentMonth = todayAdelaide.getMonth();
    const nextYear =
      viewYear === currentYear && targetMonthIndex < currentMonth
        ? currentYear + 1
        : viewYear < currentYear
        ? currentYear
        : viewYear;
    setViewYear(nextYear);
    setViewMonth(targetMonthIndex);

    // Ensure a valid enabled day in the target month holds roving tabIndex
    const candidateDay =
      nextYear === currentYear && targetMonthIndex === currentMonth
        ? todayAdelaide.getDate()
        : 1;
    setFocusedIso(formatLocalDateToIso(new Date(nextYear, targetMonthIndex, candidateDay)));
  };

  // Build calendar cells (Monday-first grid) for the viewed month
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
    const startOffset = (firstDayOfMonth.getDay() + 6) % 7;
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    const cells: Array<{
      date: Date | null;
      iso: string;
      dayNum: number;
      isPast: boolean;
      isSelected: boolean;
      isToday: boolean;
      isWeekend: boolean;
    }> = [];

    for (let i = 0; i < startOffset; i += 1) {
      cells.push({
        date: null,
        iso: `empty-${i}`,
        dayNum: 0,
        isPast: false,
        isSelected: false,
        isToday: false,
        isWeekend: false,
      });
    }

    for (let dayNum = 1; dayNum <= daysInMonth; dayNum += 1) {
      const date = new Date(viewYear, viewMonth, dayNum);
      const iso = formatLocalDateToIso(date);
      const dayOfWeek = date.getDay();
      cells.push({
        date,
        iso,
        dayNum,
        isPast: date.getTime() < todayAdelaide.getTime(),
        isSelected: iso === value,
        isToday: iso === todayAdelaideIso,
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      });
    }

    return cells;
  }, [viewYear, viewMonth, todayAdelaide, todayAdelaideIso, value]);

  // Ensure roving tabIndex lands on an enabled cell in the viewed month
  const activeGridTabIso = useMemo(() => {
    const matchInMonth = calendarDays.find(
      (c) => c.date !== null && !c.isPast && c.iso === focusedIso
    );
    if (matchInMonth) return matchInMonth.iso;
    const selectedInMonth = calendarDays.find(
      (c) => c.date !== null && !c.isPast && c.isSelected
    );
    if (selectedInMonth) return selectedInMonth.iso;
    const firstEnabled = calendarDays.find((c) => c.date !== null && !c.isPast);
    return firstEnabled?.iso ?? '';
  }, [calendarDays, focusedIso]);

  const moveFocusedDateTo = (targetDate: Date) => {
    const clamped =
      targetDate.getTime() < todayAdelaide.getTime() ? todayAdelaide : targetDate;
    const nextIso = formatLocalDateToIso(clamped);
    pendingFocusIsoRef.current = nextIso;
    setFocusedIso(nextIso);
    setViewYear(clamped.getFullYear());
    setViewMonth(clamped.getMonth());
  };

  const handleDayKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, cellDate: Date) => {
    let handled = true;
    const next = new Date(cellDate.getFullYear(), cellDate.getMonth(), cellDate.getDate());

    switch (e.key) {
      case 'ArrowLeft':
        next.setDate(next.getDate() - 1);
        moveFocusedDateTo(next);
        break;
      case 'ArrowRight':
        next.setDate(next.getDate() + 1);
        moveFocusedDateTo(next);
        break;
      case 'ArrowUp':
        next.setDate(next.getDate() - 7);
        moveFocusedDateTo(next);
        break;
      case 'ArrowDown':
        next.setDate(next.getDate() + 7);
        moveFocusedDateTo(next);
        break;
      case 'PageUp': {
        const targetMonth = cellDate.getMonth() - 1;
        const targetYear = targetMonth < 0 ? cellDate.getFullYear() - 1 : cellDate.getFullYear();
        const normalizedMonth = (targetMonth + 12) % 12;
        const maxDay = new Date(targetYear, normalizedMonth + 1, 0).getDate();
        moveFocusedDateTo(
          new Date(targetYear, normalizedMonth, Math.min(cellDate.getDate(), maxDay))
        );
        break;
      }
      case 'PageDown': {
        const targetMonth = cellDate.getMonth() + 1;
        const targetYear = targetMonth > 11 ? cellDate.getFullYear() + 1 : cellDate.getFullYear();
        const normalizedMonth = targetMonth % 12;
        const maxDay = new Date(targetYear, normalizedMonth + 1, 0).getDate();
        moveFocusedDateTo(
          new Date(targetYear, normalizedMonth, Math.min(cellDate.getDate(), maxDay))
        );
        break;
      }
      case 'Home': {
        // Monday of current week
        const offsetFromMon = (cellDate.getDay() + 6) % 7;
        next.setDate(next.getDate() - offsetFromMon);
        moveFocusedDateTo(next);
        break;
      }
      case 'End': {
        // Sunday of current week
        const offsetFromMon = (cellDate.getDay() + 6) % 7;
        next.setDate(next.getDate() + (6 - offsetFromMon));
        moveFocusedDateTo(next);
        break;
      }
      default:
        handled = false;
    }

    if (handled) {
      e.preventDefault();
    }
  };

  const handleApplyTextDate = (rawVal: string) => {
    const parsedIso = parseFlexibleDateInput(rawVal);
    if (!parsedIso) {
      setTextDateError('Enter a valid date as YYYY-MM-DD or DD/MM/YYYY.');
      return;
    }
    if (isIsoBeforeAdelaideToday(parsedIso)) {
      setTextDateError(
        `Choose ${todayAdelaideIso} or later (Australia/Adelaide time).`
      );
      return;
    }

    setTextDateError(null);
    const parsed = parseIsoDateLocal(parsedIso)!;
    setViewYear(parsed.getFullYear());
    setViewMonth(parsed.getMonth());
    setFocusedIso(parsedIso);
    onChange(parsedIso);
  };

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold uppercase tracking-wider text-[#8A5A44] mb-1.5"
        >
          {label}
        </label>
      )}

      <button
        ref={triggerRef}
        id={id}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-2 rounded-xl border border-[#EBC1B6] text-left transition-colors motion-reduce:transition-none cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724319] ${
          compact
            ? 'bg-white px-3 py-2 text-xs font-semibold text-[#724319] shadow-2xs hover:border-[#8A5A44]'
            : 'bg-[#FFF8F6] px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#724319] hover:bg-[#F2CCC3]/30'
        }`}
      >
        <span className="flex items-center gap-2 min-w-0">
          <Calendar className="w-4 h-4 text-[#8A5A44] shrink-0" aria-hidden="true" />
          <span className="truncate tabular-nums">{formattedSelectedDate}</span>
        </span>

        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border shrink-0 ${getSeasonBadgeClasses(
            selectedSeasonInfo.tier
          )}`}
        >
          <SeasonMarker tier={selectedSeasonInfo.tier} />
          <span>{getSeasonTierDisplayName(selectedSeasonInfo.tier)}</span>
        </span>
      </button>

      {/* Screen-reader live announcement for selected date & Adelaide season */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {selectedAnnouncementText}
      </div>

      {isOpen && (
        <>
          {/* Mobile backdrop for full-width bottom sheet (< 640px) */}
          {isMobileViewport && (
            <div
              className="fixed inset-0 z-40 bg-black/45"
              aria-hidden="true"
              onClick={() => closeDialog(false)}
            />
          )}

          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            style={
              isMobileViewport
                ? undefined
                : {
                    position: 'fixed',
                    left: `${desktopPos.left}px`,
                    ...(desktopPos.top !== undefined
                      ? { top: `${desktopPos.top}px` }
                      : { bottom: `${desktopPos.bottom}px` }),
                    width: `min(${DESKTOP_POPOVER_WIDTH}px, calc(100vw - 32px))`,
                    maxHeight: `${desktopPos.maxHeight}px`,
                  }
            }
            className={
              isMobileViewport
                ? 'fixed inset-x-0 bottom-0 z-50 max-h-[85dvh] flex flex-col bg-white rounded-t-3xl border-t border-[#EBC1B6] shadow-2xl'
                : 'z-50 flex flex-col bg-white rounded-2xl border border-[#EBC1B6] shadow-2xl'
            }
          >
            {/* Dialog Sticky Header */}
            <div className="px-4 pt-4 pb-3 border-b border-[#EBC1B6]/50 flex items-start justify-between gap-3 shrink-0">
              <div className="space-y-0.5">
                <h4
                  id={titleId}
                  className="text-xs sm:text-sm font-serif font-bold text-[#724319]"
                >
                  Adelaide Season Calendar
                </h4>
                <p id={descId} className="text-[11px] text-[#6E432F] leading-snug">
                  Typical demand guide based on Adelaide seasons. Not live vendor availability.
                </p>
              </div>
              <button
                type="button"
                onClick={() => closeDialog(true)}
                aria-label="Close calendar"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF8F6] hover:bg-[#F2CCC3]/45 border border-[#EBC1B6] text-[11px] font-semibold text-[#724319] shrink-0 cursor-pointer transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724319]"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Close</span>
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-4 overflow-y-auto space-y-3.5">
              {/* Plain Text Date Input Alternative */}
              <div className="space-y-1">
                <label
                  htmlFor={textInputId}
                  className="block text-[11px] font-semibold text-[#724319]"
                >
                  Enter date (YYYY-MM-DD or DD/MM/YYYY)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id={textInputId}
                    type="text"
                    inputMode="numeric"
                    value={textDateValue}
                    placeholder="YYYY-MM-DD"
                    aria-invalid={Boolean(textDateError)}
                    aria-describedby={textDateError ? textErrorId : undefined}
                    onChange={(e) => {
                      const nextVal = e.target.value;
                      setTextDateValue(nextVal);
                      if (textDateError) setTextDateError(null);
                      const validIso = parseFlexibleDateInput(nextVal);
                      if (validIso && !isIsoBeforeAdelaideToday(validIso)) {
                        const parsed = parseIsoDateLocal(validIso)!;
                        setViewYear(parsed.getFullYear());
                        setViewMonth(parsed.getMonth());
                        setFocusedIso(validIso);
                        onChange(validIso);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleApplyTextDate(textDateValue);
                      }
                    }}
                    className="flex-1 min-w-0 px-3 py-1.5 rounded-lg bg-[#FFF8F6] border border-[#EBC1B6] text-xs font-mono text-[#724319] placeholder:text-[#6E432F]/60 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#724319]"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyTextDate(textDateValue)}
                    className="px-3 py-1.5 rounded-lg bg-[#724319] hover:bg-[#8A5A44] text-white text-xs font-semibold shrink-0 cursor-pointer transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724319]"
                  >
                    Apply
                  </button>
                </div>
                {textDateError && (
                  <p id={textErrorId} role="alert" className="text-[11px] font-medium text-rose-800">
                    {textDateError}
                  </p>
                )}
              </div>

              {/* 12-Month Adelaide Season Strip (Every month marked with its symbol) */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6E432F] block">
                  Jump to month ({viewYear})
                </span>
                <div className="grid grid-cols-6 gap-1">
                  {ADELAIDE_MONTH_SEASONS.map((mInfo) => {
                    const isViewed = mInfo.monthIndex === viewMonth;
                    const tierName = getSeasonTierDisplayName(mInfo.tier);

                    return (
                      <button
                        key={mInfo.shortName}
                        type="button"
                        onClick={() => handleJumpToMonth(mInfo.monthIndex)}
                        title={`${mInfo.monthName} — ${tierName} (${mInfo.seasonLabel})`}
                        aria-label={`${mInfo.monthName} — ${tierName} season`}
                        aria-pressed={isViewed}
                        className={`px-1.5 py-1 rounded-lg text-[11px] font-medium border transition-colors motion-reduce:transition-none cursor-pointer flex items-center justify-center gap-1 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#724319] ${
                          isViewed
                            ? 'bg-[#724319] text-white border-[#724319] font-bold shadow-2xs'
                            : mInfo.tier === 'peak'
                            ? 'bg-amber-50 text-[#7C2D12] border-amber-400 hover:bg-amber-100'
                            : mInfo.tier === 'quieter'
                            ? 'bg-emerald-50 text-[#064E3B] border-emerald-400 hover:bg-emerald-100'
                            : 'bg-[#FFF8F6] text-[#724319] border-[#EBC1B6] hover:bg-[#F2CCC3]/35'
                        }`}
                      >
                        <span>{mInfo.shortName}</span>
                        <SeasonMarker tier={mInfo.tier} inverted={isViewed} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Month Navigation */}
              <div className="flex items-center justify-between gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  disabled={!canGoPrevMonth}
                  aria-label="Previous month"
                  className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724319] ${
                    canGoPrevMonth
                      ? 'border-[#EBC1B6] bg-[#FFF8F6] text-[#724319] hover:bg-[#F2CCC3]/40 cursor-pointer'
                      : 'border-[#EBC1B6]/40 bg-[#FFF8F6]/50 text-[#724319]/30 cursor-not-allowed'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                </button>

                <div className="text-center">
                  <div
                    id={monthHeadingId}
                    className="text-sm font-serif font-bold text-[#724319]"
                  >
                    {viewedSeasonInfo.monthName} {viewYear}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleNextMonth}
                  aria-label="Next month"
                  className="w-8 h-8 rounded-xl border border-[#EBC1B6] bg-[#FFF8F6] text-[#724319] hover:bg-[#F2CCC3]/40 flex items-center justify-center transition-colors motion-reduce:transition-none cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724319]"
                >
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              {/* Viewed Month Banner (Strictly matches viewedMonth tier) */}
              <div
                className={`px-3 py-2 rounded-xl border text-[11px] leading-snug flex items-start gap-2 ${getSeasonBadgeClasses(
                  viewedSeasonInfo.tier
                )}`}
              >
                <span className="mt-1 shrink-0">
                  <SeasonMarker tier={viewedSeasonInfo.tier} />
                </span>
                <div>
                  <div className="font-bold">
                    {getSeasonTierDisplayName(viewedSeasonInfo.tier)} — {viewedSeasonInfo.seasonLabel}
                  </div>
                  <div className="opacity-95">{viewedSeasonInfo.demandSummary}</div>
                </div>
              </div>

              {/* Calendar Grid */}
              <div role="grid" aria-labelledby={monthHeadingId} className="space-y-1">
                <div role="row" className="grid grid-cols-7 gap-1 text-center">
                  {WEEKDAY_LABELS.map((day) => (
                    <div
                      key={day}
                      role="columnheader"
                      aria-label={day}
                      className="text-[10px] font-semibold uppercase tracking-wider text-[#6E432F] py-1"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((cell) => {
                    if (!cell.date) {
                      return <div key={cell.iso} className="h-9" aria-hidden="true" />;
                    }

                    const monthTier = viewedSeasonInfo.tier;
                    const tierDisplay = getSeasonTierDisplayName(monthTier);
                    const isActiveTabStop = cell.iso === activeGridTabIso;

                    const dayFullLabel = cell.date.toLocaleDateString('en-AU', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    });

                    let cellStyle =
                      'bg-white text-[#724319] border-[#EBC1B6]/50 hover:bg-[#F2CCC3]/35';
                    if (cell.isPast) {
                      cellStyle =
                        'bg-transparent text-[#724319]/35 border-transparent cursor-not-allowed';
                    } else if (cell.isSelected) {
                      cellStyle =
                        'bg-[#724319] text-white border-[#724319] font-bold shadow-xs ring-2 ring-[#724319]/30';
                    } else if (monthTier === 'peak') {
                      cellStyle = cell.isWeekend
                        ? 'bg-amber-100/80 text-[#7C2D12] border-amber-400 font-semibold hover:bg-amber-100'
                        : 'bg-amber-50/70 text-[#7C2D12] border-amber-300/80 hover:bg-amber-100/80';
                    } else if (monthTier === 'quieter') {
                      cellStyle = cell.isWeekend
                        ? 'bg-emerald-50 text-[#064E3B] border-emerald-400 font-semibold hover:bg-emerald-100'
                        : 'bg-emerald-50/50 text-[#064E3B] border-emerald-300/80 hover:bg-emerald-100/70';
                    } else if (cell.isWeekend) {
                      cellStyle =
                        'bg-[#FFF8F6] text-[#724319] border-[#D4A373] font-semibold hover:bg-[#F2CCC3]/40';
                    }

                    return (
                      <button
                        key={cell.iso}
                        type="button"
                        data-iso={cell.iso}
                        tabIndex={!cell.isPast && isActiveTabStop ? 0 : -1}
                        disabled={cell.isPast}
                        aria-disabled={cell.isPast || undefined}
                        aria-pressed={cell.isSelected}
                        title={
                          cell.isPast
                            ? 'Past date unavailable'
                            : cell.isWeekend
                            ? 'Weekends book first'
                            : `${tierDisplay} season`
                        }
                        aria-label={`${dayFullLabel} — ${tierDisplay} season${
                          cell.isWeekend && !cell.isPast ? ', Weekends book first' : ''
                        }${cell.isPast ? ', unavailable past date' : ''}`}
                        onClick={() => {
                          onChange(cell.iso);
                          closeDialog(true);
                        }}
                        onKeyDown={(e) => handleDayKeyDown(e, cell.date!)}
                        className={`relative h-9 rounded-lg border text-xs tabular-nums flex flex-col items-center justify-center transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#724319] ${
                          cell.isPast ? '' : 'cursor-pointer'
                        } ${cellStyle}`}
                      >
                        <span className="leading-none">{cell.dayNum}</span>
                        {!cell.isPast && monthTier !== 'shoulder' && (
                          <span className="mt-0.5 leading-none flex items-center justify-center">
                            <SeasonMarker tier={monthTier} inverted={cell.isSelected} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Visible Legend with Text Labels, Distinct Symbols & Weekend Note */}
              <div className="pt-2.5 border-t border-[#EBC1B6]/50 space-y-1.5 text-[11px] text-[#4A2B10]">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <SeasonMarker tier="peak" />
                    <span>Peak (filled dot)</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <span>Shoulder (no marker)</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <SeasonMarker tier="quieter" />
                    <span>Quieter (hollow ring)</span>
                  </span>
                </div>
                <p className="text-[10px] text-[#6E432F]">
                  Note: Weekends book first across all Adelaide seasons.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
