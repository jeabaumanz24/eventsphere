import React, { useMemo, useState } from 'react';
import { MapPin, Mail, Send, CheckCircle2, ArrowRight } from 'lucide-react';
import { vendorsData } from '../data/mockData';
import { SERVICE_ZONES, countVendorsInZone } from '../data/serviceZones';
import { EventTypeTag } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { trackEvent } from '../utils/analytics';
import { getPageHref } from '../utils/navigation';
import { getEventSlug } from '../utils/plannerMatching';

export const CONTACT_EMAIL = 'concierge@eventsphere.com.au';

const CONTACT_EVENT_TYPES: { value: EventTypeTag; label: string }[] = [
  { value: 'Weddings', label: 'Weddings' },
  { value: 'Engagements & Proposals', label: 'Engagements and Proposals' },
  { value: 'Elopements', label: 'Elopements' },
  { value: 'Milestone Birthdays', label: 'Milestone Birthdays' },
  { value: 'Diwali & Festival of Lights', label: 'Diwali and Festival of Lights' },
  { value: 'Lunar New Year', label: 'Lunar New Year' },
  { value: 'Eid', label: 'Eid' },
  { value: 'Christenings & Baby Showers', label: 'Christenings and Baby Showers' },
  { value: 'Graduations', label: 'Graduations' },
  { value: 'Community Festivals', label: 'Community Festivals' },
  { value: 'Corporate Events', label: 'Corporate Events' },
];

interface ContactSectionProps {
  isPagePrimary?: boolean;
  onFormSubmitted?: (data: { name: string; email: string }) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  isPagePrimary = false,
  onFormSubmitted,
}) => {
  const { t } = useLanguage();
  const HeadingTag = isPagePrimary ? 'h1' : 'h2';

  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    eventType: '' | EventTypeTag;
    preferredArea: string;
    message: string;
  }>({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    preferredArea: '',
    message: '',
  });

  const [activeZoneId, setActiveZoneId] = useState<string>(SERVICE_ZONES[0].id);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const zoneVendorCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const zone of SERVICE_ZONES) {
      counts[zone.id] = countVendorsInZone(vendorsData, zone.name);
    }
    return counts;
  }, []);

  const currentZone = useMemo(
    () => SERVICE_ZONES.find((z) => z.id === activeZoneId) || SERVICE_ZONES[0],
    [activeZoneId]
  );

  const handleSelectZoneTile = (zoneId: string) => {
    setActiveZoneId(zoneId);
    setFormData((prev) => ({ ...prev, preferredArea: zoneId }));
  };

  const handlePreferredAreaChange = (nextZoneId: string) => {
    setFormData((prev) => ({ ...prev, preferredArea: nextZoneId }));
    if (nextZoneId) {
      setActiveZoneId(nextZoneId);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage(t('contact.errorMissing'));
      return;
    }

    if (!formData.email.includes('@')) {
      setErrorMessage(t('contact.errorEmail'));
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      trackEvent('contact_form_submit', {
        event_type: formData.eventType ? getEventSlug(formData.eventType) : 'unspecified',
        region: formData.preferredArea || activeZoneId,
      });
      if (onFormSubmitted) {
        onFormSubmitted({ name: formData.name, email: formData.email });
      }
    }, 500);
  };

  return (
    <section
      id="contact"
      className={`${
        isPagePrimary ? 'pt-32 pb-20 md:pt-36 md:pb-24' : 'py-20 md:py-28'
      } bg-[#F2CCC3]/25 relative`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#8A5A44]">
            {t('contact.kicker')}
          </span>
          <HeadingTag className="text-3xl sm:text-4xl font-serif font-bold text-[#724319]">
            {t('contact.title')}
          </HeadingTag>
          <p className="text-sm sm:text-base text-[#724319]/80 leading-relaxed [text-wrap:balance]">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Contact Form */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-10 border border-[#EBC1B6] shadow-md">
            {submitted ? (
              <div className="py-12 text-center space-y-4" aria-live="polite">
                <div className="w-16 h-16 rounded-full bg-[#F2CCC3] border border-[#8A5A44]/30 flex items-center justify-center text-[#724319] mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8 text-[#724319]" aria-hidden="true" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-[#724319]">
                  {t('contact.thankYou', { name: formData.name })}
                </h2>
                <p className="text-sm text-[#724319]/80 max-w-md mx-auto leading-relaxed">
                  {t('contact.receivedDesc')}
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        eventType: '',
                        preferredArea: '',
                        message: '',
                      });
                    }}
                    className="px-6 py-2.5 bg-[#724319] text-white text-xs font-semibold rounded-full hover:bg-[#8A5A44] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#724319] focus-visible:ring-offset-2"
                  >
                    {t('contact.sendAnother')}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 text-left" noValidate>
                {errorMessage && (
                  <div
                    role="alert"
                    className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl"
                  >
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-full-name"
                      className="text-xs font-semibold text-[#724319] block"
                    >
                      {t('contact.fullName')} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="contact-full-name"
                      type="text"
                      required
                      placeholder="e.g. Diwata dela Cruz"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-[#FFF8F6] border border-[#EBC1B6] rounded-xl text-sm text-[#724319] focus:outline-none focus:ring-2 focus:ring-[#8A5A44]/30 focus:border-[#8A5A44] transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-email"
                      className="text-xs font-semibold text-[#724319] block"
                    >
                      {t('contact.emailLabel')} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="diwata@example.com.au"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-[#FFF8F6] border border-[#EBC1B6] rounded-xl text-sm text-[#724319] focus:outline-none focus:ring-2 focus:ring-[#8A5A44]/30 focus:border-[#8A5A44] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Phone Number */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-phone"
                      className="text-xs font-semibold text-[#724319] block"
                    >
                      {t('contact.phoneLabel')}
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      placeholder="+61 400 000 000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-[#FFF8F6] border border-[#EBC1B6] rounded-xl text-sm text-[#724319] focus:outline-none focus:ring-2 focus:ring-[#8A5A44]/30 focus:border-[#8A5A44] transition-all"
                    />
                  </div>

                  {/* Event Type */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-event-type"
                      className="text-xs font-semibold text-[#724319] block"
                    >
                      {t('contact.eventTypeLabel')}
                    </label>
                    <select
                      id="contact-event-type"
                      value={formData.eventType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          eventType: e.target.value as '' | EventTypeTag,
                        })
                      }
                      className="w-full px-4 py-3 bg-[#FFF8F6] border border-[#EBC1B6] rounded-xl text-sm text-[#724319] focus:outline-none focus:ring-2 focus:ring-[#8A5A44]/30 focus:border-[#8A5A44] transition-all cursor-pointer"
                    >
                      <option value="">Select event type</option>
                      {CONTACT_EVENT_TYPES.map((ev) => (
                        <option key={ev.value} value={ev.value}>
                          {ev.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Optional Preferred Area (synced both ways with the 9-zone explorer) */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-preferred-area"
                    className="text-xs font-semibold text-[#724319] block"
                  >
                    Preferred area <span className="font-normal text-[#8A5A44]">(optional)</span>
                  </label>
                  <select
                    id="contact-preferred-area"
                    value={formData.preferredArea}
                    onChange={(e) => handlePreferredAreaChange(e.target.value)}
                    className="w-full px-4 py-3 bg-[#FFF8F6] border border-[#EBC1B6] rounded-xl text-sm text-[#724319] focus:outline-none focus:ring-2 focus:ring-[#8A5A44]/30 focus:border-[#8A5A44] transition-all cursor-pointer"
                  >
                    <option value="">Select preferred area</option>
                    {SERVICE_ZONES.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-details"
                    className="text-xs font-semibold text-[#724319] block"
                  >
                    {t('contact.detailsLabel')} <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="contact-details"
                    required
                    rows={4}
                    placeholder={t('contact.detailsPlaceholder')}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FFF8F6] border border-[#EBC1B6] rounded-xl text-sm text-[#724319] focus:outline-none focus:ring-2 focus:ring-[#8A5A44]/30 focus:border-[#8A5A44] transition-all resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 bg-[#724319] hover:bg-[#8A5A44] text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#724319] focus-visible:ring-offset-2"
                >
                  {isSubmitting ? (
                    <span>{t('contact.sending')}</span>
                  ) : (
                    <>
                      <span>{t('contact.submit')}</span>
                      <Send className="w-4 h-4" aria-hidden="true" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Serving Adelaide & South Australia 9-Zone Explorer */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EBC1B6] shadow-md space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-[#EBC1B6]/50">
                <MapPin className="w-5 h-5 text-[#8A5A44] shrink-0" aria-hidden="true" />
                <h2 className="text-base sm:text-lg font-serif font-bold text-[#724319]">
                  Serving Adelaide and South Australia
                </h2>
              </div>

              {/* 9 Shared South Australian Service Zones */}
              <div className="relative bg-[#FFF8F6] rounded-2xl p-4 sm:p-5 border border-[#EBC1B6]/60 space-y-4">
                <div
                  id="contact-zone-explorer-label"
                  className="text-[11px] font-semibold text-[#8A5A44] uppercase tracking-wider"
                >
                  {t('contact.selectZone')}
                </div>

                {/* 3 columns on desktop, 2 on tablet, 1 on mobile */}
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5"
                  role="group"
                  aria-labelledby="contact-zone-explorer-label"
                >
                  {SERVICE_ZONES.map((zone) => {
                    const isSelected = activeZoneId === zone.id;
                    const count = zoneVendorCounts[zone.id] ?? 0;
                    return (
                      <button
                        key={zone.id}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => handleSelectZoneTile(zone.id)}
                        className={`p-3 rounded-xl text-left text-xs transition-all cursor-pointer flex flex-col justify-between gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#724319] focus-visible:ring-offset-2 ${
                          isSelected
                            ? 'bg-[#724319] text-white shadow-xs font-semibold'
                            : 'bg-white text-[#724319] border border-[#EBC1B6]/70 hover:bg-[#F2CCC3]/40'
                        }`}
                      >
                        <span className="font-semibold leading-snug break-words">{zone.name}</span>
                        <span
                          className={`text-[10px] tabular-nums ${
                            isSelected ? 'text-white/85' : 'text-[#8A5A44]'
                          }`}
                        >
                          {t('contact.vendorsCount', { count })}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Zone detail panel announced live on change */}
                <div
                  aria-live="polite"
                  aria-atomic="true"
                  className="p-4 bg-white rounded-xl border border-[#EBC1B6]/60 text-xs space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-serif font-bold text-sm text-[#724319]">
                      {currentZone.name}
                    </h3>
                    <span className="text-[11px] font-medium text-[#8A5A44] tabular-nums">
                      {t('contact.vendorsCount', { count: zoneVendorCounts[currentZone.id] ?? 0 })}
                    </span>
                  </div>
                  <p className="text-[#724319]/85 leading-relaxed text-xs">
                    {currentZone.description}
                  </p>
                  <div className="pt-0.5 text-[11px] text-[#8A5A44]">
                    <span className="font-semibold text-[#724319]">
                      Popular celebration settings:
                    </span>{' '}
                    {currentZone.popularSettings.join(' · ')}
                  </div>
                  <div className="pt-2">
                    <a
                      href={getPageHref('vendors', `?region=${encodeURIComponent(currentZone.id)}`)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#724319] hover:text-[#8A5A44] underline decoration-[#EBC1B6] underline-offset-4 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#724319] focus-visible:ring-offset-2"
                    >
                      <span>Browse vendors in {currentZone.name}</span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Single email contact detail */}
              <div className="pt-1 text-xs text-[#724319]/85">
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="inline-flex items-center gap-2.5 font-medium text-[#724319] hover:text-[#8A5A44] transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#724319] focus-visible:ring-offset-2"
                >
                  <Mail className="w-4 h-4 text-[#8A5A44] shrink-0" aria-hidden="true" />
                  <span>{CONTACT_EMAIL}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
