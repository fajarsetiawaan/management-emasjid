'use client';

import { ArrowLeft, LifeBuoy, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { MOCK_FAQS } from '@/lib/mock-data';

export default function SupportPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = MOCK_FAQS;

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-24 relative flex flex-col">
            {/* Header */}
            <header className="bg-white px-4 h-16 flex items-center gap-3 border-b border-slate-100 sticky top-0 z-50">
                <Link href="/admin/settings" className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-50 transition-colors" aria-label="Kembali">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="font-bold text-slate-800 text-lg">Bantuan & Dukungan</h1>
            </header>

            <div className="flex-1 overflow-y-auto">
                {/* Hero Section */}
                <div className="bg-white p-8 flex flex-col items-center justify-center border-b border-slate-100 mb-6">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-4 animate-pulse">
                        <LifeBuoy size={40} />
                    </div>
                    <h2 className="font-bold text-slate-800 text-lg mb-1">Ada kendala dengan aplikasi?</h2>
                    <p className="text-sm text-slate-400 text-center max-w-[250px]">
                        Temukan jawaban di bawah atau hubungi tim support kami.
                    </p>
                </div>

                {/* FAQ List */}
                <div className="px-5 space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Pertanyaan Umum (FAQ)</h3>

                    <div className="space-y-3">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                                <button
                                    onClick={() => toggleAccordion(index)}
                                    className="w-full px-4 py-4 flex items-center justify-between text-left font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                                    aria-expanded={openIndex === index}
                                >
                                    <span className="text-sm">{faq.question}</span>
                                    {openIndex === index ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                                </button>
                                <AnimatePresence>
                                    {openIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-4 pb-4 text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sticky Bottom Actions */}
            <div className="p-4 bg-white border-t border-slate-100 sticky bottom-0 z-50">
                <a
                    href="https://wa.me/6281234567890?text=Halo%20admin,%20saya%20butuh%20bantuan%20terkait%20aplikasi%20Fase%20E-Masjid"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 hover:brightness-105 active:scale-95 transition-all"
                >
                    <MessageCircle size={20} />
                    Chat CS via WhatsApp
                </a>
            </div>
        </div>
    );
}
