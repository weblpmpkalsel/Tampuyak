# APPLICATION SERVICE: MODUL SUPERVISI AKADEMIK

**Tanggal Dokumen:** 26 Juli 2026
**Fase:** S6.4 Application Service
**Status:** FINAL (Safe Mode)

## 1. TUJUAN

Dokumen ini menjelaskan implementasi lapisan Application Service pada Modul Supervisi Akademik. Application Service bertugas sebagai orkestrator (penghubung) antara UI/Presentation Layer (yang belum dibuat) dengan Domain Model (yang telah dibuat di fase S6.2).

Sesuai prinsip Clean Architecture dan Zero Impact, Application Service di sini hanya bertugas:
- Menerima masukan dari luar melalui Data Transfer Objects (DTO).
- Memvalidasi kelengkapan masukan dan alur logika dari setiap Use Case (S6.3).
- Menginstansiasi dan merakit (orchestrate) entitas Domain Model.
- Mengembalikan objek Domain (atau DTO output) yang valid dan siap disimpan.

## 2. KONTRAK IMPLEMENTASI (THE NO'S)

- **NO Storage:** Service ini sama sekali tidak mengetahui cara menyimpan data (tidak ada Firebase, tidak ada IndexedDB).
- **NO API:** Tidak ada pemanggilan HTTP/Network di sini.
- **NO React:** Tidak ada dependensi React (Hook, Context, JSX). Kode ini adalah murni TypeScript class.
- **NO State:** Class `SupervisionApplicationService` beroperasi secara *stateless*.

## 3. PEMETAAN USE CASE KE SERVICE METHODS

Berikut adalah pemetaan langsung dari Use Case (S6.3) ke *method* di `SupervisionApplicationService`:

| Use Case | Method Name | Input DTO | Output Model |
| --- | --- | --- | --- |
| UC01: Create Supervision Plan | `createSupervisionPlan` | `CreateSupervisionPlanDTO` | `SupervisionPlan` |
| UC02: Schedule Supervision | `scheduleSupervision` | `ScheduleSupervisionDTO` | `SupervisionSchedule` |
| UC03: Upload Teaching Module | `uploadTeachingModule` | `UploadTeachingModuleDTO` | `PreObservation` |
| UC04: Conduct Observation | `conductObservation` | `SubmitObservationDTO` | `Observation` |
| UC05: Submit Reflection | `submitReflection` | `SubmitReflectionDTO` | `Reflection` |
| UC06: Conduct Coaching | `conductCoachingSession`| `ConductCoachingDTO` | `CoachingSession` |
| UC07: Create Follow-Up Plan | `createFollowUpPlan` | `CreateFollowUpPlanDTO` | `FollowUp` |
| UC08: Generate Recommendation| `generateRecommendation` | `GenerateRecommendationDTO`| `Recommendation` |

## 4. DOMAIN LOGIC TERISOLASI

Di dalam `SupervisionApplicationService`, telah disematkan agregasi logika spesifik yang hanya boleh dilakukan oleh layer ini atau Domain Layer. Sebagai contoh, saat mengeksekusi `conductObservation`, service ini secara otomatis menghitung *Average Score* berdasarkan `rubricItemId` yang dikirim dan menyimpulkan `finalScoreCategory` menjadi (SANGAT_BAIK, BAIK, CUKUP, atau KURANG). 

## 5. KESIMPULAN

Application Service telah sukses dibangun tanpa merusak *Planning Engine* atau *Legacy Code*. Kode ini 100% *type-safe* dan murni berisi *business rules* dari *Supervision*. Nantinya (pada fase S6.6 atau S6.7), UI hanya perlu memanggil *method* dari Service ini dan mengirim objek yang dikembalikan ke *Storage Adapter*.
