/**
 * src/lib/mock-data.ts
 *
 * Centralized mock data for development & prototyping.
 * Implements 2D Fund Accounting:
 * Total Assets (Physical) == Total Programs (Logical)
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
    AssetAccount,
    Program,
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
        balance: 47500000, // = sum of all asset accounts
        establishedYear: 1998,
        jamaahCount: 500,
        verificationStatus: 'verified',
        activeSince: 'Jan 2025',
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
        establishedYear: 2005,
        jamaahCount: 800,
        verificationStatus: 'verified',
        activeSince: 'Feb 2025',
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
        establishedYear: 1978,
        jamaahCount: 5000,
        verificationStatus: 'verified',
        activeSince: 'Jan 2025',
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
    setup_completed: true, // true = skip onboarding, false = force onboarding
    preferences: {
        whatsapp: true,
        email: false,
        incoming: true,
        outgoing: true,
        schedule: false,
    }
};

// ─── 2D Accounting: Dimension 1 (Assets / Physical) ─

export const MOCK_ASSET_ACCOUNTS: AssetAccount[] = [
    {
        id: 'asset_cash',
        name: 'Kas Tunai',
        type: 'CASH',
        balance: 7500000,
        description: 'Uang tunai di brankas masjid',
        color: 'emerald',
    },
    {
        id: 'asset_bsi',
        name: 'Bank BSI',
        type: 'BANK',
        balance: 25000000,
        accountNumber: '7788990011',
        description: 'A.n Masjid Raya Bintaro',
        color: 'cyan',
    },
    {
        id: 'asset_bca',
        name: 'Bank BCA',
        type: 'BANK',
        balance: 15000000,
        accountNumber: '1234567890',
        description: 'A.n H. Ahmad Dahlan',
        color: 'blue',
    },
];

// Legacy support for UI components still using BankAccount
export const MOCK_BANK_ACCOUNTS: BankAccount[] = MOCK_ASSET_ACCOUNTS
    .filter(a => a.type === 'BANK')
    .map(a => ({
        id: a.id,
        bankName: a.name,
        accountNumber: a.accountNumber || '',
        holderName: MOCK_MOSQUE.name,
        color: 'bg-gradient-to-br from-emerald-500 to-teal-700',
    }));

// ─── 2D Accounting: Dimension 2 (Programs / Logical) ─

export const MOCK_PROGRAMS: Program[] = [
    {
        id: 'kas_masjid',
        name: 'Kas Masjid (Operasional)',
        type: 'UNRESTRICTED',
        balance: 22500000,
        description: 'Biaya listrik, air, kebersihan, dan admin',
        color: 'blue',
    },
    {
        id: 'kas_yatim',
        name: 'Kas Santunan Yatim',
        type: 'RESTRICTED',
        balance: 10000000,
        description: 'Dana khusus untuk anak yatim & dhuafa',
        color: 'amber',
    },
    {
        id: 'kas_infaq',
        name: 'Kas Infaq & Sedekah',
        type: 'RESTRICTED',
        balance: 8000000,
        description: 'Dana infaq dan sedekah umum',
        color: 'emerald',
    },
    {
        id: 'kas_zakat_maal',
        name: 'Kas Zakat Maal',
        type: 'RESTRICTED',
        balance: 5000000,
        description: 'Dana zakat harta (2.5%)',
        color: 'purple',
    },
    {
        id: 'kas_zakat_fitrah',
        name: 'Kas Zakat Fitrah',
        type: 'RESTRICTED',
        balance: 1000000,
        description: 'Dana zakat fitrah Ramadhan',
        color: 'indigo',
    },
    {
        id: 'kas_wakaf',
        name: 'Kas Wakaf',
        type: 'RESTRICTED',
        balance: 1000000,
        description: 'Dana wakaf untuk pembangunan & aset masjid',
        color: 'rose',
    },
];
// ^ Sum = 47.5jt = match mosque.balance & sum of assets

// ─── Transactions (Linked to Asset & Program) ──────

export const MOCK_TRANSACTIONS: Transaction[] = [
    // ── Februari 2026 ──
    {
        id: 't1',
        date: new Date('2026-02-14'),
        amount: 3200000,
        type: 'INCOME',
        accountId: 'asset_cash',
        programId: 'kas_masjid',
        category: 'INFAQ_JUMAT',
        description: 'Kotak Amal Jumat Pekan 2',
        status: 'COMPLETED',
    },
    {
        id: 't2',
        date: new Date('2026-02-13'),
        amount: 1850000,
        type: 'EXPENSE',
        accountId: 'asset_bsi',
        programId: 'kas_masjid',
        category: 'OPERASIONAL',
        description: 'Bayar Listrik & Air bulan Februari',
        status: 'COMPLETED',
    },
    {
        id: 't3',
        date: new Date('2026-02-12'),
        amount: 5000000,
        type: 'INCOME',
        accountId: 'asset_bsi',
        programId: 'kas_yatim',
        category: 'ZAKAT_MAL',
        description: 'Hamba Allah - Zakat Mal',
        status: 'COMPLETED',
    },
    {
        id: 't4',
        date: new Date('2026-02-11'),
        amount: 750000,
        type: 'EXPENSE',
        accountId: 'asset_cash',
        programId: 'kas_masjid',
        category: 'HONOR_PETUGAS',
        description: 'Insentif Marbot Mingguan',
        status: 'COMPLETED',
    },
    {
        id: 't5',
        date: new Date('2026-02-10'),
        amount: 2500000,
        type: 'INCOME',
        accountId: 'asset_cash',
        programId: 'kas_infaq',
        category: 'INFAQ_UMUM',
        description: 'Infaq dr. Faisal',
        status: 'COMPLETED',
    },
    {
        id: 't6',
        date: new Date('2026-02-09'),
        amount: 350000,
        type: 'EXPENSE',
        accountId: 'asset_cash',
        programId: 'kas_masjid',
        category: 'OPERASIONAL',
        description: 'Beli Alat Kebersihan & Pewangi',
        status: 'COMPLETED',
    },
    {
        id: 't7',
        date: new Date('2026-02-07'),
        amount: 2800000,
        type: 'INCOME',
        accountId: 'asset_cash',
        programId: 'kas_masjid',
        category: 'INFAQ_JUMAT',
        description: 'Kotak Amal Jumat Pekan 1',
        status: 'COMPLETED',
    },
    {
        id: 't8',
        date: new Date('2026-02-06'),
        amount: 10000000,
        type: 'INCOME',
        accountId: 'asset_bca',
        programId: 'kas_pembangunan',
        category: 'WAKAF',
        description: 'Wakaf H. Abdullah utk Pembangunan Menara',
        status: 'COMPLETED',
    },
    {
        id: 't9',
        date: new Date('2026-02-05'),
        amount: 1500000,
        type: 'EXPENSE',
        accountId: 'asset_bsi',
        programId: 'kas_yatim',
        category: 'SANTUNAN',
        description: 'Santunan 5 Anak Yatim Pekan 1',
        status: 'COMPLETED',
    },
    {
        id: 't10',
        date: new Date('2026-02-04'),
        amount: 500000,
        type: 'INCOME',
        accountId: 'asset_cash',
        programId: 'kas_infaq',
        category: 'INFAQ_UMUM',
        description: 'Ibu Ratna - Infaq Makan Marbot',
        status: 'COMPLETED',
    },
    // ── Januari 2026 ──
    {
        id: 't11',
        date: new Date('2026-01-31'),
        amount: 2700000,
        type: 'INCOME',
        accountId: 'asset_cash',
        programId: 'kas_masjid',
        category: 'INFAQ_JUMAT',
        description: 'Kotak Amal Jumat Pekan 4',
        status: 'COMPLETED',
    },
    {
        id: 't12',
        date: new Date('2026-01-28'),
        amount: 2100000,
        type: 'EXPENSE',
        accountId: 'asset_bsi',
        programId: 'kas_masjid',
        category: 'OPERASIONAL',
        description: 'Bayar Listrik & Air bulan Januari',
        status: 'COMPLETED',
    },
    {
        id: 't13',
        date: new Date('2026-01-25'),
        amount: 3500000,
        type: 'INCOME',
        accountId: 'asset_bsi',
        programId: 'kas_zakat_maal',
        category: 'ZAKAT_MAL',
        description: 'Pak Budi Santoso - Zakat Maal',
        status: 'COMPLETED',
    },
    {
        id: 't14',
        date: new Date('2026-01-20'),
        amount: 8000000,
        type: 'EXPENSE',
        accountId: 'asset_bca',
        programId: 'kas_pembangunan',
        category: 'PEMBANGUNAN',
        description: 'DP Material Fondasi Menara',
        status: 'COMPLETED',
    },
    {
        id: 't15',
        date: new Date('2026-01-15'),
        amount: 1500000,
        type: 'INCOME',
        accountId: 'asset_cash',
        programId: 'kas_infaq',
        category: 'INFAQ_UMUM',
        description: 'H. Samsul Bahri - Infaq Bulanan',
        status: 'COMPLETED',
    },
    {
        id: 't16',
        date: new Date('2026-01-10'),
        amount: 750000,
        type: 'EXPENSE',
        accountId: 'asset_cash',
        programId: 'kas_masjid',
        category: 'HONOR_PETUGAS',
        description: 'Insentif Marbot Mingguan',
        status: 'COMPLETED',
    },
    {
        id: 't17',
        date: new Date('2026-01-05'),
        amount: 2000000,
        type: 'INCOME',
        accountId: 'asset_cash',
        programId: 'kas_masjid',
        category: 'INFAQ_JUMAT',
        description: 'Kotak Amal Jumat Pekan 1',
        status: 'COMPLETED',
    },
    {
        id: 't18',
        date: new Date('2026-01-03'),
        amount: 350000,
        type: 'EXPENSE',
        accountId: 'asset_cash',
        programId: 'kas_masjid',
        category: 'OPERASIONAL',
        description: 'Isi Ulang Galon & Kopi Tamu',
        status: 'COMPLETED',
    },
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
    },
    {
        question: 'Bagaimana cara menambah anggota Tim?',
        answer: 'Buka menu Pengaturan > Tim > Undang Anggota. Masukkan email dan pilih peran yang sesuai.'
    },
    {
        question: 'Apakah data saya aman?',
        answer: 'Ya, semua data dienkripsi end-to-end dan disimpan di server dengan sertifikasi ISO 27001.'
    },
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
        date: new Date('2026-02-20'),
        time: '04:30',
        category: 'KAJIAN',
        status: 'UPCOMING',
    },
    {
        id: 'e2',
        title: 'Rapat DKM Bulanan',
        date: new Date('2026-02-18'),
        time: '19:30',
        category: 'RAPAT',
        status: 'UPCOMING',
    },
    {
        id: 'e3',
        title: 'Kajian Dhuha - Fiqih Muamalah',
        ustadz: 'Ustadz Abdul Somad',
        date: new Date('2026-02-10'),
        time: '08:00',
        category: 'KAJIAN',
        status: 'DONE',
    },
    {
        id: 'e4',
        title: 'Bersih-Bersih Masjid',
        date: new Date('2026-02-22'),
        time: '06:00',
        category: 'KEGIATAN',
        status: 'UPCOMING',
    },
    {
        id: 'e5',
        title: 'Santunan Yatim Bulanan',
        date: new Date('2026-02-25'),
        time: '10:00',
        category: 'KEGIATAN',
        status: 'UPCOMING',
    },
];

// ─── Letters ───────────────────────────────────────

export const MOCK_LETTERS: Letter[] = [
    {
        id: 'l1',
        refNumber: '001/DKM/II/2026',
        type: 'OUT',
        subject: 'Undangan Walikota Tangerang Selatan',
        date: new Date('2026-02-01'),
        status: 'SENT',
    },
    {
        id: 'l2',
        refNumber: '002/DKM/SK/2026',
        type: 'OUT',
        subject: 'SK Pengangkatan Marbot Baru',
        date: new Date('2026-02-05'),
        status: 'DRAFT',
    },
    {
        id: 'l3',
        refNumber: 'INV/050/2026',
        type: 'IN',
        subject: 'Penawaran Sound System TOA',
        date: new Date('2026-02-08'),
        status: 'ARCHIVED',
    },
    {
        id: 'l4',
        refNumber: '003/DKM/LPJ/2026',
        type: 'OUT',
        subject: 'Laporan Pertanggungjawaban Kas Jan 2026',
        date: new Date('2026-02-10'),
        status: 'SENT',
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
        name: 'Sound System TOA ZS-1030',
        qty: 4,
        condition: 'GOOD',
        location: 'Menara & Ruang Utama',
    },
    {
        id: 'i3',
        name: 'AC Split Daikin 2PK',
        qty: 8,
        condition: 'MAINTENANCE',
        location: 'Ruang Utama',
    },
    {
        id: 'i4',
        name: 'Vacuum Cleaner Electrolux',
        qty: 2,
        condition: 'BROKEN',
        location: 'Gudang',
    },
    {
        id: 'i5',
        name: 'Dispenser Galon Miyako',
        qty: 3,
        condition: 'GOOD',
        location: 'Serambi',
    },
    {
        id: 'i6',
        name: 'Proyektor Epson EB-S41',
        qty: 1,
        condition: 'GOOD',
        location: 'Aula Lantai 2',
    },
    {
        id: 'i7',
        name: 'Meja Lipat Kayu',
        qty: 20,
        condition: 'GOOD',
        location: 'Gudang',
    },
];

// ─── Donors ────────────────────────────────────────

export const MOCK_DONORS: Donor[] = [
    { id: 'd1', name: 'H. Samsul Bahri', phone: '6281234567890', type: 'DONATUR_TETAP', lastDonation: '2026-02-10', totalDonated: 15000000 },
    { id: 'd2', name: 'Hj. Siti Aminah', phone: '6281298765432', type: 'DONATUR_TETAP', lastDonation: '2026-02-08', totalDonated: 8500000 },
    { id: 'd3', name: 'Pak Budi Santoso', phone: '6281345678901', type: 'JAMAAH_UMUM', lastDonation: '2026-01-25', totalDonated: 3500000 },
    { id: 'd4', name: 'Mas Ari Wibowo', phone: '6285678901234', type: 'JAMAAH_UMUM', lastDonation: '2026-02-12', totalDonated: 250000 },
    { id: 'd5', name: 'Ibu Ratna Sari', phone: '628111222333', type: 'DONATUR_TETAP', lastDonation: '2026-02-04', totalDonated: 5000000 },
    { id: 'd6', name: 'Kang Dedi', phone: '6287788990011', type: 'JAMAAH_UMUM', lastDonation: '2026-01-15', totalDonated: 100000 },
    { id: 'd7', name: 'dr. Faisal', phone: '6281234567891', type: 'DONATUR_TETAP', lastDonation: '2026-02-10', totalDonated: 20000000 },
    { id: 'd8', name: 'Teh Rina', phone: '6289988776655', type: 'JAMAAH_UMUM', lastDonation: '2026-01-20', totalDonated: 150000 },
    { id: 'd9', name: 'Pak RT 05', phone: '6285544332211', type: 'JAMAAH_UMUM', lastDonation: '2026-01-30', totalDonated: 300000 },
    { id: 'd10', name: 'H. Abdullah', phone: '6281122334455', type: 'DONATUR_TETAP', lastDonation: '2026-02-06', totalDonated: 22000000 },
    { id: 'd11', name: 'Ustadzah Fatimah', phone: '6281555666777', type: 'DONATUR_TETAP', lastDonation: '2026-02-01', totalDonated: 6000000 },
    { id: 'd12', name: 'CV Berkah Jaya', phone: '6281999888777', type: 'DONATUR_TETAP', lastDonation: '2026-01-28', totalDonated: 50000000 },
];
