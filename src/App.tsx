import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { StatsSection } from './components/StatsSection';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { VendorMarketplaceSection } from './components/VendorMarketplaceSection';
import { AIPlannerSection } from './components/AIPlannerSection';
import { PersonasSection } from './components/PersonasSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { BlogSection } from './components/BlogSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { VendorModal } from './components/VendorModal';
import { BlogModal } from './components/BlogModal';
import { LegalModal } from './components/LegalModal';
import { Toast } from './components/Toast';
import { Vendor, BlogPost } from './types';

export default function App() {
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F6] text-[#724319] font-sans flex flex-col selection:bg-[#EBC1B6] selection:text-[#724319]">
      {/* 1. Navigation Bar */}
      <Navbar onGetStarted={() => scrollTo('ai-planner')} />

      <main className="flex-grow">
        {/* 2. Hero Section */}
        <HeroSection
          onStartPlanning={() => scrollTo('ai-planner')}
          onExploreVendors={() => scrollTo('marketplace')}
        />

        {/* 3. Statistics Section */}
        <StatsSection />

        {/* 4. About EventSphere ("Why EventSphere") */}
        <AboutSection onLearnMore={() => scrollTo('services')} />

        {/* 5. Services Section */}
        <ServicesSection onSelectService={() => scrollTo('ai-planner')} />

        {/* 6. How It Works (3-step timeline) */}
        <HowItWorksSection />

        {/* 7. Vendor Marketplace Preview */}
        <VendorMarketplaceSection
          onSelectVendor={(vendor) => setSelectedVendor(vendor)}
        />

        {/* 8. AI Event Planner Section (SaaS dashboard preview) */}
        <AIPlannerSection
          onExploreVendors={() => scrollTo('marketplace')}
          onOpenConsult={() => scrollTo('contact')}
        />

        {/* 9. Customer and Vendor Personas */}
        <PersonasSection />

        {/* 10. Testimonials */}
        <TestimonialsSection />

        {/* 11. Blog Preview */}
        <BlogSection
          onReadPost={(post) => setSelectedPost(post)}
        />

        {/* 12. Contact Section */}
        <ContactSection
          onFormSubmitted={({ name }) => {
            showToast(`Inquiry received for ${name}! Our Adelaide team will be in touch shortly.`);
          }}
        />
      </main>

      {/* 13. Footer */}
      <Footer
        onOpenPrivacy={() => setLegalModalType('privacy')}
        onOpenTerms={() => setLegalModalType('terms')}
      />

      {/* Interactive Modals & Toasts */}
      <VendorModal
        vendor={selectedVendor}
        onClose={() => setSelectedVendor(null)}
        onRequestSent={(name) => {
          showToast(`Proposal request sent to ${name}!`);
        }}
      />

      <BlogModal
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
      />

      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />

      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
}
