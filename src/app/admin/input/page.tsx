import TransactionForm from '@/components/features/finance/TransactionForm';

export default function InputPage() {
    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Input Transaksi Baru</h1>
            <TransactionForm />
        </div>
    );
}
