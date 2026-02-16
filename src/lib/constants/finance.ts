
import { Building2, HeartHandshake, Coins, ShieldCheck, Gift, Landmark, Briefcase, Calculator, Tent, Beef, GraduationCap } from 'lucide-react';

export const FUND_CATEGORIES = [
    {
        id: 'OPERASIONAL',
        label: 'Operasional Masjid',
        description: 'Dana untuk kebutuhan rutin dan operasional masjid.',
        color: 'emerald'
    },
    {
        id: 'ZAKAT',
        label: 'Zakat & Fidyah',
        description: 'Penerimaan dan penyaluran dana wajib zakat.',
        color: 'indigo'
    },
    {
        id: 'WAKAF',
        label: 'Wakaf',
        description: 'Dana abadi untuk aset dan pengembangan produktif.',
        color: 'blue'
    },
    {
        id: 'SOSIAL',
        label: 'Sosial & Kemanusiaan',
        description: 'Dana untuk santunan dan bantuan bencana.',
        color: 'rose'
    },
    {
        id: 'CUSTOM',
        label: 'Lainnya',
        description: 'Kategori dana tambahan.',
        color: 'slate'
    }
] as const;

export type FundCategoryType = typeof FUND_CATEGORIES[number]['id'];

import { Fund } from '@/types';

export const DEFAULT_FUNDS: Fund[] = [
    // --- OPERASIONAL ---
    {
        id: 'kas_masjid',
        name: 'Kas Operasional Masjid',
        type: 'OPERASIONAL',
        active: true,
        locked: true,
        icon: Building2,
        description: 'Dana utama operasional masjid.',
        balance: 0,
        allocation: { type: 'CASH' },
        color: 'emerald'
    },
    {
        id: 'infaq_jumat',
        name: 'Infaq Jumat',
        type: 'OPERASIONAL',
        active: false,
        locked: false,
        icon: Gift,
        description: 'Penerimaan kotak amal Jumat.',
        balance: 0,
        allocation: { type: 'CASH' },
        color: 'emerald'
    },
    {
        id: 'petty_cash',
        name: 'Petty Cash',
        type: 'OPERASIONAL',
        active: false,
        locked: false,
        icon: Calculator,
        description: 'Kas kecil untuk pengeluaran harian.',
        balance: 0,
        allocation: { type: 'CASH' },
        color: 'emerald'
    },
    {
        id: 'sedekah_umum',
        name: 'Sedekah Umum',
        type: 'OPERASIONAL',
        active: false,
        locked: false,
        icon: HeartHandshake,
        description: 'Sedekah sukarela dari jamaah.',
        balance: 0,
        allocation: { type: 'CASH' },
        color: 'emerald'
    },

    // --- ZAKAT ---
    {
        id: 'zakat_fitrah',
        name: 'Zakat Fitrah',
        type: 'ZAKAT',
        active: false,
        locked: false,
        icon: Coins,
        description: 'Kewajiban zakat Ramadhan.',
        balance: 0,
        allocation: { type: 'CASH' },
        color: 'indigo'
    },
    {
        id: 'zakat_maal',
        name: 'Zakat Maal',
        type: 'ZAKAT',
        active: false,
        locked: false,
        icon: ShieldCheck,
        description: 'Zakat harta (2.5%).',
        balance: 0,
        allocation: { type: 'CASH' },
        color: 'indigo'
    },
    {
        id: 'fidyah',
        name: 'Fidyah',
        type: 'ZAKAT',
        active: false,
        locked: false,
        icon: Beef, // Using Beef as placeholder for food/feeding
        description: 'Pengganti puasa bagi yang berhalangan.',
        balance: 0,
        allocation: { type: 'CASH' },
        color: 'indigo'
    },

    // --- WAKAF ---
    {
        id: 'wakaf_produktif',
        name: 'Wakaf Produktif',
        type: 'WAKAF',
        active: false,
        locked: false,
        icon: Briefcase,
        description: 'Wakaf yang dikelola untuk hasil usaha.',
        balance: 0,
        allocation: { type: 'CASH' },
        color: 'blue'
    },
    {
        id: 'wakaf_bangunan',
        name: 'Wakaf Bangunan/Aset',
        type: 'WAKAF',
        active: false,
        locked: false,
        icon: Landmark,
        description: 'Wakaf untuk fisik bangunan/tanah.',
        balance: 0,
        allocation: { type: 'CASH' },
        color: 'blue'
    },

    // --- SOSIAL ---
    {
        id: 'santunan_yatim',
        name: 'Santunan Yatim',
        type: 'SOSIAL',
        active: false,
        locked: false,
        icon: GraduationCap,
        description: 'Dana pendidikan & santunan yatim.',
        balance: 0,
        allocation: { type: 'CASH' },
        color: 'rose'
    },
    {
        id: 'qurban',
        name: 'Tabungan Qurban',
        type: 'SOSIAL',
        active: false,
        locked: false,
        icon: Beef,
        description: 'Penerimaan dana hewan qurban.',
        balance: 0,
        allocation: { type: 'CASH' },
        color: 'rose'
    },
    {
        id: 'bencana',
        name: 'Tanggap Bencana',
        type: 'SOSIAL',
        active: false,
        locked: false,
        icon: Tent,
        description: 'Bantuan kemanusiaan & bencana alam.',
        balance: 0,
        allocation: { type: 'CASH' },
        color: 'rose'
    }
];
