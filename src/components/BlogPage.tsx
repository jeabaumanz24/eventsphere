import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Camera,
  Calculator,
  Code2,
  Copy,
  Home,
  Link2,
  ListChecks,
  MapPin,
  Share2,
  Sparkles,
  Star,
  HelpCircle,
} from 'lucide-react';
import { blogPostsData, vendorsData } from '../data/mockData';
import { BlogPost, JournalCategory, Vendor } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { PAGE_CONFIGS, getPageHref } from '../utils/navigation';
import { trackEvent } from '../utils/analytics';
import { JournalArticleBrowser } from './JournalArticleBrowser';

interface BlogPageProps {
  activePostId: string;
  onSelectPost: (post: BlogPost) => void;
  onBackToJournal: () => void;
  onSelectVendor?: (vendor: Vendor) => void;
  onShowToast?: (message: string) => void;
}

const CHECKLIST_STORAGE_KEY = 'eventsphere_wedding_checklist_v1';

const DEFAULT_META = {
  title: PAGE_CONFIGS.blog.title,
  description: PAGE_CONFIGS.blog.description,
  ogTitle: PAGE_CONFIGS.blog.title,
  ogDescription: PAGE_CONFIGS.blog.description,
};

function upsertMetaTag(
  selectorAttr: 'name' | 'property',
  attrValue: string,
  content: string
) {
  let tag = document.querySelector<HTMLMetaElement>(
    `meta[${selectorAttr}="${attrValue}"]`
  );
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(selectorAttr, attrValue);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

export const BlogPage: React.FC<BlogPageProps> = ({
  activePostId,
  onSelectPost,
  onBackToJournal,
  onSelectVendor,
  onShowToast,
}) => {
  const { t, currentLanguage } = useLanguage();
  const activePost =
    blogPostsData.find((p) => p.id === activePostId) || blogPostsData[0];

  const activeCategory: JournalCategory = activePost.journalCategory || 'Planning Tips';
  const [selectedJournalCategory, setSelectedJournalCategory] = useState<'All' | JournalCategory>(
    activeCategory
  );
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(CHECKLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [showSeoDrawer, setShowSeoDrawer] = useState(false);

  useEffect(() => {
    setOpenFaqIdx(0);
    setSelectedJournalCategory(activePost.journalCategory || 'Planning Tips');
  }, [activePost.id, activePost.journalCategory]);

  useEffect(() => {
    try {
      localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(checkedItems));
    } catch {
      // ignore storage quota errors
    }
  }, [checkedItems]);

  const schemaJsonLd = useMemo(() => {
    const slug = activePost.slug || activePost.id;
    const canonicalUrl =
      typeof window !== 'undefined'
        ? `${window.location.origin}${getPageHref('blog', `?post=${slug}`)}`
        : `https://eventsphere.com.au/eventsphere/blog/?post=${slug}`;

    const graph: Record<string, unknown>[] = [
      {
        '@type': 'BlogPosting',
        headline: activePost.title,
        description: activePost.seo?.metaDescription || activePost.summary,
        author: {
          '@type': 'Organization',
          name: activePost.author || 'Event Sphere Editorial Team',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Event Sphere Adelaide',
        },
        datePublished: '2026-11-01',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl,
        },
        ...(activePost.seo?.primaryKeyword
          ? {
              keywords: [
                activePost.seo.primaryKeyword,
                ...(activePost.seo.secondaryKeywords || []),
              ].join(', '),
            }
          : {}),
      },
    ];

    if (activePost.faqs && activePost.faqs.length > 0) {
      graph.push({
        '@type': 'FAQPage',
        mainEntity: activePost.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      });
    }

    return JSON.stringify(
      {
        '@context': 'https://schema.org',
        '@graph': graph,
      },
      null,
      2
    );
  }, [activePost]);

  // Inject dynamic SEO <title>, meta descriptions, and FAQ/BlogPosting JSON-LD
  useEffect(() => {
    const seoTitle = activePost.seo?.seoTitle || `${activePost.title} | Event Sphere`;
    const metaDesc = activePost.seo?.metaDescription || activePost.summary;

    document.title = seoTitle;
    upsertMetaTag('name', 'description', metaDesc);
    upsertMetaTag('property', 'og:title', seoTitle);
    upsertMetaTag('property', 'og:description', metaDesc);
    upsertMetaTag('property', 'og:type', 'article');
    upsertMetaTag('name', 'twitter:title', seoTitle);
    upsertMetaTag('name', 'twitter:description', metaDesc);

    let scriptEl = document.getElementById(
      'eventsphere-article-schema'
    ) as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = 'eventsphere-article-schema';
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = schemaJsonLd;

    return () => {
      document.title = DEFAULT_META.title;
      upsertMetaTag('name', 'description', DEFAULT_META.description);
      upsertMetaTag('property', 'og:title', DEFAULT_META.ogTitle);
      upsertMetaTag('property', 'og:description', DEFAULT_META.ogDescription);
      upsertMetaTag('property', 'og:type', 'website');
      const existingSchema = document.getElementById('eventsphere-article-schema');
      if (existingSchema) {
        existingSchema.remove();
      }
    };
  }, [activePost, schemaJsonLd]);

  const handleSelectArticle = (target: BlogPost) => {
    trackEvent('blog_preview_open', {
      article_title: target.title,
      post_id: target.id,
      category: target.journalCategory || target.category,
    });
    onSelectPost(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToSlug = (slug: string) => {
    const cleanSlug = slug.replace(/^\/?blog\//, '').trim();
    const target = blogPostsData.find(
      (p) => p.slug === cleanSlug || p.id === cleanSlug
    );
    if (target) {
      handleSelectArticle(target);
    }
  };

  const toggleChecklistItem = (key: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(`blog-sec-${sectionId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const copyText = async (text: string, toastText: string) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        onShowToast?.(toastText);
      }
    } catch {
      onShowToast?.(toastText);
    }
  };

  const handleShare = () => {
    copyText(window.location.href, 'Article link copied to clipboard!');
  };

  const checklistSection = activePost.sections?.find((s) => s.isChecklist);
  const totalChecklistCount =
    checklistSection?.groups?.reduce((acc, g) => acc + g.items.length, 0) ?? 0;
  const completedChecklistCount = checklistSection?.groups
    ? checklistSection.groups.reduce(
        (acc, g) =>
          acc +
          g.items.filter((item) => !!checkedItems[`${g.title}:${item}`]).length,
        0
      )
    : 0;

  const pillarPost = blogPostsData.find((p) => p.clusterRole === 'pillar');
  const clusterPosts = blogPostsData.filter((p) => p.clusterRole === 'cluster');
  const culturalPlaybooks = blogPostsData.filter((p) => p.id.startsWith('j'));
  const editorialPosts = blogPostsData.filter((p) => p.clusterRole === 'editorial' && !p.id.startsWith('j'));

  const sameCategoryPosts = useMemo(
    () =>
      blogPostsData.filter(
        (p) => (p.journalCategory || 'Planning Tips') === activeCategory
      ),
    [activeCategory]
  );

  const currentCategoryIndex = sameCategoryPosts.findIndex(
    (p) => p.id === activePost.id
  );
  const prevCategoryPost =
    currentCategoryIndex > 0 ? sameCategoryPosts[currentCategoryIndex - 1] : null;
  const nextCategoryPost =
    currentCategoryIndex >= 0 && currentCategoryIndex < sameCategoryPosts.length - 1
      ? sameCategoryPosts[currentCategoryIndex + 1]
      : null;

  const recommendedVendors = useMemo(() => {
    if (!activePost.recommendedVendorIds || activePost.recommendedVendorIds.length === 0) {
      return [];
    }
    return vendorsData.filter((v) => activePost.recommendedVendorIds!.includes(v.id));
  }, [activePost.recommendedVendorIds]);

  return (
    <div className="pt-24 pb-20 bg-[#FFF8F6] min-h-screen overflow-x-hidden">
      {/* Top Editorial Breadcrumb Bar */}
      <div className="border-b border-[#EBC1B6]/60 bg-white/85 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <button
              type="button"
              onClick={onBackToJournal}
              className="inline-flex items-center gap-1.5 font-semibold text-[#724319] hover:text-[#8A5A44] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('blog.backToJournal')}</span>
            </button>
            <span aria-hidden="true" className="text-[#EBC1B6]">
              /
            </span>
            <a
              href={getPageHref('home')}
              className="text-[#8A5A44] hover:text-[#724319] transition-colors"
            >
              {t('blog.backHome')}
            </a>
            <span aria-hidden="true" className="text-[#EBC1B6]">
              /
            </span>
            <span className="text-[#8A5A44] font-medium inline-flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              {t('blog.journalName')}
            </span>
            {activePost.clusterRole === 'cluster' && pillarPost && (
              <>
                <span aria-hidden="true" className="text-[#EBC1B6]">
                  /
                </span>
                <button
                  type="button"
                  onClick={() => navigateToSlug(pillarPost.slug || pillarPost.id)}
                  className="text-[#724319]/80 hover:text-[#724319] underline decoration-[#EBC1B6] underline-offset-4 cursor-pointer"
                >
                  {t('blog.pillarBadge')}
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-[#724319] bg-[#FFF8F6] hover:bg-[#F2CCC3]/40 border border-[#EBC1B6] transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{t('blog.shareGuide')}</span>
            </button>
            <a
              href={getPageHref('ai-planner')}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-[#724319] hover:bg-[#8A5A44] transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('blog.openPlanner')}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Two-Column Editorial Canvas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Article Column */}
          <article className="lg:col-span-8 bg-white rounded-3xl border border-[#EBC1B6]/70 shadow-sm overflow-hidden">
            {/* Article Hero Header */}
            <header className="p-7 sm:p-10 md:p-12 bg-gradient-to-br from-[#FFF8F6] via-white to-[#F2CCC3]/35 border-b border-[#EBC1B6]/60">
              <div className="flex flex-wrap items-center gap-2.5 text-xs font-medium text-[#8A5A44] mb-4">
                <span className="px-3 py-1 rounded-full bg-[#F2CCC3]/50 text-[#724319] font-semibold">
                  {activePost.clusterRole === 'pillar'
                    ? t('blog.pillarBadge')
                    : activePost.clusterRole === 'cluster'
                      ? `${t('blog.tabCluster')} · ${activePost.category}`
                      : activePost.category}
                </span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {activePost.readTime}
                </span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {activePost.publishedDate}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[2.55rem] font-serif font-bold text-[#724319] leading-[1.15] tracking-tight mb-5">
                {t(`blog.${activePost.id}.title`)}
              </h1>

              {activePost.featuredImage && (
                <div className="mb-6 rounded-2xl overflow-hidden border border-[#EBC1B6]/70 aspect-[16/9] bg-[#FFF8F6]">
                  <img
                    src={activePost.featuredImage}
                    alt={activePost.seo?.featuredImageAlt || t(`blog.${activePost.id}.title`)}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              <p className="text-sm sm:text-base text-[#724319]/85 leading-relaxed font-serif italic bg-white/80 p-5 rounded-2xl border border-[#EBC1B6]/60">
                {t(`blog.${activePost.id}.summary`)}
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-[#724319]/75">
                <div>
                  {t('blog.by')}{' '}
                  <span className="font-semibold text-[#724319]">
                    {activePost.author}
                  </span>
                </div>
                <div className="inline-flex items-center gap-1 text-[#8A5A44]">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{t('blog.editionFooter')}</span>
                </div>
              </div>
            </header>

            {/* Article Body */}
            <div className="p-7 sm:p-10 md:p-12 space-y-11 text-[#724319]/90">
              {currentLanguage !== 'en' && (
                <div className="p-4 rounded-2xl bg-[#FFF8F6] border border-[#EBC1B6] text-xs text-[#8A5A44] leading-relaxed">
                  {t('blog.langNote')}
                </div>
              )}
              {activePost.sections && activePost.sections.length > 0 ? (
                activePost.sections.map((section, idx) => (
                  <section
                    key={section.id}
                    id={`blog-sec-${section.id}`}
                    className="scroll-mt-28 space-y-5"
                  >
                    {idx > 0 && (
                      <div className="border-t border-[#EBC1B6]/50 pt-8" />
                    )}

                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <h2 className="text-2xl sm:text-[1.75rem] font-serif font-bold text-[#724319] leading-snug">
                        {section.heading}
                      </h2>
                      {section.isChecklist && totalChecklistCount > 0 && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-[#FFF8F6] border border-[#EBC1B6] text-[#8A5A44] tabular-nums">
                          <ListChecks className="w-3.5 h-3.5" />
                          {completedChecklistCount} / {totalChecklistCount} ticked
                        </span>
                      )}
                    </div>

                    {section.paragraphs?.map((para, pIdx) => (
                      <p
                        key={pIdx}
                        className="text-sm sm:text-base leading-relaxed text-[#724319]/85"
                      >
                        {para}
                      </p>
                    ))}

                    {section.subsections && section.subsections.length > 0 && (
                      <div className="space-y-4 pt-1">
                        {section.subsections.map((sub) => (
                          <div
                            key={sub.heading}
                            className="pl-4 sm:pl-5 border-l-2 border-[#EBC1B6] space-y-2.5"
                          >
                            <h3 className="text-lg sm:text-xl font-serif font-bold text-[#724319]">
                              {sub.heading}
                            </h3>
                            {sub.paragraphs?.map((sp, spIdx) => (
                              <p
                                key={spIdx}
                                className="text-sm sm:text-base leading-relaxed text-[#724319]/85"
                              >
                                {sp}
                              </p>
                            ))}
                            {sub.bullets && sub.bullets.length > 0 && (
                              <ul className="space-y-2 pt-1">
                                {sub.bullets.map((b) => (
                                  <li
                                    key={b}
                                    className="flex items-start gap-2.5 text-sm text-[#724319]/85"
                                  >
                                    <CheckCircle2 className="w-4 h-4 text-[#8A5A44] shrink-0 mt-0.5" />
                                    <span>{b}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {section.bulletLabel && (
                      <p className="text-sm sm:text-base font-medium text-[#724319] pt-1">
                        {section.bulletLabel}
                      </p>
                    )}

                    {section.bullets && section.bullets.length > 0 && (
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {section.bullets.map((bullet) => (
                          <li
                            key={bullet}
                            className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FFF8F6] border border-[#EBC1B6]/50 text-sm text-[#724319]/90"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#8A5A44] shrink-0 mt-0.5" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.groupIntro && (
                      <p className="text-sm sm:text-base font-medium text-[#724319] pt-2">
                        {section.groupIntro}
                      </p>
                    )}

                    {section.groups && section.groups.length > 0 && (
                      <div
                        className={`grid grid-cols-1 ${
                          section.groups.length === 2
                            ? 'md:grid-cols-2'
                            : 'md:grid-cols-3'
                        } gap-4 pt-1`}
                      >
                        {section.groups.map((group) => (
                          <div
                            key={group.title}
                            className="rounded-2xl bg-[#FFF8F6] border border-[#EBC1B6]/70 p-5 flex flex-col"
                          >
                            <h3 className="text-base font-serif font-bold text-[#724319] mb-1">
                              {group.title}
                            </h3>
                            {group.subtitle && (
                              <p className="text-xs font-medium text-[#8A5A44] mb-3">
                                {group.subtitle}
                              </p>
                            )}
                            <ul className="space-y-2 mt-2">
                              {group.items.map((item) => {
                                const checkKey = `${group.title}:${item}`;
                                const isChecked = !!checkedItems[checkKey];

                                if (section.isChecklist) {
                                  return (
                                    <li key={item}>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          toggleChecklistItem(checkKey)
                                        }
                                        className="w-full flex items-start gap-2.5 text-left text-xs sm:text-sm text-[#724319]/90 hover:text-[#724319] cursor-pointer group"
                                      >
                                        <span
                                          className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-colors ${
                                            isChecked
                                              ? 'bg-[#724319] border-[#724319] text-white'
                                              : 'bg-white border-[#8A5A44]/50 group-hover:border-[#724319]'
                                          }`}
                                        >
                                          {isChecked && (
                                            <Check className="w-3 h-3" />
                                          )}
                                        </span>
                                        <span
                                          className={
                                            isChecked
                                              ? 'line-through text-[#724319]/50'
                                              : ''
                                          }
                                        >
                                          {item}
                                        </span>
                                      </button>
                                    </li>
                                  );
                                }

                                return (
                                  <li
                                    key={item}
                                    className="flex items-start gap-2 text-xs sm:text-sm text-[#724319]/85"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#8A5A44] shrink-0 mt-1.5" />
                                    <span>{item}</span>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}

                    {section.closingNote && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF8F6] border-l-4 border-[#8A5A44] text-sm text-[#724319] font-medium leading-relaxed">
                        {section.closingNote}
                      </div>
                    )}

                    {/* Internal Callout Box linking Pillar <-> Supporting Articles */}
                    {section.calloutLink && (
                      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#F2CCC3]/45 via-[#FFF8F6] to-[#F2CCC3]/25 border border-[#EBC1B6] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1 text-sm leading-relaxed">
                          <p className="text-[#724319]/85 font-medium">
                            {section.calloutLink.promptPrefix}
                          </p>
                          <a
                            href={getPageHref('blog', `?post=${section.calloutLink.targetSlug}`)}
                            onClick={(e) => {
                              e.preventDefault();
                              navigateToSlug(section.calloutLink!.targetSlug);
                            }}
                            className="inline-flex items-center gap-1.5 font-serif font-bold text-[#724319] hover:text-[#8A5A44] underline decoration-[#8A5A44]/50 underline-offset-4 transition-colors"
                          >
                            <span>{section.calloutLink.linkLabel}</span>
                            <ArrowRight className="w-4 h-4 shrink-0" />
                          </a>
                        </div>
                      </div>
                    )}
                  </section>
                ))
              ) : (
                <div className="space-y-5">
                  {activePost.content.map((paragraph, idx) => (
                    <p
                      key={idx}
                      className="text-sm sm:text-base leading-relaxed text-[#724319]/85"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}

              {/* Rough AUD Budget Guide Table */}
              {activePost.budgetGuide && activePost.budgetGuide.items.length > 0 && (
                <section
                  id="blog-sec-budget-guide"
                  className="pt-8 border-t border-[#EBC1B6]/60 space-y-4 scroll-mt-28"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <Calculator className="w-5 h-5 text-[#8A5A44]" />
                      <h2 className="text-2xl sm:text-[1.75rem] font-serif font-bold text-[#724319]">
                        {activePost.budgetGuide.title}
                      </h2>
                    </div>
                    {activePost.budgetGuide.subtitle && (
                      <p className="text-xs sm:text-sm text-[#724319]/80">
                        {activePost.budgetGuide.subtitle}
                      </p>
                    )}
                  </div>
                  <div className="rounded-2xl border border-[#EBC1B6]/80 bg-[#FFF8F6] overflow-hidden">
                    <table className="w-full text-left text-xs sm:text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-[#EBC1B6] bg-[#F2CCC3]/35 text-[#724319]">
                          <th className="py-3 px-3 sm:px-4 font-serif font-bold">{t('blog.budgetGuideItem')}</th>
                          <th className="py-3 px-3 sm:px-4 font-serif font-bold sm:whitespace-nowrap">{t('blog.budgetGuideEst')}</th>
                          <th className="py-3 px-3 sm:px-4 font-serif font-bold">{t('blog.budgetGuideNotes')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EBC1B6]/50">
                        {activePost.budgetGuide.items.map((row) => (
                          <tr key={row.category} className="bg-white/75 hover:bg-white transition-colors">
                            <td className="py-3 px-3 sm:px-4 font-semibold text-[#724319]">{row.category}</td>
                            <td className="py-3 px-3 sm:px-4 font-mono font-bold text-[#8A5A44] sm:whitespace-nowrap tabular-nums">
                              {row.estimateAud}
                            </td>
                            <td className="py-3 px-3 sm:px-4 text-[#724319]/80">{row.notes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* FAQ Section (Schema-backed FAQPage) */}
              {activePost.faqs && activePost.faqs.length > 0 && (
                <section
                  id="blog-sec-faqs"
                  className="pt-8 border-t border-[#EBC1B6]/60 space-y-5 scroll-mt-28"
                >
                  <div className="flex items-center gap-2.5">
                    <HelpCircle className="w-5 h-5 text-[#8A5A44]" />
                    <h2 className="text-2xl sm:text-[1.75rem] font-serif font-bold text-[#724319]">
                      {t('blog.faqsTitle')}
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {activePost.faqs.map((faq, fIdx) => {
                      const isOpen = openFaqIdx === fIdx;
                      return (
                        <div
                          key={faq.question}
                          className="rounded-2xl border border-[#EBC1B6]/70 bg-[#FFF8F6]/70 overflow-hidden"
                        >
                          <button
                            type="button"
                            onClick={() => setOpenFaqIdx(isOpen ? null : fIdx)}
                            className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FFF8F6] transition-colors"
                          >
                            <span className="font-serif font-bold text-sm sm:text-base text-[#724319]">
                              {faq.question}
                            </span>
                            <ChevronDown
                              className={`w-4 h-4 text-[#8A5A44] shrink-0 transition-transform duration-200 ${
                                isOpen ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                          {isOpen && (
                            <div className="px-5 pb-4 pt-1 text-sm text-[#724319]/85 leading-relaxed border-t border-[#EBC1B6]/40 bg-white/80">
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Recommended Event Sphere Vendors Linking Back to Marketplace */}
              {recommendedVendors.length > 0 && (
                <section
                  id="blog-sec-vendors"
                  className="pt-8 border-t border-[#EBC1B6]/60 space-y-5 scroll-mt-28"
                >
                  <div className="space-y-1">
                    <h2 className="text-2xl sm:text-[1.75rem] font-serif font-bold text-[#724319]">
                      {t('blog.recVendorsTitle')}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#724319]/80">
                      {t('blog.recVendorsSub')}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {recommendedVendors.map((vendor) => (
                      <div
                        key={vendor.id}
                        onClick={() => {
                          if (onSelectVendor) {
                            onSelectVendor(vendor);
                          } else {
                            window.location.assign(getPageHref('vendors'));
                          }
                        }}
                        className="group p-4 rounded-2xl bg-[#FFF8F6] border border-[#EBC1B6]/80 hover:border-[#8A5A44] hover:shadow-md transition-all cursor-pointer flex gap-3.5 items-center"
                      >
                        <img
                          src={vendor.image}
                          alt={vendor.businessName}
                          className="w-16 h-16 rounded-xl object-cover shrink-0 border border-[#EBC1B6]"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                        />
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-semibold uppercase tracking-wide text-[#8A5A44] truncate">
                              {t(`cat.${vendor.category}`)}
                            </span>
                            <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-[#724319] tabular-nums shrink-0">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              {vendor.rating}
                            </span>
                          </div>
                          <h3 className="text-sm font-serif font-bold text-[#724319] group-hover:text-[#8A5A44] truncate">
                            {vendor.businessName}
                          </h3>
                          <div className="flex items-center justify-between gap-2 text-[11px] text-[#724319]/75">
                            <span className="truncate">{vendor.location}</span>
                            <span className="font-mono font-semibold text-[#724319] shrink-0">
                              {vendor.startingPrice}
                            </span>
                          </div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-[#8A5A44] group-hover:text-[#724319] shrink-0" />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Bottom Action Callout Inside Article */}
              <div className="pt-8 border-t border-[#EBC1B6]/60 space-y-6">
                <div className="rounded-3xl bg-gradient-to-br from-[#F2CCC3]/45 via-[#FFF8F6] to-[#EBC1B6]/35 border border-[#EBC1B6] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8A5A44]">
                      {t('blog.actionKicker')}
                    </span>
                    <h3 className="text-xl font-serif font-bold text-[#724319]">
                      {t('blog.actionTitle')}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#724319]/80">
                      {t('blog.actionSub')}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 shrink-0">
                    <a
                      href={getPageHref('ai-planner')}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-[#724319] hover:bg-[#8A5A44] transition-colors shadow-xs"
                    >
                      <Calculator className="w-4 h-4" />
                      <span>{t('blog.startAiBtn')}</span>
                    </a>
                    <a
                      href={getPageHref('vendors')}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-[#724319] bg-white hover:bg-[#FFF8F6] border border-[#EBC1B6] transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                      <span>{t('blog.browseVendorsBtn')}</span>
                    </a>
                  </div>
                </div>

                {(prevCategoryPost || nextCategoryPost) && (
                  <nav
                    aria-label={t('blog.moreInCategory', {
                      category: t(`blog.cat.${activeCategory}`),
                    })}
                    className="pt-2 space-y-3"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8A5A44]">
                      {t('blog.moreInCategory', {
                        category: t(`blog.cat.${activeCategory}`),
                      })}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {prevCategoryPost ? (
                        <a
                          href={getPageHref(
                            'blog',
                            `?post=${encodeURIComponent(
                              prevCategoryPost.slug || prevCategoryPost.id
                            )}`
                          )}
                          onClick={(e) => {
                            e.preventDefault();
                            handleSelectArticle(prevCategoryPost);
                          }}
                          className="group p-4 rounded-2xl bg-[#FFF8F6] hover:bg-[#F2CCC3]/30 border border-[#EBC1B6] transition-colors flex flex-col gap-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724319]"
                        >
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8A5A44]">
                            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>{t('blog.prevArticle')}</span>
                          </span>
                          <span className="text-sm font-serif font-bold text-[#724319] group-hover:text-[#8A5A44] leading-snug">
                            {t(`blog.${prevCategoryPost.id}.title`)}
                          </span>
                        </a>
                      ) : (
                        <div className="hidden sm:block" />
                      )}

                      {nextCategoryPost && (
                        <a
                          href={getPageHref(
                            'blog',
                            `?post=${encodeURIComponent(
                              nextCategoryPost.slug || nextCategoryPost.id
                            )}`
                          )}
                          onClick={(e) => {
                            e.preventDefault();
                            handleSelectArticle(nextCategoryPost);
                          }}
                          className="group p-4 rounded-2xl bg-[#FFF8F6] hover:bg-[#F2CCC3]/30 border border-[#EBC1B6] transition-colors flex flex-col items-start sm:items-end sm:text-right gap-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724319]"
                        >
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8A5A44]">
                            <span>{t('blog.nextArticle')}</span>
                            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                          </span>
                          <span className="text-sm font-serif font-bold text-[#724319] group-hover:text-[#8A5A44] leading-snug">
                            {t(`blog.${nextCategoryPost.id}.title`)}
                          </span>
                        </a>
                      )}
                    </div>
                  </nav>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={onBackToJournal}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-[#724319] bg-[#FFF8F6] hover:bg-[#F2CCC3]/40 border border-[#EBC1B6] transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{t('blog.backToJournal')}</span>
                  </button>
                  <a
                    href={getPageHref('home')}
                    className="text-xs font-medium text-[#8A5A44] hover:text-[#724319] underline decoration-[#EBC1B6] underline-offset-4"
                  >
                    {t('blog.backHome')}
                  </a>
                </div>
              </div>

              {/* Optional Collapsible SEO Metadata & FAQ Schema Inspector */}
              {activePost.seo && (
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => setShowSeoDrawer((prev) => !prev)}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#8A5A44] hover:text-[#724319] transition-colors cursor-pointer"
                  >
                    <Code2 className="w-4 h-4" />
                    <span>
                      {showSeoDrawer
                        ? 'Hide SEO Metadata & FAQ Schema (JSON-LD)'
                        : 'View SEO Metadata & FAQ Schema (JSON-LD)'}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${
                        showSeoDrawer ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {showSeoDrawer && (
                    <div className="mt-4 rounded-2xl border border-[#EBC1B6] bg-[#FFF8F6] p-5 space-y-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white p-3.5 rounded-xl border border-[#EBC1B6]/60 space-y-1">
                          <div className="flex items-center justify-between text-[#8A5A44] font-semibold">
                            <span>
                              SEO Title ({activePost.seo.seoTitle.length}/60 chars)
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                copyText(
                                  activePost.seo!.seoTitle,
                                  'SEO Title copied!'
                                )
                              }
                              className="hover:text-[#724319] cursor-pointer"
                              aria-label="Copy SEO Title"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-[#724319] font-medium">
                            {activePost.seo.seoTitle}
                          </p>
                        </div>

                        <div className="bg-white p-3.5 rounded-xl border border-[#EBC1B6]/60 space-y-1">
                          <div className="flex items-center justify-between text-[#8A5A44] font-semibold">
                            <span>Suggested URL Slug</span>
                            <button
                              type="button"
                              onClick={() =>
                                copyText(
                                  activePost.seo!.urlSlug,
                                  'URL slug copied!'
                                )
                              }
                              className="hover:text-[#724319] cursor-pointer"
                              aria-label="Copy URL slug"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="font-mono text-[#724319]">
                            {activePost.seo.urlSlug}
                          </p>
                        </div>
                      </div>

                      <div className="bg-white p-3.5 rounded-xl border border-[#EBC1B6]/60 space-y-1">
                        <div className="flex items-center justify-between text-[#8A5A44] font-semibold">
                          <span>
                            Meta Description (
                            {activePost.seo.metaDescription.length}/155 chars)
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              copyText(
                                activePost.seo!.metaDescription,
                                'Meta Description copied!'
                              )
                            }
                            className="hover:text-[#724319] cursor-pointer"
                            aria-label="Copy Meta Description"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[#724319]/90 leading-relaxed">
                          {activePost.seo.metaDescription}
                        </p>
                      </div>

                      <div className="bg-white p-3.5 rounded-xl border border-[#EBC1B6]/60 space-y-1.5">
                        <div className="text-[#8A5A44] font-semibold">
                          Target Keywords & Featured Image Brief
                        </div>
                        <p className="text-[#724319]">
                          <strong>Primary:</strong> {activePost.seo.primaryKeyword}
                          {activePost.seo.secondaryKeywords &&
                            activePost.seo.secondaryKeywords.length > 0 && (
                              <>
                                {' · '}
                                <strong>Secondary:</strong>{' '}
                                {activePost.seo.secondaryKeywords.join(', ')}
                              </>
                            )}
                        </p>
                        <p className="text-[#724319]/85">
                          <strong>Featured Image:</strong>{' '}
                          {activePost.seo.featuredImageRecommendation}
                        </p>
                        <p className="text-[#724319]/85">
                          <strong>Alt Text:</strong> {activePost.seo.featuredImageAlt}
                        </p>
                      </div>

                      <div className="bg-white p-3.5 rounded-xl border border-[#EBC1B6]/60 space-y-2">
                        <div className="flex items-center justify-between text-[#8A5A44] font-semibold">
                          <span>Schema.org JSON-LD (BlogPosting + FAQPage)</span>
                          <button
                            type="button"
                            onClick={() =>
                              copyText(schemaJsonLd, 'JSON-LD schema copied!')
                            }
                            className="inline-flex items-center gap-1 hover:text-[#724319] cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy JSON-LD</span>
                          </button>
                        </div>
                        <pre className="max-h-56 overflow-auto p-3 rounded-lg bg-[#FFF8F6] text-[11px] font-mono text-[#724319]/90 leading-relaxed">
                          {schemaJsonLd}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </article>

          {/* Sticky Editorial Sidebar */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* Table of Contents */}
            {activePost.sections && activePost.sections.length > 0 && (
              <div className="bg-white rounded-3xl border border-[#EBC1B6]/70 p-6 shadow-xs">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8A5A44] mb-4">
                  {t('blog.inThisGuide')}
                </h3>
                <nav className="space-y-1.5">
                  {activePost.sections.map((sec, i) => (
                    <button
                      key={sec.id}
                      onClick={() => scrollToSection(sec.id)}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm text-[#724319]/85 hover:text-[#724319] hover:bg-[#FFF8F6] transition-colors flex items-start gap-2.5 cursor-pointer"
                    >
                      <span className="font-mono text-[11px] text-[#8A5A44] mt-0.5 shrink-0">
                        {i + 1 < 10 ? `0${i + 1}` : i + 1}
                      </span>
                      <span className="leading-snug">{sec.heading}</span>
                    </button>
                  ))}
                  {activePost.faqs && activePost.faqs.length > 0 && (
                    <button
                      onClick={() => scrollToSection('faqs')}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm text-[#724319]/85 hover:text-[#724319] hover:bg-[#FFF8F6] transition-colors flex items-start gap-2.5 cursor-pointer"
                    >
                      <span className="font-mono text-[11px] text-[#8A5A44] mt-0.5 shrink-0">
                        FAQ
                      </span>
                      <span className="leading-snug">
                        {t('blog.faqsTitle')}
                      </span>
                    </button>
                  )}
                </nav>
              </div>
            )}

            {/* Cultural & Event Planning Journal Library */}
            <div className="bg-white rounded-3xl border border-[#EBC1B6]/70 p-6 shadow-xs space-y-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8A5A44]">
                <Link2 className="w-3.5 h-3.5" />
                <span>{t('blog.clusterSidebarTitle')}</span>
              </div>

              {culturalPlaybooks.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8A5A44] mb-2">
                    {t('blog.tabCluster')} ({culturalPlaybooks.length})
                  </div>
                  <div className="space-y-2">
                    {culturalPlaybooks.map((post) => {
                      const isCurrent = post.id === activePost.id;
                      return (
                        <button
                          key={post.id}
                          type="button"
                          onClick={() => handleSelectArticle(post)}
                          className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                            isCurrent
                              ? 'bg-[#724319] text-white border-[#724319] shadow-2xs'
                              : 'bg-[#FFF8F6] border-[#EBC1B6]/70 text-[#724319] hover:bg-[#F2CCC3]/30'
                          }`}
                        >
                          <div className={`flex items-center gap-2 text-[10px] mb-0.5 ${isCurrent ? 'text-white/75' : 'text-[#8A5A44]'}`}>
                            <span>{t(`blog.cat.${post.journalCategory || 'Planning Tips'}`)}</span>
                            <span aria-hidden="true">·</span>
                            <span>{post.readTime}</span>
                          </div>
                          <div className="text-xs sm:text-sm font-serif font-bold leading-snug">
                            {t(`blog.${post.id}.title`)}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {pillarPost && (
                <div className="pt-2 border-t border-[#EBC1B6]/50">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8A5A44] mb-1.5">
                    {t('blog.pillarBadge')}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSelectArticle(pillarPost)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      pillarPost.id === activePost.id
                        ? 'bg-[#724319] text-white border-[#724319] shadow-xs'
                        : 'bg-[#FFF8F6] border-[#EBC1B6] text-[#724319] hover:bg-[#F2CCC3]/30'
                    }`}
                  >
                    <div className="text-sm font-serif font-bold leading-snug">
                      {t(`blog.${pillarPost.id}.title`)}
                    </div>
                  </button>
                </div>
              )}

              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8A5A44] mb-2">
                  {t('blog.supportingHeading')} ({clusterPosts.length})
                </div>
                <div className="space-y-2">
                  {clusterPosts.map((post) => {
                    const isCurrent = post.id === activePost.id;
                    return (
                      <button
                        key={post.id}
                        type="button"
                        onClick={() => handleSelectArticle(post)}
                        className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-[#FFF8F6] border-[#8A5A44] shadow-2xs'
                            : 'bg-white border-[#EBC1B6]/60 hover:bg-[#FFF8F6]'
                        }`}
                      >
                        <div className="flex items-center gap-2 text-[11px] text-[#8A5A44] mb-0.5">
                          <span>{post.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>{post.readTime}</span>
                        </div>
                        <div className="text-xs sm:text-sm font-serif font-bold text-[#724319] leading-snug">
                          {t(`blog.${post.id}.title`)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {editorialPosts.length > 0 && (
                <div className="pt-2 border-t border-[#EBC1B6]/50">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8A5A44] mb-2">
                    {t('blog.adelaideSpotlight')}
                  </div>
                  <div className="space-y-2">
                    {editorialPosts.map((post) => {
                      const isCurrent = post.id === activePost.id;
                      return (
                        <button
                          key={post.id}
                          type="button"
                          onClick={() => handleSelectArticle(post)}
                          className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                            isCurrent
                              ? 'bg-[#FFF8F6] border-[#8A5A44] shadow-2xs'
                              : 'bg-white border-[#EBC1B6]/60 hover:bg-[#FFF8F6]'
                          }`}
                        >
                          <div className="text-xs font-serif font-bold text-[#724319] leading-snug">
                            {t(`blog.${post.id}.title`)}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Return Home Card */}
            <div className="bg-[#724319] text-white rounded-3xl p-6 shadow-md space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center">
                <Home className="w-5 h-5 text-[#F2CCC3]" />
              </div>
              <h3 className="text-lg font-serif font-bold">
                {t('blog.exploreAdelaideTitle')}
              </h3>
              <p className="text-xs text-white/80 leading-relaxed">
                {t('blog.exploreAdelaideSub')}
              </p>
              <a
                href={getPageHref('vendors')}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#724319] hover:bg-[#FFF8F6] text-xs font-semibold transition-colors"
              >
                <span>{t('blog.exploreMarketplaceBtn')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </aside>
        </div>
      </div>

      {/* Unified Non-Scrolling Journal Browser Below Article Canvas */}
      <section
        aria-label={t('blog.directoryHeading')}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 mt-14 border-t border-[#EBC1B6]/60"
      >
        <JournalArticleBrowser
          selectedCategory={selectedJournalCategory}
          onSelectCategory={setSelectedJournalCategory}
          activePostId={activePost.id}
          onSelectPost={(post) => {
            onSelectPost(post);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          heading={t('blog.directoryHeading')}
          subheading={t('blog.directorySub')}
        />
      </section>
    </div>
  );
};
