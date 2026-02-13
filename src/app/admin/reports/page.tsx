'use client';

import { useState } from 'react';
import { MOCK_TRANSACTIONS, MOCK_MOSQUE } from '@/lib/mock-data';
import { Download, ChevronLeft, ChevronRight, PieChart, TrendingUp, Wallet, ShieldCheck } from 'lucide-react';

export default function ReportsPage() {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    // Filter Transactions for Selected Month
    const monthlyTransactions = MOCK_TRANSACTIONS.filter(t => {
        return t.date.getMonth() === currentMonth && t.date.getFullYear() === currentYear;
    });

    const income = monthlyTransactions.filter(t => t.type === 'INCOME').reduce((a, b) => a + b.amount, 0);
    const expense = monthlyTransactions.filter(t => t.type === 'EXPENSE').reduce((a, b) => a + b.amount, 0);

    // Fund Separation Logic (Mock Percentage)
    // In real app, this would be summed from categories like ZAKAT vs INFAQ
    const restrictedBalance = MOCK_MOSQUE.balance * 0.3; // 30% Zakat/Yatim
    const operationalBalance = MOCK_MOSQUE.balance * 0.7; // 70% Operasional

    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-slate-800">Laporan Keuangan</h1>
            </div>

            {/* Month Filter */}
            <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600">
                    <ChevronLeft size={20} />
                </button>
                <span className="font-bold text-slate-800">
                    {months[currentMonth]} {currentYear}
                </span>
                <button onClick={handleNextMonth} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600">
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* Arus Kas Chart (Visual CSS) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="flex items-center gap-2 mb-6">
                    <TrendingUp size={18} className="text-emerald-600" />
                    <h2 className="font-bold text-slate-800">Arus Kas Bulanan</h2>
                </div>

                <div className="flex items-end gap-4 h-40">
                    {/* Income Bar */}
                    <div className="flex-1 flex flex-col justify-end items-center gap-2 group cursor-pointer">
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity absolute top-16">
                            {formatRupiah(income)}
                        </span>
                        <div
                            className="w-full bg-emerald-500 rounded-t-xl hover:bg-emerald-600 transition-all relative"
                            style={{ height: `${(income / (income + expense || 1)) * 100}%`, minHeight: '10%' }}
                        ></div>
                        <span className="text-xs font-medium text-slate-500">Masuk</span>
                    </div>

                    {/* Expense Bar */}
                    <div className="flex-1 flex flex-col justify-end items-center gap-2 group cursor-pointer">
                        <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity absolute top-16">
                            {formatRupiah(expense)}
                        </span>
                        <div
                            className="w-full bg-rose-500 rounded-t-xl hover:bg-rose-600 transition-all relative"
                            style={{ height: `${(expense / (income + expense || 1)) * 100}%`, minHeight: '10%' }}
                        ></div>
                        <span className="text-xs font-medium text-slate-500">Keluar</span>
                    </div>
                </div>
            </div>

            {/* Rincian Saldo (Fund Separation) */}
            <div className="space-y-3">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <PieChart size={18} className="text-slate-500" />
                    Posisi Saldo
                </h3>

                {/* Operational */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-5 rounded-2xl text-white shadow-lg shadow-blue-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <Wallet size={20} />
                        </div>
                        <span className="text-sm font-medium text-blue-50">Dana Operasional</span>
                    </div>
                    <p className="text-sm text-blue-100 mb-1">Bebas digunakan untuk kegiatan</p>
                    <p className="text-2xl font-bold">{formatRupiah(operationalBalance)}</p>
                </div>

                {/* Restricted */}
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-5 rounded-2xl text-white shadow-lg shadow-amber-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <ShieldCheck size={20} />
                        </div>
                        <span className="text-sm font-medium text-amber-50">Dana Terikat (Zakat/Yatim)</span>
                    </div>
                    <p className="text-sm text-amber-100 mb-1">Hanya untuk asnaf/mustahik</p>
                    <p className="text-2xl font-bold">{formatRupiah(restrictedBalance)}</p>
                </div>
            </div>

            {/* Export Button */}
            <div className="pt-4">
                <button className="w-full bg-slate-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-900 active:scale-[0.98] transition-all shadow-xl">
                    <Download size={20} />
                    Download Laporan PDF
                </button>
                <p className="text-center text-xs text-slate-400 mt-3">
                    Format PDF mencakup rincian transaksi dan posisi saldo akhir bulan {months[currentMonth]}.
                </p>
            </div>
        </div>
    );
}
