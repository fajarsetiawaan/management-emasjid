import { motion } from 'framer-motion';
import Link from 'next/link';
import { HeartHandshake, ArrowRight, CalendarDays } from 'lucide-react';

interface AdminCampaignCardProps {
    campaign: any; // Using any for now to bypass strict typing if Campaign doesn't exist yet
    index?: number;
}

export const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
};

export default function AdminCampaignCard({ campaign, index = 0 }: AdminCampaignCardProps) {
    const progress = Math.min(100, Math.floor((campaign.current_amount / campaign.target_amount) * 100));

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50';
            case 'COMPLETED': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50';
            case 'DRAFT': return 'bg-white text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 shadow-sm';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'BERJALAN';
            case 'COMPLETED': return 'SELESAI';
            case 'DRAFT': return 'DRAFT';
            default: return status;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="w-[70vw] sm:w-[260px] md:w-[280px] shrink-0 snap-center h-full bg-gradient-to-b from-[#fefbfd] to-[#fff5f8] dark:from-slate-900 dark:to-slate-900 border border-pink-100 dark:border-slate-800 rounded-[1.2rem] overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col"
        >
            {/* Header / Image Area */}
            <div className="h-36 w-full relative bg-slate-200 dark:bg-slate-800 overflow-hidden shrink-0">
                {campaign.flyer_url ? (
                    <img src={campaign.flyer_url} alt={campaign.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-slate-300 to-slate-400 dark:from-slate-700 dark:to-slate-800">
                        <HeartHandshake className="text-white/40" size={48} />
                    </div>
                )}
                {/* Gradient Overlay for Top Area */}
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent"></div>

                {/* Status Badge */}
                <div className="absolute top-4 right-4 z-10">
                    <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider border shadow-sm ${getStatusStyle(campaign.status)}`}>
                        {getStatusLabel(campaign.status)}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-4 flex flex-col flex-1">
                {/* Title - min-h ensures 2-line baseline for uniform card height */}
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-snug mb-3 min-h-[2.5rem]">
                    {campaign.title}
                </h3>

                <div className="mt-auto">
                    {/* Progress Stats */}
                    <div className="flex flex-wrap justify-between items-end gap-1 mb-1.5">
                        <div>
                            <p className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mb-0.5">TERKUMPUL</p>
                            <p className="text-xs font-bold text-[#E91E63] dark:text-pink-500">{formatRupiah(campaign.current_amount)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mb-0.5">TARGET</p>
                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{formatRupiah(campaign.target_amount)}</p>
                        </div>
                    </div>

                    {/* Progress Bar (Custom Design matching screenshot) */}
                    <div className="relative h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
                        <div
                            className="absolute top-0 left-0 h-full bg-[#E91E63] rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                        {/* The little glowing dot at the end of progress */}
                        {progress > 0 && progress < 100 && (
                            <div
                                className="absolute top-1/2 -mt-1 w-2 h-2 bg-[#E91E63] rounded-full shadow-[0_0_6px_rgba(233,30,99,0.6)]"
                                style={{ left: `calc(${progress}% - 4px)` }}
                            />
                        )}
                        {/* Dot at end for 100% */}
                        {progress >= 100 && (
                            <div
                                className="absolute top-1/2 right-0 -mr-1 -mt-1 w-2 h-2 bg-[#E91E63] rounded-full shadow-[0_0_6px_rgba(233,30,99,0.6)]"
                            />
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/50">
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                            <CalendarDays size={13} />
                            <span>{new Date(campaign.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                        </div>
                        <Link href={`/admin/donations/${campaign.slug}`} className="text-[11px] font-bold text-[#E91E63] bg-pink-50 dark:bg-pink-900/20 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-pink-100 dark:hover:bg-pink-900/40 transition-colors">
                            Kelola <ArrowRight size={13} />
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
