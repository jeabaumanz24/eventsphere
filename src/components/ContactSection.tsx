import React, { useState } from 'react';
import { MapPin, Mail, Phone, Send, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { adelaideRegions } from '../data/mockData';

interface ContactSectionProps {
  onFormSubmitted?: (data: { name: string; email: string }) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onFormSubmitted }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: 'Multicultural Wedding',
    message: '',
  });

  const [activeRegionId, setActiveRegionId] = useState('cbd');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const eventTypes = [
    'Multicultural Wedding',
    'Cultural Ceremony & Banquet',
    'Private Vineyard Celebration',
    'Engagement & Sangeet Gala',
    'Milestone Birthday / Private Event',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill in your name, email, and celebration details.');
      return;
    }

    if (!formData.email.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      if (onFormSubmitted) {
        onFormSubmitted({ name: formData.name, email: formData.email });
      }
    }, 600);
  };

  const currentRegion = adelaideRegions.find((r) => r.id === activeRegionId) || adelaideRegions[0];

  return (
    <section id="contact" className="py-20 md:py-28 bg-[#F2CCC3]/25 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#8A5A44]">
            Start Your Journey
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#724319]">
            Connect with EventSphere
          </h2>
          <p className="text-sm sm:text-base text-[#724319]/80 leading-relaxed [text-wrap:balance]">
            Whether you are planning a dual-heritage celebration in the Barossa or an artisan vendor looking to join our Adelaide directory, we would love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-[#EBC1B6] shadow-md">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#F2CCC3] border border-[#8A5A44]/30 flex items-center justify-center text-[#724319] mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8 text-[#724319]" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#724319]">
                  Thank you, {formData.name}!
                </h3>
                <p className="text-sm text-[#724319]/80 max-w-md mx-auto leading-relaxed">
                  Your inquiry has been received by our Adelaide planning desk. One of our specialist advisors will be in touch within 24 hours with tailored vendor recommendations.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        eventType: 'Multicultural Wedding',
                        message: '',
                      });
                    }}
                    className="px-6 py-2.5 bg-[#724319] text-white text-xs font-semibold rounded-full hover:bg-[#8A5A44] transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 text-left">
                {errorMessage && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#724319]">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
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
                    <label className="text-xs font-semibold text-[#724319]">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
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
                    <label className="text-xs font-semibold text-[#724319]">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+61 400 123 456"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-[#FFF8F6] border border-[#EBC1B6] rounded-xl text-sm text-[#724319] focus:outline-none focus:ring-2 focus:ring-[#8A5A44]/30 focus:border-[#8A5A44] transition-all"
                    />
                  </div>

                  {/* Event Type */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#724319]">
                      Event Type
                    </label>
                    <select
                      value={formData.eventType}
                      onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                      className="w-full px-4 py-3 bg-[#FFF8F6] border border-[#EBC1B6] rounded-xl text-sm text-[#724319] focus:outline-none focus:ring-2 focus:ring-[#8A5A44]/30 focus:border-[#8A5A44] transition-all cursor-pointer"
                    >
                      {eventTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#724319]">
                    Celebration Details & Cultural Traditions <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us about your celebration date, preferred Adelaide area, traditions (e.g. Tea Ceremony, Barossa wine tasting), and estimated guest count..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FFF8F6] border border-[#EBC1B6] rounded-xl text-sm text-[#724319] focus:outline-none focus:ring-2 focus:ring-[#8A5A44]/30 focus:border-[#8A5A44] transition-all resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 bg-[#724319] hover:bg-[#8A5A44] text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span>Sending Inquiry...</span>
                  ) : (
                    <>
                      <span>Submit Event Inquiry</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Adelaide South Australia Interactive Map Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EBC1B6] shadow-md space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#EBC1B6]/50">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#8A5A44]" />
                  <h3 className="text-base font-serif font-bold text-[#724319]">
                    Adelaide, South Australia
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-[#8A5A44] bg-[#FFF8F6] px-2.5 py-0.5 rounded-full border border-[#EBC1B6]">
                  HQ & Service Hub
                </span>
              </div>

              {/* Stylized Visual Map Representation of Greater Adelaide */}
              <div className="relative bg-[#FFF8F6] rounded-2xl p-5 border border-[#EBC1B6]/60 overflow-hidden">
                <div className="text-[11px] font-semibold text-[#8A5A44] mb-3 uppercase tracking-wider">
                  Select Regional Celebration Zone:
                </div>

                {/* Region Selector Buttons */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {adelaideRegions.map((region) => {
                    const isSelected = activeRegionId === region.id;
                    return (
                      <button
                        key={region.id}
                        type="button"
                        onClick={() => setActiveRegionId(region.id)}
                        className={`p-2.5 rounded-xl text-left text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#724319] text-white shadow-xs font-semibold'
                            : 'bg-white text-[#724319] border border-[#EBC1B6]/70 hover:bg-[#F2CCC3]/40'
                        }`}
                      >
                        <div className="truncate font-semibold">{region.name.split('&')[0]}</div>
                        <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-white/80' : 'text-[#8A5A44]'}`}>
                          {region.vendorCount} Vendors
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Region detail highlight */}
                <div className="p-3.5 bg-white rounded-xl border border-[#EBC1B6]/60 text-xs space-y-1.5">
                  <div className="font-serif font-bold text-[#724319]">{currentRegion.name}</div>
                  <p className="text-[#724319]/80 leading-relaxed text-[11px]">
                    {currentRegion.description}
                  </p>
                  <div className="pt-1 text-[10px] text-[#8A5A44]">
                    <span className="font-semibold">Top Venues:</span> {currentRegion.popularVenues.join(' · ')}
                  </div>
                </div>
              </div>

              {/* Contact Information & Hours */}
              <div className="space-y-3 pt-2 text-xs text-[#724319]/80">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#8A5A44] shrink-0" />
                  <span>concierge@eventsphere.com.au</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#8A5A44] shrink-0" />
                  <span>+61 (08) 8234 5678 (Mon–Fri 9am–6pm ACDT)</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-[#8A5A44] shrink-0" />
                  <span>Level 4, North Terrace Cultural Precinct, Adelaide SA 5000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
