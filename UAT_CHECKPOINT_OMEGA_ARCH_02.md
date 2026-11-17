# CHECKPOINT OMEGA-ARCH-02 — ENTERPRISE SECTION LAYOUT CONTRACT DESIGN

Berdasarkan hasil audit akar masalah pada arsitektur paginasi, berikut adalah rancangan desain arsitektur final **Section Layout Contract** yang agnostic dan terukur untuk skala Enterprise.

---

## JAWABAN PERTANYAAN ARSITEKTUR

### 1. Apakah lebih tepat apabila setiap section memiliki Layout Contract sendiri dibanding renderer menentukan page break secara manual?
**YA, SANGAT TEPAT.**
**Alasan:** Pendekatan ini menerapkan *Separation of Concerns* (Pemisahan Tanggung Jawab) dan *Open-Closed Principle*. Renderer seharusnya bersifat "bodoh" (dumb component); tugasnya hanya menggambar apa yang diberikan kepadanya. Jika renderer harus menebak "Ini Cover, maka jangan break" atau "Ini BAB, maka break", renderer menjadi *tightly coupled* dengan domain dokumen. Dengan memberikan Layout Contract pada setiap section, aturan tata letak hidup di layer definisi data (atau registry konfigurasi), membuat renderer bersih, skalabel, dan kebal terhadap perubahan jenis dokumen baru.

### 2. Rancang struktur konseptual Section Layout Contract
Konsepnya adalah setiap blok utama dokumen (Section/Chapter) membawa atau dipasangkan dengan sebuah objek metadata `LayoutContract`. 

Contoh Atribut Konseptual:
- **`startNewPage` (boolean):** Apakah section ini harus dipaksa mulai di halaman fisik baru? (Contoh: Cover = `false`, BAB I = `true`).
- **`keepTogether` (boolean):** Apakah elemen di dalam section ini diharamkan untuk terpotong di tengah halaman? (Contoh: Blok Tanda Tangan Pengesahan = `true`).
- **`allowSplit` (boolean):** Apakah section ini diizinkan mengalir (spill over) ke halaman berikutnya jika melebihi ruang? (Contoh: Paragraf BAB = `true`, Cover = `false`).
- **`orientation` (enum):** `portrait` atau `landscape`.
- **`pageRole` (enum):** `FrontMatter` (romawi), `BodyMatter` (arab), `BackMatter` (lampiran).
- **`printable` (boolean):** Apakah seksi ini ikut dicetak atau hanya untuk layar pratinjau?

### 3. Tentukan siapa yang seharusnya bertanggung jawab terhadap pagination
**Tanggung Jawab: SECTION LAYOUT CONTRACT (Dieksekusi oleh Generic Wrapper).**
**Alasan:** 
- Builder hanya peduli pada *konten* dan *bisnis logik*.
- Browser hanyalah *mesin cetak* yang tidak mengerti konteks KSP atau RKJM.
- Renderer hanya *jembatan visual*.
- **Layout Contract** bertindak sebagai "Direktur Paginasi" yang mendefinisikan *bagaimana* dokumen harus dibagi. Contract ini kemudian dibaca oleh **Generic Wrapper** di dalam Renderer, yang menerjemahkan niat logis tersebut ke dalam struktur CSS absolut (seperti `display: block; page-break-before: always;`) yang tidak bisa dibantah oleh Browser.

### 4. Deklarasi Kontrak vs Eksekusi Renderer
Alih-alih membuat kondisi `if (section.title === 'Cover')`, sistem akan bekerja dengan cara deklaratif:
- **Cover** mendeklarasikan: `{ startNewPage: false, keepTogether: true, allowSplit: false }`.
- **Pengesahan** mendeklarasikan: `{ startNewPage: true, keepTogether: true }`.
- **Daftar Isi** mendeklarasikan: `{ startNewPage: true, allowSplit: true }`.
- **BAB** mendeklarasikan: `{ startNewPage: true, allowSplit: true }`.
- **Renderer** hanya melakukan perulangan (looping):
  `Untuk setiap Section, bungkus dengan GenericWrapper. Jika section.contract.startNewPage == true, tambahkan CSS page-break-before pada Wrapper tersebut.`

### 5. Kompatibilitas Lintas Dokumen (KSP, RKJM, RKT, RKAS)
**SANGAT MEMUNGKINKAN.**
Desain ini memastikan bahwa **Renderer tidak perlu tahu** apakah ia sedang merender KSP, RKJM, RKT, atau RKAS. Selama Payload/Dokumen yang dikirim ke Renderer memiliki struktur array of sections di mana setiap section dilengkapi dengan `LayoutContract`, maka *engine pagination yang sama persis* dapat digunakan untuk seluruh jenis dokumen secara otomatis tanpa ada satupun *hardcode* nama BAB di layer UI.

### 6. Perbandingan Pendekatan

| Kriteria | Pendekatan A (Renderer Mengetahui Jenis Section) | Pendekatan B (Renderer Membaca Layout Contract) |
| :--- | :--- | :--- |
| **Maintainability** | Rendah. Logika bercampur dengan UI. | **Tinggi**. Aturan terpusat di layer data/konfigurasi. |
| **Scalability** | Rendah. Makin banyak dokumen, makin rumit `if-else`. | **Tinggi**. Renderer statis, kebal terhadap penambahan dokumen. |
| **Enterprise Architecture** | Melanggar *Open-Closed Principle*. | **Sesuai**. Clean architecture & Decoupled. |
| **Risiko Regresi** | Tinggi. Ubah RKJM bisa merusak KSP. | **Sangat Rendah**. Kontrak diisolasi per dokumen/section. |
| **Penambahan Dok. Baru** | Lambat. Harus coding ulang UI Renderer. | **Cepat**. Cukup define data & kontrak di Builder/Config. |

### 7. Rekomendasi Final
Rekomendasi arsitektur final untuk Enterprise Print Engine adalah:
**B. Section Layout Contract + Generic Wrapper**

**Alasan Teknis:**
Ini adalah satu-satunya cara untuk mencapai **Predictable Printing**. Dengan memindahkan *intelligence* paginasi dari deteksi *hardcode* di UI menjadi kontrak *metadata-driven*, kita menjamin bahwa Chrome Print Flow selalu menerima struktur DOM block-level murni yang sudah diinstruksikan dengan tepat. Hal ini menghilangkan masalah rendering yang "lompat-lompat" dan "halaman menyatu" untuk selamanya di seluruh lini produk dokumen.

---

## OUTPUT DESAIN ARSITEKTUR FINAL

### Diagram Arsitektur (Konseptual)
```text
[ Document Builder / Aggregator ]
       |
       | (Menyematkan Section Data + Layout Contract)
       v
[ Enterprise Document Payload ]
       |
       | (Dikirim sebagai Props murni)
       v
[ Generic Print Renderer (React) ]
       |
       |--> Loop over Sections
       |
       |--> [ Generic Block Wrapper ] <--- Menerjemahkan LayoutContract
       |           (display: block; break-before: always/auto)
       |           |
       |           |--> [ Section Content Flexbox/UI ]
       v
[ Chrome Print Flow (Browser) ] ---> Hasil cetak sempurna & konsisten
```

### Alur Kerja
1. Builder/Configurator mengompilasi konten dokumen dan menempelkan `LayoutContract` (via metadata atau registry) ke setiap `Section`.
2. Payload dokumen diserahkan ke komponen Renderer (`CanonicalRenderer` atau `EnterpriseDocumentViewer`).
3. Renderer melakukan iterasi melalui seluruh `Section`.
4. Untuk setiap `Section`, Renderer melahirkan sebuah `GenericWrapper` (elemen `div` statis tipe `block`).
5. `GenericWrapper` membaca `LayoutContract`. Jika `startNewPage: true`, ia menambahkan instruksi CSS cetak yang keras (seperti `print:break-before-page`).
6. Konten visual (tabel, teks, dll) dirender di *dalam* pelukan `GenericWrapper` tersebut.

### Tanggung Jawab Masing-Masing Layer
- **Layer Data/Config (Builder/Registry):** Bertanggung jawab mendikte *apa yang harusnya* terpisah halaman (Mendefinisikan Contract).
- **Layer Presentasi (Renderer):** Bertanggung jawab merender UI dan membungkusnya dalam Generic Wrapper tanpa mempertanyakan *mengapa* ia harus di-break.
- **Layer Wrapper (GenericWrapper):** Bertanggung jawab memastikan isolasi CSS, melarang flexbox bocor ke algoritma paginasi browser.
- **Layer Browser:** Hanya mengeksekusi instruksi primitif block-level yang disajikan oleh Wrapper.

### Keuntungan
- **Zero UI Hardcode:** Tidak ada lagi pengecekan `if (title === 'Cover')` di dalam React Components.
- **Future-Proof:** Siap untuk jenis dokumen masa depan tanpa modifikasi print engine.
- **Isolasi Flexbox:** Menyelesaikan bug "halaman menyatu" secara fundamental karena memutus konflik tata letak flexbox dan engine print browser.

### Risiko
- **Migrasi Payload:** Memerlukan sedikit penyesuaian pada output Builder atau Adapter agar memastikan `LayoutContract` (atau referensi ke `LayoutRegistry`) selalu tersedia bagi setiap seksi.
- *Mitigasi:* Dapat menggunakan nilai default global jika kontrak pada suatu seksi spesifik tidak didefinisikan (misal: default `startNewPage: true` untuk semua section level 1).
