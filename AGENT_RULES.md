# AGENT RULES & PROJECT SPECIFICATION: e-Mutowif

Dokumen ini adalah acuan instruksi tunggal, batasan keamanan, arsitektur, dan panduan kerja untuk AI Agent (Snapgent). Seluruh perencanaan, perbaikan kode, dan eksekusi tugas wajib mematuhi dokumen ini.

---

## 1. IKHTISAR & FITUR UTAMA SISTEM
e-Mutowif adalah aplikasi pemandu jamaah haji dan umrah berbasis pencatatan rute ibadah, repetisi ritual, dan pelacakan geolokasi (GPS).

### Peran Pengguna (User Roles)
1. **Jamaah (`role: jamaah`):**
   - Mengakses daftar lokasi ibadah (`locations`) dan aktivitas di dalamnya (`activities`).
   - Menjalankan ibadah inti yang memerlukan jalan memutar atau berpindah dari satu titik ke titik lain dalam beberapa kali repetisi (dipandu via data urutan `activity_routes`).
   - Mencatat progres status ibadah ke `user_activities` (`belum`, `proses`, `selesai`).
   - **Kewajiban GPS:** Wajib menyalakan GPS; aplikasi akan mengirim pembaruan koordinat (`lat`, `lon`, `last_located_at`) ke server setiap beberapa detik.
2. **Struktur Pimpinan Bertingkat (3-Tier Hierarchy):**
   Peran pimpinan telah dimodernisasi dari struktur flat menjadi hierarki 3 level:
   - **Level 1 (Kloter):** Dipimpin `ketua_kloter`. Membawahi sejumlah Rombongan (Level 2).
   - **Level 2 (Rombongan):** Dipimpin `ketua_rombongan`. Membawahi sejumlah Regu (Level 3).
   - **Level 3 (Regu):** Dipimpin `ketua_regu`. Membawahi anggota jamaah langsung (~10 Jamaah).
   - **Monitoring 2 Arah (2-Way View):** Pimpinan tingkat bawah dapat memantau status dan koordinat GPS pimpinan di atasnya (*parent leader*).
   - **Peta Hierarki Drill-Down:** Peta tidak merender ratusan marker sekaligus, melainkan bertahap (Kloter -> Rombongan -> Regu -> Jamaah).
   *(Catatan backward compatibility: role legacy `'leader'` tetap diizinkan/didukung dalam rute pimpinan).* 
3. **Admin (`role: admin`):**
   - Mengelola master data: akun pengguna (`admin`, `ketua_kloter`, `ketua_rombongan`, `ketua_regu`, `jamaah`), kelompok/group, dan penugasan tipe ibadah (`haji` atau `umrah`).

---

## 2. PETA DIREKTORI WORKSPACE
- **Frontend App (Ionic / Angular):** `TugasYeftaaa/src/app/`
  - Seluruh pengerjaan antarmuka (UI), komponen halaman, routing, model interface, dan HTTP services dilakukan di dalam direktori ini.
- **Backend API (PHP Native):** `api/api/`
  - Seluruh endpoint API backend yang mengolah query database dan mereturn data JSON berada di folder `api/api/`.
- **Ekstensi Sync:** Terhubung ke server live melalui ekstensi SFTP (`.vscode/sftp.json`) dengan opsi `uploadOnSave: true`.

---

## 3. ATURAN KERJA & BATASAN KETAT (CRITICAL CONSTRAINTS)

### A. Larangan Keamanan
- **DILARANG MEMBUKA DAN DILARANG MENGUBAH FILE `api/api/connection.php`!** File ini berisi kredensial privat database server.
- **DILARANG MENGUBAH FILE `.vscode/sftp.json`**.
- Karena file di folder `api/api/` langsung ter-upload otomatis ke server live saat disimpan (`Ctrl + S`), pastikan sintaks kode PHP valid dan tidak mengandung syntax error sebelum di-save.

### B. Aturan Database MySQL
- Agent **TIDAK MEMILIKI AKSES LANGSUNG** untuk eksekusi migrasi atau query DDL ke server database.
- Semua konfigurasi, penambahan kolom, dan pembuatan tabel **HANYA BISA DIJALANKAN MANUAL OLEH DEVELOPER VIA PHPMYADMIN**.
- Jika suatu fitur membutuhkan perubahan struktur tabel, Agent **WAJIB MEMBERIKAN SCRIPT SQL SIAP RUN** agar developer dapat mengeksekusinya di phpMyAdmin.

### C. Format JSON & Sinkronisasi Services
- Backend API wajib mengembalikan format JSON standar.
- Setiap ada penambahan endpoint baru atau modifikasi respon JSON di `api/api/`, Agent wajib langsung memperbarui interface model TypeScript dan Angular Service terkait di `TugasYeftaaa/src/app/` agar proses decode data di frontend tetap sinkron dan tidak error.

---

## 4. SKEMA STRUKTUR DATABASE (MYSQL REFERENCE)

### Tabel `users`
- `id` (INT, Primary Key, Auto Increment)
- `name` (VARCHAR 150)
- `username_email` (VARCHAR 100, Unique)
- `password` (VARCHAR 255)
- `role` (ENUM: 'admin', 'ketua_kloter', 'ketua_rombongan', 'ketua_regu', 'jamaah', legacy: 'leader')
- `ibadah_type` (ENUM: 'haji', 'umrah', Default: 'haji')
- `group_id` (INT, Foreign Key -> `groups.id`, Nullable)
- `lat` (DECIMAL 10,8, Nullable)
- `lon` (DECIMAL 11,8, Nullable)
- `last_located_at` (TIMESTAMP, Nullable)
- `created_at` / `updated_at` (TIMESTAMP)

### Tabel `groups`
- `id` (INT, Primary Key, Auto Increment)
- `name` (VARCHAR 100)
- `leader_id` (INT, Foreign Key -> `users.id`, Nullable)
- `description` (TEXT, Nullable)
- `ibadah_type` (ENUM: 'haji', 'umrah', Default: 'haji')
- `created_at` / `updated_at` (TIMESTAMP)

### Tabel `locations` & `location_open`
- **`locations`**: `id` (PK, AI), `name` (VARCHAR 100), `description` (TEXT), `image_url` (VARCHAR 255), `center_lat` (DECIMAL 10,8), `center_lon` (DECIMAL 11,8), `ibadah_type` (VARCHAR 20, Default: 'haji'), `created_at`, `updated_at`
- **`location_open`**: `id` (PK, AI), `id_locations` (FK -> `locations.id`), `open` (INT)

### Tabel `activities`, `activity_open`, & `activity_routes`
- **`activities`**: `id` (PK, AI), `location_id` (FK -> `locations.id`), `name` (VARCHAR 100), `description` (TEXT), `image_url` (VARCHAR 255), `center_lat` (DECIMAL 10,8), `center_lon` (DECIMAL 11,8), `ibadah_type` (VARCHAR 20, Default: 'haji'), `created_at`, `updated_at`
- **`activity_open`**: `id` (PK, AI), `activity_id` (FK -> `activities.id`), `open` (INT)
- **`activity_routes`**: `id` (PK, AI), `activity_id` (FK -> `activities.id`), `lat` (DECIMAL 10,8), `lon` (DECIMAL 11,8), `sequence` (INT, urutan titik rute/repetisi), `created_at`

### Tabel `user_activities`
- `id` (INT, Primary Key, Auto Increment)
- `user_id` (INT, Foreign Key -> `users.id`)
- `activity_id` (INT, Foreign Key -> `activities.id`)
- `status` (ENUM: 'belum', 'proses', 'selesai', Default: 'belum')
- `completed_at` (TIMESTAMP, Nullable)
- `created_at` / `updated_at` (TIMESTAMP)
- Unique Key: (`user_id`, `activity_id`)

---

## 5. REKAPITULASI FITUR TERBARU & PERUBAHAN ARSITEKTUR

### A. Refactoring Hierarki Pemimpin (3-Tier Leader Hierarchy)
1. **Backend PHP Native (`api/api/`):**
   - **`api/api/leader/get_jamaah.php`:**
     - Mendukung query parameter `sub_group_id` (filter drill-down) dan `include_jamaah` (0/1 untuk optimasi bandwidth).
     - Mengambil info kelompok induk, data atasan, dan koordinat GPS-nya (`parent_leader`).
     - Struktur response JSON standar:
       ```json
       {
         "status": "success",
         "group_info": { "id": 1, "name": "...", "type": "kloter|rombongan|regu" },
         "parent_leader": { "id": 0, "name": "...", "group_name": "...", "lat": 0, "lon": 0 },
         "sub_groups": [ ... ],
         "sub_leaders": [ ... ],
         "data": [ ... ]
       }
       ```
   - **`api/api/admin/users/create.php` & Modul Admin:**
     - Sinkronisasi role pimpinan baru pada validasi backend:
       `$validRoles = ['admin', 'ketua_kloter', 'ketua_rombongan', 'ketua_regu', 'jamaah'];`

2. **Frontend Services & Routing Guard (`TugasYeftaaa/src/app/`):**
   - **`src/app/services/leader.ts`:** Interface `GroupInfo`, `SubGroup`, `LeaderUser`, `GetJamaahResponse`, `GetJamaahOptions`, dan method `getJamaahList(groupId, options)` dengan filter dinamis.
   - **`src/app/auth.service.ts` & `src/app/guards/auth-guard.ts`:** Registrasi role baru ke `UserSession` dan penyesuaian guard redirect.
   - **`src/app/app-routing.module.ts` & `src/app/login/login.page.ts`:** Rute `/leader` mengizinkan `['leader', 'ketua_kloter', 'ketua_rombongan', 'ketua_regu']`.

3. **Portal Pimpinan & Radar Peta (`/leader` & `/leader/maps`):**
   - **`leader.page.ts` & `leader.page.html`:** Banner/badge dinamis sesuai kasta pimpinan, *Parent Leader Box*, dan listing berjenjang otomatis (Kloter -> Rombongan, Rombongan -> Regu, Regu -> Jamaah).
   - **`maps.page.ts`, `maps.page.html`, `maps.page.scss`:** Navigasi drill-down (`activeLevel`), breadcrumb interaktif, polling 5 detik hemat kuota, horizontal bottom sheet card slider untuk `flyTo`, dan custom SVG marker dengan skema warna:
     - **Diri Sendiri:** Green Pulse
     - **Atasan (*Parent Leader*):** Gold Shield
     - **Bawahan (*Sub Leaders*):** Dark Green Ribbon
     - **Jamaah:** Blue Dot

### B. Fitur Pencarian Hierarkis & Peta Radar (Scoped Search & Theme Integration)
1. **Backend PHP Native (`api/api/leader/search_hierarchy.php`):**
   - Endpoint pencarian berbasis cakupan hierarki (`group_id` dan `q` min. 2 karakter).
   - Mengisolasi hasil pencarian hanya pada rantai komando sah pimpinan login (Kloter -> Rombongan/Regu/Jamaah; Rombongan -> Regu/Jamaah; Regu -> Jamaah sendiri).
   - Memfilter entitas kelompok (`type: group`) dan pengguna non-admin (`type: user`) beserta koordinat GPS aktifnya.

2. **Frontend Service (`TugasYeftaaa/src/app/services/leader.ts`):**
   - Penambahan interface model `SearchResultItem` dan `SearchHierarchyResponse`.
   - Method `searchHierarchy(groupId, query)` untuk konsumsi endpoint backend pencarian.

3. **Peta Radar & Auto-Drilldown (`maps.page.ts`, `maps.page.html`, `maps.page.scss`):**
   - **Debounced Search:** Integrasi RxJS (`debounceTime(400)`, `distinctUntilChanged()`) pada `ion-searchbar`.
   - **Auto-Drilldown Engine:** Memilih hasil pencarian otomatis menyesuaikan `activeLevel`, merekonstruksi urutan `breadcrumbs`, memuat data regu target *on-demand*, dan mengarahkan kamera (`map.flyTo`) ke koordinat pin.
   - **Palet Desain Identitas e-Mutowif:**
     - *Primary Emerald* (`#0b4635`) & *Emerald Light* (`#13634c`) untuk navigasi dan tombol aksi utama.
     - *Accent Gold* (`#c5a059`) & *Gold Soft* (`#f4ecdc`) untuk header hasil pencarian, highlight kartu, dan badge atasan.
     - *Soft Emerald Backdrop Blur* (`rgba(11, 70, 53, 0.28)`) menggantikan overlay gelap kusam.
     - Teks kontras tinggi (`#1f2937`) pada search bar agar nyaman dibaca di perangkat mobile.

---

## 6. KONDISI TERAKHIR PROYEK & TECHNICAL DEBT
- **Hierarki Pemimpin:** Selesai diimplementasikan pada backend dan frontend. Status berikutnya adalah tahap pengujian flow aplikasi secara langsung dengan akun dummy bertingkat (Ketua Kloter -> Ketua Rombongan -> Ketua Regu -> Jamaah), verifikasi akurasi koordinat Leaflet, dan interaksi UI mobile.
- **Modul Umrah:** Baru selesai di sisi form admin panel (penambahan field `ibadah_type`). Sisi user/jamaah dan halaman antarmuka belum selesai (masih tertampung sementara di folder bernama `umroh`).
- **Struktur File Frontend:** Penempatan service belum seragam. Sebagian Angular service masih berada di root `TugasYeftaaa/src/app/` (belum dirapikan ke folder `services/`), dan beberapa dibuat manual tanpa file pengujian `.spec.ts`.

---

## 7. PROTOKOL WAJIB PEMBARUAN AGENT_RULES (SELF-UPDATE RULE)
Setiap kali Agent selesai mengerjakan sebuah task dan developer menyatakan **ACC clear**:
1. Agent **BERHAK dan WAJIB** memperbarui file `AGENT_RULES.md` ini agar mencerminkan kondisi terbaru proyek (misal: mencatat service yang sudah dipindahkan/dirapikan, memperbarui status modul Umrah/Leader yang sudah selesai, atau mencatat penambahan endpoint baru).
2. **Klausul Permanen:** Penjelasan fungsi inti proyek, larangan keamanan (`connection.php`, `.vscode/sftp.json`, aturan manual phpMyAdmin), serta instruksi pembaruan mandiri pada Bagian 7 ini **DILARANG KERAS DIHAPUS ATAU DIUBAH MAKNANYA**.
