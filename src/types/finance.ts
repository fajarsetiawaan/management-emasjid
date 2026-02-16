
import { LucideIcon } from 'lucide-react';

export type FundAllocationType = 'CASH' | 'BANK';

export interface FundAllocation {
    type: FundAllocationType;
    bankId?: string;
}

export interface Fund {
    id: string;
    name: string;
    type: string; // 'OPERASIONAL' | 'ZAKAT' | 'WAKAF' | 'SOSIAL' | 'CUSTOM'
    active: boolean;
    locked: boolean;
    icon: LucideIcon;
    desc: string;
    balance: number;
    allocation: FundAllocation;
}

export interface BankAccount {
    id: string;
    bankName: string;
    accountNumber: string;
    holderName: string;
    allocation: string;
}
