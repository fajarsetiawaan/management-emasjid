export const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount).replace(/\s/g, ''); // Ensure no extra spaces if any
};

export const formatShortRupiah = (amount: number) => {
    if (amount >= 1000000000) {
        return (amount / 1000000000).toFixed(1) + 'M';
    }
    if (amount >= 1000000) {
        return (amount / 1000000).toFixed(1) + 'jt';
    }
    if (amount >= 1000) {
        return (amount / 1000).toFixed(1) + 'rb';
    }
    return amount.toString();
};

export const formatCategory = (cat?: string) => {
    if (!cat) return 'Uncategorized';
    return cat.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};
