import React, { useState, useRef, useId } from 'react';
import { Mail, Copy, Check, Printer, ExternalLink } from 'lucide-react';
import { PlanPreviewContextData } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { buildMailtoHref, buildPlainTextPlanSummary } from '../utils/planSummary';
import { trackEvent } from '../utils/analytics';

interface PlanSummaryActionsProps {
  plan: PlanPreviewContextData;
  variant?: 'step3' | 'modal';
}

export const PlanSummaryActions: React.FC<PlanSummaryActionsProps> = ({
  plan,
  variant = 'step3',
}) => {
  const { t } = useLanguage();
  const [showEmailPanel, setShowEmailPanel] = useState(false);
  const [optionalEmail, setOptionalEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const emailInputId = useId();

  const handleToggleEmailPanel = () => {
    const nextOpen = !showEmailPanel;
    setShowEmailPanel(nextOpen);
    if (nextOpen) {
      setTimeout(() => {
        emailInputRef.current?.focus();
      }, 40);
    }
  };

  const handleEmailLinkClick = () => {
    trackEvent('plan_summary_used', {
      action: 'email',
      event_type: plan.eventType,
    });
    setStatusMessage(t('planTakeaway.emailPrivacyNote'));
  };

  const handleCopySummary = async () => {
    const summaryText = buildPlainTextPlanSummary(plan, false);
    let success = false;

    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(summaryText);
        success = true;
      }
    } catch {
      success = false;
    }

    if (!success) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = summaryText;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.top = '-9999px';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        success = document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch {
        success = false;
      }
    }

    if (success) {
      setCopied(true);
      setStatusMessage(t('planTakeaway.copiedBtn'));
      trackEvent('plan_summary_used', {
        action: 'copy',
        event_type: plan.eventType,
      });
      setTimeout(() => setCopied(false), 2600);
    }
  };

  const handlePrint = () => {
    trackEvent('plan_summary_used', {
      action: 'print',
      event_type: plan.eventType,
    });
    window.print();
  };

  const mailtoHref = buildMailtoHref(plan, optionalEmail);

  return (
    <div
      className={`rounded-xl border border-[#EBC1B6]/70 ${
        variant === 'modal' ? 'bg-white p-3.5' : 'bg-white/95 p-3'
      } space-y-2.5 print:border-0 print:p-0`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] font-semibold text-[#724319]">
          {t('planTakeaway.heading')}
        </span>
        <div
          aria-live="polite"
          className="text-[11px] font-medium text-emerald-700 min-h-[16px]"
        >
          {copied ? t('planTakeaway.copiedBtn') : statusMessage}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 print:hidden">
        <button
          type="button"
          onClick={handleToggleEmailPanel}
          aria-expanded={showEmailPanel}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-[#FFF8F6] hover:bg-[#F2CCC3]/50 text-[#724319] border border-[#EBC1B6] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#724319]"
        >
          <Mail className="w-3.5 h-3.5 text-[#8A5A44] shrink-0" />
          <span>{t('planTakeaway.emailBtn')}</span>
        </button>

        <button
          type="button"
          onClick={handleCopySummary}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#724319] ${
            copied
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : 'bg-[#FFF8F6] hover:bg-[#F2CCC3]/50 text-[#724319] border-[#EBC1B6]'
          }`}
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-[#8A5A44] shrink-0" />
          )}
          <span>{copied ? t('planTakeaway.copiedBtn') : t('planTakeaway.copyBtn')}</span>
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-[#FFF8F6] hover:bg-[#F2CCC3]/50 text-[#724319] border border-[#EBC1B6] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#724319]"
        >
          <Printer className="w-3.5 h-3.5 text-[#8A5A44] shrink-0" />
          <span>{t('planTakeaway.printBtn')}</span>
        </button>
      </div>

      {showEmailPanel && (
        <div className="pt-2 border-t border-[#EBC1B6]/50 space-y-2 print:hidden">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label htmlFor={emailInputId} className="sr-only">
              {t('planTakeaway.emailLabel')}
            </label>
            <input
              id={emailInputId}
              ref={emailInputRef}
              type="email"
              value={optionalEmail}
              onChange={(e) => setOptionalEmail(e.target.value)}
              placeholder={t('planTakeaway.emailPlaceholder')}
              className="flex-1 px-3 py-1.5 bg-[#FFF8F6] border border-[#EBC1B6] rounded-lg text-xs text-[#724319] placeholder:text-[#8A5A44]/60 focus:outline-none focus:ring-2 focus:ring-[#724319]/40"
            />
            <a
              href={mailtoHref}
              onClick={handleEmailLinkClick}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#724319] hover:bg-[#8A5A44] text-white text-[11px] font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#724319]"
            >
              <span>{t('planTakeaway.openMailApp')}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <p className="text-[10px] text-[#8A5A44] leading-snug">
            {t('planTakeaway.emailPrivacyNote')}
          </p>
        </div>
      )}

      {/* Printable summary block shown primarily during print */}
      <div className="hidden print:block text-xs text-black whitespace-pre-wrap border-t border-gray-300 pt-3 mt-3">
        {buildPlainTextPlanSummary(plan, false)}
      </div>
    </div>
  );
};
