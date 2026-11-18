import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import { FAQSection } from './components/FAQSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { VendorModal } from './components/VendorModal';
import { WishlistModal } from './components/WishlistModal';
import { BlogModal } from './components/BlogModal';
import { LegalModal } from './components/LegalModal';
import { Toast } from './components/Toast';
import { blogPostsData, vendorsData } from './data/mockData';
import { Vendor, BlogPost } from './types';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

const WISHLIST_STORAGE_KEY = 'eventsphere_vendor_wishlist_v1';

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
  const { t, tFor, currentLanguage } = useLanguage();
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
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      const validIds = new Set(vendorsData.map((v) => v.id));
      return parsed.filter((id): id is string => typeof id === 'string' && validIds.has(id));
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistIds));
    } catch {
      // Ignore storage quota or private-mode restrictions
    }
  }, [wishlistIds]);

  const wishlistedVendors = useMemo(() => {
    return wishlistIds
      .map((id) => vendorsData.find((v) => v.id === id))
      .filter((v): v is Vendor => Boolean(v));
  }, [wishlistIds]);

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

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  }, []);

  const toggleWishlist = useCallback(
    (vendor: Vendor) => {
      const alreadySaved = wishlistIds.includes(vendor.id);
      setWishlistIds((prev) =>
        prev.includes(vendor.id)
          ? prev.filter((id) => id !== vendor.id)
          : [...prev, vendor.id]
      );
      showToast(
        t(alreadySaved ? 'wishlist.removedToast' : 'wishlist.addedToast', {
          name: vendor.businessName,
        })
      );
    },
    [wishlistIds, showToast, t]
  );

  const removeFromWishlist = useCallback(
    (vendorId: string) => {
      const target = vendorsData.find((v) => v.id === vendorId);
      setWishlistIds((prev) => prev.filter((id) => id !== vendorId));
      if (target) {
        showToast(t('wishlist.removedToast', { name: target.businessName }));
      }
    },
    [showToast, t]
  );

  const clearWishlist = useCallback(() => {
    setWishlistIds([]);
    showToast(t('wishlist.clearedToast'));
  }, [showToast, t]);

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
        wishlistCount={wishlistedVendors.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onLanguageChange={(langName, langCode) => {
          showToast(tFor(langCode || currentLanguage, 'toast.langSwitched', { lang: langName }));
        }}
      />

      {currentPage === 'blog' ? (
        <main className="flex-grow">
          <BlogPage
            activePostId={activeBlogId}
            onSelectPost={(post) => openBlogPage(post)}
            onBackHome={(sectionId) => scrollTo(sectionId)}
            onSelectVendor={(vendor) => setSelectedVendor(vendor)}
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
            onNotify={showToast}
            wishlistIds={wishlistIds}
            onToggleWishlist={toggleWishlist}
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

          {/* 12. Multicultural Adelaide FAQ */}
          <FAQSection
            onOpenContact={() => scrollTo('contact')}
            onOpenPlanner={() => scrollTo('ai-planner')}
          />

          {/* 13. Contact Section */}
          <ContactSection
            onFormSubmitted={({ name }) => {
              showToast(t('toast.inquiryReceived', { name }));
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
        isWishlisted={selectedVendor ? wishlistIds.includes(selectedVendor.id) : false}
        onToggleWishlist={toggleWishlist}
        onRequestSent={(name) => {
          showToast(t('toast.proposalSent', { name }));
        }}
      />

      <WishlistModal
        isOpen={isWishlistOpen}
        vendors={wishlistedVendors}
        onClose={() => setIsWishlistOpen(false)}
        onRemoveVendor={removeFromWishlist}
        onClearAll={clearWishlist}
        onSelectVendor={(vendor) => setSelectedVendor(vendor)}
        onExploreMarketplace={() => scrollTo('marketplace')}
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
