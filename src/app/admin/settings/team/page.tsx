'use client';

import { MOCK_TEAM_MEMBERS } from '@/lib/mock-data';
import { TeamMember } from '@/types';
import { ArrowLeft, MoreVertical, Plus, UserPlus, Mail, Shield, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TeamPage() {
    const [activeTab, setActiveTab] = useState<'ACTIVE' | 'PENDING'>('ACTIVE');
    const [team, setTeam] = useState<TeamMember[]>(MOCK_TEAM_MEMBERS);
    const [isInviteOpen, setIsInviteOpen] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedMembers = localStorage.getItem('sim_team_members');
            if (savedMembers) {
                const parsed = JSON.parse(savedMembers);
                setTeam([...MOCK_TEAM_MEMBERS, ...parsed]);
            }
        }
    }, []);

    // Derived state
    const filteredTeam = team.filter(m => m.status === activeTab);

    // Mock Invite Handler
    const handleInvite = (e: React.FormEvent) => {
        e.preventDefault();
        setIsInviteOpen(false);
        alert('Undangan berhasil dikirim!');
        // logic to add pending member would go here
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'ADMIN': return 'bg-emerald-100 text-emerald-700';
            case 'SEKRETARIS': return 'bg-blue-100 text-blue-700';
            case 'BENDAHARA': return 'bg-amber-100 text-amber-700';
            case 'MARBOT': return 'bg-slate-100 text-slate-700';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-24 relative">
            {/* Header */}
            <header className="bg-white px-4 h-16 flex items-center gap-3 border-b border-slate-100 sticky top-0 z-50">
                <Link href="/admin/settings" className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-50 transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="font-bold text-slate-800 text-lg">Pengurus Masjid</h1>
            </header>

            {/* Tabs */}
            <div className="px-4 pt-4 pb-2">
                <div className="bg-slate-200 p-1 rounded-xl flex">
                    {['ACTIVE', 'PENDING'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === tab
                                ? 'bg-white text-slate-800 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {tab === 'ACTIVE' ? 'Aktif' : 'Menunggu'}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="px-4 py-2 space-y-3">
                <AnimatePresence mode="popLayout">
                    {filteredTeam.map((member) => (
                        <motion.div
                            key={member.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4"
                        >
                            {/* Avatar */}
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm ${member.avatarColor}`}>
                                {member.name.substring(0, 2).toUpperCase()}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <h3 className="font-bold text-slate-800 truncate">{member.name}</h3>
                                    {member.role === 'ADMIN' && <Shield size={12} className="text-emerald-500 fill-emerald-500" />}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getRoleBadgeColor(member.role)}`}>
                                        {member.role}
                                    </span>
                                    <span className="text-xs text-slate-400 truncate hidden xs:block">{member.email}</span>
                                </div>
                            </div>

                            {/* Action */}
                            <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
                                <MoreVertical size={18} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredTeam.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                            {activeTab === 'ACTIVE' ? <CheckCircle2 size={32} /> : <Clock size={32} />}
                        </div>
                        <p className="text-sm text-slate-400 font-medium">
                            {activeTab === 'ACTIVE' ? 'Belum ada pengurus lain.' : 'Tidak ada undangan pending.'}
                        </p>
                    </div>
                )}
            </div>

            {/* FAB */}
            <div className="fixed bottom-6 right-6 z-40">
                <button
                    onClick={() => setIsInviteOpen(true)}
                    className="w-14 h-14 bg-emerald-600 text-white rounded-full shadow-xl shadow-emerald-200 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                >
                    <UserPlus size={24} />
                </button>
            </div>

            {/* Invite Modal */}
            <AnimatePresence>
                {isInviteOpen && (
                    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setIsInviteOpen(false)}
                        />
                        <motion.div
                            initial={{ y: '100%', opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: '100%', opacity: 0 }}
                            className="bg-white w-full max-w-md sm:rounded-2xl rounded-t-3xl p-6 relative z-10 sm:m-4"
                        >
                            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 sm:hidden" />

                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">Undang Pengurus</h3>
                                    <p className="text-xs text-slate-400">Kirim undangan via email untuk bergabung.</p>
                                </div>
                            </div>

                            <form onSubmit={handleInvite} className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Penerima</label>
                                    <input id="email" name="email" type="email" required className="w-full px-4 py-3 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" placeholder="nama@email.com" />
                                </div>

                                <div>
                                    <label htmlFor="role" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Peran (Role)</label>
                                    <select id="role" name="role" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none">
                                        <option value="BENDAHARA">Bendahara</option>
                                        <option value="SEKRETARIS">Sekretaris</option>
                                        <option value="MARBOT">Marbot / Staff</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-95 transition-all mt-4"
                                >
                                    Kirim Undangan
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
