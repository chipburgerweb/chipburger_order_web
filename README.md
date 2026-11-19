# Chip Burger Web Store & Daily Open Order System (Node.js Edition)

**Brand / UMKM**: Chip Burger (@chipburger_id)  
**Nomor WhatsApp Resmi**: 0822-8436-2199  
**Versi**: 1.1 (PRD Compliant)  
**Teknologi**: Node.js, Express / Native HTTP, Tailwind CSS, Lucide Icons

---

## 🚀 Struktur Node.js di Project Ini

1. **[package.json](file:///d:/chip-burger-web/package.json)**:
   - Metadata proyek, dependensi (`express`, `cors`), dan script eksekusi:
     ```json
     "scripts": {
       "start": "node server.js",
       "dev": "node --watch server.js"
     }
     ```
2. **[server.js](file:///d:/chip-burger-web/server.js)**:
   - Server backend berbasis Node.js yang melayani:
     - **Static Hosting**: Menayangkan file antarmuka `index.html`, `login.html`, aset css, js, dan gambar.
     - **REST API Endpoints**:
       - `GET /api/menu`: Mengembalikan data 7 menu burger resmi beserta harga dan komposisinya.
       - `GET /api/info`: Mengembalikan status jam operasional dan ketentuan ongkir.
       - `POST /api/auth/login`: Endpoint autentikasi login member.
       - `POST /api/auth/register`: Endpoint pendaftaran pelanggan baru.
       - `POST /api/orders`: Endpoint pencatatan pesanan & generator antrean `#CB-XXX`.
   - Menggunakan modul bawaan Node.js (`http`, `fs`, `path`) sehingga dapat berjalan langsung tanpa perlu `npm install` pihak ketiga, atau dapat dipadukan dengan Express.
3. **[start-server.bat](file:///d:/chip-burger-web/start-server.bat)**:
   - Script 1-klik untuk pengguna Windows agar dapat menjalankan server Node.js dan otomatis membuka `http://localhost:3000` di browser.

---

## 💻 Cara Menjalankan Website dengan Node.js

### Langkah 1: Pastikan Node.js Terpasang di Komputer
Jika di komputer Anda belum terpasang Node.js, unduh dan pasang terlebih dahulu melalui [https://nodejs.org/](https://nodejs.org/) (pilih versi **LTS**).

### Langkah 2: Jalankan Server
Buka terminal (Command Prompt / PowerShell / Terminal Antigravity IDE) di folder `d:\chip-burger-web`, lalu ketik:

```bash
npm start
```
*atau*:
```bash
node server.js
```

### Langkah 3: Buka di Browser
Buka browser Anda dan akses:
👉 **`http://localhost:3000`**

---

## 🎨 Ringkasan Identitas Visual & Menu (PRD v1.1)

- **Warna**: Warm Cream (`#F9F4E8`), Deep Maroon (`#5A0C12`), Antique Gold (`#B88928`), Logo Bun (`#7F232C`), Patty/Saus (`#532122`).
- **Logo SVG Vektor**: Kubah maroon (#7F232C) dengan 10 biji wijen krem, patty bergelombang (#532122), dan kapsul *premium taste*.
- **7 Menu Resmi**:
  1. No Salad Burger (27K)
  2. Lo Burger (32K) - Best Seller
  3. Mushroom Burger (37K)
  4. Gourmet Burger (40K) - Best Seller
  5. Smoked Beef Burger (43K)
  6. Cheese Burger (47K) - Best Seller & Double Cheese
  7. Doubpat Burger (74K) - Double Cheese
- **Aturan Ongkos Kirim**: Delivery Kurir flat Rp 10.000, Pickup Rp 0.
- **Checkout WhatsApp**: Otomatis generate nomor antrean unik `#CB-XXX` dan format pesanan ke `0822-8436-2199`.
