/**
 * src/types/index.ts
 *
 * Centralized type definitions for fase-emasjid.
 * These types mirror the database schema (schema.sql) and are
 * designed to be compatible with Drizzle ORM infer types later.
 *
 * Usage: import { Mosque, User, ... } from '@/types';
 */

// ─── Auth & Roles ──────────────────────────────────

export type Role = 'OWNER' | 'ADMIN';

// ─── Finance: 2D Fund Accounting Core ──────────────

export type AssetType = 'CASH' | 'BANK' | 'EWALLET';
export type ProgramType = 'UNRESTRICTED' | 'RESTRICTED';
export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER'; // Added TRANSFER

/**
 * Dimension 1: Where is the money? (Physical/Asset)
 */
export interface AssetAccount {
    id: string;
    name: string; // e.g. "Bank BSI", "Kas Tunai"
    type: AssetType;
    balance: number;
    accountNumber?: string;
    description?: string;
    color: string; // UI Color
}

/**
 * Dimension 2: What is the money for? (Logical/Program)
 */
export interface Program {
    id: string;
    name: string; // e.g. "Operasional", "Yatim", "Pembangunan"
    type: ProgramType;
    balance: number;
    description?: string;
    color: string; // UI Color
    allocation?: {
        type: 'CASH' | 'BANK';
        bankId?: string;
    };
}

export type IncomeCategory = 'INFAQ_JUMAT' | 'INFAQ_UMUM' | 'ZAKAT_FITRAH' | 'ZAKAT_MAL' | 'WAKAF' | 'DONASI';
export type ExpenseCategory = 'OPERASIONAL' | 'PEMBANGUNAN' | 'HONOR_PETUGAS' | 'SOSIAL_YATIM' | 'SANTUNAN';

export type TransactionCategory = IncomeCategory | ExpenseCategory; // Keep for backward compat or categorization within programs

export interface Transaction {
    id: string;
    date: Date;
    amount: number;
    type: TransactionType;

    // 2D Accounting Links
    accountId: string; // Physical Account (Where)
    programId: string; // Logical Program (For What)

    description: string;
    status: 'COMPLETED' | 'PENDING';

    // Optional: Kept for granular categorization if needed
    category?: TransactionCategory;
}


export interface BankAccount { // Legacy, to be replaced by AssetAccount in UI
    id: string;
    bankName: string;
    accountNumber: string;
    holderName: string;
    color: string;
}

// ─── Mosque ────────────────────────────────────────

export interface Mosque {
    id: string;
    name: string;
    slug: string;
    address: string;
    city: string;
    latitude?: number;
    longitude?: number;
    balance: number;
    // Profile fields
    establishedYear?: number;
    jamaahCount?: number;
    verificationStatus?: 'verified' | 'pending' | 'unverified';
    activeSince?: string;
    coverImageUrl?: string;
}

// ─── User ──────────────────────────────────────────

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    mosqueId: string;
    mosqueName?: string;
    plan?: string;
    setup_completed?: boolean; // New flag for Onboarding Logic
    preferences?: NotificationPreferences;
}

export interface NotificationPreferences {
    whatsapp: boolean;
    email: boolean;
    incoming: boolean;
    outgoing: boolean;
    schedule: boolean;
}

// ─── Team ──────────────────────────────────────────

export interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'MEMBER' | 'SEKRETARIS' | 'BENDAHARA' | 'MARBOT';
    status: 'ACTIVE' | 'PENDING';
    avatarColor: string;
}

// ─── Events ────────────────────────────────────────

export type EventCategory = 'KAJIAN' | 'RAPAT' | 'KEGIATAN' | 'LAINNYA';
export type EventStatus = 'UPCOMING' | 'DONE';

export interface Event {
    id: string;
    title: string;
    ustadz?: string;
    date: Date;
    time: string;
    category: EventCategory;
    status: EventStatus;
}

// ─── Letters (Surat) ───────────────────────────────

export type LetterType = 'IN' | 'OUT';
export type LetterStatus = 'DRAFT' | 'SENT' | 'ARCHIVED';

export interface Letter {
    id: string;
    refNumber: string;
    type: LetterType;
    subject: string;
    date: Date;
    status: LetterStatus;
}

// ─── Inventory ─────────────────────────────────────

export type InventoryCondition = 'GOOD' | 'BROKEN' | 'MAINTENANCE';

export interface Inventory {
    id: string;
    name: string;
    qty: number;
    condition: InventoryCondition;
    location: string;
}

// ─── Donors ────────────────────────────────────────

export type DonorType = 'DONATUR_TETAP' | 'JAMAAH_UMUM';

export interface Donor {
    id: string;
    name: string;
    phone: string;
    type: DonorType;
    lastDonation: string; // ISO Date String
    totalDonated: number;
}

// ─── Tenant (Multi-tenancy / Super Admin) ──────────

export type SubscriptionPlan = 'BASIC' | 'PRO' | 'ENTERPRISE';

export interface Tenant {
    id: string;
    name: string;
    slug: string;
    ownerEmail: string;
    status: 'ACTIVE' | 'SUSPENDED';
    subscriptionPlan: SubscriptionPlan;
    joinedAt: Date;
}

// ─── Settings / Support ────────────────────────────

export interface FAQ {
    question: string;
    answer: string;
}

export interface LegalMenuItem {
    label: string;
    href: string;
    badge?: string;
    external?: boolean;
    iconName: 'Sparkles' | 'FileText' | 'ShieldCheck' | 'Star';
}
