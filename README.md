# Portfolio — Muhammad Ikmal Maulana

Website portofolio satu halaman. Semua kode (HTML + CSS + JavaScript) ada di dalam satu file: `index.html`.

## Cara membuka

Klik dua kali `index.html`. Langsung terbuka di browser, tidak perlu install apa pun.

## Struktur folder

```
ikmal-portfolio/
├─ index.html              ← seluruh website ada di sini
├─ README.md               ← file ini
│
├─ assets/
│  ├─ cards/               foto cutout untuk 4 kartu di home
│  │    cut-intro.png/.webp
│  │    cut-prompter.png/.webp
│  │    cut-editing.png/.webp
│  │    cut-photo.png/.webp
│  │    cut-footer.png     (belum dipakai, untuk footer nanti)
│  │
│  ├─ media/               portrait.png/.webp — foto & video karya
│  ├─ tools/               ikon aplikasi: capcut, lightroom, ae, pr, ps
│  ├─ share/               og-image.jpg, gambar preview waktu link dibagikan
│  └─ fonts/               Dovde-Black.woff2 + .woff
│
└─ arsip/                  versi lama & alat yang sudah tidak dipakai
```

## Yang sudah jadi

Baru bagian **Home**: judul PORTOFOLIO, empat kartu navigasi, ticker keahlian, dan dock kontak.

Section Introduction, Prompter, Editing, Photograph, dan footer belum dibuat.

## Mengganti foto kartu

Timpa file di `assets/cards/` dengan nama yang sama persis. Syaratnya:

- PNG transparan, tanpa latar belakang
- Tinggi minimal 1200px supaya tajam di layar besar
- Bagian bawah foto dipotong rata, karena kartu memotongnya di situ

Setelah menimpa file `.png`, file `.webp` yang lama perlu dihapus atau dibuat ulang — kalau tidak, browser masih memakai yang lama.

## Judul besar (font Dovde)

Font Dovde Black terpasang di `assets/fonts/` sebagai `.woff2` (14KB) dengan `.woff` sebagai cadangan untuk browser lama. Judul besar sekarang teks biasa, bukan gambar — jadi bisa di-copy, dibaca screen reader, dan dipakai untuk kata apa pun.

Cara membuat judul Dovde baru:

```html
<span class="wm-box">
  <span class="wordmark dovde" data-split>Prompter</span>
</span>
```

`data-split` membuat tiap huruf muncul bergantian saat halaman dibuka.

**Penting soal ukuran.** Supaya kata memenuhi lebar kolomnya, `font-size` harus dihitung dari lebar kata itu sendiri:

```
lebar = lebar-mentah + 0,02 × (jumlah-huruf − 1)
font-size = 100 ÷ lebar
```

Angka `0,02` itu `letter-spacing` di kelas `.dovde`. Kalau kamu ubah, semua font-size di bawah harus dihitung ulang.

| Kata | Lebar mentah | Huruf | font-size |
|---|---|---|---|
| PORTOFOLIO | 7,355 em | 10 | `13.27cqw` |
| HELLO! | 4,184 em | 6 | `23.34cqw` |
| PROMPTER | 6,639 em | 8 | `14.75cqw` |
| EDITING | 4,888 em | 7 | `19.97cqw` |
| FOTOGRAPH | 7,228 em | 9 | `13.54cqw` |

Satuan `cqw` mengukur lebar `.wm-box`, bukan lebar layar — jadi proporsinya tetap sama di mana pun.

**Dovde hanya punya huruf kapital.** Huruf kecil pun digambar sebagai kapital. Karena itu Dovde cuma dipakai untuk judul besar, tidak untuk teks berjalan dan tidak untuk judul kartu yang memang huruf campuran.

Catatan lisensi: Dovde adalah font berbayar dari [Fontfabric](https://www.fontfabric.com/fonts/dovde/). Untuk dipakai di website yang online, lisensinya harus mencakup webfont — pastikan lisensi yang kamu punya sudah termasuk itu sebelum di-upload.

## Mengubah warna

Semua warna diatur di bagian `:root` paling atas `index.html`:

| Variabel | Fungsi |
|---|---|
| `--o` | oranye utama |
| `--o-hi` | oranye terang, untuk gradien dan sorotan |
| `--o-deep` | oranye gelap, untuk gradien |
| `--c-000` | hitam latar belakang |
| `--txt` | putih teks utama |
| `--txt-dim` | abu teks pendukung |
| `--txt-mute` | abu paling redup, untuk label kecil |

Warna abu sudah disetel supaya lolos standar keterbacaan WCAG AA. Kalau digelapkan lagi, teks kecilnya jadi susah dibaca.

## Sebelum di-upload

Buka `index.html`, cari `ganti-dengan-domain-kamu.com` — ada di dua baris. Ganti dengan alamat website yang asli. Tanpa ini, preview gambar waktu link dikirim ke WhatsApp atau Instagram tidak akan muncul.

## Cara publish gratis

**Netlify Drop** — paling cepat:

1. Buka https://app.netlify.com/drop
2. Seret folder `ikmal-portfolio` ke halaman itu
3. Langsung online, dapat alamat gratis

**GitHub Pages** — kalau mau alamat lebih permanen:

1. Buat repository baru di GitHub
2. Upload seluruh isi folder `ikmal-portfolio`
3. Settings → Pages → Source: `main` → Save

## Catatan teknis

- Ukuran judul dan kartu ikut tinggi layar, jadi seluruh home muat satu layar di laptop 1366×768
- Gambar kartu pakai WebP dengan PNG sebagai cadangan, hemat sekitar 73%
- Di HP, kartu bisa digeser dengan snap dan ada indikator garis di bawahnya
- Animasi otomatis mati untuk pengguna yang mengaktifkan "reduce motion" di sistemnya
