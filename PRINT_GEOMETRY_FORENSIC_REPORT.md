# PRINT GEOMETRY FORENSIC REPORT
**Checkpoint:** OMEGA — ENTERPRISE PUBLISHING ENGINE
**Continuation Code:** RC-03-GEOMETRY
**Project:** TAMPUYAK OS

## 1. Executive Summary

Hasil audit *read-only* mengonfirmasi bahwa masalah pengecilan dokumen (shrink) dan margin yang terlalu lebar (double-margin effect) pada saat *Browser Print* disebabkan oleh **konflik kepemilikan geometry (geometry ownership conflict)** antara level `@page` (Browser) dengan level komponen `div` (Presentation Layer).

Terdapat konflik *specificity* dimana *inline style* di `CanonicalRenderer` mengalahkan class `.print-section-override`, sehingga memaksa elemen memiliki lebar absolut 210mm di dalam kanvas cetak yang sudah dipotong margin.

---

## 2. CSS Cascade & Computed Style Analysis

Fokus audit adalah elemen representasi halaman di `src/enterprise/workspace/preview/CanonicalRenderer.tsx` (elemen dengan class `.portrait-section`).

### Tabel Resolusi Properti
| Property | Source | Value | Specificity | Winner |
| :--- | :--- | :--- | :--- | :--- |
| **width** | `.print-section-override` (CSS)<br>Inline Style (React) | `auto`<br>`210mm` | 0,0,1,0<br>1,0,0,0 | **Inline Style** (`210mm`) |
| **height / min-height**| Inline Style (React) | `297mm` | 1,0,0,0 | **Inline Style** (`297mm`) |
| **margin** | `.print-section-override` (CSS)<br>Inline Style (React) | `0`<br>`0 auto` | 0,0,1,0<br>1,0,0,0 | **Inline Style** (`0 auto`) |
| **padding** | Inline Style (React) | `3cm 3cm 3cm 4cm` (T/R/B/L) | 1,0,0,0 | **Inline Style** (`3cm 3cm 3cm 4cm`) |
| **box-sizing** | `.gdds-page-wrapper` (CSS)<br>Inline Style (React) | `border-box`<br>`border-box` | 0,0,1,0<br>1,0,0,0 | **Inline Style** (`border-box`) |
| **transform** | `.print-no-transform` (CSS) | `none` | 0,0,1,0 | *N/A on page container* |
| **overflow** | `.gdds-preview-scale` (CSS) | `visible` | 0,0,1,0 | *N/A on page container* |

*Catatan:*
Aturan `@page { size: A4 portrait; margin: 3cm 3cm 3cm 4cm; }` di `src/index.css` mendikte margin fisik kanvas print pada browser, BUKAN pada elemen DOM.

---

## 3. Mathematical Geometry Calculation

Berdasarkan *computed style* di atas, berikut adalah perhitungan matematis *rendering pipeline* pada saat print diaktifkan:

1. **Browser Physical Page Width (A4):** 210mm
2. **Browser Page Margins (`@page`):** Kiri 40mm (4cm) + Kanan 30mm (3cm) = 70mm
3. **Available Printable Width:** 210mm - 70mm = **140mm**

*(Ini adalah lebar maksimal ruang cetak yang disediakan browser)*

Namun, elemen `div` halaman merender dirinya sebagai berikut:
4. **Computed DOM Element Width:** 210mm *(dari Inline Style)*
5. **Computed DOM Element Padding:** Kiri 40mm + Kanan 30mm = 70mm *(dari Inline Style)*
6. **Computed DOM Element Content Width:** 210mm - 70mm = **140mm**

---

## 4. Analisis Auto Shrink

**Apakah Browser melakukan Auto Shrink?**
**YA**

### Penyebab Matematis:
Browser memiliki *Printable Width* sebesar **140mm**.
Elemen DOM secara eksplisit menuntut *width* sebesar **210mm**.

Karena 210mm > 140mm, algoritma *shrink-to-fit* pada *browser print engine* aktif secara otomatis untuk mencegah konten terpotong. 

**Scale Factor (Faktor Pengecilan):**
`140mm / 210mm = 0.666... (66.67%)`

### Dampak Geometri Akhir pada Kertas Cetak:
Setelah diskalakan sebesar 66.67%, geometri fisik aktual yang dicetak adalah:

* **Final Physical Page Width:** 210mm *(Kertas A4)*
* **Final Printable Width:** 140mm *(Disediakan Browser)*
* **Final DOM Element Width di Kertas:** 210mm * 0.666 = **140mm**
* **Final Content Width (Lebar Teks Aktual):** 140mm * 0.666 = **93.33mm** *(Seharusnya 140mm)*
* **Final Left Margin (Margin Kiri Aktual):** `@page` margin (40mm) + [DOM padding-left (40mm) * 0.666] = 40mm + 26.66mm = **66.66mm (6.66cm)** *(Seharusnya 4cm)*
* **Final Right Margin (Margin Kanan Aktual):** `@page` margin (30mm) + [DOM padding-right (30mm) * 0.666] = 30mm + 20mm = **50mm (5cm)** *(Seharusnya 3cm)*
* **Ukuran Font Aktual:** Semua font menyusut menjadi **66.67%** dari ukuran aslinya (misalnya, font 12pt akan dicetak sebesar ~8pt).

---

## 5. Kesimpulan (Akar Masalah)

Masalah ini adalah fenomena **Double-Margin and Forced Width Effect**. 

Geometry dirender dua kali (bertumpuk):
1. Oleh `@page` (Browser Print Engine).
2. Oleh Inline Style `CanonicalRenderer` (DOM Layer).

Karena *Inline Style* memiliki *specificity* tertinggi (1,0,0,0), properti CSS `@media print` seperti `.print-section-override` yang mencoba mereset `width` dan ukuran lainnya tidak berlaku. Browser melihat DOM dengan lebar 210mm di dalam area cetak 140mm, sehingga terpaksa melakukan pengecilan skala paksa ~66.67%. Ini yang memicu font menjadi kecil dan margin visual membengkak.
