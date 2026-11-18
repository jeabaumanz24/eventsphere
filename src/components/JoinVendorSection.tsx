import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Briefcase,
  CheckCircle2,
  Info,
  RefreshCw,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { trackEvent } from '../utils/analytics';
import { getPageHref } from '../utils/navigation';

/**
 * Form service configuration (e.g. Web3Forms or Formspree).
 * Leave FORM_ENDPOINT as an empty string ('') to run in local prototype simulation mode
 * without transmitting or storing any application data.
 *
 * Example (Web3Forms):
 *   const FORM_ENDPOINT = 'https://api.web3forms.com/submit';
 *   const FORM_ACCESS_KEY = 'paste-your-web3forms-access-key-here';
 *
 * Example (Formspree):
 *   const FORM_ENDPOINT = 'https://formspree.io/f/paste-your-form-id-here';
 *   const FORM_ACCESS_KEY = '';
 */
const FORM_ENDPOINT = '';
const FORM_ACCESS_KEY = '';

const VENDOR_CATEGORY_OPTIONS = [
  'Photographer',
  'Planner',
  'Caterer',
  'Florist',
  'Makeup artist',
  'Cultural specialist',
  'Entertainment and DJ',
  'Venue and marquee hire',
  'Decor and styling',
  'Proposal and elopement specialist',
  'Other',
] as const;

const REGION_OPTIONS = [
  'Adelaide CBD',
  'Adelaide Hills',
  'Barossa',
  'McLaren Vale',
  'Fleurieu Peninsula',
  'Glenelg and beaches',
  'Northern suburbs',
  'Southern suburbs',
] as const;

const EVENT_TYPE_OPTIONS = [
  'Weddings',
  'Engagements and Proposals',
  'Elopements',
  'Milestone Birthdays',
  'Diwali and Festival of Lights',
  'Lunar New Year',
  'Eid',
  'Christenings and Baby Showers',
  'Graduations',
  'Community Festivals',
  'Corporate Events',
] as const;

const CULTURAL_TRADITION_OPTIONS = [
  'Filipino',
  'Greek',
  'Indian',
  'Chinese',
  'Italian',
  'Middle Eastern or Muslim',
  'Pacific Islander',
  'Vietnamese',
  'Korean',
  'Other',
] as const;

const STARTING_PRICE_OPTIONS = [
  'Under $500 AUD',
  '$500 – $1,500 AUD',
  '$1,500 – $3,000 AUD',
  '$3,000 – $6,000 AUD',
  '$6,000 – $12,000 AUD',
  '$12,000+ AUD',
  'Custom quote / per guest pricing',
] as const;

const MAX_ABOUT_CHARS = 500;

interface FormState {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  category: string;
  region: string;
  website: string;
  eventTypes: string[];
  traditions: string[];
  startingPrice: string;
  about: string;
  consent: boolean;
  honeypot: string;
}

type FieldErrorKey =
  | 'businessName'
  | 'contactName'
  | 'email'
  | 'category'
  | 'region'
  | 'eventTypes'
  | 'consent';

const INITIAL_FORM_STATE: FormState = {
  businessName: '',
  contactName: '',
  email: '',
  phone: '',
  category: '',
  region: '',
  website: '',
  eventTypes: [],
  traditions: [],
  startingPrice: '',
  about: '',
  consent: false,
  honeypot: '',
};

interface JoinVendorSectionProps {
  onOpenPrivacy?: () => void;
}

export const JoinVendorSection: React.FC<JoinVendorSectionProps> = ({ onOpenPrivacy }) => {
  const [form, setForm] = useState<FormState>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<Partial<Record<FieldErrorKey, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<{
    data: Omit<FormState, 'honeypot'>;
    isSimulated: boolean;
  } | null>(null);

  const confirmationHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (submittedData && confirmationHeadingRef.current) {
      confirmationHeadingRef.current.focus();
    }
  }, [submittedData]);

  const validateForm = (state: FormState): Partial<Record<FieldErrorKey, string>> => {
    const nextErrors: Partial<Record<FieldErrorKey, string>> = {};

    if (!state.businessName.trim()) {
      nextErrors.businessName = 'Enter your business name.';
    }
    if (!state.contactName.trim()) {
      nextErrors.contactName = 'Enter a contact name.';
    }
    const trimmedEmail = state.email.trim();
    if (!trimmedEmail) {
      nextErrors.email = 'Enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmedEmail)) {
      nextErrors.email = 'Enter a valid email address (for example, name@business.com.au).';
    }
    if (!state.category) {
      nextErrors.category = 'Select a vendor category.';
    }
    if (!state.region) {
      nextErrors.region = 'Select your primary suburb or region.';
    }
    if (state.eventTypes.length === 0) {
      nextErrors.eventTypes = 'Select at least one event type you serve.';
    }
    if (!state.consent) {
      nextErrors.consent = 'Confirm consent so our team can contact you about your application.';
    }

    return nextErrors;
  };

  const clearFieldError = (key: FieldErrorKey) => {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const focusFirstInvalidField = (validationErrors: Partial<Record<FieldErrorKey, string>>) => {
    const order: Array<{ key: FieldErrorKey; elementId: string }> = [
      { key: 'businessName', elementId: 'vendor-business-name' },
      { key: 'contactName', elementId: 'vendor-contact-name' },
      { key: 'email', elementId: 'vendor-email' },
      { key: 'category', elementId: 'vendor-category' },
      { key: 'region', elementId: 'vendor-region' },
      { key: 'eventTypes', elementId: 'vendor-event-type-0' },
      { key: 'consent', elementId: 'vendor-consent' },
    ];
    for (const item of order) {
      if (validationErrors[item.key]) {
        const el = document.getElementById(item.elementId);
        if (el) {
          el.focus();
          break;
        }
      }
    }
  };

  const toggleMultiOption = (field: 'eventTypes' | 'traditions', option: string) => {
    setForm((prev) => {
      const exists = prev[field].includes(option);
      const updated = exists
        ? prev[field].filter((item) => item !== option)
        : [...prev[field], option];
      return { ...prev, [field]: updated };
    });
    if (field === 'eventTypes') {
      clearFieldError('eventTypes');
    }
  };

  const submitApplication = async () => {
    setSubmitError(null);

    if (form.honeypot.trim() !== '') {
      // Silently ignore likely automated spam bot submissions
      return;
    }

    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      focusFirstInvalidField(validationErrors);
      return;
    }

    const { honeypot: _ignored, ...cleanSubmission } = form;
    const trimmedEndpoint = FORM_ENDPOINT.trim();

    if (!trimmedEndpoint) {
      // Prototype simulation mode: do not send, log, or persist anything
      setSubmittedData({
        data: cleanSubmission,
        isSimulated: true,
      });
      trackEvent('vendor_application_submit', {
        vendor_category: cleanSubmission.category,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        business_name: cleanSubmission.businessName.trim(),
        contact_name: cleanSubmission.contactName.trim(),
        email: cleanSubmission.email.trim(),
        phone: cleanSubmission.phone.trim(),
        vendor_category: cleanSubmission.category,
        suburb_or_region: cleanSubmission.region,
        website_or_instagram: cleanSubmission.website.trim(),
        event_types: cleanSubmission.eventTypes.join(', '),
        cultural_traditions: cleanSubmission.traditions.join(', '),
        starting_price_aud: cleanSubmission.startingPrice,
        about_business: cleanSubmission.about.trim(),
        consent_accepted: cleanSubmission.consent,
      };

      const trimmedKey = FORM_ACCESS_KEY.trim();
      if (trimmedKey) {
        payload.access_key = trimmedKey;
      }

      const response = await fetch(trimmedEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => null);
      if (!response.ok || (result && result.success === false)) {
        throw new Error('Submission request was not accepted.');
      }

      setSubmittedData({
        data: cleanSubmission,
        isSimulated: false,
      });
      trackEvent('vendor_application_submit', {
        vendor_category: cleanSubmission.category,
      });
    } catch {
      setSubmitError(
        'We could not submit your application right now due to a connection or service issue. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void submitApplication();
  };

  const inputBaseClass =
    'w-full px-4 py-3 bg-[#FFF8F6] border border-[#8A5A44]/40 rounded-xl text-sm text-[#4A2B10] placeholder:text-[#724319]/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#724319] focus-visible:border-[#724319] transition-colors motion-reduce:transition-none';
  const inputErrorClass =
    'w-full px-4 py-3 bg-rose-50/60 border-2 border-rose-700 rounded-xl text-sm text-[#4A2B10] placeholder:text-[#724319]/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-800 transition-colors motion-reduce:transition-none';

  const errorCount = Object.keys(errors).length;

  return (
    <section
      id="join-as-a-vendor"
      aria-labelledby="join-vendor-heading"
      className="pt-32 sm:pt-36 pb-20 bg-[#FFF8F6]"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Intro Header */}
        <header className="space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#724319] bg-white border border-[#EBC1B6] px-3 py-1 rounded-lg">
            <Briefcase className="w-3.5 h-3.5 text-[#724319]" aria-hidden="true" />
            <span>For Adelaide Vendors</span>
          </div>

          <h1
            id="join-vendor-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#724319] tracking-tight"
          >
            Join EventSphere as a Vendor
          </h1>

          <p className="text-base sm:text-lg text-[#4A2B10] leading-relaxed max-w-2xl">
            Tell us about your business and the celebrations you specialise in. Our team will review your application and get in touch.
          </p>

          <div
            role="note"
            className="rounded-2xl bg-[#F2CCC3]/50 border border-[#8A5A44]/35 px-4 py-3 flex items-start sm:items-center gap-3 text-sm text-[#4A2B10]"
          >
            <Info className="w-4 h-4 text-[#724319] shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
            <p className="font-medium leading-snug">
              EventSphere is a prototype. Applications are not binding.
            </p>
          </div>
        </header>

        {/* Confirmation View or Application Form */}
        {submittedData ? (
          <div className="bg-white rounded-3xl border border-[#EBC1B6] p-6 sm:p-10 shadow-md space-y-6">
            {submittedData.isSimulated && (
              <div
                role="status"
                className="rounded-2xl bg-[#F2CCC3]/60 border border-[#8A5A44]/40 px-4 py-3 flex items-start sm:items-center gap-3 text-sm text-[#4A2B10]"
              >
                <Info className="w-4 h-4 text-[#724319] shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
                <p className="font-semibold">
                  Simulation: this application was not sent. EventSphere is a prototype.
                </p>
              </div>
            )}

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F2CCC3] border border-[#8A5A44]/35 flex items-center justify-center text-[#724319] shrink-0">
                <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
              </div>
              <div className="space-y-2">
                <h2
                  ref={confirmationHeadingRef}
                  tabIndex={-1}
                  className="text-2xl sm:text-3xl font-serif font-bold text-[#724319] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#724319] rounded-lg"
                >
                  Application summary received
                </h2>
                <p className="text-sm sm:text-base text-[#4A2B10] leading-relaxed">
                  Thank you, {submittedData.data.contactName}. What happens next: our team will review your submitted business details, event coverage, and Adelaide region information and follow up using your contact details.
                </p>
              </div>
            </div>

            {/* Summary of Submitted Details */}
            <div className="rounded-2xl bg-[#FFF8F6] border border-[#EBC1B6] p-5 sm:p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#724319]">
                Submitted details
              </h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div>
                  <dt className="text-xs font-semibold text-[#724319]">Business name</dt>
                  <dd className="text-[#4A2B10] font-medium mt-0.5">{submittedData.data.businessName}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-[#724319]">Contact name</dt>
                  <dd className="text-[#4A2B10] font-medium mt-0.5">{submittedData.data.contactName}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-[#724319]">Email</dt>
                  <dd className="text-[#4A2B10] break-all mt-0.5">{submittedData.data.email}</dd>
                </div>
                {submittedData.data.phone.trim() && (
                  <div>
                    <dt className="text-xs font-semibold text-[#724319]">Phone</dt>
                    <dd className="text-[#4A2B10] mt-0.5">{submittedData.data.phone}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-xs font-semibold text-[#724319]">Vendor category</dt>
                  <dd className="text-[#4A2B10] mt-0.5">{submittedData.data.category}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-[#724319]">Suburb or region</dt>
                  <dd className="text-[#4A2B10] mt-0.5">{submittedData.data.region}</dd>
                </div>
                {submittedData.data.website.trim() && (
                  <div>
                    <dt className="text-xs font-semibold text-[#724319]">Website or Instagram</dt>
                    <dd className="text-[#4A2B10] break-all mt-0.5">{submittedData.data.website}</dd>
                  </div>
                )}
                {submittedData.data.startingPrice && (
                  <div>
                    <dt className="text-xs font-semibold text-[#724319]">Typical starting price</dt>
                    <dd className="text-[#4A2B10] mt-0.5">{submittedData.data.startingPrice}</dd>
                  </div>
                )}
                <div className="sm:col-span-2">
                  <dt className="text-xs font-semibold text-[#724319]">Event types served</dt>
                  <dd className="text-[#4A2B10] mt-0.5">{submittedData.data.eventTypes.join(', ')}</dd>
                </div>
                {submittedData.data.traditions.length > 0 && (
                  <div className="sm:col-span-2">
                    <dt className="text-xs font-semibold text-[#724319]">Cultural traditions served</dt>
                    <dd className="text-[#4A2B10] mt-0.5">{submittedData.data.traditions.join(', ')}</dd>
                  </div>
                )}
                {submittedData.data.about.trim() && (
                  <div className="sm:col-span-2">
                    <dt className="text-xs font-semibold text-[#724319]">About your business</dt>
                    <dd className="text-[#4A2B10] mt-0.5 whitespace-pre-line">{submittedData.data.about}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href={getPageHref('home')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#724319] hover:bg-[#8A5A44] text-white text-sm font-semibold transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#724319] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                <span>Back to Home</span>
              </a>
              <a
                href={getPageHref('vendor-insights')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FFF8F6] hover:bg-[#F2CCC3]/50 border border-[#8A5A44]/50 text-[#724319] text-sm font-semibold transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#724319] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                <BarChart3 className="w-4 h-4" aria-hidden="true" />
                <span>Back to Vendor Insights</span>
              </a>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="bg-white rounded-3xl border border-[#EBC1B6] p-6 sm:p-10 shadow-md space-y-6"
          >
            {/* Validation Error Summary Live Region */}
            <div aria-live="polite" className="space-y-3">
              {errorCount > 0 && (
                <div
                  role="alert"
                  className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-sm flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-rose-800 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-semibold">
                      Please fix the {errorCount} highlighted {errorCount === 1 ? 'field' : 'fields'} below before submitting.
                    </p>
                  </div>
                </div>
              )}

              {submitError && (
                <div
                  role="alert"
                  className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-rose-800 shrink-0 mt-0.5" aria-hidden="true" />
                    <p className="font-medium">{submitError}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void submitApplication()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-800 hover:bg-rose-900 text-white text-xs font-semibold shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-900 focus-visible:ring-offset-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Try again</span>
                  </button>
                </div>
              )}
            </div>

            {/* Hidden Honeypot Anti-Spam Field */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="vendor-botcheck">Leave this field blank</label>
              <input
                id="vendor-botcheck"
                name="botcheck"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={form.honeypot}
                onChange={(e) => setForm((prev) => ({ ...prev, honeypot: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Business Name */}
              <div className="space-y-1.5">
                <label htmlFor="vendor-business-name" className="block text-sm font-semibold text-[#724319]">
                  Business name <span className="font-normal text-[#4A2B10]">(required)</span>
                </label>
                <input
                  id="vendor-business-name"
                  name="businessName"
                  type="text"
                  required
                  autoComplete="organization"
                  value={form.businessName}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, businessName: e.target.value }));
                    clearFieldError('businessName');
                  }}
                  aria-invalid={Boolean(errors.businessName)}
                  aria-describedby={
                    errors.businessName
                      ? 'vendor-business-name-hint vendor-business-name-error'
                      : 'vendor-business-name-hint'
                  }
                  className={errors.businessName ? inputErrorClass : inputBaseClass}
                />
                <p id="vendor-business-name-hint" className="text-xs text-[#4A2B10]/85">
                  Trading or studio name shown to Adelaide hosts.
                </p>
                {errors.businessName && (
                  <p id="vendor-business-name-error" role="alert" className="text-xs font-semibold text-rose-800">
                    {errors.businessName}
                  </p>
                )}
              </div>

              {/* Contact Name */}
              <div className="space-y-1.5">
                <label htmlFor="vendor-contact-name" className="block text-sm font-semibold text-[#724319]">
                  Contact name <span className="font-normal text-[#4A2B10]">(required)</span>
                </label>
                <input
                  id="vendor-contact-name"
                  name="contactName"
                  type="text"
                  required
                  autoComplete="name"
                  value={form.contactName}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, contactName: e.target.value }));
                    clearFieldError('contactName');
                  }}
                  aria-invalid={Boolean(errors.contactName)}
                  aria-describedby={
                    errors.contactName
                      ? 'vendor-contact-name-hint vendor-contact-name-error'
                      : 'vendor-contact-name-hint'
                  }
                  className={errors.contactName ? inputErrorClass : inputBaseClass}
                />
                <p id="vendor-contact-name-hint" className="text-xs text-[#4A2B10]/85">
                  Primary person handling EventSphere enquiries.
                </p>
                {errors.contactName && (
                  <p id="vendor-contact-name-error" role="alert" className="text-xs font-semibold text-rose-800">
                    {errors.contactName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="vendor-email" className="block text-sm font-semibold text-[#724319]">
                  Email <span className="font-normal text-[#4A2B10]">(required)</span>
                </label>
                <input
                  id="vendor-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, email: e.target.value }));
                    clearFieldError('email');
                  }}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={
                    errors.email ? 'vendor-email-hint vendor-email-error' : 'vendor-email-hint'
                  }
                  className={errors.email ? inputErrorClass : inputBaseClass}
                />
                <p id="vendor-email-hint" className="text-xs text-[#4A2B10]/85">
                  Used only to reply regarding your application.
                </p>
                {errors.email && (
                  <p id="vendor-email-error" role="alert" className="text-xs font-semibold text-rose-800">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label htmlFor="vendor-phone" className="block text-sm font-semibold text-[#724319]">
                  Phone <span className="font-normal text-[#4A2B10]">(optional)</span>
                </label>
                <input
                  id="vendor-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                  aria-describedby="vendor-phone-hint"
                  className={inputBaseClass}
                />
                <p id="vendor-phone-hint" className="text-xs text-[#4A2B10]/85">
                  Optional Australian mobile or studio number.
                </p>
              </div>

              {/* Vendor Category */}
              <div className="space-y-1.5">
                <label htmlFor="vendor-category" className="block text-sm font-semibold text-[#724319]">
                  Vendor category <span className="font-normal text-[#4A2B10]">(required)</span>
                </label>
                <select
                  id="vendor-category"
                  name="category"
                  required
                  value={form.category}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, category: e.target.value }));
                    clearFieldError('category');
                  }}
                  aria-invalid={Boolean(errors.category)}
                  aria-describedby={
                    errors.category ? 'vendor-category-hint vendor-category-error' : 'vendor-category-hint'
                  }
                  className={`${errors.category ? inputErrorClass : inputBaseClass} cursor-pointer`}
                >
                  <option value="">Select a category</option>
                  {VENDOR_CATEGORY_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <p id="vendor-category-hint" className="text-xs text-[#4A2B10]/85">
                  Choose the primary service category for your business.
                </p>
                {errors.category && (
                  <p id="vendor-category-error" role="alert" className="text-xs font-semibold text-rose-800">
                    {errors.category}
                  </p>
                )}
              </div>

              {/* Suburb or Region */}
              <div className="space-y-1.5">
                <label htmlFor="vendor-region" className="block text-sm font-semibold text-[#724319]">
                  Suburb or region <span className="font-normal text-[#4A2B10]">(required)</span>
                </label>
                <select
                  id="vendor-region"
                  name="region"
                  required
                  value={form.region}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, region: e.target.value }));
                    clearFieldError('region');
                  }}
                  aria-invalid={Boolean(errors.region)}
                  aria-describedby={
                    errors.region ? 'vendor-region-hint vendor-region-error' : 'vendor-region-hint'
                  }
                  className={`${errors.region ? inputErrorClass : inputBaseClass} cursor-pointer`}
                >
                  <option value="">Select a suburb or region</option>
                  {REGION_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <p id="vendor-region-hint" className="text-xs text-[#4A2B10]/85">
                  Primary Greater Adelaide or South Australian area you service.
                </p>
                {errors.region && (
                  <p id="vendor-region-error" role="alert" className="text-xs font-semibold text-rose-800">
                    {errors.region}
                  </p>
                )}
              </div>

              {/* Website or Instagram */}
              <div className="space-y-1.5">
                <label htmlFor="vendor-website" className="block text-sm font-semibold text-[#724319]">
                  Website or Instagram <span className="font-normal text-[#4A2B10]">(optional)</span>
                </label>
                <input
                  id="vendor-website"
                  name="website"
                  type="text"
                  autoComplete="url"
                  value={form.website}
                  onChange={(e) => setForm((prev) => ({ ...prev, website: e.target.value }))}
                  aria-describedby="vendor-website-hint"
                  className={inputBaseClass}
                />
                <p id="vendor-website-hint" className="text-xs text-[#4A2B10]/85">
                  Share a portfolio website URL or @instagram handle.
                </p>
              </div>

              {/* Typical Starting Price in AUD */}
              <div className="space-y-1.5">
                <label htmlFor="vendor-starting-price" className="block text-sm font-semibold text-[#724319]">
                  Typical starting price in AUD <span className="font-normal text-[#4A2B10]">(optional)</span>
                </label>
                <select
                  id="vendor-starting-price"
                  name="startingPrice"
                  value={form.startingPrice}
                  onChange={(e) => setForm((prev) => ({ ...prev, startingPrice: e.target.value }))}
                  aria-describedby="vendor-starting-price-hint"
                  className={`${inputBaseClass} cursor-pointer`}
                >
                  <option value="">Select a typical AUD range (optional)</option>
                  {STARTING_PRICE_OPTIONS.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
                <p id="vendor-starting-price-hint" className="text-xs text-[#4A2B10]/85">
                  Helps hosts gauge budget alignment in indicative AUD.
                </p>
              </div>
            </div>

            {/* Event Types You Serve (Required Multi-Select) */}
            <fieldset
              className="rounded-2xl bg-[#FFF8F6] border border-[#EBC1B6] p-4 sm:p-5 space-y-3"
              aria-describedby={
                errors.eventTypes
                  ? 'vendor-event-types-hint vendor-event-types-error'
                  : 'vendor-event-types-hint'
              }
            >
              <legend className="px-1 text-sm font-semibold text-[#724319]">
                Event types you serve <span className="font-normal text-[#4A2B10]">(required)</span>
              </legend>
              <p id="vendor-event-types-hint" className="text-xs text-[#4A2B10]/85">
                Select all celebration types your business supports.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                {EVENT_TYPE_OPTIONS.map((eventType, index) => {
                  const checked = form.eventTypes.includes(eventType);
                  const inputId = `vendor-event-type-${index}`;
                  return (
                    <label
                      key={eventType}
                      htmlFor={inputId}
                      className={`flex items-start gap-2.5 px-3 py-2.5 rounded-xl border text-xs sm:text-sm cursor-pointer transition-colors motion-reduce:transition-none ${
                        checked
                          ? 'bg-[#F2CCC3]/50 border-[#724319] text-[#4A2B10] font-semibold'
                          : 'bg-white border-[#EBC1B6] text-[#4A2B10] hover:border-[#8A5A44]'
                      }`}
                    >
                      <input
                        id={inputId}
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleMultiOption('eventTypes', eventType)}
                        className="mt-0.5 h-4 w-4 rounded border-[#724319] text-[#724319] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#724319] shrink-0 cursor-pointer"
                      />
                      <span>{eventType}</span>
                    </label>
                  );
                })}
              </div>

              {errors.eventTypes && (
                <p id="vendor-event-types-error" role="alert" className="text-xs font-semibold text-rose-800 pt-1">
                  {errors.eventTypes}
                </p>
              )}
            </fieldset>

            {/* Cultural Traditions You Serve (Optional Multi-Select) */}
            <fieldset
              className="rounded-2xl bg-[#FFF8F6] border border-[#EBC1B6] p-4 sm:p-5 space-y-3"
              aria-describedby="vendor-traditions-hint"
            >
              <legend className="px-1 text-sm font-semibold text-[#724319]">
                Cultural traditions you serve <span className="font-normal text-[#4A2B10]">(optional)</span>
              </legend>
              <p id="vendor-traditions-hint" className="text-xs text-[#4A2B10]/85">
                Select any cultural customs, cuisines, or ceremonies you have direct experience with.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                {CULTURAL_TRADITION_OPTIONS.map((tradition, index) => {
                  const checked = form.traditions.includes(tradition);
                  const inputId = `vendor-tradition-${index}`;
                  return (
                    <label
                      key={tradition}
                      htmlFor={inputId}
                      className={`flex items-start gap-2.5 px-3 py-2.5 rounded-xl border text-xs sm:text-sm cursor-pointer transition-colors motion-reduce:transition-none ${
                        checked
                          ? 'bg-[#F2CCC3]/50 border-[#724319] text-[#4A2B10] font-semibold'
                          : 'bg-white border-[#EBC1B6] text-[#4A2B10] hover:border-[#8A5A44]'
                      }`}
                    >
                      <input
                        id={inputId}
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleMultiOption('traditions', tradition)}
                        className="mt-0.5 h-4 w-4 rounded border-[#724319] text-[#724319] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#724319] shrink-0 cursor-pointer"
                      />
                      <span>{tradition}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {/* Tell Us About Your Business */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label htmlFor="vendor-about" className="block text-sm font-semibold text-[#724319]">
                  Tell us about your business <span className="font-normal text-[#4A2B10]">(optional)</span>
                </label>
                <span
                  id="vendor-about-counter"
                  className="text-xs font-medium text-[#4A2B10] tabular-nums"
                  aria-live="polite"
                >
                  {form.about.length} / {MAX_ABOUT_CHARS} characters
                </span>
              </div>
              <textarea
                id="vendor-about"
                name="about"
                rows={4}
                maxLength={MAX_ABOUT_CHARS}
                value={form.about}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    about: e.target.value.slice(0, MAX_ABOUT_CHARS),
                  }))
                }
                aria-describedby="vendor-about-hint vendor-about-counter"
                className={`${inputBaseClass} resize-y`}
              />
              <p id="vendor-about-hint" className="text-xs text-[#4A2B10]/85">
                Share languages spoken, dietary capabilities, equipment, or signature cultural experience (up to 500 characters).
              </p>
            </div>

            {/* Consent Checkbox */}
            <div className="space-y-1.5">
              <label
                htmlFor="vendor-consent"
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-colors motion-reduce:transition-none ${
                  errors.consent
                    ? 'bg-rose-50/60 border-rose-700'
                    : 'bg-[#FFF8F6] border-[#EBC1B6] hover:border-[#8A5A44]'
                }`}
              >
                <input
                  id="vendor-consent"
                  name="consent"
                  type="checkbox"
                  required
                  checked={form.consent}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, consent: e.target.checked }));
                    clearFieldError('consent');
                  }}
                  aria-invalid={Boolean(errors.consent)}
                  aria-describedby={errors.consent ? 'vendor-consent-error' : undefined}
                  className="mt-0.5 h-4 w-4 rounded border-[#724319] text-[#724319] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#724319] shrink-0 cursor-pointer"
                />
                <span className="text-xs sm:text-sm text-[#4A2B10] leading-relaxed">
                  I agree to EventSphere contacting me about my application and storing the details I submit for that purpose.{' '}
                  <span className="font-semibold text-[#724319]">(required)</span>
                </span>
              </label>
              {errors.consent && (
                <p id="vendor-consent-error" role="alert" className="text-xs font-semibold text-rose-800">
                  {errors.consent}
                </p>
              )}
            </div>

            {/* Submit Button & Privacy Note */}
            <div className="pt-2 space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#724319] hover:bg-[#8A5A44] disabled:opacity-65 text-white text-sm sm:text-base font-semibold shadow-sm hover:shadow-md transition-all motion-reduce:transition-none cursor-pointer disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#724319] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
                <span>{isSubmitting ? 'Submitting application...' : 'Submit application'}</span>
                {!isSubmitting && <ArrowRight className="w-4 h-4" aria-hidden="true" />}
              </button>

              <p className="text-xs sm:text-sm text-[#4A2B10] flex flex-wrap items-center gap-1.5 leading-relaxed">
                <ShieldCheck className="w-4 h-4 text-[#724319] shrink-0" aria-hidden="true" />
                <span>
                  We only use these details to review your application. They are not shared with advertisers. Read our{' '}
                  <button
                    type="button"
                    onClick={onOpenPrivacy}
                    className="font-semibold text-[#724319] underline underline-offset-2 hover:text-[#4A2B10] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#724319] rounded-sm px-0.5"
                  >
                    Privacy Policy
                  </button>
                  .
                </span>
              </p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
