1. Ringkasan Eksekutif (Executive Summary)
1.1 Visi Produk
Mengubah manajemen masjid dari pembukuan manual menjadi Ekosistem Digital Terpadu. Aplikasi ini bukan hanya mencatat uang (Accounting), tetapi menjadi "Sistem Operasi" bagi DKM untuk mengelola kegiatan dakwah, administrasi surat-menyurat, dan aset inventaris dalam satu genggaman (Super App).

1.2 Target Market (B2B SaaS)
Primary User (Admin DKM): Ketua, Bendahara, Sekretaris, dan Seksi Dakwah/Perlengkapan.

End User (Jamaah): Masyarakat umum yang mengakses informasi publik (Laporan & Jadwal).

1.3 Keunggulan Utama (USP)
Mobile-First Experience: UI/UX dirancang seperti aplikasi native (Gojek/Livin), bukan dashboard web kaku.

Strict Fund Separation: Logika keuangan syariah (Zakat vs Operasional terpisah).

Holistic Management: Integrasi Keuangan, Jadwal Kajian, Surat, dan Aset dalam satu database.

2. Profil Pengguna (User Personas)
Sistem harus mendukung Role-Based Access Control (RBAC) di Level 3 (Pengurus):

Ketua DKM (The Approver): Butuh ringkasan "Helicopter View". Ingin melihat saldo total, agenda terdekat, dan menyetujui surat keluar.

Bendahara (The Accountant): Fokus pada modul Keuangan. Input Infaq Jumat, bayar listrik, upload struk.

Sekretaris (The Admin): Fokus pada modul Surat & Agenda. Membuat jadwal kajian, mencatat surat masuk dari Kemenag/Kelurahan.

Marbot/Logistik (The Keeper): Fokus pada modul Aset. Melaporkan barang rusak (misal: Mic mati, Karpet kotor).

3. Spesifikasi Fungsional (Functional Requirements)
3.1 Core Architecture & Navigation (The "Super App" Shell)
FR-01: Mobile Container on Desktop:

Aplikasi dibatasi lebar max 480px (ukuran HP) dan diletakkan di tengah layar saat dibuka di Desktop/Laptop.

Background luar berwarna gelap/abu-abu untuk fokus ke konten aplikasi.

FR-02: Sticky Header & Bottom Nav:

Header: Menampilkan Logo Masjid, Nama Masjid, Notifikasi, dan Logout.

Bottom Nav (5 Menu): Home (Grid Menu), Agenda (Kalender), FAB (+) (Quick Action), Surat (Admin), Profil.

3.2 Modul 1: Dashboard Utama (Home)
FR-03: Hero Section (Keuangan):

Card besar menampilkan Saldo Total Kas secara real-time.

Indikator status kesehatan kas (Aman / Kritis).

FR-04: Grid Menu System:

Navigasi utama berbentuk ikon grid (4 kolom) seperti Gojek/OVO.

Menu: Keuangan, Jadwal, Surat, Aset, Jamaah, Laporan.

FR-05: Smart Widgets:

Widget "Agenda Terdekat": Menampilkan 1 event yang akan datang (Countdown).

Widget "Surat Terbaru": Status surat terakhir (Masuk/Keluar).

3.3 Modul 2: Keuangan (Finance)
FR-06: Transaksi Multi-Kategori:

Input Pemasukan/Pengeluaran dengan toggle.

Kategori Dinamis: Dropdown berubah sesuai tipe transaksi (Income: Zakat/Infaq vs Expense: Operasional/Bangunan).

FR-07: Bukti Transaksi:

Wajib upload foto/kamera untuk setiap pengeluaran di atas nominal tertentu (misal Rp 100rb).

3.4 Modul 3: Dakwah & Kegiatan (Events)
FR-08: Manajemen Jadwal:

CRUD Event (Judul, Nama Ustadz, Tanggal, Jam, Poster).

Kategori Event: Kajian Rutin, PHBI (Maulid/Isra Miraj), Rapat DKM, Jumat Berkah.

FR-09: Publikasi:

Event yang statusnya PUBLISHED akan muncul di Halaman Publik Jamaah.

3.5 Modul 4: Administrasi & Aset (Admin & Inventory)
FR-10: Log Surat (Mail Tracking):

Pencatatan Surat Masuk (Dari mana, Perihal, Foto Surat).

Pencatatan Surat Keluar (Tujuan, Perihal, Status: Draft/Sent).

FR-11: Manajemen Inventaris:

Database barang milik masjid (Nama, Qty, Lokasi, Kondisi).

Status Kondisi: BAIK, RUSAK RINGAN, RUSAK BERAT.

3.6 Halaman Publik (Jamaah View)
FR-12: QR Code Landing Page:

Diakses via app.com/m/[slug-masjid].

Tanpa Login.

FR-13: Konten Publik:

Tab 1: Laporan Keuangan (Grafik & Mutasi Transparan).

Tab 2: Agenda Masjid (Jadwal Kajian & Petugas Jumat).

Tab 3: Profil Masjid (Visi Misi & Rekening Donasi).

4. Struktur Database (Schema Concept)
Tabel Utama yang dibutuhkan (Relasional):

Organization (Masjid): id, slug, name, address.

User (Pengurus): id, email, role (Owner/Admin/Member).

Transaction (Keuangan): id, amount, type, category, proofUrl.

Event (Kegiatan): id, title, ustadz, date, posterUrl, isPublic.

Letter (Surat): id, refNumber, direction (In/Out), subject, attachmentUrl.

Inventory (Aset): id, itemName, qty, condition, location.

5. Non-Functional Requirements (NFR)
Performance:

Halaman Publik harus load < 2 detik di jaringan 3G (Optimasi gambar poster/struk).

Security:

Data donatur (No HP) di modul Keuangan TIDAK BOLEH tampil di Halaman Publik.

URL Foto Surat & Struk harus Signed URL (Expired dalam waktu tertentu), tidak public open.

Compatibility:

Web App harus bersifat PWA (Progressive Web App). Bisa di-"Install" ke Homescreen HP Admin.

6. Roadmap Pengembangan (Phasing)
Phase 1: The Core (Minggu 1-2)
Setup Project & Database (Mock First).

UI Shell (Mobile Container, Bottom Nav).

Modul Keuangan (CRUD Transaksi).

Halaman Publik Sederhana (Hanya Keuangan).

Phase 2: The Super App (Minggu 3-4)
Implementasi Grid Menu Dashboard.

Modul Kegiatan (Event & Jadwal).

Modul Surat & Aset.

Integrasi Backend Real (Hono/SQLite).

Phase 3: Monetization & Scale (Bulan 2)
Dashboard Super Admin (SaaS Owner).

Fitur Langganan (Payment Gateway).

Notifikasi WhatsApp (Integrasi 3rd party).

7. Glossary (Istilah)
Slug: Bagian URL unik identitas masjid (contoh: masjid-raya).

FAB: Floating Action Button, tombol bulat melayang untuk aksi cepat.

SaaS: Software as a Service, model bisnis langganan.

Mock Data: Data palsu untuk keperluan simulasi tampilan sebelum database siap.