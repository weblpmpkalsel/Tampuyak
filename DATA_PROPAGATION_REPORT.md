# DATA PROPAGATION REPORT

Upon successful import of an official workbook:
1. `settings.rapor.data` is updated.
2. `settings.school.name` and `npsn` are synchronized.
3. Analysis (Priorities, Roots, Strengths, Weaknesses) is written natively to `settings.analisis.data`.
4. RKT lines are mapped to `settings.planning.rkt`.
5. ARKAS lines are mapped to `settings.planning.rkas`.
6. `settings.analisis.status` is set to "Disetujui".
7. `settings.rapor.isLocked` is set to true.

Data automatically trickles down into SWOT, IRB, School DNA, KSP, RKJM, RKT, RKAS, and Monitoring views instantly via global state propagation.
