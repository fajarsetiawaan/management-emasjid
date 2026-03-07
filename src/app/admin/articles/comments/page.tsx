'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    MessageCircle,
    Search,
    Trash2,
    Reply,
    Eye,
    ChevronRight,
    User,
    Clock,
    Filter,
    MessageSquare,
    AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { getAllComments, deleteComment, type Comment } from '@/services/comments';

export default function CommentModerationPage() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [filterArticle, setFilterArticle] = useState('ALL');

    useEffect(() => {
        loadComments();
    }, []);

    const loadComments = async () => {
        setIsLoading(true);
        const data = await getAllComments();
        setComments(data);
        setIsLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus komentar ini?')) {
            const success = await deleteComment(id);
            if (success) {
                setComments(prev => prev.filter(c => c.id !== id));
            }
        }
    };

    // Filter logic
    const filteredComments = comments.filter(c => {
        const matchesSearch = c.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesArticle = filterArticle === 'ALL' || c.article_id === filterArticle;
        return matchesSearch && matchesArticle;
    });

    // Unique articles for filter
    const uniqueArticles = Array.from(new Set(comments.map(c => JSON.stringify({ id: c.article_id, title: c.article_title }))))
        .map(s => JSON.parse(s));

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300 relative pb-24">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[128px] animate-blob" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50">
                <div className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/articles" className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Pusat Moderasi</h1>
                            <p className="text-[10px] text-rose-600 dark:text-rose-400 font-black uppercase tracking-widest">Komentar Jamaah</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="relative z-10 px-6 pt-8 space-y-6">

                {/* Stats Summary */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                        <MessageSquare className="text-rose-500 mb-3" size={24} />
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Komentar</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{comments.length}</p>
                    </div>
                    <div className="p-6 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                        <Clock className="text-emerald-500 mb-3" size={24} />
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Hari Ini</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                            {comments.filter(c => new Date(c.created_at).toDateString() === new Date().toDateString()).length || 0}
                        </p>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col gap-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Cari komentar atau nama..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all shadow-sm"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        <button
                            onClick={() => setFilterArticle('ALL')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${filterArticle === 'ALL' ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/25' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'}`}
                        >
                            Semua Artikel
                        </button>
                        {uniqueArticles.map(art => (
                            <button
                                key={art.id}
                                onClick={() => setFilterArticle(art.id)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${filterArticle === art.id ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/25' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'}`}
                            >
                                {art.title}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-4">
                            <div className="w-10 h-10 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin" />
                            <p className="text-sm font-bold text-slate-500">Memuat data...</p>
                        </div>
                    ) : filteredComments.length > 0 ? (
                        <AnimatePresence mode="popLayout">
                            {filteredComments.map((comment, index) => (
                                <motion.div
                                    key={comment.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="p-5 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm group hover:border-rose-200 dark:hover:border-rose-900/50 transition-colors"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden ring-2 ring-white dark:ring-slate-950 shrink-0">
                                            <img src={comment.avatar} alt={comment.username} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <h3 className="text-sm font-black text-slate-900 dark:text-white truncate">{comment.username}</h3>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider tabular-nums">
                                                    {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-3">
                                                {comment.content}
                                            </p>

                                            <Link
                                                href={`/admin/articles/${comment.article_id}`}
                                                className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:text-rose-500 group/link transition-colors mb-4 w-fit"
                                            >
                                                <AlertCircle size={12} className="group-hover/link:text-rose-500" />
                                                <span className="text-[10px] font-bold truncate max-w-[150px]">{comment.article_title}</span>
                                                <ChevronRight size={12} />
                                            </Link>

                                            <div className="flex items-center gap-2">
                                                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 transition-all">
                                                    <Reply size={14} /> Bilas
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(comment.id)}
                                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 hover:bg-rose-600 hover:text-white transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    ) : (
                        <div className="py-20 text-center">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MessageCircle className="text-slate-300" size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Tidak ada komentar</h3>
                            <p className="text-sm text-slate-500">Coba ubah filter atau kata kunci pencarian Anda.</p>
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
}
