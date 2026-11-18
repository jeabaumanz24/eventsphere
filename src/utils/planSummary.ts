import { PlanPreviewContextData } from '../types';

export function buildPlainTextPlanSummary(
  plan: PlanPreviewContextData,
  conciseForMailto = false
): string {
  const elementsLine =
    plan.culturalElements.length > 0
      ? plan.culturalElements.join(', ')
      : 'General celebration styling & coordination';

  const vendorLines = plan.recommendedVendors.map((v, idx) =>
    `${idx + 1}. ${v.businessName} (${v.category}) - Fit ${v.fitScore}% - ${v.scaledPriceSummary}`
  );

  if (conciseForMailto) {
    const lines = [
      'Sample plan from EventSphere (fictional vendors and sample data)',
      '',
      `Event type: ${plan.eventType}`,
      `Cultural tradition: ${plan.traditionLabel}`,
      `Cultural elements: ${elementsLine}`,
      `Headcount: ${plan.headcount}`,
      `Location: ${plan.location}`,
      `Budget: ${plan.budgetLabel}`,
      `Overall fit score: ${plan.overallFitScore}%`,
      `Package estimate: ~$${plan.packageEstimatedTotal.toLocaleString()} AUD`,
      '',
      'Recommended vendors:',
      ...vendorLines,
      '',
      `Sample quote (${plan.selectedVendorName}): ${plan.selectedVendorPriceSummary}`,
      `Inclusions: ${plan.quoteLineItems.slice(0, 3).join('; ')}`,
    ];
    return lines.join('\n').slice(0, 1450);
  }

  return [
    'Sample plan from EventSphere (fictional vendors and sample data)',
    '====================================================================',
    `Event Type: ${plan.eventType}`,
    `Cultural Tradition: ${plan.traditionLabel}`,
    `Cultural Elements: ${elementsLine}`,
    `Headcount: ${plan.headcount}`,
    `Location: ${plan.location}`,
    `Budget: ${plan.budgetLabel}`,
    `Preferred Service Slot: ${plan.preferredTime}`,
    '',
    `Overall Package Fit Score: ${plan.overallFitScore}%`,
    `Combined Package Estimate: ~$${plan.packageEstimatedTotal.toLocaleString()} AUD`,
    '',
    'Recommended Fictional Sample Vendors:',
    ...vendorLines,
    '',
    `Featured Sample Quote — ${plan.selectedVendorName} (${plan.selectedVendorCategory}):`,
    `Guide Estimate: ${plan.selectedVendorPriceSummary}`,
    ...(plan.quoteLineItems.length > 0
      ? ['Quote Details:', ...plan.quoteLineItems.map((item) => `  - ${item}`)]
      : []),
    '',
    `Sample Reply Note: ${plan.sampleQuoteText.replace(/^"|"$/g, '')}`,
    '',
    'Sample plan from EventSphere (fictional vendors and sample data)',
  ].join('\n');
}

export function buildMailtoHref(
  plan: PlanPreviewContextData,
  optionalEmail = ''
): string {
  const recipient = optionalEmail.trim();
  const subject = encodeURIComponent('My EventSphere plan');
  const body = encodeURIComponent(buildPlainTextPlanSummary(plan, true));
  return `mailto:${recipient ? encodeURIComponent(recipient) : ''}?subject=${subject}&body=${body}`;
}
