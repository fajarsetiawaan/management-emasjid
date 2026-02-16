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
    AssetAccount,
    Fund,
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
    MOCK_ASSET_ACCOUNTS,
    MOCK_FUNDS,
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

// ─── Finance: 2D Accounting ────────────────────────

/** Get all transactions */
export async function getTransactions(): Promise<Transaction[]> {
    if (USE_MOCK) {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('sim_transactions');
            if (saved) return JSON.parse(saved) as Transaction[];
        }
        return MOCK_TRANSACTIONS;
    }
    throw new Error('API not implemented');
}

/** Get transactions filtered by type */
export async function getTransactionsByType(
    type: 'INCOME' | 'EXPENSE'
): Promise<Transaction[]> {
    const all = await getTransactions();
    return all.filter((t) => t.type === type);
}

/**
 * Save new transaction & update account balances (Mock Logic)
 */
export async function saveTransaction(payload: Omit<Transaction, 'id' | 'status'>): Promise<Transaction> {
    if (!USE_MOCK) throw new Error('API not implemented');

    // 1. Create Transaction Object
    const newTransaction: Transaction = {
        id: crypto.randomUUID(),
        status: 'COMPLETED',
        ...payload
    };

    if (typeof window !== 'undefined') {
        // 2. Load Existing Data
        const savedTransactions = localStorage.getItem('sim_transactions');
        const transactions = savedTransactions ? JSON.parse(savedTransactions) : MOCK_TRANSACTIONS;

        // 3. Save Transaction
        const updatedTransactions = [newTransaction, ...transactions];
        localStorage.setItem('sim_transactions', JSON.stringify(updatedTransactions));

        // 4. Update Balances (sim_assets)
        const savedAssets = localStorage.getItem('sim_assets');
        let assets = savedAssets ? JSON.parse(savedAssets) : MOCK_ASSET_ACCOUNTS;

        if (payload.type === 'INCOME') {
            assets = assets.map((a: AssetAccount) =>
                a.id === payload.accountId ? { ...a, balance: (a.balance || 0) + payload.amount } : a
            );
        } else if (payload.type === 'EXPENSE') {
            assets = assets.map((a: AssetAccount) =>
                a.id === payload.accountId ? { ...a, balance: (a.balance || 0) - payload.amount } : a
            );
        } else if (payload.type === 'TRANSFER' && payload.transferTargetAccountId) {
            // Transfer: Source Debit, Target Credit
            assets = assets.map((a: AssetAccount) => {
                if (a.id === payload.accountId) return { ...a, balance: (a.balance || 0) - payload.amount };
                if (a.id === payload.transferTargetAccountId) return { ...a, balance: (a.balance || 0) + payload.amount };
                return a;
            });
        }

        localStorage.setItem('sim_assets', JSON.stringify(assets));

        // Dispatch event to update UI in real-time if components listen to storage
        window.dispatchEvent(new Event('storage'));

        return newTransaction;
    }

    return newTransaction;
}

/** Dimension 1: Get Asset Accounts (Physical) — localStorage-first */
export async function getAssetAccounts(): Promise<AssetAccount[]> {
    if (USE_MOCK) {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('sim_assets');
            if (saved) {
                const assets = JSON.parse(saved) as AssetAccount[];
                const total = assets.reduce((s, a) => s + (a.balance || 0), 0);
                if (total > 0) return assets;
            }
        }
        return MOCK_ASSET_ACCOUNTS;
    }
    throw new Error('API not implemented');
}

/** Dimension 2: Get Funds (Logical) — localStorage-first */
export async function getFunds(): Promise<Fund[]> {
    if (USE_MOCK) {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('sim_funds');
            if (saved) {
                let funds = JSON.parse(saved) as Fund[];

                // Migration: Fix Fund Name if old one exists (Kas Masjid)
                const kasMasjid = funds.find(f => f.id === 'kas_masjid');
                if (kasMasjid && kasMasjid.name.includes('(Operasional)')) {
                    funds = funds.map(f =>
                        f.id === 'kas_masjid' ? { ...f, name: 'Kas Masjid' } : f
                    );
                    localStorage.setItem('sim_funds', JSON.stringify(funds));
                }

                const total = funds.reduce((s, f) => s + (f.balance || 0), 0);
                if (total > 0) return funds;
            }
        }
        return MOCK_FUNDS;
    }
    throw new Error('API not implemented');
}

/** Legacy: Get bank accounts — localStorage-first */
export async function getBankAccounts(): Promise<BankAccount[]> {
    if (USE_MOCK) {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('sim_bank_accounts');
            if (saved) return JSON.parse(saved) as BankAccount[];
        }
        return MOCK_BANK_ACCOUNTS;
    }
    throw new Error('API not implemented');
}

/** Get total balance across all asset accounts (onboarding-aware) */
export function getTotalBalance(): number {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('sim_assets');
        if (saved) {
            const assets = JSON.parse(saved) as AssetAccount[];
            const total = assets.reduce((sum: number, a: AssetAccount) => sum + (a.balance || 0), 0);
            // If localStorage data has 0 total (stale/incomplete), fall back to mock
            if (total > 0) return total;
        }
    }
    return MOCK_MOSQUE.balance;
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
