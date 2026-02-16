'use client';

import { MOCK_EVENTS } from '@/lib/mock-data';
import { Calendar, Clock, MapPin, CheckCircle2, Plus, ArrowRight, Video, SlidersHorizontal, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FilterDropdown, FilterTrigger, FilterContent, FilterItem } from '@/components/shared/FilterDropdown';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

const EventCard = ({ event }: { event: (typeof MOCK_EVENTS)[0] }) => {
    const isUpcoming = event.status === 'UPCOMING';

    return (
        <motion.div
            variants={item}
            whileTap={{ scale: 0.98 }}
            className="group relative overflow-hidden bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl rounded-[2rem] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 border border-white/50 dark:border-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-900/70"
        >
            {/* Decorative Gradient Line */}
            <div className={`absolute left-0 top-8 bottom-8 w-1 rounded-r-full 
                ${isUpcoming ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-slate-300 dark:bg-slate-700'}`}
            />

            <div className="flex gap-5 pl-3">
                {/* Date Capsule */}
                <div className={`
                    flex flex-col items-center justify-center w-[4.5rem] h-[4.5rem] rounded-2xl flex-shrink-0 border shadow-sm
                    ${isUpcoming
                        ? 'bg-blue-50/80 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400'
                        : 'bg-slate-50/80 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 text-slate-400'
                    }
                `}>
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">
                        {event.date.toLocaleString('default', { month: 'short' })}
                    </span>
                    <span className="text-3xl font-black leading-none tracking-tighter">
                        {event.date.getDate()}
                    </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-center py-1">
                    <div className="flex items-start justify-between gap-4">
                        <h3 className={`font-bold text-lg leading-tight truncate pr-2 ${isUpcoming ? 'text-slate-800 dark:text-white' : 'text-slate-500 line-through decoration-slate-300'}`}>
                            {event.title}
                        </h3>
                        {event.category === 'KAJIAN' && (
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                                <Video size={14} />
                            </span>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider border
                            ${event.category === 'KAJIAN'
                                ? 'bg-purple-50 dark:bg-purple-900/10 text-purple-600 border-purple-100 dark:border-purple-800/30'
                                : 'bg-orange-50 dark:bg-orange-900/10 text-orange-600 border-orange-100 dark:border-orange-800/30'}
                        `}>
                            {event.category}
                        </span>

                        <span className="text-slate-300 dark:text-slate-700 mx-1">•</span>

                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                            <Clock size={12} className="text-slate-400" />
                            {event.time}
                        </div>
                    </div>

                    {event.ustadz && (
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                            {event.ustadz}
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default function EventsPage() {
    const [filterDate, setFilterDate] = useState('MONTH');
    const [filterCategory, setFilterCategory] = useState('ALL');

    // Dynamic Filter Label
    const now = new Date();
    const currentMonthYear = now.toLocaleString('id-ID', { month: 'long', year: 'numeric' });

    const getFilterLabel = () => {
        switch (filterDate) {
            case 'MONTH': return currentMonthYear;
            case 'WEEK': return 'Pekan Ini';
            case 'ALL': return 'Semua Agenda';
            default: return currentMonthYear;
        }
    };

    const filterEvents = (events: typeof MOCK_EVENTS) => {
        return events.filter(e => {
            // Category Filter
            if (filterCategory !== 'ALL' && e.category !== filterCategory) return false;

            // Date Filter
            const eventDate = new Date(e.date);
            eventDate.setHours(0, 0, 0, 0);

            const today = new Date(now);
            today.setHours(0, 0, 0, 0);

            if (filterDate === 'MONTH') {
                return eventDate.getMonth() === today.getMonth() && eventDate.getFullYear() === today.getFullYear();
            }
            if (filterDate === 'WEEK') {
                // Get start and end of current week (assuming Sunday start)
                const startOfWeek = new Date(today);
                startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday

                const endOfWeek = new Date(today);
                endOfWeek.setDate(today.getDate() + (6 - today.getDay())); // Saturday

                return eventDate >= startOfWeek && eventDate <= endOfWeek;
            }
            return true;
        });
    };

    const upcomingEvents = filterEvents(MOCK_EVENTS.filter(e => e.status === 'UPCOMING'))
        .sort((a, b) => a.date.getTime() - b.date.getTime());

    const pastEvents = filterEvents(MOCK_EVENTS.filter(e => e.status === 'DONE'))
        .sort((a, b) => b.date.getTime() - a.date.getTime());

    return (
        <div className="min-h-screen pb-24 relative overflow-hidden font-sans">
            {/* Deep Ambient Backgrounds (Shared with Finance) */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[128px] mix-blend-multiply dark:mix-blend-screen animate-blob" />
                <div className="absolute top-[40%] left-[-10%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[128px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000" />
                <div className="absolute bottom-[-10%] right-[20%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[128px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 transition-all">
                <div className="px-6 py-4 flex justify-between items-center">
                    {/* Left: Page Title */}
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Agenda</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{getFilterLabel()}</p>
                    </div>

                    {/* Right: Filters */}
                    <div className="flex gap-2">
                        {/* Date Filter */}
                        <FilterDropdown>
                            <FilterTrigger
                                icon={<Calendar size={18} />}
                                isActive={filterDate !== 'ALL'}
                                indicator={filterDate !== 'ALL' && <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />}
                            >
                                <FilterContent width="w-48">
                                    <h4 className="px-3 py-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider">Filter Waktu</h4>
                                    <FilterItem onClick={() => setFilterDate('ALL')} isSelected={filterDate === 'ALL'} icon={<Calendar size={14} />}>Semua Agenda</FilterItem>
                                    <FilterItem onClick={() => setFilterDate('MONTH')} isSelected={filterDate === 'MONTH'} icon={<Calendar size={14} />}>Bulan Ini</FilterItem>
                                    <FilterItem onClick={() => setFilterDate('WEEK')} isSelected={filterDate === 'WEEK'} icon={<Calendar size={14} />}>Pekan Ini</FilterItem>
                                </FilterContent>
                            </FilterTrigger>
                        </FilterDropdown>
                        <FilterDropdown>
                            <FilterTrigger
                                icon={<SlidersHorizontal size={18} />}
                                isActive={filterCategory !== 'ALL'}
                                indicator={filterCategory !== 'ALL' && <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />}
                            >
                                <FilterContent width="w-56">
                                    <FilterItem onClick={() => setFilterCategory('ALL')} isSelected={filterCategory === 'ALL'}>Semua Kategori</FilterItem>
                                    <FilterItem onClick={() => setFilterCategory('KAJIAN')} isSelected={filterCategory === 'KAJIAN'}>Kajian</FilterItem>
                                    <FilterItem onClick={() => setFilterCategory('RAPAT')} isSelected={filterCategory === 'RAPAT'}>Rapat</FilterItem>
                                    <FilterItem onClick={() => setFilterCategory('KEGIATAN')} isSelected={filterCategory === 'KEGIATAN'}>Kegiatan</FilterItem>
                                </FilterContent>
                            </FilterTrigger>
                        </FilterDropdown>
                    </div>
                </div>
            </header>

            <main className="px-4 pt-6 relative z-10 space-y-8">
                {/* Upcoming Section */}
                <motion.section
                    key={`upcoming-${filterDate}-${filterCategory}`}
                    variants={container}
                    initial="hidden"
                    animate="show"
                >
                    <div className="sticky top-[80px] z-30 mb-4 ml-1 flex items-center justify-between">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-full shadow-sm border border-white/20 dark:border-white/10">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                            <h2 className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                Akan Datang
                            </h2>
                            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[9px] font-black px-1.5 rounded-md">
                                {upcomingEvents.length}
                            </span>
                        </div>

                        {/* Add Button Moved Here */}
                        <Link href="/admin/events/new" className="group relative">
                            <div className="absolute inset-0 bg-blue-500 rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
                            <button className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-blue-500 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all">
                                <Plus size={16} strokeWidth={3} />
                            </button>
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {upcomingEvents.map(event => <EventCard key={event.id} event={event} />)}
                        {upcomingEvents.length === 0 && (
                            <div className="text-center py-10 opacity-60">
                                <p className="text-slate-400 italic text-sm">Belum ada agenda mendatang.</p>
                            </div>
                        )}
                    </div>
                </motion.section>

                {/* Past Section */}
                {pastEvents.length > 0 && (
                    <motion.section
                        key={`past-${filterDate}-${filterCategory}`}
                        variants={container}
                        initial="hidden"
                        animate="show"
                    >
                        <div className="sticky top-[80px] z-30 mb-4 ml-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100/60 dark:bg-slate-800/60 backdrop-blur-md rounded-full shadow-sm border border-white/20 dark:border-white/10 grayscale opacity-80">
                                <CheckCircle2 size={12} className="text-slate-500" />
                                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Selesai
                                </h2>
                            </div>
                        </div>

                        <div className="space-y-4 opacity-60 hover:opacity-100 transition-opacity duration-500">
                            {pastEvents.map(event => <EventCard key={event.id} event={event} />)}
                        </div>
                    </motion.section>
                )}
            </main>
        </div>
    );
}
