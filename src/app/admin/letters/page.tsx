'use client';

import { useState } from 'react';
import { MOCK_LETTERS } from '@/lib/mock-data';
import { FileText, ArrowRight, ArrowLeft, Download, Eye, Plus } from 'lucide-react';
import { LetterType } from '@/types';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function LettersPage() {
    const [activeTab, setActiveTab] = useState<LetterType>('IN');

    const filteredLetters = MOCK_LETTERS.filter(
        (l) => l.type === activeTab
    ).sort((a, b) => b.date.getTime() - a.date.getTime());

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        }).format(date);
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'SENT': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'DRAFT': return 'bg-slate-100 text-slate-500 border-slate-200';
            case 'ARCHIVED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            default: return 'bg-slate-100 text-slate-500';
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-6 p-1">
            <div className="flex items-center justify-between px-1">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Surat</h1>
                    <p className="text-slate-500 text-xs font-medium">Administrasi persuratan</p>
                </div>
                <Link href="/admin/letters/new" className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-lg hover:bg-slate-900 hover:scale-105 transition-all">
                    <Plus size={20} />
                </Link>
            </div>

            {/* Tabs */}
            <div className="bg-slate-100 p-1.5 rounded-2xl flex relative z-0">
                <button
                    onClick={() => setActiveTab('IN')}
                    className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 relative z-10
            ${activeTab === 'IN' ? 'text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    {activeTab === 'IN' && (
                        <motion.div
                            layoutId="letter-tab-bg"
                            className="absolute inset-0 bg-white shadow-sm rounded-xl -z-10 border border-slate-200/50"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <span className={`flex items-center justify-center w-6 h-6 rounded-full ${activeTab === 'IN' ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-400'}`}>
                        <ArrowRight size={14} />
                    </span>
                    Masuk
                </button>
                <button
                    onClick={() => setActiveTab('OUT')}
                    className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 relative z-10
            ${activeTab === 'OUT' ? 'text-orange-700' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    {activeTab === 'OUT' && (
                        <motion.div
                            layoutId="letter-tab-bg"
                            className="absolute inset-0 bg-white shadow-sm rounded-xl -z-10 border border-slate-200/50"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <span className={`flex items-center justify-center w-6 h-6 rounded-full ${activeTab === 'OUT' ? 'bg-orange-100 text-orange-600' : 'bg-slate-200 text-slate-400'}`}>
                        <ArrowLeft size={14} />
                    </span>
                    Keluar
                </button>
            </div>

            {/* Letters List */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                key={activeTab}
                className="space-y-4"
            >
                <AnimatePresence mode="popLayout">
                    {filteredLetters.map((letter) => (
                        <motion.div
                            key={letter.id}
                            variants={item}
                            className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm group active:scale-[0.99] transition-transform"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase border ${getStatusStyle(letter.status)}`}>
                                        {letter.status}
                                    </span>
                                    <span className="text-xs text-slate-400 font-medium">{formatDate(letter.date)}</span>
                                </div>
                                <span className="text-[10px] items-center text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-mono font-bold tracking-tight">
                                    #{letter.refNumber}
                                </span>
                            </div>

                            <h3 className="text-base font-bold text-slate-800 leading-tight mb-4 group-hover:text-blue-600 transition-colors">{letter.subject}</h3>

                            <div className="flex gap-3 border-t pt-4 border-slate-50">
                                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-slate-600 bg-slate-50 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors">
                                    <Eye size={16} className="text-slate-400" />
                                    Lihat Detail
                                </button>
                                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-slate-600 bg-slate-50 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors">
                                    <Download size={16} className="text-slate-400" />
                                    Unduh PDF
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredLetters.length === 0 && (
                    <motion.div variants={item} className="text-center py-16 text-slate-400 text-sm italic">
                        Tidak ada surat dalam kategori ini.
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
