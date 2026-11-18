import React, { useState } from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { BlogPost, JournalCategory } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { JournalArticleBrowser } from './JournalArticleBrowser';

interface BlogSectionProps {
  isPagePrimary?: boolean;
  onReadPost: (post: BlogPost) => void;
  onOpenBlogPage?: () => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({
  isPagePrimary = false,
  onReadPost,
  onOpenBlogPage,
}) => {
  const { t } = useLanguage();
  const HeadingTag = isPagePrimary ? 'h1' : 'h2';
  const [selectedCategory, setSelectedCategory] = useState<'All' | JournalCategory>('All');

  return (
    <section
      id="blog"
      className={`${
        isPagePrimary ? 'pt-32 pb-20 md:pt-36 md:pb-24' : 'py-20 md:py-28'
      } bg-[#FFF8F6] relative overflow-x-hidden`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="space-y-3">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#8A5A44]">
              {t('blog.kicker')}
            </span>
            <HeadingTag className="text-3xl sm:text-4xl font-serif font-bold text-[#724319] [text-wrap:balance]">
              {t('blog.title')}
            </HeadingTag>
            <p className="text-sm text-[#724319]/80 max-w-2xl leading-relaxed">
              {t('blog.subtitle')}
            </p>
          </div>

          {onOpenBlogPage && (
            <button
              type="button"
              onClick={onOpenBlogPage}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-[#724319] text-[#724319] hover:text-white border border-[#EBC1B6] text-xs font-semibold transition-all shadow-xs cursor-pointer shrink-0 self-start md:self-auto"
            >
              <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t('blog.visitFullPage')}</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          )}
        </div>

        <JournalArticleBrowser
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onSelectPost={onReadPost}
        />
      </div>
    </section>
  );
};
