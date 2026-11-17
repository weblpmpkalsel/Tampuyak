const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/knowledge_registry.json', 'utf8'));

const panduanAplikasi = {
    "id": "panduan-tampuyak",
    "category": "faq",
    "Title": "Panduan Lengkap Penggunaan Aplikasi Tampuyak",
    "Summary": "Panduan langkah demi langkah menggunakan aplikasi Tampuyak untuk menyusun dokumen KSP, RKJM, RKT, RKAS, dan LPJ secara otomatis.",
    "Purpose": "Membantu Kepala Sekolah, Bendahara, dan Tim Pengembang Sekolah dalam menguasai seluruh fitur sistem Tampuyak.",
    "Step-by-step guidance": [
      "1. PENGATURAN AWAL (MASTER DATA): Masuk ke menu 'Pengaturan'. Lengkapi seluruh identitas sekolah, data Kepala Sekolah, Komite, Pengawas, Guru, Tendik, serta sarana prasarana. Pastikan semuanya terisi karena data ini menjadi pondasi bagi seluruh dokumen yang akan dihasilkan.",
      "2. ANALISIS RAPOR PENDIDIKAN: Masuk ke modul 'Analisis Data'. Anda dapat mengetik manual atau mengandalkan sistem. Sistem otomatis membaca profil dan karakteristik sekolah untuk mencari akar masalah dan merumuskan prioritas.",
      "3. PENYUSUNAN RKJM & RKT: Lanjutkan ke menu 'Perencanaan Dokumen' (RKJM/RKT). Berdasarkan akar masalah sebelumnya, sistem merekomendasikan program dan kegiatan operasional. Anda bisa mengedit, menambah, atau menghapus kegiatan agar sesuai dengan konteks riil sekolah.",
      "4. PENYUSUNAN RKAS: Buka modul 'Alokasi RKAS'. RKT yang sudah disetujui akan otomatis tersinkronisasi menjadi kerangka RKAS. Anda hanya perlu mendistribusikan pagu anggaran BOS yang tersedia ke dalam kegiatan-kegiatan tersebut.",
      "5. KSP STUDIO: Fitur andalan untuk menyusun Kurikulum Satuan Pendidikan (KSP). Sistem akan merangkai informasi karakteristik sekolah, visi, misi, serta pengorganisasian pembelajaran menjadi dokumen baku KSP yang utuh.",
      "6. E-OFFICE & LPJ: Gunakan 'E-Office' untuk otomasi pembuatan Surat Tugas, Undangan, dan surat dinas lainnya. Gunakan 'LPJ Kepala Sekolah' untuk menyusun Lembar Pertanggungjawaban Mutlak BOSP secara instan.",
      "7. BACKUP DATA (SANGAT PENTING): Aplikasi Tampuyak menyimpan data secara lokal di perangkat Anda demi privasi dan keamanan (Offline First). WAJIB melakukan 'Backup JSON' di menu Pengaturan secara berkala agar jika Anda berganti komputer atau membersihkan browser, data tidak hilang."
    ],
    "Common mistakes": [
      "Tidak melengkapi Master Data di awal, menyebabkan dokumen yang dicetak memiliki bagian yang kosong/tidak lengkap.",
      "Mengubah data di RKT namun lupa menyesuaikan kembali pagu anggaran di modul RKAS, sehingga terjadi ketidaksesuaian.",
      "Lupa melakukan pencadangan data (Backup JSON). Karena data disimpan secara lokal, sangat disarankan mencadangkan data setiap selesai bekerja."
    ],
    "Related regulations": "Panduan ini disesuaikan dengan alur kerja manajerial Kepala Sekolah sesuai dengan juknis pengelolaan BOSP dan Kurikulum Merdeka.",
    "Related templates": ["Dokumen KSP", "Dokumen RKJM", "Dokumen RKT", "Dokumen RKAS"],
    "Related workspace": ["Pengaturan", "Pusat Pengetahuan", "KSP Studio", "Perencanaan Dokumen"]
};

data.unshift(panduanAplikasi);
fs.writeFileSync('src/knowledge_registry.json', JSON.stringify(data, null, 2));
console.log('Knowledge registry patched.');
