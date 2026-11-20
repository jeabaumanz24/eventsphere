import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Clock,
  Copy,
  Lightbulb,
  Printer,
} from 'lucide-react';
import {
  CelebrationChecklistConfig,
  ChecklistVendorItem,
  getChecklistBySlug,
} from '../data/checklistsData';
import { trackEvent } from '../utils/analytics';
import { getChecklistHref, getPageHref } from '../utils/navigation';

interface ChecklistDetailPageProps {
  checklist: CelebrationChecklistConfig;
}

export const ChecklistDetailPage: React.FC<ChecklistDetailPageProps> = ({ checklist }) => {
  // In-memory checklist state only (no localStorage)
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  const essentialKeys = useMemo(
    () => checklist.essentials.map((item) => `essential:${item.categorySlug}`),
    [checklist.essentials]
  );

  const checkedEssentialCount = useMemo(
    () => essentialKeys.filter((key) => Boolean(checkedMap[key])).length,
    [essentialKeys, checkedMap]
  );

  const relatedChecklists = useMemo(
    () =>
      checklist.relatedSlugs
        .map((slug) => getChecklistBySlug(slug))
        .filter((item): item is CelebrationChecklistConfig => Boolean(item)),
    [checklist.relatedSlugs]
  );

  const toggleItem = (key: string) => {
    setCheckedMap((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    trackEvent('checklist_used', {
      event_type: checklist.slug,
      action: 'check',
    });
  };

  const buildPlainTextSummary = (): string => {
    const lines: string[] = [
      `${checklist.h1} — EventSphere Adelaide`,
      `${checkedEssentialCount} of ${checklist.essentials.length} essentials planned`,
      '',
      'BOOK FIRST (ESSENTIALS)',
      ...checklist.essentials.map((item) => {
        const key = `essential:${item.categorySlug}`;
        const mark = checkedMap[key] ? '[x]' : '[ ]';
        return `${mark} ${item.label} — ${item.note}`;
      }),
      '',
      'NICE TO HAVE (OPTIONAL EXTRAS)',
      ...checklist.niceToHave.map((item) => {
        const key = `optional:${item.categorySlug}`;
        const mark = checkedMap[key] ? '[x]' : '[ ]';
        return `${mark} ${item.label} — ${item.note}`;
      }),
      '',
      'TYPICAL LEAD TIMES',
      ...checklist.typicalLeadTimes.map((lt) => `- ${lt}`),
      '',
      'PRACTICAL TIP',
      checklist.practicalTip,
    ];
    return lines.join('\n');
  };

  const handleCopyChecklist = async () => {
    const text = buildPlainTextSummary();
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
      trackEvent('checklist_used', {
        event_type: checklist.slug,
        action: 'copy',
      });
    } catch {
      // Ignore clipboard failures in restricted environments
    }
  };

  const handlePrintChecklist = () => {
    trackEvent('checklist_used', {
      event_type: checklist.slug,
      action: 'print',
    });
    if (typeof window !== 'undefined' && typeof window.print === 'function') {
      window.print();
    }
  };

  const renderChecklistRow = (item: ChecklistVendorItem, group: 'essential' | 'optional') => {
    const itemKey = `${group}:${item.categorySlug}`;
    const inputId = `checklist-${checklist.slug}-${group}-${item.categorySlug}`;
    const isChecked = Boolean(checkedMap[itemKey]);
    const vendorHref = getPageHref(
      'vendors',
      `?event=${encodeURIComponent(checklist.slug)}&category=${encodeURIComponent(item.categorySlug)}`
    );

    return (
      <li
        key={itemKey}
        className={`rounded-2xl border p-4 sm:p-5 transition-colors ${
          isChecked
            ? 'bg-[#FFF8F6] border-[#724319]/45'
            : 'bg-white border-[#EBC1B6]/80 hover:border-[#8A5A44]/70'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
          <div className="flex items-start gap-3.5 min-w-0">
            <input
              id={inputId}
              type="checkbox"
              checked={isChecked}
              onChange={() => toggleItem(itemKey)}
              className="mt-1 h-5 w-5 rounded border-[#8A5A44] text-[#724319] accent-[#724319] cursor-pointer shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724319]"
            />
            <div className="min-w-0 space-y-1">
              <label
                htmlFor={inputId}
                className={`block text-base font-serif font-bold cursor-pointer leading-snug ${
                  isChecked ? 'line-through text-[#8A5A44]' : 'text-[#724319]'
                }`}
              >
                {item.label}
              </label>
              <p className="text-xs sm:text-sm text-[#4A2B10]/85 leading-relaxed">
                {item.note}
              </p>
            </div>
          </div>

          <a
            href={vendorHref}
            aria-label={`Browse ${item.label} vendors for ${checklist.displayName}`}
            className="print:hidden inline-flex items-center gap-1.5 self-start sm:self-center px-3.5 py-2 rounded-full bg-[#FFF8F6] hover:bg-[#724319] text-[#724319] hover:text-white border border-[#EBC1B6] hover:border-[#724319] text-xs font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#724319] focus-visible:ring-offset-2"
          >
            <span>Browse vendors</span>
            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </div>
      </li>
    );
  };

  return (
    <section
      id="checklist-detail"
      aria-labelledby="checklist-page-heading"
      className="pt-28 pb-20 md:pt-36 md:pb-24 bg-[#FFF8F6] relative checklist-print-root"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="print:hidden">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-[#8A5A44]">
            <li>
              <a
                href={getPageHref('home')}
                className="hover:text-[#724319] transition-colors rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724319]"
              >
                Home
              </a>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="w-3.5 h-3.5" />
            </li>
            <li>
              <a
                href={getPageHref('checklists')}
                className="hover:text-[#724319] transition-colors rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724319]"
              >
                Celebration Checklists
              </a>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="w-3.5 h-3.5" />
            </li>
            <li aria-current="page" className="text-[#724319] font-semibold">
              {checklist.displayName}
            </li>
          </ol>
        </nav>

        {/* Printable Checklist Container */}
        <div className="checklist-print-area bg-white rounded-3xl border border-[#EBC1B6]/80 shadow-xs p-6 sm:p-8 lg:p-10 space-y-8">
          {/* Header & Intro */}
          <div className="space-y-3 border-b border-[#EBC1B6]/60 pb-6">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#8A5A44]">
              Adelaide Event Vendor Guide
            </span>
            <h1
              id="checklist-page-heading"
              className="text-3xl sm:text-4xl font-serif font-bold text-[#724319] tracking-tight"
            >
              {checklist.h1}
            </h1>
            <p className="text-sm sm:text-base text-[#4A2B10] leading-relaxed">
              {checklist.intro}
            </p>
          </div>

          {/* Interactive Progress Bar & Utility Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-[#FFF8F6] border border-[#EBC1B6]/80 px-5 py-4">
            <div className="space-y-1">
              <p
                aria-live="polite"
                className="text-sm font-semibold text-[#724319] tabular-nums"
              >
                {checkedEssentialCount} of {checklist.essentials.length} essentials planned
              </p>
              <p className="text-xs text-[#6E432F] print:hidden">
                Tick off each vendor type as you shortlist or book. Checklist state stays in this session only.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 print:hidden shrink-0">
              <button
                type="button"
                onClick={handleCopyChecklist}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-[#F2CCC3]/40 text-[#724319] border border-[#EBC1B6] text-xs font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#724319] focus-visible:ring-offset-2"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#8A5A44]" aria-hidden="true" />
                    <span>Copy checklist</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handlePrintChecklist}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-[#F2CCC3]/40 text-[#724319] border border-[#EBC1B6] text-xs font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#724319] focus-visible:ring-offset-2"
              >
                <Printer className="w-3.5 h-3.5 text-[#8A5A44]" aria-hidden="true" />
                <span>Print or save as PDF</span>
              </button>

              <span className="sr-only" aria-live="polite">
                {copied ? 'Checklist copied to clipboard.' : ''}
              </span>
            </div>
          </div>

          {/* Section 1: Book First (Essentials) */}
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#724319]">
                Book first
              </h2>
              <p className="text-xs sm:text-sm text-[#6E432F]">
                Core vendor types to secure early so your celebration date and key logistics are locked in.
              </p>
            </div>
            <ul className="space-y-3">
              {checklist.essentials.map((item) => renderChecklistRow(item, 'essential'))}
            </ul>
          </div>

          {/* Section 2: Nice to Have (Optional Extras) */}
          <div className="space-y-4 pt-2 border-t border-[#EBC1B6]/50">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#724319]">
                Nice to have
              </h2>
              <p className="text-xs sm:text-sm text-[#6E432F]">
                Optional suppliers that elevate the atmosphere once your essentials are arranged.
              </p>
            </div>
            <ul className="space-y-3">
              {checklist.niceToHave.map((item) => renderChecklistRow(item, 'optional'))}
            </ul>
          </div>

          {/* Section 3: Typical Lead Times */}
          <div className="space-y-3 pt-4 border-t border-[#EBC1B6]/50">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#8A5A44] shrink-0" aria-hidden="true" />
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#724319]">
                Typical lead times
              </h2>
            </div>
            <ul className="list-disc pl-5 space-y-2 text-sm text-[#4A2B10] leading-relaxed">
              {checklist.typicalLeadTimes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Section 4: Practical Tip */}
          <div className="rounded-2xl bg-[#FFF8F6] border border-[#EBC1B6] p-5 sm:p-6 space-y-2">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-[#8A5A44] shrink-0" aria-hidden="true" />
              <h2 className="text-lg sm:text-xl font-serif font-bold text-[#724319]">
                Practical tip
              </h2>
            </div>
            <p className="text-sm text-[#4A2B10] leading-relaxed">{checklist.practicalTip}</p>
          </div>
        </div>

        {/* Related Checklists (Hidden on Print) */}
        {relatedChecklists.length > 0 && (
          <div className="print:hidden space-y-4">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#724319]">
              Related checklists
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedChecklists.map((rel) => (
                <a
                  key={rel.slug}
                  href={getChecklistHref(rel.slug)}
                  onClick={() =>
                    trackEvent('checklist_hub_click', {
                      event_type: rel.slug,
                    })
                  }
                  className="group rounded-2xl bg-white border border-[#EBC1B6]/80 hover:border-[#8A5A44] p-5 transition-all hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#724319] focus-visible:ring-offset-2 flex flex-col justify-between gap-3"
                >
                  <div className="space-y-1.5">
                    <h3 className="text-base font-serif font-bold text-[#724319] group-hover:text-[#8A5A44] transition-colors">
                      {rel.displayName}
                    </h3>
                    <p className="text-xs text-[#6E432F] leading-relaxed">
                      {rel.essentials.length} essentials to book first
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#724319] group-hover:translate-x-0.5 transition-transform">
                    <span>View checklist</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Primary CTA & Breadcrumb Back to Hub (Hidden on Print) */}
        <div className="print:hidden pt-4 border-t border-[#EBC1B6]/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <a
            href={getPageHref('checklists')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#724319] hover:text-[#4A2B10] transition-colors rounded-lg px-2 py-1 -ml-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#724319] focus-visible:ring-offset-2"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Back to Celebration Checklists</span>
          </a>

          <a
            href={getPageHref('ai-planner')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#724319] hover:bg-[#8A5A44] text-white text-sm font-semibold shadow-xs hover:shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#724319] focus-visible:ring-offset-2"
          >
            <span>Open AI Planner</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
};
