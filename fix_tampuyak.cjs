const fs = require('fs');

let content = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

content = content.replace(
  '{currentView === "supervisiAkademik" && <SupervisionProvider><SupervisionAcademicView /></SupervisionProvider>}',
  '{currentView === "supervisiAkademik" && (import.meta.env.VITE_ENABLE_SUPERVISION_MODULE === \'true\' ? <SupervisionProvider><SupervisionAcademicView /></SupervisionProvider> : <div className="p-8 text-center text-gray-500">Modul Supervisi Akademik belum diaktifkan.</div>)}'
);

fs.writeFileSync('src/Tampuyak.tsx', content);
console.log('Fixed Tampuyak.tsx');
