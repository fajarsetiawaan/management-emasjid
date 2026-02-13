'use client';

import { useState } from 'react';
import { MOCK_DONORS } from '@/lib/mock-data';
import { Search, Phone, User, ExternalLink } from 'lucide-react';

export default function DonorsPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredDonors = MOCK_DONORS.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-slate-800">Jamaah & Donatur</h1>
                <div className="text-xs text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-full">
                    {MOCK_DONORS.length} Orang
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                    type="text"
                    placeholder="Cari nama jamaah..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm transition-all"
                />
            </div>

            {/* Donors List */}
            <div className="space-y-3">
                {filteredDonors.map((donor) => (
                    <div key={donor.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {/* Avatar */}
                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200">
                                {getInitials(donor.name)}
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-slate-800">{donor.name}</h3>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase
                    ${donor.type === 'DONATUR_TETAP' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}
                  `}>
                                        {donor.type === 'DONATUR_TETAP' ? 'Tetap' : 'Umum'}
                                    </span>
                                    <p className="text-[10px] text-slate-400">
                                        Total: {formatRupiah(donor.totalDonated)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <a
                            href={`https://wa.me/${donor.phone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 hover:bg-green-100 transition-colors"
                        >
                            <Phone size={20} />
                        </a>
                    </div>
                ))}

                {filteredDonors.length === 0 && (
                    <div className="text-center py-12 text-slate-400 text-sm">
                        Tidak ditemukan nama "{searchTerm}".
                    </div>
                )}
            </div>
        </div>
    );
}
