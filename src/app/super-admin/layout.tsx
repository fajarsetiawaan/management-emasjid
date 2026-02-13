import Link from 'next/link';
import {
    BarChart,
    Building,
    CreditCard,
    Settings,
    ShieldCheck,
    Search,
    Bell
} from 'lucide-react';
import { MOCK_USER } from '@/lib/mock-data';

export default function SuperAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const sidebarItems = [
        { name: 'Overview', href: '/super-admin', icon: BarChart },
        { name: 'Tenants', href: '/super-admin/tenants', icon: Building },
        { name: 'Subscriptions', href: '/super-admin/subscriptions', icon: CreditCard },
        { name: 'Settings', href: '/super-admin/settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-slate-100 flex font-sans text-slate-900">
            {/* Sidebar - Distinct Color (e.g., Slate-900 for Super Admin) */}
            <aside className="w-64 bg-slate-900 text-slate-300 fixed h-full z-10 hidden md:flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-slate-800">
                    <div className="flex items-center gap-2 text-white font-bold text-xl">
                        <ShieldCheck className="text-emerald-500" />
                        <span>Fase Admin</span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${item.name === 'Overview'
                                    ? 'bg-emerald-600/10 text-emerald-500'
                                    : 'hover:bg-slate-800 hover:text-white'
                                }
              `}
                        >
                            <item.icon size={20} />
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 px-3 py-2">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold">
                            SA
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">Platform Owner</p>
                            <p className="text-xs text-slate-500 truncate">super@fase.id</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 min-h-screen flex flex-col">
                {/* Top Bar */}
                <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-10 px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-slate-500 text-sm">
                        <span className="font-semibold text-slate-900">Platform Overview</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50">
                            <Search size={20} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
