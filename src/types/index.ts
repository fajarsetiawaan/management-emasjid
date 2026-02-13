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

// ─── Finance ───────────────────────────────────────

export type TransactionType = 'INCOME' | 'EXPENSE';

export type IncomeCategory = 'INFAQ_JUMAT' | 'ZAKAT_FITRAH' | 'ZAKAT_MAL' | 'WAKAF' | 'DONASI';
export type ExpenseCategory = 'OPERASIONAL' | 'PEMBANGUNAN' | 'HONOR_PETUGAS' | 'SOSIAL_YATIM';

export type TransactionCategory = IncomeCategory | ExpenseCategory;

export interface Transaction {
    id: string;
    amount: number;
    type: TransactionType;
    category: TransactionCategory;
    date: Date;
    description: string;
    status: 'COMPLETED' | 'PENDING';
}

export interface BankAccount {
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

export type EventCategory = 'KAJIAN' | 'RAPAT' | 'LAINNYA';
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
