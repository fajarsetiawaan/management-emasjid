/**
 * src/lib/api.ts
 *
 * Centralized API service layer.
 * UI components MUST import data through these functions,
 * never directly from mock-data.ts.
 *
 * Toggle USE_MOCK to `false` when integrating with real backend (Drizzle ORM).
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

import {
    MOCK_MOSQUE,
    MOCK_MOSQUES,
    MOCK_USER,
    MOCK_BANK_ACCOUNTS,
    MOCK_FAQS,
    MOCK_LEGAL_MENU,
    MOCK_TEAM_MEMBERS,
    MOCK_TRANSACTIONS,
    MOCK_ALL_TENANTS,
    MOCK_EVENTS,
    MOCK_LETTERS,
    MOCK_INVENTORY,
    MOCK_DONORS,
} from './mock-data';

// ─── Toggle: set to false when backend is ready ───
const USE_MOCK = true;

// ─── Mosque ────────────────────────────────────────

/** Get default/active mosque info */
export async function getMosque(): Promise<Mosque> {
    if (USE_MOCK) return MOCK_MOSQUE;
    // TODO: fetch from Drizzle/API
    throw new Error('API not implemented');
}

/** Get all registered mosques */
export async function getMosques(): Promise<Mosque[]> {
    if (USE_MOCK) return MOCK_MOSQUES;
    throw new Error('API not implemented');
}

/** Find mosque by slug */
export async function getMosqueBySlug(slug: string): Promise<Mosque | undefined> {
    if (USE_MOCK) return MOCK_MOSQUES.find((m) => m.slug === slug);
    throw new Error('API not implemented');
}

// ─── User ──────────────────────────────────────────

/** Get currently authenticated user */
export async function getCurrentUser(): Promise<User> {
    if (USE_MOCK) return MOCK_USER;
    throw new Error('API not implemented');
}

// ─── Finance ───────────────────────────────────────

/** Get all transactions */
export async function getTransactions(): Promise<Transaction[]> {
    if (USE_MOCK) return MOCK_TRANSACTIONS;
    throw new Error('API not implemented');
}

/** Get transactions filtered by type */
export async function getTransactionsByType(
    type: 'INCOME' | 'EXPENSE'
): Promise<Transaction[]> {
    if (USE_MOCK) return MOCK_TRANSACTIONS.filter((t) => t.type === type);
    throw new Error('API not implemented');
}

/** Get bank accounts */
export async function getBankAccounts(): Promise<BankAccount[]> {
    if (USE_MOCK) return MOCK_BANK_ACCOUNTS;
    throw new Error('API not implemented');
}

// ─── Events ────────────────────────────────────────

/** Get all events */
export async function getEvents(): Promise<Event[]> {
    if (USE_MOCK) return MOCK_EVENTS;
    throw new Error('API not implemented');
}

/** Get upcoming events only */
export async function getUpcomingEvents(): Promise<Event[]> {
    if (USE_MOCK) return MOCK_EVENTS.filter((e) => e.status === 'UPCOMING');
    throw new Error('API not implemented');
}

// ─── Letters ───────────────────────────────────────

/** Get all letters (surat) */
export async function getLetters(): Promise<Letter[]> {
    if (USE_MOCK) return MOCK_LETTERS;
    throw new Error('API not implemented');
}

// ─── Inventory ─────────────────────────────────────

/** Get all inventory items */
export async function getInventory(): Promise<Inventory[]> {
    if (USE_MOCK) return MOCK_INVENTORY;
    throw new Error('API not implemented');
}

// ─── Donors ────────────────────────────────────────

/** Get all donor records */
export async function getDonors(): Promise<Donor[]> {
    if (USE_MOCK) return MOCK_DONORS;
    throw new Error('API not implemented');
}

// ─── Team ──────────────────────────────────────────

/** Get team members */
export async function getTeamMembers(): Promise<TeamMember[]> {
    if (USE_MOCK) return MOCK_TEAM_MEMBERS;
    throw new Error('API not implemented');
}

// ─── Tenants (Super Admin) ─────────────────────────

/** Get all registered tenants */
export async function getAllTenants(): Promise<Tenant[]> {
    if (USE_MOCK) return MOCK_ALL_TENANTS;
    throw new Error('API not implemented');
}

// ─── Support / Settings ────────────────────────────

/** Get FAQ items */
export async function getFAQs(): Promise<FAQ[]> {
    if (USE_MOCK) return MOCK_FAQS;
    throw new Error('API not implemented');
}

/** Get legal/about menu items */
export async function getLegalMenu(): Promise<LegalMenuItem[]> {
    if (USE_MOCK) return MOCK_LEGAL_MENU;
    throw new Error('API not implemented');
}
