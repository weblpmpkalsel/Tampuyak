#!/bin/bash
sed -i 's/{currentView === "supervisiAkademik" && <SupervisionAcademicView \/>}/{currentView === "supervisiAkademik" \&\& <SupervisionProvider><SupervisionAcademicView \/><\/SupervisionProvider>}/g' src/Tampuyak.tsx
sed -i 's/import { SupervisionAcademicView } from ".\/modules\/supervision";/import { SupervisionAcademicView, SupervisionProvider } from ".\/modules\/supervision";/g' src/Tampuyak.tsx
