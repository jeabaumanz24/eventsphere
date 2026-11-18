import React, { useMemo, useState } from 'react';
import { ArrowUpRight, ArrowRight, BookOpen, Layers } from 'lucide-react';
import { blogPostsData } from '../data/mockData';
import { BlogPost, JournalCategory } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface BlogSectionProps {
  onReadPost: (post: BlogPost) => void;
  onOpenBlogPage?: () => void;
}

const JOURNAL_CATEGORIES: Array<'All' | JournalCategory> = [
  'All',
  'Festivals',
  'Birthdays',
  'Proposals & Elopements',
  'Corporate',
  'Weddings',
  'Planning Tips',
];

export const BlogSection: React.FC<BlogSectionProps> = ({
  onReadPost,
  onOpenBlogPage,
}) => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<'All' | JournalCategory>('All');

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: blogPostsData.length };
    for (const p of blogPostsData) {
      const cat = p.journalCategory || 'Planning Tips';
      counts[cat] = (counts[cat] || 0) + 1;
    }
    return counts;
  }, []);

  const categoryPosts = useMemo(() => {
    if (selectedCategory === 'All') return blogPostsData;
    return blogPostsData.filter(
      (p) => (p.journalCategory || 'Planning Tips') === selectedCategory
    );
  }, [selectedCategory]);

  // Spotlight a non-wedding celebration guide in 'All', or pillar guide in 'Weddings', or first article in filtered category
  const spotlightPost = useMemo(() => {
    if (selectedCategory === 'All') {
      return blogPostsData.find((p) => p.id === 'j5') || blogPostsData[0];
    }
    if (selectedCategory === 'Weddings') {
      return (
        categoryPosts.find((p) => p.clusterRole === 'pillar') || categoryPosts[0]
      );
    }
    return categoryPosts[0];
  }, [selectedCategory, categoryPosts]);

  const gridPosts = useMemo(() => {
    if (!spotlightPost) return [];
    return categoryPosts.filter((p) => p.id !== spotlightPost.id);
  }, [categoryPosts, spotlightPost]);

  const isPillarSpotlight = spotlightPost?.clusterRole === 'pillar';

  return (
    <section id="blog" className="py-20 md:py-28 bg-[#FFF8F6] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="space-y-3">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#8A5A44]">
              {t('blog.kicker')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#724319] [text-wrap:balance]">
              {t('blog.title')}
            </h2>
            <p className="text-sm text-[#724319]/80 max-w-2xl leading-relaxed">
              {t('blog.subtitle')}
            </p>
          </div>

          {onOpenBlogPage && (
            <button
              onClick={onOpenBlogPage}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-[#724319] text-[#724319] hover:text-white border border-[#EBC1B6] text-xs font-semibold transition-all shadow-xs cursor-pointer shrink-0 self-start md:self-auto"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{t('blog.visitFullPage')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Journal Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-9">
          {JOURNAL_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            const count = categoryCounts[cat] ?? 0;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#724319] text-white shadow-xs font-semibold'
                    : 'bg-white hover:bg-[#F2CCC3]/40 text-[#724319] border border-[#EBC1B6]/70'
                }`}
              >
                {t(`blog.cat.${cat}`)}{' '}
                <span className={`ml-1 tabular-nums ${isActive ? 'text-white/75' : 'text-[#8A5A44]'}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Featured Article Spotlight */}
        {spotlightPost && (
          <div
            onClick={() => onReadPost(spotlightPost)}
            className="group mb-10 bg-gradient-to-br from-white via-white to-[#F2CCC3]/35 rounded-3xl overflow-hidden border border-[#EBC1B6] shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer grid grid-cols-1 lg:grid-cols-12 items-stretch"
          >
            {spotlightPost.featuredImage && (
              <div className="lg:col-span-4 aspect-[16/10] lg:aspect-auto overflow-hidden bg-[#FFF8F6]">
                <img
                  src={spotlightPost.featuredImage}
                  alt={spotlightPost.seo?.featuredImageAlt || t(`blog.${spotlightPost.id}.title`)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
            <div
              className={`${
                spotlightPost.featuredImage ? 'lg:col-span-8' : 'lg:col-span-12'
              } p-7 sm:p-9 flex flex-col justify-between gap-5`}
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#8A5A44]">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#724319] text-white font-semibold text-[11px]">
                    {isPillarSpotlight
                      ? t('blog.pillarBadge')
                      : t('blog.featuredNonWeddingBadge')}
                  </span>
                  <span>{t(`blog.cat.${spotlightPost.journalCategory || 'Planning Tips'}`)}</span>
                  <span aria-hidden="true">·</span>
                  <span>{spotlightPost.readTime}</span>
                  <span aria-hidden="true">·</span>
                  <span>{spotlightPost.publishedDate}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#724319] group-hover:text-[#8A5A44] transition-colors leading-snug">
                  {t(`blog.${spotlightPost.id}.title`)}
                </h3>

                <p className="text-sm text-[#724319]/80 leading-relaxed max-w-2xl">
                  {t(`blog.${spotlightPost.id}.summary`)}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#8A5A44]">
                  <Layers className="w-3.5 h-3.5" />
                  <span>
                    {isPillarSpotlight
                      ? t('blog.pillarSummaryHint')
                      : t('blog.featuredHint')}
                  </span>
                </span>
                <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#724319] group-hover:bg-[#8A5A44] text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs whitespace-nowrap">
                  <span>{isPillarSpotlight ? t('blog.readPillar') : t('blog.readComplete')}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Journal Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gridPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => onReadPost(post)}
              className="group bg-white rounded-3xl overflow-hidden border border-[#EBC1B6]/70 shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between cursor-pointer"
            >
              <div>
                {post.featuredImage && (
                  <div className="aspect-[16/9] overflow-hidden bg-[#FFF8F6] border-b border-[#EBC1B6]/40">
                    <img
                      src={post.featuredImage}
                      alt={post.seo?.featuredImageAlt || t(`blog.${post.id}.title`)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-6 pb-2">
                  {/* Quiet unboxed metadata */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#8A5A44] mb-2.5">
                    <span className="font-semibold text-[#724319]/90">
                      {t(`blog.cat.${post.journalCategory || 'Planning Tips'}`)}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-serif font-bold text-[#724319] group-hover:text-[#8A5A44] transition-colors leading-snug mb-2.5">
                    {t(`blog.${post.id}.title`)}
                  </h3>

                  <p className="text-xs text-[#724319]/75 line-clamp-3 leading-relaxed">
                    {t(`blog.${post.id}.summary`)}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-4 mt-2 border-t border-[#EBC1B6]/40 flex items-center justify-between text-xs font-semibold text-[#724319]">
                <span>{t('blog.readComplete')}</span>
                <div className="w-7 h-7 rounded-full bg-[#FFF8F6] border border-[#EBC1B6] flex items-center justify-center group-hover:bg-[#724319] group-hover:text-white transition-all">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
