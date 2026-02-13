'use client';

import { MOCK_EVENTS } from '@/lib/mock-data';
import { Calendar, Clock, MapPin, CheckCircle2, Plus } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function EventsPage() {
    const upcomingEvents = MOCK_EVENTS.filter(e => e.status === 'UPCOMING')
        .sort((a, b) => a.date.getTime() - b.date.getTime());

    const pastEvents = MOCK_EVENTS.filter(e => e.status === 'DONE')
        .sort((a, b) => b.date.getTime() - a.date.getTime());

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, x: -10 },
        show: { opacity: 1, x: 0 }
    };

    const EventCard = ({ event }: { event: (typeof MOCK_EVENTS)[0] }) => (
        <motion.div variants={item} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-4 group active:scale-[0.99] transition-transform">
            {/* Date Box */}
            <div className={`
        w-16 flex-shrink-0 flex flex-col items-center justify-center rounded-xl border transition-colors
        ${event.status === 'UPCOMING'
                    ? 'bg-blue-50 border-blue-100 text-blue-600 group-hover:bg-blue-100'
                    : 'bg-slate-50 border-slate-100 text-slate-400'
                }
      `}>
                <span className="text-[10px] font-bold uppercase tracking-wider">{event.date.toLocaleString('default', { month: 'short' })}</span>
                <span className="text-2xl font-bold leading-none">{event.date.getDate()}</span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 py-0.5">
                <div className="flex items-start justify-between">
                    <h3 className={`font-bold truncate text-base ${event.status === 'DONE' ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                        {event.title}
                    </h3>
                </div>

                <div className="flex items-center gap-2 mt-1 mb-2">
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide
                        ${event.category === 'KAJIAN' ? 'bg-purple-50 text-purple-600' : 'bg-orange-50 text-orange-600'}
                    `}>
                        {event.category}
                    </span>
                    <span className="text-xs text-slate-500 truncate font-medium">{event.ustadz || 'Agenda Internal'}</span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-0.5 rounded-md">
                        <Clock size={12} />
                        <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <MapPin size={12} />
                        <span>Masjid Utama</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="space-y-8 p-1">
            <div className="flex items-center justify-between px-1">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Agenda</h1>
                    <p className="text-slate-500 text-xs font-medium">Jadwal kegiatan masjid</p>
                </div>
                <Link href="/admin/events/new" className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-105 transition-all">
                    <Plus size={20} />
                </Link>
            </div>

            {/* Upcoming Section */}
            <motion.div variants={container} initial="hidden" animate="show">
                <h2 className="text-xs font-bold text-slate-400 mb-3 px-1 flex items-center gap-2 uppercase tracking-wider">
                    <Calendar size={14} />
                    Akan Datang ({upcomingEvents.length})
                </h2>
                <div className="space-y-4">
                    {upcomingEvents.map(event => <EventCard key={event.id} event={event} />)}
                    {upcomingEvents.length === 0 && <p className="text-slate-400 text-sm italic px-1">Tidak ada agenda mendatang.</p>}
                </div>
            </motion.div>

            {/* Past Section */}
            {pastEvents.length > 0 && (
                <motion.div variants={container} initial="hidden" animate="show">
                    <h2 className="text-xs font-bold text-slate-400 mb-3 px-1 flex items-center gap-2 uppercase tracking-wider">
                        <CheckCircle2 size={14} />
                        Selesai
                    </h2>
                    <div className="space-y-4 opacity-70 hover:opacity-100 transition-opacity duration-300">
                        {pastEvents.map(event => <EventCard key={event.id} event={event} />)}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
