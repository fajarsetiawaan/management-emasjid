'use client';

import { useState } from 'react';
import { ArrowLeft, Calendar, Clock, MapPin, User, Save, Upload, Users } from 'lucide-react';
import Link from 'next/link';

export default function NewEventPage() {
    const [formData, setFormData] = useState({
        title: '',
        date: new Date().toISOString().split('T')[0],
        time: '19:30',
        ustadz: '',
        category: 'KAJIAN',
        location: 'Masjid Utama',
        attendees: ''
    });

    const [flyerFile, setFlyerFile] = useState<File | null>(null);

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

                {/* Category Selection (Segmented Control) */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Kategori</label>
                    <div className="flex bg-slate-100/80 p-1.5 rounded-xl gap-1 relative z-0">
                        {[
                            { id: 'KAJIAN', label: 'Kajian' },
                            { id: 'RAPAT', label: 'Rapat DKM' },
                            { id: 'LAINNYA', label: 'Lainnya' }
                        ].map((cat) => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => setFormData({ ...formData, category: cat.id })}
                                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 relative z-10 ${formData.category === cat.id
                                    ? 'bg-white text-blue-600 shadow-sm shadow-slate-200/50 ring-1 ring-slate-900/5'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

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

                {/* Ustadz (Hanya untuk Kajian) */}
                {formData.category === 'KAJIAN' && (
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
                )}

                {/* Lokasi */}
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

                {/* Optional Flyer (Hanya untuk Kajian) */}
                {formData.category === 'KAJIAN' && (
                    <div className="space-y-3">
                        <label className="block text-sm font-bold text-slate-700">Upload Flyer Kajian (Opsional)</label>
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                                {flyerFile ? (
                                    <>
                                        <div className="text-emerald-600 font-bold mb-1 truncate w-full max-w-[200px]">{flyerFile.name}</div>
                                        <p className="text-xs text-slate-500">Klik untuk mengganti gambar</p>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-8 h-8 text-slate-400 mb-2" />
                                        <p className="mb-1 text-sm text-slate-500 font-medium">
                                            <span className="text-emerald-600 font-bold">Klik untuk upload</span> gambar
                                        </p>
                                        <p className="text-xs text-slate-400">SVG, PNG, JPG (Max. 2MB)</p>
                                    </>
                                )}
                            </div>
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    setFlyerFile(e.target.files[0]);
                                }
                            }} />
                        </label>
                    </div>
                )}

                {/* Peserta Kehadiran (Hanya untuk Rapat) */}
                {formData.category === 'RAPAT' && (
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Target Peserta Rapat</label>
                        <div className="relative">
                            <Users className="absolute left-3 top-4 text-slate-400" size={18} />
                            <textarea
                                value={formData.attendees}
                                onChange={e => setFormData({ ...formData, attendees: e.target.value })}
                                placeholder="Contoh: Seluruh Pengurus DKM, Divisi Keamanan, dll."
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                rows={3}
                                required
                            />
                        </div>
                    </div>
                )}

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
