'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface TrendData {
    label: string;
    income: number;
    expense: number;
}

interface TrendChartProps {
    data: TrendData[];
    height?: number;
}

export default function TrendChart({ data, height = 200 }: TrendChartProps) {
    // Calculate max value for scaling
    const maxValue = useMemo(() => {
        return Math.max(...data.map(d => Math.max(d.income, d.expense))) * 1.2; // Add 20% buffer
    }, [data]);

    // Generate Path Data
    const generatePath = (key: 'income' | 'expense') => {
        if (data.length === 0) return '';

        const stepX = 100 / (data.length - 1);

        return data.reduce((path, point, index) => {
            const x = index * stepX;
            const y = 100 - (point[key] / maxValue) * 100;

            if (index === 0) return `M ${x} ${y}`;

            // Simple line for now, could be bezier
            return `${path} L ${x} ${y}`;
        }, '');
    };

    // Generate Area Data (for gradient fill)
    const generateArea = (key: 'income' | 'expense') => {
        const linePath = generatePath(key);
        return `${linePath} L 100 100 L 0 100 Z`;
    };

    const incomePath = generatePath('income');
    const incomeArea = generateArea('income');
    const expensePath = generatePath('expense');
    const expenseArea = generateArea('expense');

    return (
        <div className="w-full relative select-none" style={{ height }}>
            {/* SVG Chart */}
            <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="w-full h-full overflow-visible"
            >
                {/* Grid Lines (Optional) */}
                <line x1="0" y1="25" x2="100" y2="25" stroke="currentColor" strokeOpacity="0.05" vectorEffect="non-scaling-stroke" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeOpacity="0.05" vectorEffect="non-scaling-stroke" />
                <line x1="0" y1="75" x2="100" y2="75" stroke="currentColor" strokeOpacity="0.05" vectorEffect="non-scaling-stroke" />

                {/* INCOME */}
                <defs>
                    <linearGradient id="gradIncome" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="gradExpense" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Income Area & Line */}
                <motion.path
                    initial={{ d: `M 0 100 L 100 100 L 0 100 Z` }}
                    animate={{ d: incomeArea }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    fill="url(#gradIncome)"
                />
                <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1, d: incomePath }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                />

                {/* Expense Area & Line */}
                <motion.path
                    initial={{ d: `M 0 100 L 100 100 L 0 100 Z` }}
                    animate={{ d: expenseArea }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                    fill="url(#gradExpense)"
                />
                <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1, d: expensePath }}
                    transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                />

                {/* Interactive Points (Tooltips logic would go here) */}
                {data.map((d, i) => {
                    const x = i * (100 / (data.length - 1));
                    const yIncome = 100 - (d.income / maxValue) * 100;
                    const yExpense = 100 - (d.expense / maxValue) * 100;

                    return (
                        <g key={i}>
                            <circle cx={x} cy={yIncome} r="1.5" fill="#10b981" className="opacity-0 hover:opacity-100 transition-opacity cursor-pointer" vectorEffect="non-scaling-stroke" />
                            <circle cx={x} cy={yExpense} r="1.5" fill="#f43f5e" className="opacity-0 hover:opacity-100 transition-opacity cursor-pointer" vectorEffect="non-scaling-stroke" />
                        </g>
                    )
                })}
            </svg>

            {/* X-Axis Labels */}
            <div className="absolute bottom-0 w-full flex justify-between text-[10px] text-slate-400 font-medium translate-y-4">
                {data.map((d, i) => (
                    <span key={i} className="text-center w-8">{d.label.slice(0, 3)}</span>
                ))}
            </div>
        </div>
    );
}
