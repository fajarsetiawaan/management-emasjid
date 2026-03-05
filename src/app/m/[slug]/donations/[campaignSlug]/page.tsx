'use client';

import { useState, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Share2, HeartHandshake, TrendingUp, Users, CheckCircle2, Copy } from 'lucide-react';
import Link from 'next/link';

// Mock Data
import DONATIONS_MOCK from '@/mocks/donations.json';
import { MOCK_MOSQUE } from '@/lib/mock-data';

const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
};

export default function PublicCampaignDetailPage({ params }: { params: Promise<{ slug: string, campaignSlug: string }> }) {
    const { slug, campaignSlug } = use(params);
    const [activeTab, setActiveTab] = useState<'cerita' | 'update' | 'donatur'>('cerita');
    const [showDonateModal, setShowDonateModal] = useState(false);

    // Find campaign data (mock)
    const campaign = DONATIONS_MOCK.campaigns.find(c => c.slug === campaignSlug) || DONATIONS_MOCK.campaigns[0];
    const donations = DONATIONS_MOCK.campaign_donations.filter(d => d.campaign_id === campaign.id);
    const updates = DONATIONS_MOCK.campaign_updates.filter(u => u.campaign_id === campaign.id);

    const progress = Math.min(100, Math.floor((campaign.current_amount / campaign.target_amount) * 100));
    const totalDonors = donations.length;

    // Donate Modal Form State
    const [donateAmount, setDonateAmount] = useState<number>(50000);
    const [donateName, setDonateName] = useState('');
    const [donateMessage, setDonateMessage] = useState('');

    const presetAmounts = [10000, 50000, 100000, 500000];

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Disalin ke clipboard!');
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300 pb-28 relative font-sans tracking-tight">

            {/* Header Sticky Container over Flyer */}
            <div className="sticky top-0 z-50 w-full px-5 py-4 flex justify-between items-center transition-all">
                <Link href={`/m/${slug}`} className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/50 transition-colors shadow-sm border border-white/20">
                    <ArrowLeft size={20} />
                </Link>
                <button className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/50 transition-colors shadow-sm border border-white/20">
                    <Share2 size={18} />
                </button>
            </div>

            {/* Flyer / Hero Image (Behind Header) */}
            <div className="w-full h-80 relative -mt-[72px] bg-slate-200 dark:bg-slate-800">
                {campaign.flyer_url ? (
                    <img src={campaign.flyer_url} alt={campaign.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-500/20 to-rose-500/20">
                        <HeartHandshake className="text-pink-400 opacity-60" size={60} />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
            </div>

            {/* Campaign Main Info (Pulled up over the flyer) */}
            <main className="px-5 -mt-16 relative z-10 space-y-5">

                {/* Info Card */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-5 border border-white/40 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border border-emerald-500/20">Sedang Berjalan</span>
                        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                            Oleh: <span className="text-slate-700 dark:text-slate-300 font-bold">{MOCK_MOSQUE.name}</span>
                        </span>
                    </div>

                    <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-tight mb-4">
                        {campaign.title}
                    </h1>

                    {/* Progress */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-[22px] font-black text-pink-600 dark:text-pink-500 leading-none">{formatRupiah(campaign.current_amount)}</p>
                                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wide mt-1">Terkumpul dari {formatRupiah(campaign.target_amount)}</p>
                            </div>
                        </div>

                        <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full relative"
                            >
                                <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/30"></div>
                            </motion.div>
                        </div>

                        <div className="flex justify-between items-center text-[11px] font-semibold text-slate-500 pt-1">
                            <span className="flex items-center gap-1"><Users size={12} /> {totalDonors} Donatur</span>
                            <span>Sisa {Math.ceil((new Date(campaign.end_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24))} hari</span>
                        </div>
                    </div>
                </div>

                {/* Tabs Component */}
                <div className="sticky top-20 z-40 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-md pt-2 pb-3 -mx-5 px-5">
                    <div className="flex p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
                        <button
                            onClick={() => setActiveTab('cerita')}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'cerita' ? 'bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
                        >
                            Cerita
                        </button>
                        <button
                            onClick={() => setActiveTab('update')}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'update' ? 'bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
                        >
                            Kabar Terbaru
                        </button>
                        <button
                            onClick={() => setActiveTab('donatur')}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'donatur' ? 'bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
                        >
                            Donatur <span className="bg-slate-200 dark:bg-slate-700 text-xs px-1.5 py-0.5 rounded-full ml-1">{totalDonors}</span>
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {/* CERITA TAB */}
                        {activeTab === 'cerita' && (
                            <motion.div key="cerita" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                                <h3 className="font-bold text-slate-800 dark:text-slate-200">Kisah & Latar Belakang</h3>
                                <div className="text-[15px] prose dark:prose-invert prose-p:leading-relaxed prose-pink text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                                    {campaign.description}
                                </div>
                            </motion.div>
                        )}

                        {/* UPDATE TAB */}
                        {activeTab === 'update' && (
                            <motion.div key="update" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                                {updates.length > 0 ? updates.map(upd => (
                                    <div key={upd.id} className="relative pl-6 pb-6 border-l-2 border-slate-200 dark:border-slate-800 last:border-transparent last:pb-0">
                                        <div className="absolute top-0 left-[-9px] w-4 h-4 rounded-full bg-pink-500 border-4 border-slate-50 dark:border-slate-950"></div>
                                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm ml-2">
                                            <p className="text-[10px] items-center text-slate-500 font-bold uppercase tracking-wider mb-2 flex gap-1">
                                                <CheckCircle2 size={12} className="text-emerald-500" />
                                                {new Date(upd.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </p>
                                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                                                {upd.content}
                                            </p>
                                            {upd.image_url && (
                                                <img src={upd.image_url} alt="Update" className="w-full h-48 object-cover rounded-xl mt-3" />
                                            )}
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-10">
                                        <p className="text-slate-500 dark:text-slate-400 text-sm">Belum ada kabar terbaru.</p>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* DONATUR TAB */}
                        {activeTab === 'donatur' && (
                            <motion.div key="donatur" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-4">Orang baik yang sudah berdonasi</h3>
                                {donations.length > 0 ? donations.map((don, idx) => (
                                    <div key={don.id} className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-100 to-rose-200 dark:from-pink-900/40 dark:to-rose-800/40 flex items-center justify-center flex-shrink-0 font-bold text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-800/50">
                                            {don.donor_name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{don.donor_name}</h4>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Berdonasi {formatRupiah(don.amount)}</p>
                                                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                                                <p className="text-[10px] text-slate-400">{new Date(don.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</p>
                                            </div>
                                            {don.message && (
                                                <div className="mt-2.5 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-xs text-slate-600 dark:text-slate-300 italic">
                                                    "{don.message}"
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-10">
                                        <p className="text-slate-500 dark:text-slate-400 text-sm">Jadilah yang pertama berdonasi di program ini.</p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* Bottom Floating CTA Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 z-50">
                <button
                    onClick={() => setShowDonateModal(true)}
                    className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold text-lg py-4 rounded-2xl shadow-xl shadow-pink-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    Donasi Sekarang <HeartHandshake size={20} />
                </button>
            </div>

            {/* Donation Modal Flow */}
            <AnimatePresence>
                {showDonateModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowDonateModal(false)}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 z-[70] bg-white dark:bg-slate-950 rounded-t-[2.5rem] p-6 pb-12 shadow-2xl border-t border-slate-200 dark:border-slate-800"
                            style={{ maxHeight: '90vh', overflowY: 'auto' }}
                        >
                            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-6"></div>

                            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 text-center text-balance leading-tight">Mulai Donasi untuk<br /> <span className="text-pink-600 dark:text-pink-400">{campaign.title}</span></h2>

                            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Proceed to Payment Mockup"); setShowDonateModal(false); }}>
                                {/* Preset Amounts */}
                                <div>
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1 mb-2 block uppercase tracking-wider">Pilih Nominal</label>
                                    <div className="grid grid-cols-2 gap-3 mb-3">
                                        {presetAmounts.map(amount => (
                                            <button
                                                key={amount}
                                                type="button"
                                                onClick={() => setDonateAmount(amount)}
                                                className={`py-3 px-2 rounded-xl text-sm font-bold border transition-all 
                                                    ${donateAmount === amount
                                                        ? 'bg-pink-50 border-pink-500 text-pink-600 dark:bg-pink-900/30 dark:border-pink-500 dark:text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.15)]'
                                                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-pink-300 dark:hover:border-pink-700'}`}
                                            >
                                                {formatRupiah(amount)}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500 font-bold">Rp</div>
                                        <input
                                            id="donateAmount"
                                            name="donateAmount"
                                            type="number"
                                            value={donateAmount || ''}
                                            onChange={e => setDonateAmount(parseInt(e.target.value))}
                                            placeholder="Nominal lainnya"
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3.5 pl-12 pr-4 text-slate-800 dark:text-slate-100 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-400 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Profil Donatur */}
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1 block uppercase tracking-wider">Profil Donatur</label>

                                    <input
                                        id="donateName"
                                        name="donateName"
                                        type="text"
                                        placeholder="Nama Lengkap (Kosongkan jika Hamba Allah)"
                                        value={donateName}
                                        onChange={e => setDonateName(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3.5 px-4 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-400 transition-all"
                                    />

                                    <textarea
                                        id="donateMessage"
                                        name="donateMessage"
                                        placeholder="Tulis doa atau dukungan untuk program ini (opsional)"
                                        rows={3}
                                        value={donateMessage}
                                        onChange={e => setDonateMessage(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3.5 px-4 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-400 transition-all resize-none"
                                    />
                                </div>

                                {/* Instruksi Transfer Manual (Mock Payment Gateway) */}
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-2xl p-4">
                                    <p className="text-xs text-blue-800 dark:text-blue-300 font-medium leading-relaxed mb-3">
                                        Untuk saat ini, donasi ditransfer manual ke rekening resmi Masjid:
                                    </p>
                                    <div className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-100 dark:border-slate-700 flex justify-between items-center shadow-sm mb-2">
                                        <div>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">BSI (Bank Syariah Indonesia)</p>
                                            <p className="text-base font-bold text-slate-800 dark:text-slate-100 tracking-wider">712 3456 789</p>
                                            <p className="text-xs text-slate-500 mt-0.5">a.n DKM Masjid Jami</p>
                                        </div>
                                        <button type="button" onClick={() => copyToClipboard('7123456789')} className="p-2.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                                            <Copy size={18} />
                                        </button>
                                    </div>
                                    <p className="text-[11px] text-blue-700/70 dark:text-blue-400/70 italic text-center mt-2">
                                        (Simpan bukti transfer untuk konfirmasi)
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full block bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-pink-500/25 transition-all text-center"
                                >
                                    Konfirmasi & Lanjutkan
                                </button>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
