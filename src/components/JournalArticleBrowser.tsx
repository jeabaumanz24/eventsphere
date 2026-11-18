import React, { useEffect, useId, useMemo, useState } from 'react';
import { ArrowUpRight, BookOpen, ChevronDown, Clock, Search, X } from 'lucide-react';
import { blogPostsData } from '../data/mockData';
import { BlogPost, JournalCategory } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { getPageHref } from '../utils/navigation';
import { trackEvent } from '../utils/analytics';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const selectId = useId();
  const searchInputId = useId();

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [selectedCategory, searchQuery]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: blogPostsData.length };
    for (const post of blogPostsData) {
      const cat = post.journalCategory || 'Planning Tips';
      counts[cat] = (counts[cat] || 0) + 1;
    }
    return counts;
  }, []);

  const categoryPosts = useMemo(() => {
    if (selectedCategory === 'All') return blogPostsData;
    return blogPostsData.filter(
      (post) => (post.journalCategory || 'Planning Tips') === selectedCategory
    );
  }, [selectedCategory]);

  const filteredPosts = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase();
    if (!normalized) return categoryPosts;

    return categoryPosts.filter((post) => {
      const localizedTitle = t(`blog.${post.id}.title`).toLowerCase();
      const rawTitle = post.title.toLowerCase();
      return localizedTitle.includes(normalized) || rawTitle.includes(normalized);
    });
  }, [categoryPosts, searchQuery, t]);

  const visiblePosts = useMemo(
    () => filteredPosts.slice(0, visibleCount),
    [filteredPosts, visibleCount]
  );

  const hasMore = visiblePosts.length < filteredPosts.length;

  const handleCategoryChange = (nextCategory: 'All' | JournalCategory) => {
    onSelectCategory(nextCategory);
    trackEvent('journal_filter_used', {
      filter_value: nextCategory,
    });
  };

  const handleClearSearch = () => {
    setSearchQuery('');
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
            <p className="text-sm text-[#724319]/80 max-w-2xl leading-relaxed">
              {subheading}
            </p>
          )}
        </div>
      )}

      {/* Search Box Above Category & Article List */}
      <div className="max-w-xl">
        <label htmlFor={searchInputId} className="sr-only">
          {t('blog.searchLabel')}
        </label>
        <div className="relative">
          <Search
            className="w-4 h-4 text-[#8A5A44] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            id={searchInputId}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('blog.searchPlaceholder')}
            className="w-full pl-11 pr-20 py-3 rounded-2xl bg-white border border-[#EBC1B6] text-sm text-[#724319] placeholder:text-[#8A5A44]/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724319] transition-colors shadow-2xs"
          />
          {searchQuery.trim().length > 0 && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#FFF8F6] hover:bg-[#F2CCC3]/50 text-[#724319] border border-[#EBC1B6]/80 text-xs font-semibold cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724319]"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t('blog.searchClear')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Filter: Dropdown (<640px) / Wrapping Chips (>=640px) */}
      <div>
        {/* Mobile Select (<640px) */}
        <div className="sm:hidden">
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold uppercase tracking-wider text-[#8A5A44] mb-1.5"
          >
            {t('blog.filterByCategoryLabel')}
          </label>
          <div className="relative">
            <select
              id={selectId}
              value={selectedCategory}
              onChange={(e) =>
                handleCategoryChange(e.target.value as 'All' | JournalCategory)
              }
              className="w-full appearance-none pl-4 pr-10 py-3 rounded-2xl bg-white border border-[#EBC1B6] text-sm font-semibold text-[#724319] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724319] cursor-pointer"
            >
              {JOURNAL_CATEGORIES.map((cat) => {
                const count = categoryCounts[cat] ?? 0;
                return (
                  <option key={cat} value={cat}>
                    {t(`blog.cat.${cat}`)} ({count})
                  </option>
                );
              })}
            </select>
            <ChevronDown
              className="w-4 h-4 text-[#8A5A44] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Desktop & Tablet Wrapping Filter Chips (>=640px) */}
        <div
          className="hidden sm:flex sm:flex-wrap items-center gap-2"
          role="group"
          aria-label={t('blog.filterByCategoryLabel')}
        >
          {JOURNAL_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            const count = categoryCounts[cat] ?? 0;
            return (
              <button
                key={cat}
                type="button"
                aria-pressed={isActive}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724319] ${
                  isActive
                    ? 'bg-[#724319] text-white shadow-xs font-semibold'
                    : 'bg-white hover:bg-[#F2CCC3]/40 text-[#724319] border border-[#EBC1B6]/70'
                }`}
              >
                {t(`blog.cat.${cat}`)}{' '}
                <span
                  className={`ml-1 tabular-nums ${
                    isActive ? 'text-white/80' : 'text-[#8A5A44]'
                  }`}
                >
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Result Count Announcement */}
      <div
        aria-live="polite"
        className="text-xs font-medium text-[#8A5A44]"
      >
        {t('blog.showingCount', {
          shown: visiblePosts.length,
          total: filteredPosts.length,
          category: t(`blog.cat.${selectedCategory}`),
        })}
      </div>

      {/* Empty Search State or Vertical List of Article Cards */}
      {filteredPosts.length === 0 ? (
        <div className="rounded-3xl bg-white border border-[#EBC1B6] p-8 text-center space-y-3">
          <div className="w-11 h-11 rounded-2xl bg-[#FFF8F6] border border-[#EBC1B6] flex items-center justify-center mx-auto text-[#8A5A44]">
            <BookOpen className="w-5 h-5" aria-hidden="true" />
          </div>
          <p className="text-lg font-serif font-bold text-[#724319]">
            {t('blog.noArticlesFound')}
          </p>
          <p className="text-xs sm:text-sm text-[#724319]/75 max-w-md mx-auto">
            {t('blog.noArticlesHint')}
          </p>
          <div className="pt-1">
            <button
              type="button"
              onClick={handleClearSearch}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#724319] hover:bg-[#8A5A44] text-white text-xs font-semibold transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724319]"
            >
              {t('blog.searchClear')}
            </button>
          </div>
        </div>
      ) : (
        <>
          <ul className="flex flex-col gap-3">
            {visiblePosts.map((post) => {
              const isCurrent = activePostId === post.id;
              const postCat = post.journalCategory || 'Planning Tips';
              const slug = post.slug || post.id;
              const articleUrl = getPageHref('blog', `?post=${encodeURIComponent(slug)}`);

              return (
                <li key={post.id} className="min-w-0">
                  <a
                    href={articleUrl}
                    aria-current={isCurrent ? 'page' : undefined}
                    onClick={(e) => handleArticleClick(e, post)}
                    className={`group block rounded-2xl p-5 sm:p-6 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724319] ${
                      isCurrent
                        ? 'bg-[#FFF8F6] border-2 border-[#724319] shadow-sm'
                        : 'bg-white hover:bg-[#FFF8F6]/70 border border-[#EBC1B6]/75 hover:border-[#8A5A44] shadow-2xs hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#8A5A44]">
                          {isCurrent && (
                            <span className="px-2.5 py-0.5 rounded-full bg-[#724319] text-white text-[11px] font-semibold">
                              {t('blog.currentlyReading')}
                            </span>
                          )}
                          <span className="font-semibold text-[#724319]">
                            {t(`blog.cat.${postCat}`)}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>{post.readTime}</span>
                          </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-serif font-bold text-[#724319] group-hover:text-[#8A5A44] transition-colors leading-snug break-words">
                          {t(`blog.${post.id}.title`)}
                        </h3>

                        <p className="text-xs sm:text-sm text-[#724319]/75 truncate">
                          {t(`blog.${post.id}.summary`)}
                        </p>
                      </div>

                      <span
                        aria-hidden="true"
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border transition-colors mt-1 ${
                          isCurrent
                            ? 'bg-[#724319] text-white border-[#724319]'
                            : 'bg-[#FFF8F6] text-[#724319] border-[#EBC1B6] group-hover:bg-[#724319] group-hover:text-white group-hover:border-[#724319]'
                        }`}
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </span>
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>

          {hasMore && (
            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-[#724319] text-[#724319] hover:text-white border border-[#EBC1B6] text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724319]"
              >
                <span>{t('blog.showMore')}</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
