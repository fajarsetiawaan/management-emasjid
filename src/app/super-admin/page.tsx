import { MOCK_ALL_TENANTS } from '@/lib/mock-data';
import { Building2, DollarSign, Users, MoreVertical, Ban, CheckCircle } from 'lucide-react';

export default function SuperAdminDashboard() {
    const activeTenants = MOCK_ALL_TENANTS.filter(t => t.status === 'ACTIVE').length;
    // Calculating ARR based on subscription plan (Mock calculation)
    // BASIC = 1.000.000/yr, PRO = 2.000.000/yr, ENTERPRISE = 5.000.000/yr
    const calculateARR = () => {
        let total = 0;
        MOCK_ALL_TENANTS.forEach(t => {
            if (t.status === 'ACTIVE') {
                if (t.subscriptionPlan === 'BASIC') total += 1000000;
                if (t.subscriptionPlan === 'PRO') total += 2000000;
                if (t.subscriptionPlan === 'ENTERPRISE') total += 5000000;
            }
        });
        return total;
    };

    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="space-y-6">
            {/* Global Stats */}
            <h1 className="text-2xl font-bold text-slate-800">Platform Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500">Total Masjid Active</p>
                        <p className="text-3xl font-bold text-slate-900 mt-2">{activeTenants}</p>
                    </div>
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                        <Building2 size={24} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500">Total ARR (Est)</p>
                        <p className="text-3xl font-bold text-emerald-600 mt-2">{formatRupiah(calculateARR())}</p>
                    </div>
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                        <DollarSign size={24} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500">Total Active Users</p>
                        <p className="text-3xl font-bold text-slate-900 mt-2">{MOCK_ALL_TENANTS.length * 3 + 12}</p>
                        {/* Mock calculation: avg 3 users per tenant + 12 organic */}
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                        <Users size={24} />
                    </div>
                </div>
            </div>

            {/* Tenant Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mt-8">
                <div className="p-6 border-b border-slate-200">
                    <h3 className="font-bold text-slate-900">Registered Tenants</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 font-medium">Tenant Name</th>
                                <th className="px-6 py-3 font-medium">Plan</th>
                                <th className="px-6 py-3 font-medium">Owner</th>
                                <th className="px-6 py-3 font-medium">Joined At</th>
                                <th className="px-6 py-3 font-medium text-center">Status</th>
                                <th className="px-6 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {MOCK_ALL_TENANTS.map((tenant) => (
                                <tr key={tenant.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        {tenant.name}
                                        <div className="text-xs text-slate-400 font-normal">/{tenant.slug}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`
                      px-2 py-1 rounded text-xs font-bold
                      ${tenant.subscriptionPlan === 'ENTERPRISE' ? 'bg-purple-100 text-purple-700' :
                                                tenant.subscriptionPlan === 'PRO' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}
                    `}>
                                            {tenant.subscriptionPlan}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">
                                        {tenant.ownerEmail}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">
                                        {new Date(tenant.joinedAt).toLocaleDateString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`
                      inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                      ${tenant.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}
                    `}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${tenant.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                                            {tenant.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {tenant.status === 'ACTIVE' ? (
                                                <button className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors group relative" title="Suspend Tenant">
                                                    <Ban size={18} />
                                                </button>
                                            ) : (
                                                <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors group relative" title="Activate Tenant">
                                                    <CheckCircle size={18} />
                                                </button>
                                            )}
                                            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                                <MoreVertical size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
