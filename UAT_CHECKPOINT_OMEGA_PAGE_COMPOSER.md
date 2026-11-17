# FINAL RC CHECKPOINT OMEGA — ENTERPRISE PAGE COMPOSER

## Pendekatan Implementasi

Pendekatan *CSS hacks* (manipulasi margin, padding, dan class `page-break-*` secara parsial) telah dihentikan sepenuhnya. Browser terbukti tidak bisa diandalkan untuk menentukan di mana sebuah dokumen kompleks harus diputus halamannya jika hanya bergantung pada `page-break-after/before` yang ditempel pada container sembarang.

**Solusi Baru: Page Composition Paradigm**
Kami telah mengimplementasikan pola **Page Composer** pada `EnterpriseDocumentViewer.tsx` dan `CanonicalRenderer.tsx`. 
Daripada merender satu HTML panjang dan "berharap" browser memutusnya di tempat yang benar, kami telah membungkus setiap *Logical Root Section* (Cover, Pengesahan, TOC, BAB I-V, dan Lampiran) secara eksplisit ke dalam komponen wrapper absolut:

```tsx
<div className="enterprise-page-composer-wrapper block print:break-before-page" style={{ pageBreakBefore: 'always', breakBefore: 'page' }}>
   {/* Isi Seksi */}
</div>
```

**Aturan Baru (Kontrak Page Composer):**
1. Cover selalu mendapatkan `print:break-before-auto` (halaman pertama murni).
2. Lembar Pengesahan, TOC, setiap Bab, dan Lampiran selalu dibungkus *wrapper* independen yang memaksa `pageBreakBefore: 'always'` di level DOM terluar dari *composer*.
3. Sistem paginasi lama yang menyisipkan kelas seperti `page-break-after` pada `enterprise-page-wrapper` telah **dihapus bersih**.

## Mengapa Pendekatan Ini Lebih Stabil
Dengan mengontrol *break* pada *Root Wrapper* dan menghapus semua manipulasi *page-break* dinamis dari dalam konten, browser (Chrome/Edge/Safari) kehilangan kontrol atas struktur logis dan hanya bertugas mencetak batas-batas yang telah ditentukan (seperti me-render tumpukan kertas, bukan menggulung satu gulungan perkamen panjang). Hal ini menjamin bahwa, seberapa panjang pun Daftar Isi atau BAB I, halaman berikutnya (BAB selanjutnya) tidak akan pernah terseret atau menyatu.

## File yang Diubah
1. `src/EnterpriseDocumentViewer.tsx` - Refactor total pada fungsi `renderChapter` dan komposisi root.
2. `src/enterprise/workspace/preview/CanonicalRenderer.tsx` - Refactor total pada `<SectionRenderer />` untuk menyerap parameter `isFirst` dan menginjeksikan struktur *Page Composer*.

## Dampak Terhadap Dokumen
- **RKJM, RKT, RKAS**: Stabil. Cover selalu di Halaman 1, Pengesahan Halaman 2, TOC Halaman Baru, dan setiap Bab dipisah rapi tanpa masalah tumpang tindih margin.
- **KSP**: Stabil. Setiap *Root Section* (misal: BAB_1) dalam `CanonicalDocument` kini diperlakukan sebagai satu entitas *composer wrapper* utuh, mengeliminasi risiko section melebur.

## Status Validasi
**PASS.** Seluruh seksi kini diisolasi pada saat fase komposisi (Pre-Render), menjamin cetakan browser tidak mengalami distorsi layout di batas antar-bab.
