import React, { useEffect, useId, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Bookmark,
  CheckSquare,
  ChevronDown,
  Clock,
  Search,
  X,
} from 'lucide-react';
import { blogPostsData } from '../data/mockData';
import { BlogPost, EventTypeTag, JournalCategory } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { getPageHref } from '../utils/navigation';
import { trackEvent } from '../utils/analytics';
import {
  CELEBRATION_CHAPTERS,
  CELEBRATION_SHORT_LABELS,
  getPostCelebrationType,
  resolvePostText,
} from '../utils/journalHelpers';

export const JOURNAL_CATEGORIES: Array<'All' | JournalCategory> = [
  'All',
  'Festivals',
  'Birthdays',
  'Proposals & Elopements',
  'Corporate',
  'Weddings',
  'Planning Tips',
];

const PAGE_SIZE = 6;

interface ChecklistHubJournalItem {
  kind: 'checklist-hub';
  id: 'celebration-checklists-hub';
  title: string;
  summary: string;
  journalCategory: JournalCategory;
  metaLabel: string;
}

type JournalBrowserItem =
  | { kind: 'article'; post: BlogPost }
  | ChecklistHubJournalItem;

const CHECKLIST_HUB_CARD: ChecklistHubJournalItem = {
  kind: 'checklist-hub',
  id: 'celebration-checklists-hub',
  title: 'Celebration Checklists',
  summary:
    'Interactive vendor checklists for 11 celebrations in Adelaide — see what to book first, typical lead times, and direct marketplace links.',
  journalCategory: 'Planning Tips',
  metaLabel: '11 interactive checklists',
};

interface JournalArticleBrowserProps {
  selectedCategory: 'All' | JournalCategory;
  onSelectCategory: (category: 'All' | JournalCategory) => void;
  activePostId?: string;
  onSelectPost: (post: BlogPost) => void;
  heading?: string;
  subheading?: string;
}

export const JournalArticleBrowser: React.FC<JournalArticleBrowserProps> = ({
  selectedCategory,
  onSelectCategory,
  activePostId,
  onSelectPost,
  heading,
  subheading,
}) => {
  const { t } = useLanguage();
  const [selectedCelebration, setSelectedCelebration] = useState<'All' | EventTypeTag>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const [flipRevision, setFlipRevision] = useState(0);

  const celebrationSelectId = useId();
  const searchInputId = useId();

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCelebration, searchQuery]);

  const allItems = useMemo<JournalBrowserItem[]>(
    () => [
      CHECKLIST_HUB_CARD,
      ...blogPostsData.map((post): JournalBrowserItem => ({ kind: 'article', post })),
    ],
    []
  );

  const celebrationCounts = useMemo(() => {
    const counts: Record<string, number> = { All: blogPostsData.length };
    for (const post of blogPostsData) {
      const cel = getPostCelebrationType(post);
      if (cel) {
        counts[cel] = (counts[cel] || 0) + 1;
      }
    }
    return counts;
  }, []);

  const scopedItems = useMemo(() => {
    if (selectedCelebration !== 'All') {
      return allItems.filter(
        (item) =>
          item.kind === 'article' && getPostCelebrationType(item.post) === selectedCelebration
      );
    }
    return allItems;
  }, [allItems, selectedCelebration]);

  const filteredItems = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase();
    if (!normalized) return scopedItems;

    return scopedItems.filter((item) => {
      if (item.kind === 'checklist-hub') {
        return (
          item.title.toLowerCase().includes(normalized) ||
          item.summary.toLowerCase().includes(normalized)
        );
      }
      const resolvedTitle = resolvePostText(t, `blog.${item.post.id}.title`, item.post.title).toLowerCase();
      const resolvedSummary = resolvePostText(t, `blog.${item.post.id}.summary`, item.post.summary).toLowerCase();
      const rawTitle = item.post.title.toLowerCase();
      const cel = (getPostCelebrationType(item.post) || '').toLowerCase();
      return (
        resolvedTitle.includes(normalized) ||
        resolvedSummary.includes(normalized) ||
        rawTitle.includes(normalized) ||
        cel.includes(normalized)
      );
    });
  }, [scopedItems, searchQuery, t]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * PAGE_SIZE;

  const visibleItems = useMemo(
    () => filteredItems.slice(startIdx, startIdx + PAGE_SIZE),
    [filteredItems, startIdx]
  );

  const triggerPageFlip = (direction: 'next' | 'prev') => {
    setFlipDirection(direction);
    setFlipRevision((prev) => prev + 1);
  };

  const handleCelebrationChange = (nextCelebration: 'All' | EventTypeTag) => {
    const allChapters: Array<'All' | EventTypeTag> = ['All', ...CELEBRATION_CHAPTERS];
    const prevIdx = allChapters.indexOf(selectedCelebration);
    const nextIdx = allChapters.indexOf(nextCelebration);
    triggerPageFlip(nextIdx < prevIdx ? 'prev' : 'next');

    setSelectedCelebration(nextCelebration);
    setCurrentPage(1);
    if (selectedCategory !== 'All') {
      onSelectCategory('All');
    }
    trackEvent('journal_filter_used', {
      filter_value: nextCelebration,
    });
  };

  const handlePageTurn = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === safePage) return;
    triggerPageFlip(nextPage > safePage ? 'next' : 'prev');
    setCurrentPage(nextPage);
  };

  const handleClearFilters = () => {
    triggerPageFlip('prev');
    setSearchQuery('');
    setSelectedCelebration('All');
    setCurrentPage(1);
    onSelectCategory('All');
  };

  const handleArticleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    post: BlogPost
  ) => {
    e.preventDefault();
    trackEvent('blog_preview_open', {
      article_title: post.title,
      post_id: post.id,
      category: post.journalCategory || post.category,
    });
    onSelectPost(post);
  };

  const activeScopeLabel =
    selectedCelebration !== 'All'
      ? selectedCelebration
      : t('blog.cat.All');

  return (
    <div className="space-y-6">
      {(heading || subheading) && (
        <div className="space-y-2">
          {heading && (
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#724319] [text-wrap:balance]">
              {heading}
            </h2>
          )}
          {subheading && (
            <p className="text-sm text-[#724319]/80 max-w-2xl leading-relaxed font-serif italic">
              {subheading}
            </p>
          )}
        </div>
      )}

      {/* Bound Linen Journal Notebook Shell: Left Chapter Tabs + Right Flipping Pages */}
      <div className="journal-notebook-cover rounded-[26px] p-2 sm:p-3.5 md:p-4">
        <div className="rounded-[20px] border border-[#DEC1B5] overflow-hidden bg-[#F5E5DD] flex flex-col lg:flex-row">
          {/* LEFT SIDE: Vertical Notebook Chapter Divider Tabs */}
          <aside
            aria-label="Celebration notebook chapters"
            className="w-full lg:w-[276px] xl:w-[292px] shrink-0 bg-[#F4E3DB]/90 border-b lg:border-b-0 lg:border-r border-[#D9B6A8] flex flex-col"
          >
            <div className="px-4 sm:px-5 pt-5 pb-3.5 border-b border-[#DEC1B5]/80 flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#724319]">
                <Bookmark className="w-3.5 h-3.5 text-[#8A5A44]" aria-hidden="true" />
                <span>Flip to a Celebration Chapter</span>
              </div>
              {(selectedCelebration !== 'All' || searchQuery.trim()) && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-[11px] font-semibold text-[#724319] hover:text-[#8A5A44] underline decoration-[#C99B89] underline-offset-4 cursor-pointer shrink-0"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Mobile Celebration Selector (<1024px) */}
            <div className="p-4 lg:hidden">
              <label htmlFor={celebrationSelectId} className="sr-only">
                Choose a celebration chapter
              </label>
              <div className="relative">
                <select
                  id={celebrationSelectId}
                  value={selectedCelebration}
                  onChange={(e) =>
                    handleCelebrationChange(e.target.value as 'All' | EventTypeTag)
                  }
                  className="w-full appearance-none pl-3.5 pr-9 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#DEC1B5] text-sm font-medium text-[#724319] cursor-pointer"
                >
                  <option value="All">All Celebrations ({celebrationCounts.All})</option>
                  {CELEBRATION_CHAPTERS.map((cel, idx) => (
                    <option key={cel} value={cel}>
                      {String(idx + 1).padStart(2, '0')} · {cel} ({celebrationCounts[cel] || 0})
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="w-4 h-4 text-[#8A5A44] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Desktop Vertical Tabbed Notebook Index (>=1024px) */}
            <nav
              className="hidden lg:flex lg:flex-col py-3 pl-3 pr-0 space-y-1 flex-1"
              aria-label="Celebration notebook chapters"
            >
              <button
                type="button"
                aria-pressed={selectedCelebration === 'All'}
                onClick={() => handleCelebrationChange('All')}
                className={`relative w-full text-left px-3.5 py-2.5 rounded-l-xl text-xs transition-all cursor-pointer flex items-center justify-between gap-2 border-y border-l ${
                  selectedCelebration === 'All'
                    ? 'bg-[#FFFDF9] text-[#724319] border-[#DEC1B5] font-semibold -mr-px z-10 shadow-[-3px_2px_8px_-4px_rgba(74,43,16,0.14)]'
                    : 'bg-[#EFE0D7]/70 hover:bg-[#FAF0EB] text-[#724319]/85 border-transparent hover:border-[#DEC1B5]/70 font-medium mr-2 rounded-r-lg'
                }`}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span
                    className={`font-mono text-[10px] tabular-nums shrink-0 ${
                      selectedCelebration === 'All' ? 'text-[#8A5A44] font-semibold' : 'text-[#8A5A44]/80'
                    }`}
                  >
                    00
                  </span>
                  <span className="truncate font-serif text-[13px]">All Celebrations</span>
                </span>
                <span
                  className={`font-mono text-[11px] tabular-nums shrink-0 ${
                    selectedCelebration === 'All' ? 'text-[#724319] font-semibold' : 'text-[#8A5A44]'
                  }`}
                >
                  {celebrationCounts.All}
                </span>
              </button>

              {CELEBRATION_CHAPTERS.map((cel, idx) => {
                const isActive = selectedCelebration === cel;
                const count = celebrationCounts[cel] || 0;
                return (
                  <button
                    key={cel}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => handleCelebrationChange(cel)}
                    className={`relative w-full text-left px-3.5 py-2.5 rounded-l-xl text-xs transition-all cursor-pointer flex items-center justify-between gap-2 border-y border-l ${
                      isActive
                        ? 'bg-[#FFFDF9] text-[#724319] border-[#DEC1B5] font-semibold -mr-px z-10 shadow-[-3px_2px_8px_-4px_rgba(74,43,16,0.14)]'
                        : 'bg-[#EFE0D7]/70 hover:bg-[#FAF0EB] text-[#724319]/85 border-transparent hover:border-[#DEC1B5]/70 font-medium mr-2 rounded-r-lg'
                    }`}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <span
                        className={`font-mono text-[10px] tabular-nums shrink-0 ${
                          isActive ? 'text-[#8A5A44] font-semibold' : 'text-[#8A5A44]/80'
                        }`}
                      >
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="truncate font-serif text-[13px]">
                        {CELEBRATION_SHORT_LABELS[cel]}
                      </span>
                    </span>
                    <span
                      className={`font-mono text-[11px] tabular-nums shrink-0 ${
                        isActive ? 'text-[#724319] font-semibold' : 'text-[#8A5A44]'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </nav>

            <div className="hidden lg:block px-5 py-4 border-t border-[#DEC1B5]/70 text-[11px] font-serif italic text-[#8A5A44]">
              Click any chapter tab to flip pages
            </div>
          </aside>

          {/* RIGHT SIDE: Stitched Spine & Flipping Ruled Notebook Pages */}
          <div className="flex-1 min-w-0 journal-spine-divider journal-flip-stage bg-[#FFFDF9] overflow-hidden">
            <div
              key={`${selectedCelebration}-${safePage}-${flipRevision}`}
              className={`journal-notebook-paper h-full flex flex-col justify-between ${
                flipRevision > 0
                  ? flipDirection === 'next'
                    ? 'journal-page-flip-next'
                    : 'journal-page-flip-prev'
                  : ''
              }`}
            >
              {/* Top Search & Active Chapter Folio Bar */}
              <div className="px-5 sm:px-8 lg:pl-10 lg:pr-8 pt-6 pb-5 border-b border-[#DEC1B5]/85 bg-[#FFFBF7]/90 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#8A5A44]">
                      {selectedCelebration === 'All'
                        ? 'Complete Notebook Index'
                        : `Chapter ${String(CELEBRATION_CHAPTERS.indexOf(selectedCelebration) + 1).padStart(2, '0')}`}
                    </p>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#724319] leading-tight">
                      {selectedCelebration === 'All' ? 'All Celebrations' : selectedCelebration}
                    </h3>
                  </div>

                  {/* Ink-Line Search Input */}
                  <div className="w-full sm:w-72 md:w-80">
                    <label htmlFor={searchInputId} className="sr-only">
                      {t('blog.searchLabel')}
                    </label>
                    <div className="relative">
                      <Search
                        className="w-4 h-4 text-[#8A5A44] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                        aria-hidden="true"
                      />
                      <input
                        id={searchInputId}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('blog.searchPlaceholder')}
                        className="w-full pl-10 pr-16 py-2 rounded-xl bg-white border border-[#DEC1B5] text-sm text-[#724319] placeholder:text-[#8A5A44]/65 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724319] transition-colors"
                      />
                      {searchQuery.trim().length > 0 && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#FFF8F6] hover:bg-[#F2CCC3]/50 text-[#724319] border border-[#EBC1B6]/80 text-[11px] font-semibold cursor-pointer"
                        >
                          <X className="w-3 h-3" aria-hidden="true" />
                          <span>{t('blog.searchClear')}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Live Result Announcement */}
                <div
                  aria-live="polite"
                  className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#8A5A44]"
                >
                  <span>
                    {t('blog.showingCount', {
                      shown: visibleItems.length,
                      total: filteredItems.length,
                      category: activeScopeLabel,
                    })}
                  </span>
                  <span className="font-mono text-[11px] tabular-nums text-[#8A5A44]">
                    Page {String(safePage).padStart(2, '0')} of {String(totalPages).padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Notebook Page Entries */}
              {filteredItems.length === 0 ? (
                <div className="px-6 py-16 text-center space-y-3 flex-1 flex flex-col items-center justify-center">
                  <div className="w-11 h-11 rounded-xl bg-[#FFF8F6] border border-[#DEC1B5] flex items-center justify-center text-[#8A5A44]">
                    <BookOpen className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <p className="text-xl font-serif font-bold text-[#724319]">
                    {t('blog.noArticlesFound')}
                  </p>
                  <p className="text-xs sm:text-sm text-[#724319]/75 max-w-md mx-auto">
                    {t('blog.noArticlesHint')}
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleClearFilters}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#724319] hover:bg-[#8A5A44] text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      {t('blog.searchClear')}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <ul className="grid grid-cols-1 xl:grid-cols-2 flex-1 divide-y xl:divide-y-0 divide-[#EBC1B6]/65">
                    {visibleItems.map((item, idx) => {
                      const entryNumber = String(startIdx + idx + 1).padStart(2, '0');
                      const isRightCol = idx % 2 === 1;

                      if (item.kind === 'checklist-hub') {
                        return (
                          <li
                            key={item.id}
                            className={`min-w-0 p-5 sm:p-7 lg:pl-10 xl:px-7 xl:py-7 border-b border-[#EBC1B6]/65 ${
                              isRightCol ? 'xl:border-l xl:border-l-[#EBC1B6]/65' : ''
                            }`}
                          >
                            <a
                              href={getPageHref('checklists')}
                              className="group block h-full rounded-xl p-5 bg-[#FFF6F2] hover:bg-[#FCECE5]/75 border border-dashed border-[#C99B89] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724319]"
                            >
                              <div className="flex items-center justify-between gap-2 text-[11px] font-mono uppercase tracking-[0.1em] text-[#8A5A44] pb-3 mb-3.5 border-b border-[#EBC1B6]/80">
                                <span className="inline-flex items-center gap-1.5 font-semibold text-[#724319]">
                                  <CheckSquare className="w-3.5 h-3.5 text-[#8A5A44]" aria-hidden="true" />
                                  <span>Pinned Index</span>
                                </span>
                                <span className="tabular-nums">{item.metaLabel}</span>
                              </div>

                              <div className="space-y-2.5">
                                <h4 className="text-lg sm:text-xl font-serif font-bold text-[#724319] group-hover:text-[#8A5A44] transition-colors leading-snug">
                                  {item.title}
                                </h4>
                                <p className="text-xs sm:text-sm text-[#724319]/80 leading-relaxed">
                                  {item.summary}
                                </p>
                              </div>

                              <div className="mt-5 pt-3 border-t border-[#EBC1B6]/70 flex items-center justify-between text-xs font-semibold text-[#724319]">
                                <span className="font-serif italic font-normal text-[#8A5A44]">
                                  11 South Australian checklists
                                </span>
                                <span className="inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform shrink-0">
                                  <span>Open</span>
                                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                                </span>
                              </div>
                            </a>
                          </li>
                        );
                      }

                      const { post } = item;
                      const isCurrent = activePostId === post.id;
                      const postCat = post.journalCategory || 'Planning Tips';
                      const celebrationLabel = getPostCelebrationType(post);
                      const slug = post.slug || post.id;
                      const articleUrl = getPageHref('blog', `?post=${encodeURIComponent(slug)}`);
                      const displayTitle = resolvePostText(t, `blog.${post.id}.title`, post.title);
                      const displaySummary = resolvePostText(t, `blog.${post.id}.summary`, post.summary);

                      return (
                        <li
                          key={post.id}
                          className={`min-w-0 p-5 sm:p-7 lg:pl-10 xl:px-7 xl:py-7 border-b border-[#EBC1B6]/65 transition-colors ${
                            isRightCol ? 'xl:border-l xl:border-l-[#EBC1B6]/65' : ''
                          } ${isCurrent ? 'bg-[#FFF5F0]/80' : 'hover:bg-[#FFF9F6]/70'}`}
                        >
                          <a
                            href={articleUrl}
                            aria-current={isCurrent ? 'page' : undefined}
                            onClick={(e) => handleArticleClick(e, post)}
                            className="group flex flex-col h-full justify-between gap-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#724319] rounded-lg"
                          >
                            <div className="space-y-3.5">
                              {/* Folio Metadata Line */}
                              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#8A5A44] pb-2 border-b border-[#EBC1B6]/65">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span className="font-mono font-semibold text-[#724319] tabular-nums">
                                    No. {entryNumber}
                                  </span>
                                  <span aria-hidden="true">·</span>
                                  <span className="font-semibold uppercase tracking-[0.08em] text-[#724319]">
                                    {celebrationLabel || t(`blog.cat.${postCat}`)}
                                  </span>
                                  {isCurrent && (
                                    <>
                                      <span aria-hidden="true">·</span>
                                      <span className="italic font-serif font-semibold text-[#724319]">
                                        {t('blog.currentlyReading')}
                                      </span>
                                    </>
                                  )}
                                </div>

                                <span className="inline-flex items-center gap-1 font-mono tabular-nums text-[11px]">
                                  <Clock className="w-3 h-3" aria-hidden="true" />
                                  <span>{post.readTime}</span>
                                </span>
                              </div>

                              {/* Mounted Notebook Photo + Editorial Entry Copy */}
                              <div className="flex flex-col sm:flex-row gap-4 items-start">
                                {post.featuredImage && (
                                  <figure className="w-full sm:w-36 shrink-0 pt-1">
                                    <div className="journal-photo-mount rounded-sm overflow-visible">
                                      <div className="aspect-[4/3] w-full overflow-hidden bg-[#F6E6DF]">
                                        <img
                                          src={post.featuredImage}
                                          alt={post.seo?.featuredImageAlt || displayTitle}
                                          loading="lazy"
                                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                                          referrerPolicy="no-referrer"
                                        />
                                      </div>
                                    </div>
                                    <figcaption className="mt-1.5 text-[10px] font-serif italic text-[#8A5A44]/90 truncate">
                                      Fig. {entryNumber} — {post.publishedDate}
                                    </figcaption>
                                  </figure>
                                )}

                                <div className="min-w-0 flex-1 space-y-1.5">
                                  <h4 className="text-base sm:text-lg font-serif font-bold text-[#724319] group-hover:text-[#8A5A44] transition-colors leading-snug [text-wrap:balance]">
                                    {displayTitle}
                                  </h4>
                                  <p className="text-xs sm:text-[13px] text-[#724319]/80 leading-relaxed line-clamp-3">
                                    {displaySummary}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Notebook Entry Footer */}
                            <div className="flex items-center justify-between gap-3 pt-1 text-xs">
                              <span className="font-serif italic text-[#8A5A44] truncate">
                                {post.category} · Adelaide, SA
                              </span>
                              <span className="inline-flex items-center gap-1 font-semibold text-[#724319] group-hover:text-[#8A5A44] underline decoration-[#D9B6A8] group-hover:decoration-[#724319] underline-offset-4 shrink-0 transition-colors">
                                <span>Read entry</span>
                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                              </span>
                            </div>
                          </a>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Bottom Page-Turn Folio Controls */}
                  <div className="px-5 sm:px-8 lg:pl-10 lg:pr-8 py-4 bg-[#FFFBF7]/90 flex flex-wrap items-center justify-between gap-3 text-xs text-[#8A5A44]">
                    <span className="font-mono tabular-nums">
                      Entries {String(startIdx + 1).padStart(2, '0')}–
                      {String(startIdx + visibleItems.length).padStart(2, '0')} of{' '}
                      {String(filteredItems.length).padStart(2, '0')}
                    </span>

                    {totalPages > 1 ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={safePage <= 1}
                          onClick={() => handlePageTurn(safePage - 1)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#DEC1B5] bg-white hover:bg-[#F6E6DF]/60 disabled:opacity-40 disabled:cursor-not-allowed text-[#724319] font-semibold transition-colors cursor-pointer"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Previous page</span>
                        </button>

                        <span className="px-2 font-mono text-[11px] tabular-nums text-[#724319] font-semibold">
                          {String(safePage).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}
                        </span>

                        <button
                          type="button"
                          disabled={safePage >= totalPages}
                          onClick={() => handlePageTurn(safePage + 1)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#724319] hover:bg-[#8A5A44] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold transition-colors cursor-pointer"
                        >
                          <span>Flip page</span>
                          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    ) : (
                      <span className="font-serif italic text-[#8A5A44]">
                        Select another chapter on the left to turn pages
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
