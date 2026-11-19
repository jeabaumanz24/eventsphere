import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  Clock,
  Copy,
  Eye,
  Info,
  MessageSquare,
  Printer,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import {
  BreakdownDatum,
  DATE_RANGE_OPTIONS,
  DateRangeId,
  INSIGHTS_VENDOR_OPTIONS,
  buildVendorInsightsReport,
} from '../data/vendorInsightsData';
import { trackEvent } from '../utils/analytics';
import { getPageHref } from '../utils/navigation';
import { VendorImage } from './VendorImage';

interface VendorInsightsSectionProps {
  onCopied?: (message: string) => void;
}

const SHORT_EVENT_LABELS: Record<string, [string, string?]> = {
  Weddings: ['Weddings'],
  'Milestone Birthdays': ['Milestone', 'Birthdays'],
  Diwali: ['Diwali'],
  'Lunar New Year': ['Lunar', 'New Year'],
  Eid: ['Eid'],
  'Corporate Events': ['Corporate', 'Events'],
  Other: ['Other'],
};

interface BreakdownBarChartProps {
  idPrefix: string;
  title: string;
  summaryText: string;
  metricHeader: string;
  data: BreakdownDatum[];
  totalValue: number;
}

const BreakdownBarChart: React.FC<BreakdownBarChartProps> = ({
  idPrefix,
  title,
  summaryText,
  metricHeader,
  data,
  totalValue,
}) => {
  const maxVal = Math.max(...data.map((d) => d.value), 1);

  return (
    <article className="bg-white rounded-3xl border border-[#EBC1B6] p-6 sm:p-7 soft-shadow flex flex-col justify-between break-inside-avoid">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-lg sm:text-xl font-serif font-bold text-[#724319]">
            {title}
          </h3>
          <span className="text-xs font-semibold text-[#724319] bg-[#FFF8F6] border border-[#EBC1B6] px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0 tabular-nums">
            Total: {totalValue.toLocaleString('en-AU')}
          </span>
        </div>

        <p className="text-sm text-[#4A2B10] leading-relaxed mb-5">
          {summaryText}
        </p>

        {/* Horizontal SVG/HTML Bar Visualization (Zero External Libraries) */}
        <div
          className="space-y-3"
          role="list"
          aria-label={`${title} bar chart`}
        >
          {data.map((row) => {
            const widthPct = maxVal > 0 ? Math.round((row.value / maxVal) * 100) : 0;
            const isTop = row.value > 0 && row.value === maxVal;
            const patternId = `${idPrefix}-pat-${row.label.replace(/\s+/g, '-').toLowerCase()}`;

            return (
              <div key={row.label} role="listitem" className="space-y-1">
                <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
                  <span className="font-medium text-[#4A2B10] flex items-center gap-1.5">
                    {row.label}
                    {isTop && (
                      <span className="text-[11px] font-semibold text-[#724319] bg-[#F2CCC3]/55 border border-[#EBC1B6] px-1.5 py-0.5 rounded">
                        Highest
                      </span>
                    )}
                  </span>
                  <span className="font-semibold text-[#724319] tabular-nums whitespace-nowrap">
                    {row.value.toLocaleString('en-AU')}{' '}
                    <span className="text-xs font-normal text-[#4A2B10]">
                      ({row.sharePct.toFixed(1)}%)
                    </span>
                  </span>
                </div>

                <div className="w-full h-5 rounded-lg bg-[#FFF8F6] border border-[#EBC1B6]/80 overflow-hidden relative">
                  {row.value > 0 && (
                    <svg
                      className="h-full block"
                      style={{ width: `${Math.max(widthPct, 4)}%` }}
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      <defs>
                        <pattern
                          id={patternId}
                          width="8"
                          height="8"
                          patternUnits="userSpaceOnUse"
                          patternTransform="rotate(45)"
                        >
                          <rect width="8" height="8" fill="#8A5A44" />
                          <line
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="8"
                            stroke="#FFF8F6"
                            strokeWidth="2.5"
                            strokeOpacity="0.4"
                          />
                        </pattern>
                      </defs>
                      <rect
                        width="100%"
                        height="100%"
                        rx="4"
                        fill={isTop ? '#724319' : `url(#${patternId})`}
                      />
                    </svg>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Accessible Data Table Toggle */}
      <details className="mt-5 pt-4 border-t border-[#EBC1B6]/60 group">
        <summary className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#724319] hover:text-[#4A2B10] cursor-pointer select-none list-none rounded-lg px-2 py-1 -ml-2 hover:bg-[#FFF8F6] transition-colors">
          <span>View data table</span>
          <ChevronDown className="w-3.5 h-3.5 transition-transform group-open:rotate-180" />
        </summary>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs text-[#4A2B10]">
            <thead>
              <tr className="border-b border-[#EBC1B6] bg-[#FFF8F6]">
                <th scope="col" className="py-2 px-2.5 font-semibold text-[#724319]">
                  Category
                </th>
                <th scope="col" className="py-2 px-2.5 font-semibold text-[#724319] text-right">
                  {metricHeader}
                </th>
                <th scope="col" className="py-2 px-2.5 font-semibold text-[#724319] text-right">
                  Share
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBC1B6]/50">
              {data.map((row) => (
                <tr key={row.label}>
                  <th scope="row" className="py-2 px-2.5 font-medium text-[#4A2B10]">
                    {row.label}
                  </th>
                  <td className="py-2 px-2.5 text-right tabular-nums">
                    {row.value.toLocaleString('en-AU')}
                  </td>
                  <td className="py-2 px-2.5 text-right tabular-nums">
                    {row.sharePct.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </article>
  );
};

export const VendorInsightsSection: React.FC<VendorInsightsSectionProps> = ({
  onCopied,
}) => {
  const { t } = useLanguage();
  const [selectedVendorId, setSelectedVendorId] = useState<string>(
    INSIGHTS_VENDOR_OPTIONS[0].id
  );
  const [selectedRange, setSelectedRange] = useState<DateRangeId>('90d');
  const [hasCopied, setHasCopied] = useState(false);

  const report = useMemo(
    () => buildVendorInsightsReport(selectedVendorId, selectedRange),
    [selectedVendorId, selectedRange]
  );

  const handleVendorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextId = e.target.value;
    setSelectedVendorId(nextId);
    setHasCopied(false);
    const chosen = INSIGHTS_VENDOR_OPTIONS.find((opt) => opt.id === nextId);
    if (chosen) {
      trackEvent('vendor_insights_used', {
        filter_type: 'vendor_category',
        filter_value: chosen.roleLabel,
      });
    }
  };

  const handleRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextRange = e.target.value as DateRangeId;
    setSelectedRange(nextRange);
    setHasCopied(false);
    const chosenRange = DATE_RANGE_OPTIONS.find((opt) => opt.id === nextRange);
    if (chosenRange) {
      trackEvent('vendor_insights_used', {
        filter_type: 'date_range',
        filter_value: chosenRange.label,
      });
    }
  };

  const handlePrintReport = () => {
    trackEvent('vendor_report_action', { action: 'print' });
    window.print();
  };

  const handleCopySummary = async () => {
    trackEvent('vendor_report_action', { action: 'copy' });
    const text = report.plainTextSummary;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        throw new Error('Clipboard API unavailable');
      }
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }

    setHasCopied(true);
    if (onCopied) {
      onCopied('Copied vendor insights summary to clipboard.');
    }
    window.setTimeout(() => {
      setHasCopied(false);
    }, 3000);
  };

  // Precompute Chart B (Views by event type SVG column chart) geometry
  const viewsMax = Math.max(...report.viewsByEventType.map((d) => d.value), 1);
  const topViewsBucket = [...report.viewsByEventType].sort(
    (a, b) => b.value - a.value
  )[0];

  // Precompute Chart D (Enquiries over time SVG line chart) geometry
  const series = report.enquiriesOverTime;
  const maxSeriesVal = Math.max(...series.map((p) => p.enquiries), 1);
  const minSeriesVal = Math.min(...series.map((p) => p.enquiries));
  const yCeiling = Math.ceil(maxSeriesVal * 1.2);
  const svgW = 560;
  const svgH = 225;
  const padL = 42;
  const padR = 24;
  const padT = 26;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const linePoints = series.map((pt, idx) => {
    const x =
      series.length === 1
        ? padL + plotW / 2
        : padL + (idx / (series.length - 1)) * plotW;
    const y = padT + plotH - (pt.enquiries / yCeiling) * plotH;
    return { ...pt, x, y };
  });

  const polylineCoords = linePoints
    .map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(' ');
  const areaCoords =
    linePoints.length > 0
      ? `${linePoints[0].x.toFixed(1)},${(padT + plotH).toFixed(1)} ${polylineCoords} ${linePoints[
          linePoints.length - 1
        ].x.toFixed(1)},${(padT + plotH).toFixed(1)}`
      : '';

  const firstPeriod = series[0];
  const lastPeriod = series[series.length - 1];
  const trendDirectionText =
    lastPeriod && firstPeriod && lastPeriod.enquiries >= firstPeriod.enquiries
      ? `grew from ${firstPeriod.enquiries} in ${firstPeriod.period} to ${lastPeriod.enquiries} in ${lastPeriod.period}`
      : `moved from ${firstPeriod?.enquiries ?? 0} in ${firstPeriod?.period ?? ''} to ${lastPeriod?.enquiries ?? 0} in ${lastPeriod?.period ?? ''}`;

  const joinVendorHref = getPageHref('join-as-a-vendor');

  return (
    <section
      id="vendor-insights"
      aria-labelledby="vendor-insights-heading"
      className="pt-32 sm:pt-36 pb-20 bg-[#FFF8F6]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Simulation Disclaimer Banner */}
        <div
          role="note"
          className="rounded-2xl bg-[#F2CCC3]/50 border border-[#8A5A44]/35 px-4 py-3 flex items-start sm:items-center gap-3 text-sm text-[#4A2B10]"
        >
          <Info className="w-4 h-4 text-[#724319] shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
          <p className="font-medium leading-snug">
            {t('vendorInsights.disclaimer')}
          </p>
        </div>

        {/* Intro Header + CTA */}
        <div className="bg-white rounded-3xl border border-[#EBC1B6] p-6 sm:p-8 lg:p-10 soft-shadow">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#724319] bg-[#FFF8F6] border border-[#EBC1B6] px-3 py-1 rounded-lg">
                <BarChart3 className="w-3.5 h-3.5 text-[#724319]" aria-hidden="true" />
                <span>Adelaide Partner Preview · Sample Simulation</span>
              </div>
              <h1
                id="vendor-insights-heading"
                className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#724319] tracking-tight"
              >
                {t('vendorInsights.title')}
              </h1>
              <p className="text-base sm:text-lg text-[#4A2B10] leading-relaxed">
                {t('vendorInsights.subtitle')}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0 print:hidden">
              <a
                href={joinVendorHref}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#724319] hover:bg-[#8A5A44] text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all"
              >
                <span>{t('vendorInsights.joinCta')}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Controls: Fictional Vendor Selector + Date Range Selector */}
          <div className="mt-8 pt-6 border-t border-[#EBC1B6]/70 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 print:hidden">
            <div>
              <label
                htmlFor="insights-vendor-select"
                className="block text-xs font-semibold uppercase tracking-wider text-[#724319] mb-2"
              >
                Select fictional vendor profile
              </label>
              <select
                id="insights-vendor-select"
                value={selectedVendorId}
                onChange={handleVendorChange}
                className="w-full rounded-xl border border-[#8A5A44]/40 bg-[#FFF8F6] px-4 py-3 text-sm font-medium text-[#4A2B10] focus:border-[#724319] cursor-pointer"
              >
                {INSIGHTS_VENDOR_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.businessName} ({option.roleLabel})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="insights-range-select"
                className="block text-xs font-semibold uppercase tracking-wider text-[#724319] mb-2"
              >
                Date range
              </label>
              <select
                id="insights-range-select"
                value={selectedRange}
                onChange={handleRangeChange}
                className="w-full rounded-xl border border-[#8A5A44]/40 bg-[#FFF8F6] px-4 py-3 text-sm font-medium text-[#4A2B10] focus:border-[#724319] cursor-pointer"
              >
                {DATE_RANGE_OPTIONS.map((rangeOpt) => (
                  <option key={rangeOpt.id} value={rangeOpt.id}>
                    {rangeOpt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Selected Profile Metadata Context + Live Region Announcement */}
          <div
            aria-live="polite"
            className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-[#4A2B10] bg-[#FFF8F6] border border-[#EBC1B6]/80 rounded-xl px-4 py-2.5"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl overflow-hidden border border-[#EBC1B6] bg-white shrink-0">
                <VendorImage
                  vendor={report.vendor}
                  variant="thumb"
                  className="w-full h-full"
                  imgClassName="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <span>
                Showing sample dashboard for{' '}
                <strong className="text-[#724319]">{report.vendor.businessName}</strong> (
                {report.roleLabel} · {report.vendor.location}) over{' '}
                <strong className="text-[#724319]">{report.dateRange.label}</strong>.
              </span>
            </div>
            <span className="text-xs text-[#724319] font-medium">
              Tagged traditions: {report.vendor.traditions.join(', ')}
            </span>
          </div>
        </div>

        {/* Summary KPI Cards */}
        <div
          aria-label="Key sample performance metrics"
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6"
        >
          <div className="bg-white rounded-3xl border border-[#EBC1B6] p-6 soft-shadow">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#724319]">
                Profile views
              </span>
              <span className="w-9 h-9 rounded-xl bg-[#FFF8F6] border border-[#EBC1B6] flex items-center justify-center text-[#724319]">
                <Eye className="w-4 h-4" aria-hidden="true" />
              </span>
            </div>
            <div className="text-3xl font-serif font-bold text-[#4A2B10] tabular-nums">
              {report.summary.profileViews.toLocaleString('en-AU')}
            </div>
            <p className="mt-2 text-xs font-semibold text-[#724319]">
              {report.summary.viewsDelta}
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#EBC1B6] p-6 soft-shadow">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#724319]">
                Enquiries
              </span>
              <span className="w-9 h-9 rounded-xl bg-[#FFF8F6] border border-[#EBC1B6] flex items-center justify-center text-[#724319]">
                <MessageSquare className="w-4 h-4" aria-hidden="true" />
              </span>
            </div>
            <div className="text-3xl font-serif font-bold text-[#4A2B10] tabular-nums">
              {report.summary.enquiries.toLocaleString('en-AU')}
            </div>
            <p className="mt-2 text-xs font-semibold text-[#724319]">
              {report.summary.enquiriesDelta}
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#EBC1B6] p-6 soft-shadow">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#724319]">
                Conversion rate
              </span>
              <span className="w-9 h-9 rounded-xl bg-[#FFF8F6] border border-[#EBC1B6] flex items-center justify-center text-[#724319]">
                <TrendingUp className="w-4 h-4" aria-hidden="true" />
              </span>
            </div>
            <div className="text-3xl font-serif font-bold text-[#4A2B10] tabular-nums">
              {report.summary.conversionRate.toFixed(1)}%
            </div>
            <p className="mt-2 text-xs font-semibold text-[#724319]">
              {report.summary.conversionDelta} · enquiries / views
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#EBC1B6] p-6 soft-shadow">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#724319]">
                Average response time
              </span>
              <span className="w-9 h-9 rounded-xl bg-[#FFF8F6] border border-[#EBC1B6] flex items-center justify-center text-[#724319]">
                <Clock className="w-4 h-4" aria-hidden="true" />
              </span>
            </div>
            <div className="text-3xl font-serif font-bold text-[#4A2B10] tabular-nums">
              {report.summary.avgResponseHours.toFixed(1)} hrs
            </div>
            <p className="mt-2 text-xs font-semibold text-[#724319]">
              {report.summary.responseDelta}
            </p>
          </div>
        </div>

        {/* 4 Accessible Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart A: Enquiries by Event Type */}
          <BreakdownBarChart
            idPrefix="enq-event"
            title="Enquiries by event type"
            summaryText={`${report.topEventType.label} leads enquiry volume with ${report.topEventType.value} enquiries (${report.topEventType.sharePct.toFixed(1)}% of all enquiries) across the ${report.dateRange.shortLabel} window.`}
            metricHeader="Enquiries"
            data={report.enquiriesByEventType}
            totalValue={report.summary.enquiries}
          />

          {/* Chart B: Views by Event Type (Inline SVG Column Chart) */}
          <article className="bg-white rounded-3xl border border-[#EBC1B6] p-6 sm:p-7 soft-shadow flex flex-col justify-between break-inside-avoid">
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-lg sm:text-xl font-serif font-bold text-[#724319]">
                  Views by event type
                </h3>
                <span className="text-xs font-semibold text-[#724319] bg-[#FFF8F6] border border-[#EBC1B6] px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0 tabular-nums">
                  Total: {report.summary.profileViews.toLocaleString('en-AU')}
                </span>
              </div>

              <p className="text-sm text-[#4A2B10] leading-relaxed mb-4">
                {topViewsBucket.label} attracted the highest profile visibility at{' '}
                {topViewsBucket.value.toLocaleString('en-AU')} views (
                {topViewsBucket.sharePct.toFixed(1)}% of total views).
              </p>

              <div className="w-full overflow-hidden">
                <svg
                  viewBox="0 0 560 235"
                  className="w-full h-auto block"
                  role="img"
                  aria-labelledby="views-chart-svg-title"
                >
                  <title id="views-chart-svg-title">
                    Profile views by event type for {report.vendor.businessName}
                  </title>
                  <defs>
                    <pattern
                      id="views-col-hatch"
                      width="8"
                      height="8"
                      patternUnits="userSpaceOnUse"
                      patternTransform="rotate(45)"
                    >
                      <rect width="8" height="8" fill="#8A5A44" />
                      <line
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="8"
                        stroke="#FFF8F6"
                        strokeWidth="2.5"
                        strokeOpacity="0.38"
                      />
                    </pattern>
                  </defs>

                  {/* Baseline & Horizontal Grid */}
                  {[0, 0.5, 1].map((ratio) => {
                    const y = 175 - ratio * 135;
                    return (
                      <line
                        key={ratio}
                        x1={20}
                        y1={y}
                        x2={545}
                        y2={y}
                        stroke="#EBC1B6"
                        strokeDasharray={ratio === 0 ? undefined : '4 4'}
                        strokeWidth="1"
                      />
                    );
                  })}

                  {report.viewsByEventType.map((datum, idx) => {
                    const slotW = 520 / report.viewsByEventType.length;
                    const barW = 40;
                    const x = 22 + idx * slotW + (slotW - barW) / 2;
                    const maxBarH = 132;
                    const barH =
                      datum.value > 0
                        ? Math.max(8, Math.round((datum.value / viewsMax) * maxBarH))
                        : 2;
                    const y = 175 - barH;
                    const isTop = datum.value > 0 && datum.value === viewsMax;
                    const lines = SHORT_EVENT_LABELS[datum.label] || [datum.label];

                    return (
                      <g key={datum.label}>
                        <rect
                          x={x}
                          y={y}
                          width={barW}
                          height={barH}
                          rx={5}
                          fill={
                            datum.value === 0
                              ? '#EBC1B6'
                              : isTop
                              ? '#724319'
                              : 'url(#views-col-hatch)'
                          }
                        />
                        <text
                          x={x + barW / 2}
                          y={y - 6}
                          textAnchor="middle"
                          fontSize="11.5"
                          fontWeight="700"
                          fill="#4A2B10"
                        >
                          {datum.value.toLocaleString('en-AU')}
                        </text>
                        <text
                          x={x + barW / 2}
                          y={194}
                          textAnchor="middle"
                          fontSize="10.5"
                          fontWeight="600"
                          fill="#4A2B10"
                        >
                          {lines[0]}
                          {lines[1] && (
                            <tspan x={x + barW / 2} dy="13">
                              {lines[1]}
                            </tspan>
                          )}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            <details className="mt-4 pt-4 border-t border-[#EBC1B6]/60 group">
              <summary className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#724319] hover:text-[#4A2B10] cursor-pointer select-none list-none rounded-lg px-2 py-1 -ml-2 hover:bg-[#FFF8F6] transition-colors">
                <span>View data table</span>
                <ChevronDown className="w-3.5 h-3.5 transition-transform group-open:rotate-180" />
              </summary>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs text-[#4A2B10]">
                  <thead>
                    <tr className="border-b border-[#EBC1B6] bg-[#FFF8F6]">
                      <th scope="col" className="py-2 px-2.5 font-semibold text-[#724319]">
                        Event type
                      </th>
                      <th scope="col" className="py-2 px-2.5 font-semibold text-[#724319] text-right">
                        Views
                      </th>
                      <th scope="col" className="py-2 px-2.5 font-semibold text-[#724319] text-right">
                        Share
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EBC1B6]/50">
                    {report.viewsByEventType.map((row) => (
                      <tr key={row.label}>
                        <th scope="row" className="py-2 px-2.5 font-medium text-[#4A2B10]">
                          {row.label}
                        </th>
                        <td className="py-2 px-2.5 text-right tabular-nums">
                          {row.value.toLocaleString('en-AU')}
                        </td>
                        <td className="py-2 px-2.5 text-right tabular-nums">
                          {row.sharePct.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          </article>

          {/* Chart C: Popular Cultural Traditions Among Enquiries */}
          <BreakdownBarChart
            idPrefix="enq-tradition"
            title="Popular cultural traditions among enquiries"
            summaryText={`${report.topTradition.label} hosts generated ${report.topTradition.value} enquiries (${report.topTradition.sharePct.toFixed(1)}%), making it the leading cultural tradition for ${report.vendor.businessName}.`}
            metricHeader="Enquiries"
            data={report.enquiriesByTradition}
            totalValue={report.summary.enquiries}
          />

          {/* Chart D: Enquiries Over Time (Inline SVG Line Chart) */}
          <article className="bg-white rounded-3xl border border-[#EBC1B6] p-6 sm:p-7 soft-shadow flex flex-col justify-between break-inside-avoid">
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-lg sm:text-xl font-serif font-bold text-[#724319]">
                  Enquiries over time
                </h3>
                <span className="text-xs font-semibold text-[#724319] bg-[#FFF8F6] border border-[#EBC1B6] px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0 tabular-nums">
                  {report.dateRange.label}
                </span>
              </div>

              <p className="text-sm text-[#4A2B10] leading-relaxed mb-4">
                Enquiry volume {trendDirectionText} (range {minSeriesVal}–{maxSeriesVal} per period).
              </p>

              <div className="w-full overflow-hidden">
                <svg
                  viewBox={`0 0 ${svgW} ${svgH}`}
                  className="w-full h-auto block"
                  role="img"
                  aria-labelledby="enquiries-trend-svg-title"
                >
                  <title id="enquiries-trend-svg-title">
                    Enquiries over time for {report.vendor.businessName} ({report.dateRange.label})
                  </title>

                  {/* Y-axis horizontal guides */}
                  {[0, 0.5, 1].map((ratio) => {
                    const y = padT + plotH - ratio * plotH;
                    const tickVal = Math.round(ratio * yCeiling);
                    return (
                      <g key={ratio}>
                        <line
                          x1={padL}
                          y1={y}
                          x2={svgW - padR}
                          y2={y}
                          stroke="#EBC1B6"
                          strokeDasharray={ratio === 0 ? undefined : '4 4'}
                          strokeWidth="1"
                        />
                        <text
                          x={padL - 8}
                          y={y + 4}
                          textAnchor="end"
                          fontSize="10.5"
                          fontWeight="500"
                          fill="#4A2B10"
                        >
                          {tickVal}
                        </text>
                      </g>
                    );
                  })}

                  {/* Soft tinted area fill */}
                  {areaCoords && (
                    <polygon points={areaCoords} fill="#EBC1B6" fillOpacity="0.32" />
                  )}

                  {/* Line stroke */}
                  <polyline
                    fill="none"
                    stroke="#724319"
                    strokeWidth="2.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={polylineCoords}
                  />

                  {/* Points + Direct Numeric Labels */}
                  {linePoints.map((pt) => (
                    <g key={pt.period}>
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={5}
                        fill="#724319"
                        stroke="#FFF8F6"
                        strokeWidth="2"
                      />
                      <text
                        x={pt.x}
                        y={pt.y - 10}
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="700"
                        fill="#4A2B10"
                      >
                        {pt.enquiries}
                      </text>
                      <text
                        x={pt.x}
                        y={svgH - 12}
                        textAnchor="middle"
                        fontSize="10.5"
                        fontWeight="600"
                        fill="#4A2B10"
                      >
                        {pt.period}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>

            <details className="mt-4 pt-4 border-t border-[#EBC1B6]/60 group">
              <summary className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#724319] hover:text-[#4A2B10] cursor-pointer select-none list-none rounded-lg px-2 py-1 -ml-2 hover:bg-[#FFF8F6] transition-colors">
                <span>View data table</span>
                <ChevronDown className="w-3.5 h-3.5 transition-transform group-open:rotate-180" />
              </summary>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs text-[#4A2B10]">
                  <thead>
                    <tr className="border-b border-[#EBC1B6] bg-[#FFF8F6]">
                      <th scope="col" className="py-2 px-2.5 font-semibold text-[#724319]">
                        Period
                      </th>
                      <th scope="col" className="py-2 px-2.5 font-semibold text-[#724319] text-right">
                        Enquiries
                      </th>
                      <th scope="col" className="py-2 px-2.5 font-semibold text-[#724319] text-right">
                        Profile views
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EBC1B6]/50">
                    {report.enquiriesOverTime.map((pt) => (
                      <tr key={pt.period}>
                        <th scope="row" className="py-2 px-2.5 font-medium text-[#4A2B10]">
                          {pt.period}
                        </th>
                        <td className="py-2 px-2.5 text-right tabular-nums">
                          {pt.enquiries.toLocaleString('en-AU')}
                        </td>
                        <td className="py-2 px-2.5 text-right tabular-nums">
                          {pt.views.toLocaleString('en-AU')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          </article>
        </div>

        {/* Repeated Simulation Disclaimer Banner Under the Charts */}
        <div
          role="note"
          className="rounded-2xl bg-[#F2CCC3]/50 border border-[#8A5A44]/35 px-4 py-3 flex items-start sm:items-center gap-3 text-sm text-[#4A2B10]"
        >
          <Info className="w-4 h-4 text-[#724319] shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
          <p className="font-medium leading-snug">
            {t('vendorInsights.disclaimer')}
          </p>
        </div>

        {/* Rule-Based AI Insight Box ("Sample insight") + Report Export Actions */}
        <div className="bg-white rounded-3xl border border-[#EBC1B6] p-6 sm:p-8 soft-shadow space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F2CCC3]/60 border border-[#EBC1B6] flex items-center justify-center text-[#724319] shrink-0">
                <Sparkles className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#724319]">
                    AI insight
                  </h2>
                  <span className="text-xs font-semibold text-[#724319] bg-[#FFF8F6] border border-[#8A5A44]/40 px-2.5 py-0.5 rounded-md">
                    Sample insight
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#4A2B10]">
                  Rule-based recommendations derived from {report.vendor.businessName}’s{' '}
                  {report.dateRange.label.toLowerCase()} simulation metrics.
                </p>
              </div>
            </div>

            {/* Print & Copy Report Controls */}
            <div className="flex flex-wrap items-center gap-3 print:hidden">
              <button
                type="button"
                onClick={handlePrintReport}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFF8F6] hover:bg-[#F2CCC3]/45 border border-[#8A5A44]/45 text-xs sm:text-sm font-semibold text-[#724319] transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" aria-hidden="true" />
                <span>Download or print this report</span>
              </button>

              <button
                type="button"
                onClick={handleCopySummary}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#724319] hover:bg-[#8A5A44] text-xs sm:text-sm font-semibold text-white transition-colors cursor-pointer"
              >
                {hasCopied ? (
                  <>
                    <Check className="w-4 h-4" aria-hidden="true" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" aria-hidden="true" />
                    <span>Copy summary</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {report.aiInsights.map((tip, idx) => (
              <li
                key={idx}
                className="rounded-2xl bg-[#FFF8F6] border border-[#EBC1B6] p-4 sm:p-5 text-sm text-[#4A2B10] leading-relaxed flex flex-col gap-2"
              >
                <span className="text-xs font-bold uppercase tracking-wider text-[#724319]">
                  Sample tip {idx + 1}
                </span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>

          <div className="pt-4 border-t border-[#EBC1B6]/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-[#4A2B10] print:hidden">
            <span>
              Interested in listing your Adelaide hospitality, styling, entertainment or planning business?
            </span>
            <a
              href={joinVendorHref}
              className="inline-flex items-center gap-1.5 font-semibold text-[#724319] hover:underline"
            >
              <span>{t('vendorInsights.joinCta')}</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
