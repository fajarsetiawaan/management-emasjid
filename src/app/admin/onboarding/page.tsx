'use client';

import SetupWizard from '@/components/dashboard/SetupWizard';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function OnboardingPage() {
    return (
        <div className="bg-slate-50 min-h-screen p-6">
            <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                    <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium text-sm mb-4">
                        <ArrowLeft size={16} /> Kembali ke Dashboard
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">Setup Masjid</h1>
                    <p className="text-slate-500">Lengkapi data masjid Anda untuk mengaktifkan semua fitur.</p>
                </div>

                <SetupWizard />
            </div>
        </div>
    );
}
