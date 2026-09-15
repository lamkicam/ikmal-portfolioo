Ikon aplikasi untuk pelat "Tools" di section Introduction.

Kelima file ini harus ada di folder ini, dengan nama persis seperti ini:

  capcut.png
  lightroom.png
  after-effects.png
  premiere-pro.png
  photoshop.png

Ikon ditampilkan 46x46 piksel di halaman, jadi file 96x96 sudah cukup
tajam termasuk di layar retina.

Kalau nanti mau menambah tool baru, salin salah satu baris ini di
index.html (cari kata "class=\"tools\""):

  <li class="tool"><img src="assets/tools/NAMA.png" alt="Nama Tool" loading="lazy"></li>

Kalau ikonnya belum ada, pakai versi huruf sebagai pengganti sementara:

  <li class="tool tool--txt" title="Nama Tool">Xx</li>
