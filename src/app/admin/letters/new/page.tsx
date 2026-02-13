'use client';

import { useState } from 'react';
import { ArrowLeft, FileText, Calendar, Building2, User, Save, ArrowRight, ArrowLeft as ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';

export default function NewLetterPage() {
    const [type, setType] = useState<'IN' | 'OUT'>('IN');
    const [formData, setFormData] = useState({
        refNumber: '',
        date: new Date().toISOString().split('T')[0],
        subject: '',
        sender: '', // For IN: Pengirim, For OUT: Tujuan
        description: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Letter Created:', { type, ...formData });
        alert('Surat berhasil dicatat! (Cek Console)');
        // In real app: router.push('/admin/letters');
    };

    return (
        <div className="p-6">
            <Link href="/admin/dashboard" className="flex items-center gap-2 text-slate-500 mb-6 hover:text-orange-600 transition-colors">
                <ArrowLeft size={20} />
                <span className="font-bold">Kembali</span>
            </Link>

            <div className="mb-6">
                <h1 className="text-xl font-bold text-slate-800">Catat Surat</h1>
                <p className="text-slate-500 text-sm">Administrasi surat masuk dan keluar.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Type Switcher */}
                <div className="grid grid-cols-2 border-b border-slate-100">
                    <button
                        type="button"
                        onClick={() => setType('IN')}
                        className={`p-4 flex items-center justify-center gap-2 font-bold transition-colors ${type === 'IN' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:bg-slate-50'}`}
                    >
                        <ArrowRight size={18} />
                        Surat Masuk
                    </button>
                    <button
                        type="button"
                        onClick={() => setType('OUT')}
                        className={`p-4 flex items-center justify-center gap-2 font-bold transition-colors ${type === 'OUT' ? 'bg-orange-50 text-orange-600 border-b-2 border-orange-600' : 'text-slate-400 hover:bg-slate-50'}`}
                    >
                        <ArrowLeftIcon size={18} />
                        Surat Keluar
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Ref Number */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Nomor Surat</label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                value={formData.refNumber}
                                onChange={e => setFormData({ ...formData, refNumber: e.target.value })}
                                placeholder={type === 'IN' ? "Nomor surat dari pengirim" : "Nomor urut keluar (Auto)"}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none"
                                required
                            />
                        </div>
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Tanggal Surat</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="date"
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                                className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none"
                                required
                            />
                        </div>
                    </div>

                    {/* Subject */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Perihal / Judul</label>
                        <input
                            type="text"
                            value={formData.subject}
                            onChange={e => setFormData({ ...formData, subject: e.target.value })}
                            placeholder="Contoh: Undangan Rapat Koordinasi"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none"
                            required
                        />
                    </div>

                    {/* Sender / Recipient */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            {type === 'IN' ? 'Pengirim / Instansi Asal' : 'Tujuan / Penerima'}
                        </label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                value={formData.sender}
                                onChange={e => setFormData({ ...formData, sender: e.target.value })}
                                placeholder={type === 'IN' ? "Nama Instansi / Pengirim" : "Nama Instansi / Perorangan"}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none"
                                required
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Ringkasan Isi (Disposisi)</label>
                        <textarea
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Catatan ringkas atau instruksi disposisi..."
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className={`w-full font-bold py-4 rounded-xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 text-white
                    ${type === 'IN' ? 'bg-blue-600 shadow-blue-200 hover:bg-blue-700' : 'bg-orange-600 shadow-orange-200 hover:bg-orange-700'}
                `}
                    >
                        <Save size={20} />
                        Simpan Surat {type === 'IN' ? 'Masuk' : 'Keluar'}
                    </button>
                </form>
            </div>
        </div>
    );
}
