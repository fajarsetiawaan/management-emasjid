'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Newspaper, ArrowRight, CalendarDays, User } from 'lucide-react';
import type { Article } from '@/services/articles';

interface AdminArticleCardProps {
    article: Article;
    index?: number;
}

export default function AdminArticleCard({ article, index = 0 }: AdminArticleCardProps) {
    const getStatusStyle = (status: string): string => {
        switch (status) {
            case 'PUBLISHED': return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50';
            case 'ARCHIVED': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50';
            case 'DRAFT': return 'bg-white text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 shadow-sm';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const getStatusLabel = (status: string): string => {
        switch (status) {
            case 'PUBLISHED': return 'TERBIT';
            case 'ARCHIVED': return 'ARSIP';
            case 'DRAFT': return 'DRAFT';
            default: return status;
        }
    };

    const getCategoryStyle = (category: string): string => {
        switch (category) {
            case 'PENGUMUMAN': return 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400';
            case 'KAJIAN': return 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400';
            case 'KEGIATAN': return 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400';
            case 'EDUKASI': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400';
            case 'INFAQ': return 'bg-pink-50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400';
            default: return 'bg-slate-50 text-slate-600';
        }
    };

    const formattedDate = article.published_at
        ? new Date(article.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
        : 'Belum terbit';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="w-[70vw] sm:w-[260px] md:w-[280px] shrink-0 snap-center h-full bg-gradient-to-b from-[#fafcfe] to-[#f0f5ff] dark:from-slate-900 dark:to-slate-900 border border-blue-100 dark:border-slate-800 rounded-[1.2rem] overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col"
        >
            {/* Header / Image Area */}
            <div className="h-36 w-full relative bg-slate-200 dark:bg-slate-800 overflow-hidden shrink-0">
                {article.flyer_url ? (
                    <img src={article.flyer_url} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-slate-300 to-slate-400 dark:from-slate-700 dark:to-slate-800">
                        <Newspaper className="text-white/40" size={48} />
                    </div>
                )}
                {/* Gradient Overlay */}
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent"></div>

                {/* Status Badge */}
                <div className="absolute top-3 right-3 z-10">
                    <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider border shadow-sm ${getStatusStyle(article.status)}`}>
                        {getStatusLabel(article.status)}
                    </div>
                </div>

                {/* Category Badge */}
                <div className="absolute bottom-3 left-3 z-10">
                    <div className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider ${getCategoryStyle(article.category)}`}>
                        {article.category}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-4 flex flex-col flex-1">
                {/* Title */}
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-snug mb-2 min-h-[2.5rem]">
                    {article.title}
                </h3>

                {/* Excerpt */}
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 mb-3">
                    {article.excerpt}
                </p>

                <div className="mt-auto">
                    {/* Author */}
                    <div className="flex items-center gap-1.5 mb-3">
                        <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <User size={10} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{article.author_name}</span>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/50">
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                            <CalendarDays size={13} />
                            <span>{formattedDate}</span>
                        </div>
                        <Link href={`/admin/articles/${article.slug}`} className="text-[11px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                            Kelola <ArrowRight size={13} />
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
