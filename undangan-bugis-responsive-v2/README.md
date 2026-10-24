# Undangan Digital — Bugis-inspired responsive starter

Starter website HTML/CSS/JS yang mengikuti arah visual referensi: warna gelap, krem, aksen gold, nuansa Bugis, dan layout responsif.

## Jalankan
1. Ekstrak ZIP.
2. Buka `index.html` di browser.
3. Untuk hosting, unggah seluruh folder beserta folder `assets`.

## Foto (penting)
Masukkan foto asli ke folder `assets` dengan nama:
- `foto-cover.jpg` — foto utama di halaman pembuka
- `foto-pria.jpg` — potret pengantin pria
- `foto-wanita.jpg` — potret pengantin wanita
- `galeri-1.jpg` sampai `galeri-5.jpg` — foto galeri

Galeri memakai CSS Grid responsif dan `object-fit: cover`, sehingga foto tidak meregang. Foto besar akan memenuhi kolom utama di desktop, lalu beradaptasi ke dua kolom pada layar HP. Klik foto untuk melihat versi besar (lightbox). Jika gambar belum ada, website tetap tampil, namun foto tidak akan terlihat; tambahkan foto asli agar slot foto terisi.

Disarankan foto portrait untuk cover dan foto profil, serta foto landscape/portrait campuran untuk galeri. Gunakan foto resolusi cukup besar, idealnya sisi terpanjang 1400–2000 px, JPG/WebP terkompresi, sekitar 200–500 KB per foto jika memungkinkan.

## Personalisasi tamu
Contoh URL: `index.html?to=Faidah`. Di hosting nanti, nama tamu bisa disisipkan sebagai query string atau dibuat sebagai link unik per orang.

## Konfigurasi wajib sebelum publikasi
Buka `script.js`:
- `weddingDate`: ganti dengan tanggal dan waktu acara yang sebenarnya.
- `whatsappNumber`: ganti dengan nomor WhatsApp yang menerima RSVP.
- `accountNumber`: ganti jika fitur hadiah digital dipakai.
- Ganti tanggal, jam, alamat, nama, rekening, dan konten contoh di `index.html`.

Tombol musik masih berupa placeholder; tambahkan file musik yang memang boleh digunakan dan hubungkan dengan elemen audio bila dibutuhkan. RSVP saat ini membuka WhatsApp dengan teks terisi otomatis, bukan menyimpan data ke spreadsheet/database.

## Catatan
Nama, tanggal, alamat, dan rekening di dalam template adalah data contoh, bukan informasi acara final. Pastikan semuanya diganti dan diverifikasi sebelum website dibagikan.
