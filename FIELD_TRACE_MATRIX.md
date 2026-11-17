# Field Trace Matrix

| Field Name | State Path | Component | Consumer | Persistence | Output Locations |
|---|---|---|---|---|---|
| School Name | `settings.school.name` | `Settings/SchoolForm` | DOE, UI Headers | IndexedDB | KSP, RKJM, RKT, RKAS, Headers |
| Principal | `settings.principal.name` | `Settings/SchoolForm` | DOE, Signatures | IndexedDB | KSP, RKJM, RKT, RKAS |
| NPSN | `settings.school.npsn` | `Settings/SchoolForm` | DOE | IndexedDB | Documents |
| Vision | `settings.identitas.visi` or `settings.analisis.data.tujuan` | UI | DOE (partially) | IndexedDB | KSP |
| Mission | `settings.identitas.misi` | UI | DOE (partially) | IndexedDB | KSP |
| Literacy Score | `settings.rapor.data["A.1"]` | `RaporView` | RPIE -> DOE | IndexedDB | KSP, RKJM, RKT |
