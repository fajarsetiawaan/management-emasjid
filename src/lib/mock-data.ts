/**
 * src/lib/mock-data.ts
 *
 * Centralized mock data for development & prototyping.
 * All mock constants are imported from here via lib/api.ts.
 *
 * ⚠️ UI components should NOT import this file directly.
 *    Use functions from '@/lib/api' instead.
 */

import type {
    Mosque,
    User,
    Transaction,
    Tenant,
    Event,
    Letter,
    Inventory,
    Donor,
    BankAccount,
    FAQ,
    LegalMenuItem,
    TeamMember,
} from '@/types';

// ─── Mosque ────────────────────────────────────────

export const MOCK_MOSQUES: Mosque[] = [
    {
        id: 'm1',
        name: 'Masjid Raya Bintaro',
        slug: 'masjid-raya-bintaro',
        address: 'Jl. Merpati Raya No. 1, Bintaro Jaya Sektor 1',
        city: 'Tangerang Selatan',
        latitude: -6.2088,
        longitude: 106.8456,
        balance: 15450000,
    },
    {
        id: 'm2',
        name: 'Masjid Raya Bogor',
        slug: 'masjid-raya-bogor',
        address: 'Jl. Pajajaran No. 10, Bogor Tengah',
        city: 'Bogor',
        latitude: -6.5971,
        longitude: 106.8060,
        balance: 25000000,
    },
    {
        id: 'm3',
        name: 'Masjid Istiqlal',
        slug: 'masjid-istiqlal',
        address: 'Jl. Taman Wijaya Kusuma, Jakarta Pusat',
        city: 'Jakarta',
        latitude: -6.1702,
        longitude: 106.8314,
        balance: 1500000000,
    }
];

export const MOCK_MOSQUE: Mosque = MOCK_MOSQUES[0];

// ─── User ──────────────────────────────────────────

export const MOCK_USER: User = {
    id: 'u1',
    name: 'H. Ahmad Dahlan',
    email: 'ahmad.dahlan@example.com',
    role: 'OWNER',
    mosqueId: 'm1',
    mosqueName: 'Masjid Raya Bintaro',
    plan: 'PREMIUM',
    preferences: {
        whatsapp: true,
        email: false,
        incoming: true,
        outgoing: true,
        schedule: false,
    }
};

// ─── Bank Accounts ─────────────────────────────────

export const MOCK_BANK_ACCOUNTS: BankAccount[] = [
    { id: '1', bankName: 'Mandiri', accountNumber: '1330015566778', holderName: 'Masjid Raya Bogor', color: 'bg-gradient-to-br from-blue-600 to-indigo-800' },
    { id: '2', bankName: 'BSI', accountNumber: '7788990011', holderName: 'Masjid Raya Bogor', color: 'bg-gradient-to-br from-emerald-500 to-teal-700' },
];

// ─── FAQ ───────────────────────────────────────────

export const MOCK_FAQS: FAQ[] = [
    {
        question: 'Bagaimana cara ganti password?',
        answer: 'Buka menu Keamanan > Ganti Password untuk memperbarui kata sandi Anda.'
    },
    {
        question: 'Lupa PIN Aplikasi?',
        answer: 'Hubungi Admin Ketua DKM untuk melakukan reset PIN keamanan Anda.'
    },
    {
        question: 'Cara export laporan PDF?',
        answer: 'Masuk ke menu Laporan pada dashboard, lalu klik ikon Download di pojok kanan atas.'
    }
];

// ─── Legal Menu ────────────────────────────────────

export const MOCK_LEGAL_MENU: LegalMenuItem[] = [
    { iconName: 'Sparkles', label: 'Apa yang baru?', href: '#', badge: 'v1.0.0' },
    { iconName: 'FileText', label: 'Syarat & Ketentuan', href: '#' },
    { iconName: 'ShieldCheck', label: 'Kebijakan Privasi', href: '#' },
    { iconName: 'Star', label: 'Beri Rating', href: '#', external: true },
];

// ─── Team Members ──────────────────────────────────

export const MOCK_TEAM_MEMBERS: TeamMember[] = [
    { id: 'u1', name: 'H. Ahmad Dahlan', email: 'ahmad.dahlan@example.com', role: 'ADMIN', status: 'ACTIVE', avatarColor: 'bg-indigo-500' },
    { id: 'u2', name: 'Ust. Yusuf Mansur', email: 'yusuf@example.com', role: 'SEKRETARIS', status: 'ACTIVE', avatarColor: 'bg-emerald-500' },
    { id: 'u3', name: 'Kang Emil', email: 'emil@example.com', role: 'BENDAHARA', status: 'ACTIVE', avatarColor: 'bg-blue-500' },
    { id: 'u4', name: 'Pak RT 05', email: 'rt05@example.com', role: 'MEMBER', status: 'PENDING', avatarColor: 'bg-orange-500' },
];

// ─── Transactions ──────────────────────────────────

export const MOCK_TRANSACTIONS: Transaction[] = [
    {
        id: 't1',
        amount: 2500000,
        type: 'INCOME',
        category: 'INFAQ_JUMAT',
        date: new Date('2024-02-09'),
        description: 'Kotak Amal Jumat Pekan 2',
        status: 'COMPLETED',
    },
    {
        id: 't2',
        amount: 1500000,
        type: 'EXPENSE',
        category: 'OPERASIONAL',
        date: new Date('2024-02-08'),
        description: 'Bayar Listrik & Air',
        status: 'COMPLETED',
    },
    {
        id: 't3',
        amount: 5000000,
        type: 'INCOME',
        category: 'ZAKAT_MAL',
        date: new Date('2024-02-07'),
        description: 'Hamba Allah',
        status: 'COMPLETED',
    },
    {
        id: 't4',
        amount: 750000,
        type: 'EXPENSE',
        category: 'HONOR_PETUGAS',
        date: new Date('2024-02-06'),
        description: 'Insentif Marbot',
        status: 'COMPLETED',
    },
    {
        id: 't5',
        amount: 300000,
        type: 'EXPENSE',
        category: 'OPERASIONAL',
        date: new Date('2024-02-05'),
        description: 'Beli Alat Kebersihan',
        status: 'COMPLETED',
    },
    {
        id: 't6',
        amount: 1200000,
        type: 'INCOME',
        category: 'INFAQ_JUMAT',
        date: new Date('2024-02-02'),
        description: 'Kotak Amal Jumat Pekan 1',
        status: 'COMPLETED',
    },
    {
        id: 't7',
        amount: 10000000,
        type: 'INCOME',
        category: 'WAKAF',
        date: new Date('2024-02-01'),
        description: 'Wakaf Tunai Pembangunan Menara',
        status: 'COMPLETED',
    },
    {
        id: 't8',
        amount: 5000000,
        type: 'EXPENSE',
        category: 'PEMBANGUNAN',
        date: new Date('2024-01-31'),
        description: 'DP Tukang',
        status: 'COMPLETED',
    },
    {
        id: 't9',
        amount: 200000,
        type: 'INCOME',
        category: 'DONASI',
        date: new Date('2024-01-30'),
        description: 'Sumbangan Nasi Box',
        status: 'COMPLETED',
    },
    {
        id: 't10',
        amount: 1500000,
        type: 'EXPENSE',
        category: 'SOSIAL_YATIM',
        date: new Date('2024-01-28'),
        description: 'Santunan Anak Yatim Bulanan',
        status: 'COMPLETED',
    },
    {
        id: 't11',
        amount: 450000,
        type: 'EXPENSE',
        category: 'OPERASIONAL',
        date: new Date('2024-01-27'),
        description: 'Service AC',
        status: 'COMPLETED',
    },
    {
        id: 't12',
        amount: 3200000,
        type: 'INCOME',
        category: 'INFAQ_JUMAT',
        date: new Date('2024-01-26'),
        description: 'Kotak Amal Jumat Pekan 4',
        status: 'COMPLETED',
    },
    {
        id: 't13',
        amount: 100000,
        type: 'INCOME',
        category: 'ZAKAT_FITRAH',
        date: new Date('2024-01-25'),
        description: 'Zakat Fitrah (Simulasi)',
        status: 'COMPLETED',
    },
    {
        id: 't14',
        amount: 2500000,
        type: 'EXPENSE',
        category: 'PEMBANGUNAN',
        date: new Date('2024-01-20'),
        description: 'Beli Semen 50 Sak',
        status: 'COMPLETED',
    },
    {
        id: 't15',
        amount: 500000,
        type: 'EXPENSE',
        category: 'HONOR_PETUGAS',
        date: new Date('2024-01-15'),
        description: 'Bonus Khotib',
        status: 'COMPLETED',
    },
];

// ─── Tenants (Super Admin) ─────────────────────────

export const MOCK_ALL_TENANTS: Tenant[] = [
    {
        id: 'tnt1',
        name: 'Masjid Raya Bogor',
        slug: 'masjid-raya-bogor',
        ownerEmail: 'budi@masjidraya.com',
        status: 'ACTIVE',
        subscriptionPlan: 'PRO',
        joinedAt: new Date('2023-01-15'),
    },
    {
        id: 'tnt2',
        name: 'Masjid Al-Ikhlas',
        slug: 'masjid-al-ikhlas',
        ownerEmail: 'admin@alikhlas.com',
        status: 'ACTIVE',
        subscriptionPlan: 'BASIC',
        joinedAt: new Date('2023-06-20'),
    },
    {
        id: 'tnt3',
        name: 'Musholla As-Salam',
        slug: 'musholla-as-salam',
        ownerEmail: 'dkmsalam@gmail.com',
        status: 'SUSPENDED',
        subscriptionPlan: 'BASIC',
        joinedAt: new Date('2023-08-10'),
    },
    {
        id: 'tnt4',
        name: 'Masjid Jami Attaqwa',
        slug: 'masjid-jami-attaqwa',
        ownerEmail: 'sekretariat@attaqwa.id',
        status: 'ACTIVE',
        subscriptionPlan: 'ENTERPRISE',
        joinedAt: new Date('2022-11-05'),
    },
    {
        id: 'tnt5',
        name: 'Masjid Nurul Huda',
        slug: 'masjid-nurul-huda',
        ownerEmail: 'takmir@nurulhuda.net',
        status: 'ACTIVE',
        subscriptionPlan: 'BASIC',
        joinedAt: new Date('2023-12-01'),
    },
];

// ─── Events ────────────────────────────────────────

export const MOCK_EVENTS: Event[] = [
    {
        id: 'e1',
        title: 'Kajian Subuh - Tafsir Al-Quran',
        ustadz: 'Ustadz Adi Hidayat',
        date: new Date('2024-02-10'),
        time: '04:30',
        category: 'KAJIAN',
        status: 'UPCOMING',
    },
    {
        id: 'e2',
        title: 'Rapat DKM Bulanan',
        date: new Date('2024-02-12'),
        time: '19:30',
        category: 'RAPAT',
        status: 'UPCOMING',
    },
    {
        id: 'e3',
        title: 'Kajian Dhuha',
        ustadz: 'Ustadz Abdul Somad',
        date: new Date('2024-02-04'),
        time: '08:00',
        category: 'KAJIAN',
        status: 'DONE',
    },
];

// ─── Letters ───────────────────────────────────────

export const MOCK_LETTERS: Letter[] = [
    {
        id: 'l1',
        refNumber: '001/DKM/II/2024',
        type: 'OUT',
        subject: 'Undangan Walikota Bogor',
        date: new Date('2024-02-01'),
        status: 'SENT',
    },
    {
        id: 'l2',
        refNumber: '002/DKM/SK/2024',
        type: 'OUT',
        subject: 'SK Pengangkatan Marbot',
        date: new Date('2024-02-05'),
        status: 'DRAFT',
    },
    {
        id: 'l3',
        refNumber: 'INV/050/2024',
        type: 'IN',
        subject: 'Penawaran Sound System',
        date: new Date('2024-02-08'),
        status: 'ARCHIVED',
    },
];

// ─── Inventory ─────────────────────────────────────

export const MOCK_INVENTORY: Inventory[] = [
    {
        id: 'i1',
        name: 'Karpet Sajadah Turkey',
        qty: 50,
        condition: 'GOOD',
        location: 'Ruang Utama',
    },
    {
        id: 'i2',
        name: 'Sound System TOA',
        qty: 4,
        condition: 'GOOD',
        location: 'Menara & Ruang Utama',
    },
    {
        id: 'i3',
        name: 'AC Split 2PK',
        qty: 8,
        condition: 'MAINTENANCE',
        location: 'Ruang Utama',
    },
    {
        id: 'i4',
        name: 'Vacuum Cleaner',
        qty: 2,
        condition: 'BROKEN',
        location: 'Gudang',
    },
];

// ─── Donors ────────────────────────────────────────

export const MOCK_DONORS: Donor[] = [
    { id: 'd1', name: 'H. Samsul Bahri', phone: '6281234567890', type: 'DONATUR_TETAP', lastDonation: '2024-02-01', totalDonated: 15000000 },
    { id: 'd2', name: 'Hj. Siti Aminah', phone: '6281298765432', type: 'DONATUR_TETAP', lastDonation: '2024-02-05', totalDonated: 8500000 },
    { id: 'd3', name: 'Pak Budi Santoso', phone: '6281345678901', type: 'JAMAAH_UMUM', lastDonation: '2024-01-20', totalDonated: 500000 },
    { id: 'd4', name: 'Mas Ari Wibowo', phone: '6285678901234', type: 'JAMAAH_UMUM', lastDonation: '2024-02-08', totalDonated: 250000 },
    { id: 'd5', name: 'Ibu Ratna Sari', phone: '628111222333', type: 'DONATUR_TETAP', lastDonation: '2024-02-02', totalDonated: 5000000 },
    { id: 'd6', name: 'Kang Dedi', phone: '6287788990011', type: 'JAMAAH_UMUM', lastDonation: '2023-12-30', totalDonated: 100000 },
    { id: 'd7', name: 'dr. Faisal', phone: '6281234567891', type: 'DONATUR_TETAP', lastDonation: '2024-02-07', totalDonated: 20000000 },
    { id: 'd8', name: 'Teh Rina', phone: '6289988776655', type: 'JAMAAH_UMUM', lastDonation: '2024-01-15', totalDonated: 150000 },
    { id: 'd9', name: 'Pak RT 05', phone: '6285544332211', type: 'JAMAAH_UMUM', lastDonation: '2024-01-25', totalDonated: 300000 },
    { id: 'd10', name: 'H. Abdullah', phone: '6281122334455', type: 'DONATUR_TETAP', lastDonation: '2024-02-06', totalDonated: 12000000 },
];
