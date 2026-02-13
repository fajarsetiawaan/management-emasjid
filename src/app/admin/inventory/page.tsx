'use client';

import { MOCK_INVENTORY } from '@/lib/mock-data';
import { Package, Search, Plus } from 'lucide-react';

export default function InventoryPage() {
    const getConditionColor = (condition: string) => {
        switch (condition) {
            case 'GOOD': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'BROKEN': return 'bg-rose-50 text-rose-600 border-rose-100';
            case 'MAINTENANCE': return 'bg-orange-50 text-orange-600 border-orange-100';
            default: return 'bg-slate-50 text-slate-600';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-slate-800">Inventaris Masjid</h1>
                <button className="bg-emerald-600 text-white p-2 rounded-lg shadow-md hover:bg-emerald-700 transition-colors">
                    <Plus size={20} />
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                    type="text"
                    placeholder="Cari barang..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
            </div>

            {/* Inventory List */}
            <div className="space-y-3">
                {MOCK_INVENTORY.map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                <Package size={20} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-800">{item.name}</h3>
                                <p className="text-xs text-slate-500">{item.location}</p>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="text-sm font-bold text-slate-900 mb-1">{item.qty} Unit</div>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${getConditionColor(item.condition)}`}>
                                {item.condition}
                            </span>
                        </div>
                    </div>
                ))}

                {MOCK_INVENTORY.length === 0 && (
                    <div className="text-center py-12 text-slate-400 text-sm">
                        Belum ada data inventaris.
                    </div>
                )}
            </div>
        </div>
    );
}
