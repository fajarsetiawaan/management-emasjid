'use client';

import { useState } from 'react';
import { ArrowLeft, Calendar, Clock, MapPin, User, Save } from 'lucide-react';
import Link from 'next/link';

export default function NewEventPage() {
    const [formData, setFormData] = useState({
        title: '',
        date: new Date().toISOString().split('T')[0],
        time: '19:30',
        ustadz: '',
        category: 'KAJIAN',
        location: 'Masjid Utama'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Event Created:', formData);
        alert('Agenda berhasil dibuat! (Cek Console)');
        // In real app: router.push('/admin/events');
    };

    return (
        <div className="p-6">
            <Link href="/admin/dashboard" className="flex items-center gap-2 text-slate-500 mb-6 hover:text-emerald-600 transition-colors">
                <ArrowLeft size={20} />
                <span className="font-bold">Kembali</span>
            </Link>

            <div className="mb-6">
                <h1 className="text-xl font-bold text-slate-800">Buat Agenda Baru</h1>
                <p className="text-slate-500 text-sm">Jadwalkan kegiatan atau kajian masjid.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5">

                {/* Title */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Nama Kegiatan</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Contoh: Kajian Subuh Rutin"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        required
                    />
                </div>

                {/* Date & Time Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Tanggal</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="date"
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                                className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Jam</label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="time"
                                value={formData.time}
                                onChange={e => setFormData({ ...formData, time: e.target.value })}
                                className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Ustadz */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Pemateri / Ustadz</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            value={formData.ustadz}
                            onChange={e => setFormData({ ...formData, ustadz: e.target.value })}
                            placeholder="Nama Ustadz (Opsional)"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                {/* Category & Location */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Kategori</label>
                        <select
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-3 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        >
                            <option value="KAJIAN">Kajian</option>
                            <option value="RAPAT">Rapat DKM</option>
                            <option value="LAINNYA">Lainnya</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Lokasi</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                                className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
                >
                    <Save size={20} />
                    Simpan Agenda
                </button>

            </form>
        </div>
    );
}
