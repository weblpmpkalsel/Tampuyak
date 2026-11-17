# KSP GOLD 1.5 - CONTRACT DESIGN REPORT
## TAMPUYAK OS ENTERPRISE ARCHITECTURE

### 1. Daftar Field Settings yang Digunakan KSP
Berdasarkan file `EnterpriseConfigurationCenter.ts` dan penggunaan di modul KSP (seperti `KSPDashboard` dan `KspDocumentAssembler`), KSP membutuhkan data identitas berikut:
- `schoolName`
- `npsn`
- `address`
- `village`
- `district`
- `regencyOrCity`
- `province`
- `academicYear`
- `schoolLogoUrl`
- `governmentLogoUrl`
- `schoolStatus`
- `principalName`
- `principalNip`
- `principalPosition`
- `supervisorName`
- `supervisorNip`
- `supervisorPosition`
- `headOfEducationOfficeName`
- `headOfEducationOfficeNip`
- `headOfEducationOfficePosition`
- `schoolCommitteeName`

### 2. Mapping Lengkap Settings → KspMetadata
Modul KSP akan memetakan (mapping) nilai dari state global `Settings` yang berada di `AppContext`:

| KSP Field (KspMetadata) | Settings Field (Single Source of Truth) |
| :--- | :--- |
| `schoolName` | `settings.school.name` |
| `npsn` | `settings.school.npsn` |
| `address` | `settings.school.address` |
| `village` | `settings.school.village` |
| `district` | `settings.school.district` |
| `regencyOrCity` | `settings.school.regency` |
| `province` | `settings.school.province` |
| `academicYear` | `settings.education.academicYear` |
| `schoolLogoUrl` | `settings.branding.logoUrl` (atau `settings.visualIdentity.logoSekolah`) |
| `governmentLogoUrl` | `settings.school.governmentLogo` (atau `settings.identityAssets.governmentLogo`) |
| `schoolStatus` | `settings.school.status` |
| `principalName` | `settings.principal.name` |
| `principalNip` | `settings.principal.nip` |
| `principalPosition` | `settings.principal.position` |
| `supervisorName` | `settings.pengawas.name` |
| `supervisorNip` | `settings.pengawas.nip` |
| `headOfEducationOfficeName` | `settings.kepalaDinas.name` |
| `headOfEducationOfficeNip` | `settings.kepalaDinas.nip` |
| `headOfEducationOfficePosition` | `settings.kepalaDinas.jabatan` |
| `schoolCommitteeName` | `settings.komite.name` |

### 3. Field yang Belum Tersedia

**SUDAH TERSEDIA:** 
Hampir seluruh kebutuhan entitas KSP (20 dari 21 fields) telah tersedia dengan tepat pada objek default settings.

**BELUM TERSEDIA:**
- `supervisorPosition` : Pada model `settings.pengawas` saat ini hanya terdapat `name` dan `nip`. (Dapat diatasi di adapter dengan menggunakan fallback default fallback seperti "Pengawas Sekolah" tanpa mengubah struktur data).
- `vicePrincipal` : KSP Assembler masih menggunakan string literal untuk Wakil Kepala Sekolah ('Bapak Wakil, S.Pd.'). Field spesifik wakil kepala sekolah belum direpresentasikan secara eksklusif dalam objek `settings`. (Hanya di-report, tidak dibuat field baru).

### 4. Kontrak KspMetadata
Desain ViewModel / Data Transfer Object murni untuk konsumsi modul KSP:

```typescript
export interface KspMetadata {
  schoolName: string;
  npsn: string;
  address: string;
  village: string;
  district: string;
  regencyOrCity: string;
  province: string;
  academicYear: string;
  schoolLogoUrl: string;
  governmentLogoUrl: string;
  schoolStatus: string;
  principalName: string;
  principalNip: string;
  principalPosition: string;
  supervisorName: string;
  supervisorNip: string;
  supervisorPosition: string;
  headOfEducationOfficeName: string;
  headOfEducationOfficeNip: string;
  headOfEducationOfficePosition: string;
  schoolCommitteeName: string;
}
```

### 5. Dampak Terhadap Arsitektur (Impact Analysis)
Penerapan desain kontrak ini bersifat sangat aman (ZERO IMPACT ke modul eksternal):
- ✓ **Tidak mengubah RKJM, RKT, RKAS**: Flow data dan builder untuk dokumen RKAS, RKT, dan RKJM terisolasi penuh dan sama sekali tidak menggunakan kontrak ini.
- ✓ **Tidak mengubah Enterprise Architecture & Backup**: Representasi `KspMetadata` ini diekstrak *on-the-fly* pada UI layer (Dashboard/Workspace). Struktur JSON dari global `Settings` yang disimpan ke cloud/local disk tidak berubah. Proses export dan backup tetap konsisten.
- ✓ **Tidak mengubah Workspace Adapter (RKAS, dll.)**: Eksekusi Adapter hanya terjadi pada layer KSP.
- ✓ **Isolasi Logika (Anti-Corruption Layer)**: Komponen internal `KspDocumentAssembler`, `KspPreviewWorkspace`, dan `KSPDashboard` tidak akan tahu mengenai besarnya model state `Settings`. Mereka hanya menerima DTO `KspMetadata`.

### 6. Konfirmasi Single Source of Truth
Berdasarkan rancangan di atas, dikonfirmasi bahwa **KSP akan bertindak sebatas sebagai CONSUMER** yang mengadopsi prinsip pasif. Data sekolah, tim penyusun, dan informasi lain murni ditarik (mapped) dari state mentah Pengaturan (`settings` yang dikendalikan oleh pengguna via `AppContext`). 

Implementasi ini menjamin penghapusan `EnterpriseConfigurationCenter` (yang selama ini berisi fake/mock placeholder) dan menggantikannya dengan data *live* milik pengguna dengan 0% mutasi data.
