---
description: Build a Mosque Management Super App (B2B SaaS). The UI must mimic a native mobile app (e.g., Gojek/Livin) but run on the web.
---

Strategy: Mock-First (Use static JSON data, no database integration yet).

📦 STAGE 1: Data Modeling (The Brain)
Create the strict data contracts first in src/lib/.

src/lib/types.ts:

Organization: { id, name, slug, address, logo, balance }.

User: { id, name, email, role: 'OWNER'|'ADMIN', avatar }.

Transaction: { id, amount, type: 'IN'|'OUT', category, date, desc }.

Event (New): { id, title, ustadz, date, time, category: 'KAJIAN'|'RAPAT', status: 'UPCOMING'|'DONE' }.

Letter (New): { id, refNumber, type: 'IN'|'OUT', subject, date, status: 'DRAFT'|'SENT' }.

Inventory (New): { id, name, qty, condition: 'GOOD'|'BROKEN', location }.

src/lib/mock.ts:

Create MOCK_MOSQUE ("Masjid Raya Al-Falah").

Create MOCK_TRANSACTIONS (15 items, mixed dates).

Create MOCK_EVENTS (e.g., "Kajian Subuh - Ustadz Adi", "Rapat DKM").

Create MOCK_LETTERS (e.g., "Undangan Walikota", "SK Marbot").

Create MOCK_INVENTORY (e.g., "Karpet Sajadah", "Sound System TOA").

📱 STAGE 2: Mobile App Shell (The Layout)
Refactor src/app/admin/layout.tsx. Do NOT use a desktop sidebar.

Mobile Constraint (Desktop View):

Outer Wrapper: div.min-h-screen.bg-slate-900.flex.justify-center.

App Container: div.w-full.max-w-[480px].bg-slate-50.min-h-screen.shadow-2xl.relative.

Sticky Header (Top Bar):

Style: sticky top-0 z-50 h-16 bg-white/90 backdrop-blur border-b flex items-center justify-between px-4.

Left: Logo (Circle) + Mosque Name (Bold, Truncated).

Right: Bell Icon (Notification) + LogOut Icon (Red).

Bottom Navigation (The Dock):

Style: fixed bottom-0 z-50 w-full max-w-[480px] bg-white border-t h-20 grid grid-cols-5 items-center pb-2.

Items:

Home (LayoutGrid) -> /admin/dashboard

Jadwal (Calendar) -> /admin/events

FAB (+): Absolute center, raised (-mt-8). Circle h-14 w-14, bg-emerald-600, shadow-lg, Icon Plus (White).

Admin (Folder) -> /admin/letters

Akun (User) -> /admin/settings

Active State: Icon turns Emerald-600.

🏠 STAGE 3: Super App Dashboard (Home)
File: src/app/admin/dashboard/page.tsx

Hero Section (Finance):

Gradient Card (bg-gradient-to-r from-emerald-600 to-emerald-800).

Content: "Total Saldo Kas", Big Amount (Rp 150.000.000), Status "Safe".

Grid Menu System (The Super App Look):

Layout: grid grid-cols-4 gap-4 p-4 bg-white rounded-xl mx-4 -mt-6 shadow-sm relative z-10.

Menu Items (Icon Wrapper + Label):

💰 Keuangan (/admin/finance)

📅 Agenda (/admin/events)

📝 Surat (/admin/letters)

📦 Aset (/admin/inventory)

👥 Jamaah (/admin/donors)

📊 Laporan (/admin/reports)

Widgets (Below Grid):

"Agenda Terdekat": Horizontal Card showing the next upcoming event from Mock Data.

📄 STAGE 4: Feature Pages (List Views)
Create simple list pages for the modules.

/admin/finance:

Tabs: "Pemasukan" (Green) vs "Pengeluaran" (Red).

List: Transaction cards with Date and Amount.

/admin/events:

Card Layout: Date Badge (Left) + Title & Ustadz (Right).

/admin/inventory:

Simple Table: Item Name | Qty | Condition (Badge: Green/Red).

🌐 STAGE 5: Public View (Jamaah)
File: src/app/m/[slug]/page.tsx

Layout: No Bottom Nav. Simple white background.

Header: Large Mosque Logo & Name centered.

Tabs:

Tab 1: Laporan (Summary Finance Charts).

Tab 2: Agenda (List of Upcoming Public Events).

Tab 3: Profil (Address, Bank Account for Donation).

Visual Style Guide:

Primary Color: Emerald-600.

Secondary Color: Slate-600.

Font: Inter / Geist.

Corner Radius: rounded-xl for cards.

Action: Execute Stage 1 (Data) first, then Stage 2 (Shell), then Stage 3 (Dashboard). Ensure the Mobile Constraint is applied correctly.