import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'E-Masjid Super App',
  description: 'Aplikasi Manajemen Masjid Modern',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 relative`}>
        {/* Global Background Orbs - Subtle */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-50">
          <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] bg-emerald-400/5 dark:bg-emerald-600/5 rounded-full blur-[150px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[80%] h-[80%] bg-blue-400/5 dark:bg-blue-600/5 rounded-full blur-[150px]" />
        </div>

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster position="top-center" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
