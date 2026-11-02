import React from 'react';
import { ArrowUpRight, BookOpen, Clock, Calendar } from 'lucide-react';
import { blogPostsData } from '../data/mockData';
import { BlogPost } from '../types';

interface BlogSectionProps {
  onReadPost: (post: BlogPost) => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ onReadPost }) => {
  return (
    <section id="blog" className="py-20 md:py-28 bg-[#FFF8F6] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div className="space-y-3">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#8A5A44]">
              Planning Guides & Insights
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#724319]">
              Latest from the EventSphere Journal
            </h2>
            <p className="text-sm text-[#724319]/80 max-w-xl leading-relaxed">
              Expert advice on cross-cultural traditions, South Australian venue benchmarks, and cutting-edge event technology.
            </p>
          </div>
        </div>

        {/* 4 Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {blogPostsData.map((post) => (
            <div
              key={post.id}
              onClick={() => onReadPost(post)}
              className="group bg-white rounded-3xl p-6 border border-[#EBC1B6]/70 shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Quiet unboxed metadata */}
                <div className="flex items-center gap-2 text-xs text-[#8A5A44] mb-3">
                  <span>{post.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{post.readTime}</span>
                </div>

                <h3 className="text-base sm:text-lg font-serif font-bold text-[#724319] group-hover:text-[#8A5A44] transition-colors leading-snug mb-3">
                  {post.title}
                </h3>

                <p className="text-xs text-[#724319]/75 line-clamp-3 leading-relaxed mb-4">
                  {post.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-[#EBC1B6]/40 flex items-center justify-between text-xs font-semibold text-[#724319]">
                <span>Read Full Guide</span>
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
