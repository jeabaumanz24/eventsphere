import React, { useState, useEffect, useCallback } from 'react';
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
import { BlogPage } from './components/BlogPage';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { VendorModal } from './components/VendorModal';
import { BlogModal } from './components/BlogModal';
import { LegalModal } from './components/LegalModal';
import { Toast } from './components/Toast';
import { blogPostsData } from './data/mockData';
import { Vendor, BlogPost } from './types';
import { LanguageProvider } from './context/LanguageContext';

function parseBlogRoute(hash: string, pathname = ''): { isBlog: boolean; postId: string } {
  const defaultId = blogPostsData[0]?.id || 'b0';
  let slug = '';

  if (hash.startsWith('#/blog')) {
    slug = hash.replace(/^#\/blog\/?/, '').trim();
  } else if (pathname.includes('/blog')) {
    const [, afterBlog = ''] = pathname.split('/blog');
    slug = afterBlog.replace(/^\/+|\/+$/g, '').trim();
  } else {
    return { isBlog: false, postId: defaultId };
  }

  if (!slug) {
    return { isBlog: true, postId: defaultId };
  }
  const matched = blogPostsData.find((p) => p.slug === slug || p.id === slug);
  return { isBlog: true, postId: matched ? matched.id : defaultId };
}

function EventSphereApp() {
  const initialRoute = parseBlogRoute(
    typeof window !== 'undefined' ? window.location.hash : '',
    typeof window !== 'undefined' ? window.location.pathname : ''
  );
  const [currentPage, setCurrentPage] = useState<'home' | 'blog'>(
    initialRoute.isBlog ? 'blog' : 'home'
  );
  const [activeBlogId, setActiveBlogId] = useState<string>(initialRoute.postId);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const parsed = parseBlogRoute(
        window.location.hash,
        window.location.pathname
      );
      if (parsed.isBlog) {
        setCurrentPage('blog');
        setActiveBlogId(parsed.postId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  const openBlogPage = useCallback((post?: BlogPost) => {
    const target = post || blogPostsData[0];
    setActiveBlogId(target.id);
    setCurrentPage('blog');
    const nextHash = target.slug ? `#/blog/${target.slug}` : '#/blog';
    if (window.location.hash !== nextHash) {
      window.location.hash = nextHash;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const scrollTo = useCallback(
    (id?: string) => {
      const targetId = id || 'home';
      if (currentPage !== 'home') {
        setCurrentPage('home');
        if (window.location.hash.startsWith('#/blog')) {
          window.history.replaceState(null, '', `#${targetId}`);
        }
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 60);
        return;
      }

      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    [currentPage]
  );

  return (
    <div className="min-h-screen bg-[#FFF8F6] text-[#724319] font-sans flex flex-col selection:bg-[#EBC1B6] selection:text-[#724319]">
      {/* 1. Navigation Bar with Language Switcher */}
      <Navbar
        currentPage={currentPage}
        onOpenBlogPage={() => openBlogPage()}
        onNavigateHomeSection={(sectionId) => scrollTo(sectionId)}
        onGetStarted={() => scrollTo('ai-planner')}
        onLanguageChange={(langName) => {
          showToast(`Language switched to ${langName}`);
        }}
      />

      {currentPage === 'blog' ? (
        <main className="flex-grow">
          <BlogPage
            activePostId={activeBlogId}
            onSelectPost={(post) => openBlogPage(post)}
            onBackHome={(sectionId) => scrollTo(sectionId)}
            onShowToast={showToast}
          />
        </main>
      ) : (
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
            onScheduleExported={(msg) => showToast(msg)}
          />

          {/* 9. Customer and Vendor Personas */}
          <PersonasSection />

          {/* 10. Testimonials */}
          <TestimonialsSection />

          {/* 11. Blog Preview */}
          <BlogSection
            onReadPost={(post) => openBlogPage(post)}
            onOpenBlogPage={() => openBlogPage()}
          />

          {/* 12. Contact Section */}
          <ContactSection
            onFormSubmitted={({ name }) => {
              showToast(`Inquiry received for ${name}! Our Adelaide team will be in touch shortly.`);
            }}
          />
        </main>
      )}

      {/* 13. Footer */}
      <Footer
        onOpenPrivacy={() => setLegalModalType('privacy')}
        onOpenTerms={() => setLegalModalType('terms')}
        onOpenBlogPage={() => openBlogPage()}
        onNavigateHomeSection={(sectionId) => scrollTo(sectionId)}
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

export default function App() {
  return (
    <LanguageProvider>
      <EventSphereApp />
    </LanguageProvider>
  );
}
