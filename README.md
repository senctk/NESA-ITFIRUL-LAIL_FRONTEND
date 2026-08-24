# Hokky Store — Frontend Technical Test

Aplikasi React untuk menampilkan katalog produk dan daftar transaksi dari dummy API Spring Boot.

## Prasyarat

- Node.js 20+ dan npm
- Backend tes berjalan di `http://localhost:8055` (`java -jar backend.jar`)

## Menjalankan aplikasi

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

Vite meneruskan request `/dummy/*` ke `http://localhost:8055`, sehingga aplikasi bisa mengakses API tanpa konfigurasi CORS tambahan. Bila backend tersedia pada host lain, set `VITE_API_BASE_URL` ke URL backend tersebut sebelum menjalankan aplikasi.

## Endpoint

- `GET /dummy/produk`
- `GET /dummy/transaksi`

## Fitur

- Katalog produk dengan gambar, kategori, stok, harga Rupiah, dan status aktif.
- Detail transaksi termasuk status, pembayaran, pengiriman, resi, catatan, serta item pesanan.
- Tampilan responsif, loading state, dan error/retry state.
