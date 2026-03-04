'use client';

import { Suspense } from 'react';
import TransactionForm from '@/components/features/finance/TransactionForm';

export default function NewTransactionPage() {
    return (
        <Suspense fallback={<div className="p-4 text-center">Loading form...</div>}>
            <TransactionForm />
        </Suspense>
    );
}
