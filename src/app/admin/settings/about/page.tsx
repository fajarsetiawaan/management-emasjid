'use client';

import { ArrowLeft, Sparkles, FileText, ShieldCheck, Star, ChevronRight, Building2 } from 'lucide-react';
import Link from 'next/link';
import { MOCK_MOSQUE, MOCK_LEGAL_MENU } from '@/lib/mock-data';
import * as Icons from 'lucide-react';

export default function AboutPage() {
    const legalmenu = MOCK_LEGAL_MENU.map(item => ({
        ...item,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        icon: (Icons as any)[item.iconName] || Icons.HelpCircle
    }));

    return (
        <div className="min-h-screen bg-slate-50 pb-24 relative flex flex-col">
            {/* Header */}
            <header className="bg-white px-4 h-16 flex items-center gap-3 border-b border-slate-100 sticky top-0 z-50">
                <Link href="/admin/settings" className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-50 transition-colors" aria-label="Kembali">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="font-bold text-slate-800 text-lg">Tentang Aplikasi</h1>
            </header>

            <div className="flex-1 overflow-y-auto">
                {/* Logo Showcase */}
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-24 h-24 rounded-3xl bg-emerald-600 shadow-xl shadow-emerald-200 flex items-center justify-center mb-6 text-white transform rotate-3 hover:rotate-0 transition-transform duration-500">
                        <Building2 size={48} />
                    </div>
                    <h2 className="font-bold text-2xl text-slate-900 tracking-tight mb-1">Fase E-Masjid</h2>
                    <p className="text-sm font-medium text-slate-400 mb-3">Versi 1.0.0 (Build 20260208)</p>
                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-3 py-1 rounded-full border border-emerald-200">
                        Up to Date
                    </span>
                </div>

                {/* Legal Menu */}
                <div className="px-5">
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-50 shadow-sm">
                        {legalmenu.map((item, index) => (
                            <Link
                                key={index}
                                href={item.href}
                                className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center gap-3.5">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
                                        <item.icon size={16} />
                                    </div>
                                    <span className="font-bold text-slate-700 text-sm">{item.label}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    {item.badge && (
                                        <span className="text-[10px] font-bold bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                                            {item.badge}
                                        </span>
                                    )}
                                    <ChevronRight size={16} className="text-slate-300" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="p-6 text-center">
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                    Copyright © 2026 Fase E-Masjid.<br />
                    Dibuat untuk Kemakmuran Masjid.
                </p>
            </div>
        </div>
    );
}
