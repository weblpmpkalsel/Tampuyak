# UX-2.0 KSP WORKSPACE INFORMATION ARCHITECTURE

## EXECUTIVE SUMMARY
The KSP Workspace navigation has been completely redesigned to achieve a 1:1 mapping with the canonical printed KSP Document. This ensures an intuitive authoring experience where the mental model of the workspace perfectly mirrors the physical output document. Users will no longer have to hunt for settings across disparate modules; if a section exists in the KSP, it exists in the corresponding Workspace chapter.

## INFORMATION ARCHITECTURE & CHAPTER MAPPING

### BAB I: Karakteristik Satuan Pendidikan
*   **Workspace Section**: `BAB I - Karakteristik`
*   **Content Areas**:
    *   Profil Satuan Pendidikan (Identitas, Lokasi, Status)
    *   Konteks Sosial Budaya dan Lingkungan
    *   Karakteristik Peserta Didik
    *   Karakteristik Pendidik dan Tenaga Kependidikan
    *   Kemitraan (Orang Tua, Masyarakat, DUDI)

### BAB II: Visi, Misi, dan Tujuan
*   **Workspace Section**: `BAB II - Arah Strategis`
*   **Content Areas**:
    *   Visi Satuan Pendidikan
    *   Misi Satuan Pendidikan
    *   Tujuan Jangka Pendek, Menengah, dan Panjang

### BAB III: Pengorganisasian Pembelajaran
*   **Workspace Section**: `BAB III - Pengorganisasian Pembelajaran`
*   **Content Areas**:
    *   Struktur Kurikulum (Fase, Pendekatan)
    *   Pengaturan Beban Belajar (Alokasi JP)
    *   Intrakurikuler (Mata Pelajaran)
    *   Kokurikuler (Proyek Profil, Pembiasaan)
    *   Ekstrakurikuler (Wajib, Pilihan)
    *   Kalender Akademik (Minggu Efektif, Jadwal Tahunan)

### BAB IV: Perencanaan Pembelajaran
*   **Workspace Section**: `BAB IV - Perencanaan Pembelajaran`
*   **Content Areas**:
    *   Ruang Lingkup Satuan Pendidikan (Capaian Pembelajaran)
    *   Ruang Lingkup Kelas (Alur Tujuan Pembelajaran, Modul Ajar)
    *   Strategi Diferensiasi
    *   Kebijakan Asesmen Pembelajaran

### BAB V: Evaluasi, Pendampingan, dan Pengembangan Profesional
*   **Workspace Section**: `BAB V - Evaluasi & Pengembangan`
*   **Content Areas**:
    *   Evaluasi Pembelajaran dan Kurikulum
    *   Pendampingan Akademik dan Psikososial
    *   Pengembangan Profesional Pendidik

## ENFORCED RULES
1.  **Isomorphism**: Every Workspace section directly corresponds to ONE chapter in the generated KSP.
2.  **No Hidden Authoring Locations**: Settings related to the Academic Calendar, for instance, are exclusively found under BAB III, not hidden in a generic "Settings" or "Admin" tab.
3.  **No Duplicated Entry Points**: A specific data entity (e.g., Extracurricular) can only be edited from its designated chapter.
4.  **Zero Search Policy**: The explicit chronological ordering (BAB I to BAB V) eliminates the need for users to guess where to input specific data.

## IMPACT
By aligning the Workspace Information Architecture directly with the Golden Government Document, we reduce cognitive load, improve data completeness, and ensure that the KSP compilation process is a natural output of the authoring journey.
