declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

export function trackEvent(eventName: string, params: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return;
  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    } else if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: eventName, ...params });
    }
  } catch {
    // Ignore analytics errors in sandboxed/blocked environments
  }
}

export function trackPageView(pageId: string, pageTitle: string): void {
  if (typeof window === 'undefined') return;
  try {
    const pagePath = window.location.pathname + window.location.search;
    trackEvent('page_view', {
      page_id: pageId,
      page_title: pageTitle,
      page_path: pagePath,
    });
  } catch {
    // Ignore analytics errors
  }
}
