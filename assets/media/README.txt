File media untuk website. Nama harus PERSIS seperti di bawah,
karena index.html mencarinya dengan nama itu.


SUDAH TERPASANG
───────────────
  portrait.png / .webp        foto di kartu HELLO (Introduction)
  prompter-bg.jpg / .webp     foto Shibuya di banner Prompter
  prompter-cut.png / .webp    cutout kamu di banner Prompter


MASIH KOSONG — bagian Prompter
──────────────────────────────
Video Product (5 slot):
  prompter-01.mp4    9:16   vertikal
  prompter-02.mp4    9:16   vertikal  ← slot besar di tengah
  prompter-03.mp4    1:1    kotak
  prompter-04.mp4    9:16   vertikal
  prompter-05.mp4    1:1    kotak

UGC / Animation / Brands (3 slot):
  prompter-ugc-01.mp4    9:16
  prompter-ugc-02.mp4    9:16
  prompter-ugc-03.mp4    9:16

Bukti TikTok:
  tiktok-profile.png     9:16   screenshot profil TikTok


CARA MEMASANG VIDEO
───────────────────
Cari nama filenya di index.html, misalnya "prompter-01.mp4".
Ganti seluruh blok <div class="ph">...</div> dengan:

  <video src="assets/media/prompter-01.mp4"
         poster="assets/media/prompter-01.jpg"
         muted loop playsinline preload="none"></video>

Yang penting:
  poster        gambar sampul, WAJIB diisi. Ini yang bikin halaman ringan.
  preload="none"  videonya baru diunduh saat diputar, bukan saat halaman dibuka.

Untuk foto, cukup:

  <img src="assets/media/tiktok-profile.png" alt="Profil TikTok" loading="lazy">


UKURAN FILE
───────────
Video  : target di bawah 1 MB per klip. Kalau file aslinya 3-4 MB,
         kompres dulu — bilang saja, nanti dibantu.
Poster : JPG lebar 800px, sekitar 60 KB.
Foto   : lebar maksimal 1200px.

Kalau semua 8 video langsung dimuat tanpa poster, halaman jadi
sekitar 30 MB dan butuh hampir satu menit di jaringan seluler.
Dengan poster + preload="none", beban awalnya cuma sekitar 500 KB.
