import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { BlogPost } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface BlogModalProps {
  post: BlogPost | null;
  onClose: () => void;
}

export const BlogModal: React.FC<BlogModalProps> = ({ post, onClose }) => {
  const { t } = useLanguage();

  useEffect(() => {
    if (!post) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [post, onClose]);

  if (!post) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="blog-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl border border-[#EBC1B6] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-[#FFF8F6] border border-[#EBC1B6] flex items-center justify-center text-[#724319] hover:bg-[#724319] hover:text-white transition-all shadow-sm cursor-pointer"
          aria-label={t('blog.closeReader')}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-br from-[#FFF8F6] via-[#FFF8F6] to-[#F2CCC3]/30 border-b border-[#EBC1B6]/50 pr-14">
          <div className="flex items-center gap-2 text-xs text-[#8A5A44] mb-2 font-medium">
            <span>{post.category}</span>
            <span aria-hidden="true">·</span>
            <span>{post.readTime}</span>
            <span aria-hidden="true">·</span>
            <span>{post.publishedDate}</span>
          </div>

          <h2
            id="blog-modal-title"
            className="text-2xl sm:text-3xl font-serif font-bold text-[#724319] leading-tight"
          >
            {t(`blog.${post.id}.title`)}
          </h2>

          <div className="text-xs text-[#724319]/70 mt-2">
            {t('blog.by')} <span className="font-semibold text-[#724319]">{post.author}</span>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-4 max-h-[calc(80vh-12rem)] overflow-y-auto text-xs sm:text-sm text-[#724319]/85 leading-relaxed">
          <div className="p-4 bg-[#FFF8F6] rounded-2xl border border-[#EBC1B6]/60 italic font-serif text-[#724319]">
            "{t(`blog.${post.id}.summary`)}"
          </div>

          {post.content.map((paragraph, idx) => (
            <p key={idx} className="leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-[#FFF8F6] border-t border-[#EBC1B6]/50 flex items-center justify-between text-xs">
          <span className="text-[#8A5A44]">{t('blog.editionFooter')}</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#724319] text-white font-medium rounded-full hover:bg-[#8A5A44] transition-colors cursor-pointer"
          >
            {t('blog.closeReader')}
          </button>
        </div>
      </div>
    </div>
  );
};
