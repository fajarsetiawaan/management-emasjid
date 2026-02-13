import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen w-full bg-slate-50 flex flex-col justify-center items-center relative overflow-hidden font-sans text-slate-900">
            {/* Background Pattern (Subtle Islamic Geometry / Abstract) */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            {/* Main Container */}
            <main className="w-full max-w-md px-6 relative z-10">
                {children}
            </main>

            {/* Footer */}
            <footer className="absolute bottom-6 w-full text-center text-xs text-slate-400">
                © 2026 MosqueApp. Dibuat untuk Kemakmuran Umat.
            </footer>
        </div>
    );
}
