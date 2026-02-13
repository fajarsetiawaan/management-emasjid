'use client';

import { MOCK_MOSQUE } from '@/lib/mock-data';
import { ArrowLeft, Download, Printer, Share2, Building2 } from 'lucide-react';
import Link from 'next/link';
import QRCode from 'react-qr-code';
import { useState, useEffect } from 'react';

function QrContent({ slug }: { slug: string }) {
    const [qrisUrl, setQrisUrl] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedQris = localStorage.getItem('sim_qris_url');
            if (savedQris) setQrisUrl(savedQris);
        }
    }, []);

    if (qrisUrl) {
        return (
            <img src={qrisUrl} alt="QRIS Masjid" className="w-full h-auto object-contain" />
        );
    }

    return (
        <QRCode
            value={`https://app.fase.id/m/${slug}`}
            size={180}
            level="H"
            className="w-full h-auto"
        />
    );
}

export default function QRCodePage() {
    return (
        <div className="min-h-screen bg-slate-50 pb-24 relative flex flex-col">
            {/* Header */}
            <header className="bg-white px-4 h-16 flex items-center gap-3 border-b border-slate-100 z-50">
                <Link href="/admin/settings" className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-50 transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="font-bold text-slate-800 text-lg">QR Code Masjid</h1>
            </header>

            {/* Content Container (Center Aligned) */}
            <div className="flex-1 flex flex-col items-center justify-center p-6">

                {/* Poster Preview (A6/A5 Aspect Ratio) */}
                <div className="w-full max-w-[320px] bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 relative group cursor-default select-none">

                    {/* Top Branding Pattern */}
                    <div className="h-4 bg-emerald-600 w-full" />

                    <div className="p-8 flex flex-col items-center text-center">
                        {/* Logo */}
                        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                            <Building2 size={32} />
                        </div>

                        {/* Mosque Name */}
                        <h2 className="font-bold text-xl text-slate-900 leading-tight mb-1">{MOCK_MOSQUE.name}</h2>
                        <p className="text-xs text-slate-500 max-w-[80%] mx-auto">{MOCK_MOSQUE.address}</p>

                        {/* QR Area */}
                        <div className="my-8 p-4 bg-white border-2 border-slate-900 rounded-xl relative">
                            {/* Corner Accents */}
                            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-emerald-600" />
                            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-emerald-600" />
                            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-emerald-600" />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-emerald-600" />

                            <QrContent slug={MOCK_MOSQUE.slug} />
                        </div>

                        {/* Footer Call to Action */}
                        <h3 className="font-bold text-slate-800 mb-1">Scan untuk Infaq</h3>
                        <p className="text-xs text-slate-500">Laporan transparan & update kegiatan terkini.</p>
                    </div>

                    {/* Bottom Branding */}
                    <div className="bg-slate-50 py-3 text-center border-t border-slate-100">
                        <p className="text-[10px] text-slate-400 font-medium tracking-wide">Powered by Fase E-Masjid</p>
                    </div>
                </div>

                <p className="text-center text-xs text-slate-400 mt-6 max-w-xs mx-auto">
                    Poster ini dapat dicetak dan ditempel di kotak amal atau papan pengumuman.
                </p>

            </div>

            {/* Sticky Action Buttons */}
            <div className="bg-white border-t border-slate-100 p-4 sticky bottom-0 z-50">
                <div className="max-w-[480px] mx-auto grid grid-cols-2 gap-3">
                    <button className="col-span-1 bg-slate-100 text-slate-700 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors">
                        <Share2 size={18} />
                        Share
                    </button>
                    <button className="col-span-1 bg-emerald-600 text-white font-bold py-3.5 rounded-xl text-sm shadow-emerald-200 shadow-lg flex items-center justify-center gap-2 hover:bg-emerald-700 active:scale-95 transition-all">
                        <Download size={18} />
                        Download PNG
                    </button>
                </div>
                <div className="max-w-[480px] mx-auto mt-3">
                    <button className="w-full text-xs font-bold text-slate-400 py-2 flex items-center justify-center gap-2 hover:text-slate-600">
                        <Printer size={14} />
                        Cetak Poster (PDF)
                    </button>
                </div>
            </div>
        </div>
    );
}
