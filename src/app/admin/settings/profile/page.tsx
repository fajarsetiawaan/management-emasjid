'use client';

import { MOCK_MOSQUE } from '@/lib/mock-data';
import { ArrowLeft, Camera, MapPin, Save } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function EditProfilePage() {
    const [isLoading, setIsLoading] = useState(false);
    const [logoUrl, setLogoUrl] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedLogo = localStorage.getItem('sim_logo_url');
            if (savedLogo) setLogoUrl(savedLogo);
        }
    }, []);

    const handleSave = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            alert('Profil berhasil diperbarui!');
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            {/* Header */}
            <header className="bg-white px-4 h-16 flex items-center justify-between border-b border-slate-100 sticky top-0 z-50">
                <Link href="/admin/settings" className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-500 hover:text-slate-800">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="font-bold text-slate-800">Edit Profil</h1>
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="text-sm font-bold text-emerald-600 hover:text-emerald-700 disabled:opacity-50"
                >
                    {isLoading ? 'Menyimpan...' : 'Simpan'}
                </button>
            </header>

            {/* Cover Image */}
            <div className="relative w-full aspect-video bg-slate-200 group cursor-pointer overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-sm">
                        <Camera size={14} /> Ganti Sampul
                    </div>
                </div>
                {/* Placeholder for Cover */}
                <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium bg-slate-200">
                    Placeholder Sampul (16:9)
                </div>
            </div>

            {/* Avatar & Basic Info */}
            <div className="px-5 -mt-10 relative z-10 mb-6">
                <div className="relative inline-block">
                    <div className="w-24 h-24 rounded-full bg-slate-200 border-4 border-white shadow-md overflow-hidden flex items-center justify-center text-slate-400 relative">
                        {logoUrl ? (
                            <img src={logoUrl} alt="Logo Masjid" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-2xs font-bold">LOGO</span>
                        )}
                    </div>
                    <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center border-2 border-white shadow-sm hover:bg-emerald-700 transition-colors">
                        <Camera size={14} />
                    </button>
                </div>
            </div>

            {/* Form Fields */}
            <div className="px-5 space-y-6">

                {/* Identity Group */}
                <section className="space-y-4">
                    <div>
                        <label htmlFor="mosqueName" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nama Masjid <span className="text-rose-500">*</span></label>
                        <input
                            id="mosqueName"
                            name="mosqueName"
                            type="text"
                            defaultValue={MOCK_MOSQUE.name}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold text-slate-800"
                            placeholder="Contoh: Masjid Raya Bintaro"
                        />
                    </div>

                    <div>
                        <label htmlFor="slug" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Slug URL Public</label>
                        <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                            <span className="px-4 py-3 text-slate-400 bg-slate-100 border-r border-slate-200 text-sm font-medium">app.com/m/</span>
                            <input
                                id="slug"
                                name="slug"
                                type="text"
                                defaultValue={MOCK_MOSQUE.slug}
                                disabled
                                className="flex-1 px-4 py-3 bg-transparent text-slate-500 font-medium text-sm focus:outline-none"
                            />
                            <button className="px-4 text-xs font-bold text-emerald-600 hover:bg-emerald-50 transition-colors">
                                Copy
                            </button>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1.5 ml-1">Hubungi admin untuk mengubah permalink ini.</p>
                    </div>

                    <div>
                        <label htmlFor="establishedYear" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tahun Berdiri</label>
                        <input
                            id="establishedYear"
                            name="establishedYear"
                            type="number"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-800"
                            placeholder="Contoh: 1998"
                        />
                    </div>
                </section>

                <hr className="border-slate-100" />

                {/* Location Group */}
                <section className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <MapPin size={18} className="text-emerald-600" />
                        Lokasi & Peta
                    </h3>

                    <div>
                        <label htmlFor="address" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Alamat Lengkap</label>
                        <textarea
                            id="address"
                            name="address"
                            defaultValue={MOCK_MOSQUE.address}
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-800 resize-none"
                            placeholder="Jalan, Nomor, RT/RW, Kelurahan..."
                        />
                    </div>

                    <div>
                        <label htmlFor="city" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Kota / Kabupaten</label>
                        <select
                            id="city"
                            name="city"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-800 appearance-none"
                        >
                            <option>Kota Bogor</option>
                            <option>Kab. Bogor</option>
                            <option>DKI Jakarta</option>
                            <option>Depok</option>
                        </select>
                    </div>

                    {/* Map Picker Placeholder */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Titik Peta</label>
                        <div className="w-full aspect-video bg-emerald-50 rounded-xl border-2 border-dashed border-emerald-200 flex flex-col items-center justify-center gap-3 relative overflow-hidden group hover:border-emerald-400 transition-colors cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm animate-bounce">
                                <MapPin size={20} fill="currentColor" />
                            </div>
                            <span className="text-xs font-bold text-emerald-700">Atur Lokasi di Peta</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-3">
                            <div>
                                <label htmlFor="latitude" className="block text-[10px] font-bold text-slate-400 mb-1">Latitude</label>
                                <input id="latitude" name="latitude" type="text" disabled defaultValue="-6.5971469" className="w-full px-3 py-2 bg-slate-50 rounded-lg text-xs font-mono text-slate-600 border border-slate-200" />
                            </div>
                            <div>
                                <label htmlFor="longitude" className="block text-[10px] font-bold text-slate-400 mb-1">Longitude</label>
                                <input id="longitude" name="longitude" type="text" disabled defaultValue="106.8060388" className="w-full px-3 py-2 bg-slate-50 rounded-lg text-xs font-mono text-slate-600 border border-slate-200" />
                            </div>
                        </div>
                    </div>
                </section>

                <div className="h-4"></div>
            </div>
        </div>
    );
}
