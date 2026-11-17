const fs = require('fs');
let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

// Replace PageHelp for Data Sekolah
const oldDataSekolahHelp = `<PageHelp title="Data Sekolah" description="Pusat pengaturan profil, identitas, sarana prasarana, dan tenaga pendidik." importance="Menjadi sumber data utama bagi seluruh dokumen yang akan dihasilkan secara otomatis." nextStep="Lengkapi seluruh informasi secara akurat pada setiap tab." />`;
const newDataSekolahHelp = `<PageHelp 
          title="Data Sekolah" 
          description="Pusat pengaturan profil, identitas, sarana prasarana, dan tenaga pendidik." 
          importance="Menjadi sumber data utama bagi seluruh dokumen yang akan dihasilkan secara otomatis. Kesalahan data disini akan berakibat pada seluruh dokumen." 
          nextStep="Lengkapi seluruh informasi secara akurat pada setiap tab."
          time="10-15 Menit"
          checklist={["SK Pendirian Sekolah", "Data Pokok Pendidik", "Data Ruangan & Sarpras"]}
          mistakes={["Mengisi nama sekolah tanpa awalan yang benar (misal: hanya mengisi '1 Jakarta' bukan 'SDN 1 Jakarta')."]}
        />`;

if (content.includes(oldDataSekolahHelp)) {
  content = content.replace(oldDataSekolahHelp, newDataSekolahHelp);
}

// Replace PageHelp for Dokumen Perencanaan
const oldDokumenHelp = `<PageHelp title="Dokumen Perencanaan" description="Pusat pengelolaan seluruh dokumen perencanaan sekolah (RKJM, RKT, RKAS)." importance="Membantu Anda melacak status penyusunan dan memonitor seluruh dokumen dalam satu tempat." nextStep="Pilih dokumen yang ingin disusun atau ditinjau." />`;
const newDokumenHelp = `<PageHelp 
        title="Dokumen Perencanaan" 
        description="Pusat pengelolaan seluruh dokumen perencanaan sekolah (RKJM, RKT, RKAS) dan Kurikulum (KSP)." 
        importance="Membantu Anda melacak status penyusunan dan memonitor seluruh dokumen dalam satu tempat secara berkesinambungan." 
        nextStep="Pilih dokumen yang ingin disusun atau ditinjau, mulai dari RKJM jika ini adalah siklus 4 tahunan." 
        regulation="Permendikbud No. 19 Tahun 2007"
        time="Bervariasi per dokumen"
        mistakes={["Membuat RKAS tanpa menyusun RKT dan RKJM terlebih dahulu.", "Dokumen tidak sinkron satu sama lain."]}
      />`;

if (content.includes(oldDokumenHelp)) {
  content = content.replace(oldDokumenHelp, newDokumenHelp);
}

// Replace PageHelp for Rapor Pendidikan
const oldRaporHelp = `<PageHelp title="Rapor Pendidikan" description="Halaman untuk memasukkan dan menyinkronkan hasil Evaluasi Diri Sekolah atau Rapor Pendidikan." importance="Merupakan dasar evaluasi untuk menentukan program prioritas sekolah secara tepat." nextStep="Unggah data rapor pendidikan terbaru Anda dan kunci data jika sudah sesuai." />`;
const newRaporHelp = `<PageHelp 
        title="Rapor Pendidikan" 
        description="Halaman untuk memasukkan dan menyinkronkan hasil Evaluasi Diri Sekolah atau Rapor Pendidikan." 
        importance="Merupakan dasar evaluasi untuk menentukan program prioritas sekolah secara tepat." 
        nextStep="Unggah data rapor pendidikan terbaru Anda dan kunci data jika sudah sesuai." 
        checklist={["File Unduhan Excel Rapor Pendidikan Tahun Terakhir"]}
        mistakes={["Menganalisis Rapor yang kedaluwarsa.", "Tidak memperhatikan indikator akar masalah."]}
      />`;

if (content.includes(oldRaporHelp)) {
  content = content.replace(oldRaporHelp, newRaporHelp);
}

fs.writeFileSync('src/Tampuyak.tsx', content);
