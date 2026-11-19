import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { StatsSection } from './components/StatsSection';
import { AboutSection } from './components/AboutSection';
import { HomeOverviewStrip } from './components/HomeOverviewStrip';
import { MissionSection } from './components/MissionSection';
import { FeaturedVendorsSection } from './components/FeaturedVendorsSection';
import { HowItWorksTeaserSection } from './components/HowItWorksTeaserSection';
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
import { VendorInsightsSection } from './components/VendorInsightsSection';
import { JoinVendorSection } from './components/JoinVendorSection';
import { Footer } from './components/Footer';
import { VendorModal } from './components/VendorModal';
import { WishlistModal } from './components/WishlistModal';
import { BlogModal } from './components/BlogModal';
import { LegalModal } from './components/LegalModal';
import { Toast } from './components/Toast';
import { blogPostsData, vendorsData } from './data/mockData';
import { Vendor, BlogPost, PageId } from './types';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { PAGE_CONFIGS, detectCurrentPage, getPageHref } from './utils/navigation';
import { trackEvent, trackPageView } from './utils/analytics';
import { parseMarketplaceUrlParams } from './utils/plannerMatching';

const WISHLIST_STORAGE_KEY = 'eventsphere_vendor_wishlist_v1';

function extractBlogPostIdFromLocation(): string | null {
  if (typeof window === 'undefined') return null;

  const searchParams = new URLSearchParams(window.location.search);
  const queryPost = searchParams.get('post');
  if (queryPost) {
    const matched = blogPostsData.find(
      (p) => p.slug === queryPost || p.id === queryPost
    );
    if (matched) return matched.id;
  }

  const hash = window.location.hash || '';
  if (hash.startsWith('#/blog')) {
    const slug = hash.replace(/^#\/blog\/?/, '').trim();
    if (!slug) return null;
    const matched = blogPostsData.find((p) => p.slug === slug || p.id === slug);
    return matched ? matched.id : null;
  }

  return null;
}

function EventSphereApp() {
  const { t, tFor, currentLanguage } = useLanguage();
  const currentPage: PageId = useMemo(() => detectCurrentPage(), []);
  const [activeBlogId, setActiveBlogId] = useState<string | null>(() =>
    extractBlogPostIdFromLocation()
  );

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

  // Sync page metadata and fire GA4 page_view when active page or blog article changes
  useEffect(() => {
    const config = PAGE_CONFIGS[currentPage];
    if (currentPage === 'blog' && activeBlogId) {
      const post = blogPostsData.find((p) => p.id === activeBlogId);
      const articleTitle = post?.seo?.seoTitle || `${post?.title || 'Journal'} | EventSphere`;
      trackPageView('blog', articleTitle);
      return;
    }

    document.title = config.title;
    const descTag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (descTag) {
      descTag.setAttribute('content', config.description);
    }
    trackPageView(currentPage, config.title);
  }, [currentPage, activeBlogId]);

  // Sync browser back/forward navigation & legacy #/blog/ hashes
  useEffect(() => {
    const handleLocationChange = () => {
      const nextBlogId = extractBlogPostIdFromLocation();
      if (currentPage === 'home' && window.location.hash.startsWith('#/blog')) {
        const slug = window.location.hash.replace(/^#\/blog\/?/, '').trim();
        window.location.assign(getPageHref('blog', slug ? `?post=${encodeURIComponent(slug)}` : ''));
        return;
      }
      setActiveBlogId(nextBlogId);
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, [currentPage]);

  // Observe visible sections once per page visit for non-PII GA4 analytics
  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const seenSections = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const sectionId = (entry.target as HTMLElement).id;
            if (sectionId && !seenSections.has(sectionId)) {
              seenSections.add(sectionId);
              trackEvent('section_view', {
                page: currentPage,
                section_id: sectionId,
              });
            }
          }
        }
      },
      { threshold: 0.25 }
    );

    const sectionEls = document.querySelectorAll('main section[id]');
    sectionEls.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [currentPage, activeBlogId]);

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

  const openBlogArticle = useCallback(
    (post?: BlogPost) => {
      const target = post || blogPostsData[0];
      const slug = target.slug || target.id;
      const targetUrl = getPageHref('blog', `?post=${encodeURIComponent(slug)}`);

      if (currentPage !== 'blog') {
        window.location.assign(targetUrl);
        return;
      }

      setActiveBlogId(target.id);
      try {
        window.history.pushState(null, '', targetUrl);
      } catch {
        // Ignore history restrictions
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [currentPage]
  );

  const handleBackToJournal = useCallback(() => {
    setActiveBlogId(null);
    try {
      window.history.pushState(null, '', getPageHref('blog'));
    } catch {
      // Ignore history restrictions
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleOpenStandardVendor = useCallback((vendor: Vendor) => {
    setSelectedVendor(vendor);
  }, []);

  const handleCloseVendorModal = useCallback(() => {
    setSelectedVendor(null);
  }, []);

  const handleExploreMarketplaceFromWishlist = useCallback(() => {
    if (currentPage === 'vendors') {
      const el = document.getElementById('marketplace');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    window.location.assign(getPageHref('vendors'));
  }, [currentPage]);

  const [isMarketplacePlannerFiltered, setIsMarketplacePlannerFiltered] = useState<boolean>(() => {
    if (typeof window === 'undefined' || currentPage !== 'vendors') return false;
    const parsed = parseMarketplaceUrlParams(window.location.search);
    return parsed.budget !== null && parsed.guests !== null;
  });

  return (
    <div className="min-h-screen bg-[#FFF8F6] text-[#724319] font-sans flex flex-col selection:bg-[#EBC1B6] selection:text-[#724319]">
      <a href="#main-content" className="skip-to-content">
        {t('a11y.skipToContent')}
      </a>

      {/* Shared Navigation Bar */}
      <Navbar
        currentPage={currentPage}
        hideGetStarted={currentPage === 'vendors' && isMarketplacePlannerFiltered}
        wishlistCount={wishlistedVendors.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onLanguageChange={(langName, langCode) => {
          showToast(tFor(langCode || currentLanguage, 'toast.langSwitched', { lang: langName }));
        }}
      />

      {/* Per-page Main Landmark */}
      <main id="main-content" className="flex-grow">
        {currentPage === 'home' && (
          <>
            <HeroSection />
            <StatsSection />
            <HomeOverviewStrip />
            <FeaturedVendorsSection
              onSelectVendor={handleOpenStandardVendor}
              wishlistIds={wishlistIds}
              onToggleWishlist={toggleWishlist}
            />
            <HowItWorksTeaserSection />
          </>
        )}

        {currentPage === 'about' && (
          <>
            <MissionSection />
            <AboutSection isPagePrimary={false} />
            <PersonasSection />
            <TestimonialsSection />
          </>
        )}

        {currentPage === 'services' && (
          <>
            <ServicesSection isPagePrimary={true} />
            <HowItWorksSection />
          </>
        )}

        {currentPage === 'ai-planner' && (
          <>
            <AIPlannerSection
              isPagePrimary={true}
              onScheduleExported={(msg) => showToast(msg)}
            />
            <FAQSection />
          </>
        )}

        {currentPage === 'vendors' && (
          <VendorMarketplaceSection
            isPagePrimary={true}
            onSelectVendor={handleOpenStandardVendor}
            onNotify={showToast}
            wishlistIds={wishlistIds}
            onToggleWishlist={toggleWishlist}
            onPlannerFilterChange={setIsMarketplacePlannerFiltered}
          />
        )}

        {currentPage === 'blog' &&
          (activeBlogId ? (
            <BlogPage
              activePostId={activeBlogId}
              onSelectPost={(post) => openBlogArticle(post)}
              onBackToJournal={handleBackToJournal}
              onSelectVendor={handleOpenStandardVendor}
              onShowToast={showToast}
            />
          ) : (
            <BlogSection
              isPagePrimary={true}
              onReadPost={(post) => openBlogArticle(post)}
              onOpenBlogPage={() => openBlogArticle(blogPostsData[0])}
            />
          ))}

        {currentPage === 'contact' && (
          <>
            <ContactSection
              isPagePrimary={true}
              onFormSubmitted={({ name }) => {
                showToast(t('toast.inquiryReceived', { name }));
              }}
            />
            <FAQSection />
          </>
        )}

        {currentPage === 'vendor-insights' && (
          <VendorInsightsSection onCopied={showToast} />
        )}

        {currentPage === 'join-as-a-vendor' && (
          <JoinVendorSection onOpenPrivacy={() => setLegalModalType('privacy')} />
        )}
      </main>

      {/* Shared Footer */}
      <Footer
        onOpenPrivacy={() => setLegalModalType('privacy')}
        onOpenTerms={() => setLegalModalType('terms')}
      />

      {/* Interactive Modals & Toasts */}
      <VendorModal
        vendor={selectedVendor}
        onClose={handleCloseVendorModal}
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
        onSelectVendor={handleOpenStandardVendor}
        onExploreMarketplace={handleExploreMarketplaceFromWishlist}
      />

      <BlogModal post={selectedPost} onClose={() => setSelectedPost(null)} />

      <LegalModal type={legalModalType} onClose={() => setLegalModalType(null)} />

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
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
