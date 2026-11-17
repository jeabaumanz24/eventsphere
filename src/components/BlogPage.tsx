import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
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
  HelpCircle,
} from 'lucide-react';
import { blogPostsData } from '../data/mockData';
import { BlogPost } from '../types';

interface BlogPageProps {
  activePostId: string;
  onSelectPost: (post: BlogPost) => void;
  onBackHome: (sectionId?: string) => void;
  onShowToast?: (message: string) => void;
}

const CHECKLIST_STORAGE_KEY = 'eventsphere_wedding_checklist_v1';

const DEFAULT_META = {
  title: 'Event Sphere | AI-Powered Multicultural Event Planning & Vendor Discovery',
  description:
    "Event Sphere is Adelaide's premier AI-powered multicultural event planning and vendor discovery platform. Plan weddings, cultural celebrations, and private events with intelligent budgeting and verified local vendors.",
  ogTitle: 'Event Sphere | AI-Powered Multicultural Event Planning',
  ogDescription:
    'Discover trusted vendors, plan smarter, and create unforgettable multicultural events in Adelaide with intelligent recommendations and planning tools.',
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
  onBackHome,
  onShowToast,
}) => {
  const activePost =
    blogPostsData.find((p) => p.id === activePostId) || blogPostsData[0];

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
  }, [activePost.id]);

  useEffect(() => {
    try {
      localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(checkedItems));
    } catch {
      // ignore storage quota errors
    }
  }, [checkedItems]);

  const schemaJsonLd = useMemo(() => {
    const urlSlug =
      activePost.seo?.urlSlug || `/blog/${activePost.slug || activePost.id}`;
    const canonicalUrl =
      typeof window !== 'undefined'
        ? `${window.location.origin}/#${urlSlug}`
        : `https://eventsphere.com.au/#${urlSlug}`;

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

  const navigateToSlug = (slug: string) => {
    const cleanSlug = slug.replace(/^\/?blog\//, '').trim();
    const target = blogPostsData.find(
      (p) => p.slug === cleanSlug || p.id === cleanSlug
    );
    if (target) {
      onSelectPost(target);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
  const editorialPosts = blogPostsData.filter((p) => p.clusterRole === 'editorial');

  return (
    <div className="pt-24 pb-20 bg-[#FFF8F6] min-h-screen">
      {/* Top Editorial Breadcrumb Bar */}
      <div className="border-b border-[#EBC1B6]/60 bg-white/85 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <button
              onClick={() => onBackHome()}
              className="inline-flex items-center gap-1.5 font-semibold text-[#724319] hover:text-[#8A5A44] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
            <span aria-hidden="true" className="text-[#EBC1B6]">
              /
            </span>
            <span className="text-[#8A5A44] font-medium inline-flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              Event Sphere Journal
            </span>
            {activePost.clusterRole === 'cluster' && pillarPost && (
              <>
                <span aria-hidden="true" className="text-[#EBC1B6]">
                  /
                </span>
                <button
                  onClick={() => navigateToSlug(pillarPost.slug || pillarPost.id)}
                  className="text-[#724319]/80 hover:text-[#724319] underline decoration-[#EBC1B6] underline-offset-4 cursor-pointer"
                >
                  Wedding Planning Pillar Guide
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-[#724319] bg-[#FFF8F6] hover:bg-[#F2CCC3]/40 border border-[#EBC1B6] transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Guide</span>
            </button>
            <button
              onClick={() => onBackHome('ai-planner')}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-[#724319] hover:bg-[#8A5A44] transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Open AI Planner</span>
            </button>
          </div>
        </div>
      </div>

      {/* Topic Cluster Article Switcher Strip */}
      <div className="bg-[#F2CCC3]/25 border-b border-[#EBC1B6]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {blogPostsData.map((post) => {
              const isSelected = post.id === activePost.id;
              const prefix =
                post.clusterRole === 'pillar'
                  ? 'Pillar: '
                  : post.clusterRole === 'cluster'
                    ? 'Guide: '
                    : '';
              return (
                <button
                  key={post.id}
                  onClick={() => {
                    onSelectPost(post);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-[#724319] text-white font-semibold shadow-xs'
                      : 'bg-white/90 text-[#724319]/80 hover:bg-white border border-[#EBC1B6]/60'
                  }`}
                >
                  {prefix}
                  {post.title.length > 42
                    ? `${post.title.slice(0, 42)}...`
                    : post.title}
                </button>
              );
            })}
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
                    ? 'Pillar Cornerstone Guide'
                    : activePost.clusterRole === 'cluster'
                      ? `Topic Cluster · ${activePost.category}`
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
                {activePost.title}
              </h1>

              {activePost.featuredImage && (
                <div className="mb-6 rounded-2xl overflow-hidden border border-[#EBC1B6]/70 aspect-[16/9] bg-[#FFF8F6]">
                  <img
                    src={activePost.featuredImage}
                    alt={activePost.seo?.featuredImageAlt || activePost.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              <p className="text-sm sm:text-base text-[#724319]/85 leading-relaxed font-serif italic bg-white/80 p-5 rounded-2xl border border-[#EBC1B6]/60">
                {activePost.summary}
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-[#724319]/75">
                <div>
                  By{' '}
                  <span className="font-semibold text-[#724319]">
                    {activePost.author}
                  </span>
                </div>
                <div className="inline-flex items-center gap-1 text-[#8A5A44]">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Event Sphere Adelaide & Australian Edition</span>
                </div>
              </div>
            </header>

            {/* Article Body */}
            <div className="p-7 sm:p-10 md:p-12 space-y-11 text-[#724319]/90">
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
                            href={`#/blog/${section.calloutLink.targetSlug}`}
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

              {/* FAQ Section (Schema-backed FAQPage) */}
              {activePost.faqs && activePost.faqs.length > 0 && (
                <section
                  id="blog-sec-faqs"
                  className="pt-8 border-t border-[#EBC1B6]/60 space-y-5 scroll-mt-28"
                >
                  <div className="flex items-center gap-2.5">
                    <HelpCircle className="w-5 h-5 text-[#8A5A44]" />
                    <h2 className="text-2xl sm:text-[1.75rem] font-serif font-bold text-[#724319]">
                      Frequently Asked Questions
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

              {/* Bottom Action Callout Inside Article */}
              <div className="pt-8 border-t border-[#EBC1B6]/60">
                <div className="rounded-3xl bg-gradient-to-br from-[#F2CCC3]/45 via-[#FFF8F6] to-[#EBC1B6]/35 border border-[#EBC1B6] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8A5A44]">
                      Put This Guide Into Action
                    </span>
                    <h3 className="text-xl font-serif font-bold text-[#724319]">
                      Ready to map your budget, timeline & Adelaide vendors?
                    </h3>
                    <p className="text-xs sm:text-sm text-[#724319]/80">
                      Try Event Sphere’s AI Budget Calculator, Wedding To-Do Timeline, and verified Adelaide marketplace.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 shrink-0">
                    <button
                      onClick={() => onBackHome('ai-planner')}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-[#724319] hover:bg-[#8A5A44] transition-colors shadow-xs cursor-pointer"
                    >
                      <Calculator className="w-4 h-4" />
                      <span>Start AI Planning</span>
                    </button>
                    <button
                      onClick={() => onBackHome('marketplace')}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-[#724319] bg-white hover:bg-[#FFF8F6] border border-[#EBC1B6] transition-colors cursor-pointer"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Browse Vendors</span>
                    </button>
                  </div>
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
                  In This Guide
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
                        Frequently Asked Questions
                      </span>
                    </button>
                  )}
                </nav>
              </div>
            )}

            {/* Wedding Planning Pillar & Cluster Map */}
            <div className="bg-white rounded-3xl border border-[#EBC1B6]/70 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8A5A44]">
                <Link2 className="w-3.5 h-3.5" />
                <span>Wedding Planning Topic Cluster</span>
              </div>

              {pillarPost && (
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8A5A44] mb-1.5">
                    Pillar Cornerstone Guide
                  </div>
                  <button
                    onClick={() => {
                      onSelectPost(pillarPost);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      pillarPost.id === activePost.id
                        ? 'bg-[#724319] text-white border-[#724319] shadow-xs'
                        : 'bg-[#FFF8F6] border-[#EBC1B6] text-[#724319] hover:bg-[#F2CCC3]/30'
                    }`}
                  >
                    <div className="text-sm font-serif font-bold leading-snug">
                      {pillarPost.title}
                    </div>
                  </button>
                </div>
              )}

              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8A5A44] mb-2">
                  Supporting Deep-Dive Guides ({clusterPosts.length})
                </div>
                <div className="space-y-2">
                  {clusterPosts.map((post) => {
                    const isCurrent = post.id === activePost.id;
                    return (
                      <button
                        key={post.id}
                        onClick={() => {
                          onSelectPost(post);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
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
                          {post.title}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {editorialPosts.length > 0 && (
                <div className="pt-2 border-t border-[#EBC1B6]/50">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8A5A44] mb-2">
                    Adelaide Editorial Spotlights
                  </div>
                  <div className="space-y-2">
                    {editorialPosts.map((post) => {
                      const isCurrent = post.id === activePost.id;
                      return (
                        <button
                          key={post.id}
                          onClick={() => {
                            onSelectPost(post);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                            isCurrent
                              ? 'bg-[#FFF8F6] border-[#8A5A44] shadow-2xs'
                              : 'bg-white border-[#EBC1B6]/60 hover:bg-[#FFF8F6]'
                          }`}
                        >
                          <div className="text-xs font-serif font-bold text-[#724319] leading-snug">
                            {post.title}
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
                Explore Event Sphere Adelaide
              </h3>
              <p className="text-xs text-white/80 leading-relaxed">
                Return to the main platform to browse verified photographers, planners, caterers, and cultural specialists across South Australia.
              </p>
              <button
                onClick={() => onBackHome('marketplace')}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#724319] hover:bg-[#FFF8F6] text-xs font-semibold transition-colors cursor-pointer"
              >
                <span>Explore Vendor Marketplace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
