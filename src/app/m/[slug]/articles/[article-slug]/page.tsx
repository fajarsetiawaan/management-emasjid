'use client';

import { useEffect, useState, use } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, Send, Share2, Newspaper, Heart, ChevronRight, Bookmark, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { getArticleBySlug, getPublishedArticles, type Article } from '@/services/articles';

export default function PublicArticleDetailPage({ params }: { params: Promise<{ slug: string; 'article-slug': string }> }) {
    const resolvedParams = use(params);
    const mosqueSlug = resolvedParams.slug;
    const articleSlug = resolvedParams['article-slug'];

    const [article, setArticle] = useState<Article | null>(null);
    const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [likeCount, setLikeCount] = useState(128);
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState([
        { id: 1, name: 'Ahmad Fauzi', text: 'Masya Allah, bermanfaat sekali artikelnya 🤲', time: '2 jam lalu' },
        { id: 2, name: 'Siti Nurhaliza', text: 'Jazakallahu khairan, terima kasih sudah berbagi ilmu', time: '5 jam lalu' },
    ]);
    const [showComments, setShowComments] = useState(false);

    useEffect(() => {
        getArticleBySlug(articleSlug).then(data => {
            setArticle(data);
            setIsLoading(false);
        });
        getPublishedArticles().then(data => {
            setRelatedArticles(data.filter(a => a.slug !== articleSlug).slice(0, 3));
        });
    }, [articleSlug]);

    const getCategoryStyle = (category: string): string => {
        switch (category) {
            case 'PENGUMUMAN': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'KAJIAN': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
            case 'KEGIATAN': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
            case 'EDUKASI': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
            case 'INFAQ': return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const handleShare = async (): Promise<void> => {
        try {
            await navigator.share({
                title: article?.title || 'Artikel Masjid',
                url: window.location.href,
            });
        } catch {
            navigator.clipboard.writeText(window.location.href);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-slate-950">
                <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] dark:bg-slate-950 gap-4">
                <Newspaper className="text-slate-300 dark:text-slate-600" size={64} />
                <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300">Artikel Tidak Ditemukan</h2>
                <Link href={`/m/${mosqueSlug}/articles`} className="text-sm font-bold text-blue-600 hover:text-blue-700">
                    ← Kembali ke Daftar Artikel
                </Link>
            </div>
        );
    }

    const formattedDate = article.published_at
        ? new Date(article.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        : 'Belum diterbitkan';

    return (
        <div className="bg-white dark:bg-slate-950 min-h-screen transition-colors duration-300 relative pb-24 font-sans">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl transition-colors duration-300 border-b border-slate-100 dark:border-slate-800">
                <div className="px-4 py-2.5 flex justify-between items-center">
                    <Link href={`/m/${mosqueSlug}/articles`} className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <ArrowLeft size={18} className="text-slate-700 dark:text-slate-300" />
                    </Link>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleShare}
                            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            <Send size={16} className="text-slate-600 dark:text-slate-400" />
                        </button>
                        <button
                            onClick={() => setIsBookmarked(!isBookmarked)}
                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${isBookmarked ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                        >
                            <Bookmark size={16} className={isBookmarked ? 'text-blue-600 fill-blue-600' : 'text-slate-600 dark:text-slate-400'} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="relative mx-auto max-w-[600px]">
                {/* Banner Image */}
                {article.flyer_url ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full aspect-[16/10] relative overflow-hidden"
                    >
                        <img src={article.flyer_url} alt={article.title} className="w-full h-full object-cover" />
                    </motion.div>
                ) : (
                    <div className="w-full aspect-[16/10] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
                        <Newspaper className="text-slate-300 dark:text-slate-600" size={56} />
                    </div>
                )}

                {/* Content Area */}
                <div className="px-5 pt-5">

                    {/* Author Row */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 mb-4"
                    >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                            {article.author_name?.charAt(0) || 'A'}
                        </div>
                        <div>
                            <p className="font-bold text-[13px] text-slate-800 dark:text-white">{article.author_name}</p>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500">{formattedDate}</p>
                        </div>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="text-[22px] font-extrabold text-slate-900 dark:text-white leading-[1.25] tracking-tight mb-4"
                    >
                        {article.title}
                    </motion.h1>

                    {/* Stats & Category Row */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center justify-between mb-5 pb-5 border-b border-slate-100 dark:border-slate-800"
                    >
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsLiked(!isLiked)}
                                className="flex items-center gap-1.5 group"
                            >
                                <Heart size={16} className={`transition-colors ${isLiked ? 'text-red-500 fill-red-500' : 'text-slate-400 group-hover:text-red-400'}`} />
                                <span className={`text-xs font-bold ${isLiked ? 'text-red-500' : 'text-slate-500'}`}>128</span>
                            </button>
                            <div className="flex items-center gap-1.5">
                                <Eye size={16} className="text-slate-400" />
                                <span className="text-xs font-bold text-slate-500">361.4K</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Share2 size={14} className="text-slate-400" />
                                <span className="text-xs font-bold text-slate-500">24</span>
                            </div>
                        </div>
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-extrabold tracking-wider ${getCategoryStyle(article.category)}`}>
                            {article.category}
                        </span>
                    </motion.div>

                    {/* Article Body */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="mb-6"
                    >
                        <div className="text-[15px] text-slate-700 dark:text-slate-300 leading-[1.85] whitespace-pre-line font-medium">
                            {article.content}
                        </div>
                    </motion.div>

                    {/* Tags */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap gap-2 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800"
                    >
                        {['#masjid', '#dakwah', article.category?.toLowerCase()].filter(Boolean).map((tag, i) => (
                            <span key={i} className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                                {tag?.startsWith('#') ? tag : `#${tag}`}
                            </span>
                        ))}
                    </motion.div>

                    {/* Engagement Row */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100 dark:border-slate-800"
                    >
                        <span className="text-sm font-bold text-slate-800 dark:text-white">Apakah artikel ini bermanfaat?</span>
                        <div className="flex items-center gap-2">
                            <button className="px-3.5 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold hover:bg-emerald-200 transition-colors">
                                👍 Ya
                            </button>
                            <button className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                👎 Tidak
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Comments Section */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-8 px-5"
                >
                    <button
                        onClick={() => setShowComments(!showComments)}
                        className="flex items-center justify-between w-full py-3"
                    >
                        <div className="flex items-center gap-2">
                            <MessageCircle size={18} className="text-slate-600 dark:text-slate-400" />
                            <span className="font-bold text-sm text-slate-800 dark:text-white">
                                Komentar ({comments.length})
                            </span>
                        </div>
                        <ChevronRight size={16} className={`text-slate-400 transition-transform duration-200 ${showComments ? 'rotate-90' : ''}`} />
                    </button>

                    {showComments && (
                        <div className="space-y-4 mt-2 animate-in slide-in-from-top-2">
                            {comments.map((comment) => (
                                <div key={comment.id} className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                        {comment.name.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="text-[12px] font-bold text-slate-800 dark:text-slate-200">{comment.name}</span>
                                            <span className="text-[10px] text-slate-400">{comment.time}</span>
                                        </div>
                                        <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">{comment.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Related Articles */}
                {relatedArticles.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        className="mb-8 px-5"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-base text-slate-800 dark:text-white">Artikel Terkait</h3>
                            <Link href={`/m/${mosqueSlug}/articles`} className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
                                Lihat Semua
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {relatedArticles.map((related) => (
                                <Link href={`/m/${mosqueSlug}/articles/${related.slug}`} key={related.id} className="block group">
                                    <div className="flex gap-3 items-center">
                                        {related.flyer_url ? (
                                            <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                                                <img src={related.flyer_url} alt={related.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            </div>
                                        ) : (
                                            <div className="w-20 h-20 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                                                <Newspaper className="text-slate-300 dark:text-slate-600" size={20} />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-[13px] text-slate-800 dark:text-white line-clamp-2 leading-snug mb-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{related.title}</h4>
                                            <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                                <span>{related.author_name}</span>
                                                <span>•</span>
                                                <span>{related.published_at ? new Date(related.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'}</span>
                                            </div>
                                        </div>
                                        <ChevronRight size={16} className="text-slate-300 dark:text-slate-600 flex-shrink-0" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </main>

            {/* Floating Bottom Bar - Love & Comment */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 px-4 py-2.5 safe-area-bottom">
                <div className="max-w-[600px] mx-auto flex items-center gap-3">
                    {/* Love Button */}
                    <button
                        onClick={() => {
                            setIsLiked(!isLiked);
                            setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
                        }}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all active:scale-90 ${isLiked ? 'bg-red-50 dark:bg-red-900/20' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    >
                        <Heart size={20} className={`transition-all duration-300 ${isLiked ? 'text-red-500 fill-red-500 scale-110' : 'text-slate-400'}`} />
                        <span className={`text-xs font-bold ${isLiked ? 'text-red-500' : 'text-slate-500'}`}>{likeCount}</span>
                    </button>

                    {/* Comment Input */}
                    <div className="flex-1 flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-2">
                        <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Tulis komentar..."
                            className="flex-1 bg-transparent text-sm text-slate-800 dark:text-white placeholder:text-slate-400 outline-none"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && commentText.trim()) {
                                    setComments(prev => [{ id: Date.now(), name: 'Anda', text: commentText.trim(), time: 'Baru saja' }, ...prev]);
                                    setCommentText('');
                                    setShowComments(true);
                                }
                            }}
                        />
                        <button
                            onClick={() => {
                                if (commentText.trim()) {
                                    setComments(prev => [{ id: Date.now(), name: 'Anda', text: commentText.trim(), time: 'Baru saja' }, ...prev]);
                                    setCommentText('');
                                    setShowComments(true);
                                }
                            }}
                            className={`p-1.5 rounded-lg transition-colors ${commentText.trim() ? 'bg-blue-600 text-white' : 'text-slate-300 dark:text-slate-600'}`}
                            disabled={!commentText.trim()}
                        >
                            <Send size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
