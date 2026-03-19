# Setup PostgreSQL untuk Bengal Trans Jaya

## Opsi 1: PostgreSQL Lokal (Windows)

### Install PostgreSQL
1. Download dari https://www.postgresql.org/download/windows/
2. Install dengan default settings
3. Catat password untuk user `postgres` (misal: `password`)
4. Buka pgAdmin (UI database) atau gunakan psql (command line)

### Buat Database btj_db
```bash
# Menggunakan psql
psql -U postgres
CREATE DATABASE btj_db;
\q
```

### Update .env.local
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/btj_db"
```

---

## Opsi 2: Supabase Cloud (Recommended untuk testing)

1. Buka https://supabase.com
2. Sign up / Login
3. Create new project
4. Tunggu provision selesai
5. Di tab "Settings > Database", copy connection string
6. Update .env.local:
```
DATABASE_URL="postgresql://[user]:[password]@[host]:[port]/[database]"
```

---

## Setup Database & Admin Portal

Setelah DATABASE_URL diatur:

```bash
# Terminal di c:\project\BTJ\bengal-trans-jaya

# 1. Generate Prisma client
npm run db:generate

# 2. Push schema ke database
npm run db:push

# 3. Seed data admin + konten default
npm run db:seed

# 4. Jalankan development server
npm run dev
```

---

## Akses Admin Portal

### Login
- URL: http://localhost:3000/admin/login
- Email: admin@btj.local
- Password: Admin123!

### Dashboard Menu
- **Dashboard**: Ringkasan jumlah unit, kru, etc
- **Unit**: Tambah/edit/hapus unit bus + fasilitas + foto
- **Kru**: Tambah/edit/hapus kru dengan foto
- **Galeri/Testi**: Kelola foto momen dan testimoni
- **Settings**: Ubah hero title, WA number, foto hero, lokasi, dll

---

## Perubahan di Landing Page

Semua konten sekarang baca dari database:
- ✅ Unit (nama, deskripsi, kapasitas, fasilitas, foto)
- ✅ Kru (nama, peran, foto)
- ✅ Galeri momen dan testimoni
- ✅ Hero image, title, subtitle, deskripsi
- ✅ Nomor WhatsApp dan label tombol
- ✅ Lokasi

Ubah di admin → langsung tampil di landing page (dengan revalidasi cache)

---

## Troubleshooting

### Database connection error
- Cek DATABASE_URL di .env.local
- Pastikan PostgreSQL service berjalan
- Test koneksi: `npm run db:generate`

### Admin tidak bisa login
- Jalankan `npm run db:seed` lagi untuk reset
- Pastikan .env.local ada ADMIN_EMAIL dan ADMIN_PASSWORD

### Landing page masih tampil data lama
- Refresh browser (hard refresh: Ctrl+Shift+R)
- Restart dev server: `npm run dev`

---

## Perintah Util

```bash
# Jalankan seed (buat admin + konten default)
npm run db:seed

# Lihat database GUI (jika using local PostgreSQL)
# Open pgAdmin atau DBeaver

# Reset schema (hapus semua, rebuild)
npm run db:push -- --force-reset

# Generate Prisma types
npm run db:generate
```

---

## Berikutnya

Jika admin portal sudah berjalan, Anda bisa:
1. Login ke admin portal
2. Tambah/edit unit, foto, kru, galeri
3. Ubah hero image dan WA number dari Settings
4. Lihat hasilnya langsung di landing page

Selamat! Portal admin BTJ sudah siap. 🎉
