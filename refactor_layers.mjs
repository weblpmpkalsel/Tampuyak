import fs from 'fs';

let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

const layerReplacements = [
  ['ENTERPRISE READY', 'SIAP DIGUNAKAN'],
  ['VERY GOOD', 'SANGAT BAIK'],
  ['NEEDS MINOR REVISION', 'PERLU REVISI KECIL'],
  ['REVISION REQUIRED', 'PERLU REVISI'],
  ['Data Integrity', 'Integritas Data'],
  ['Knowledge Consistency', 'Konsistensi Isi'],
  ['Reasoning Validation', 'Validasi Logika'],
  ['Style & Typography', 'Gaya & Tipografi'],
  ['Format Compliance', 'Kesesuaian Format'],
  ['Structure Completeness', 'Kelengkapan Struktur'],
  ['Export Readiness', 'Kesiapan Unduhan'],
  ['Governance Approval', 'Persetujuan Pengesahan'],
  ['Final Validation', 'Validasi Akhir']
];

for (const [en, id] of layerReplacements) {
  content = content.replace(new RegExp(`'${en}'`, 'g'), `'${id}'`);
  content = content.replace(new RegExp(`"${en}"`, 'g'), `"${id}"`);
  content = content.replace(new RegExp(`>${en}<`, 'g'), `>${id}<`);
}

content = content.replace(/>PASS</g, '>VALID<');
content = content.replace(/'PASS'/g, "'VALID'");
content = content.replace(/>FAIL</g, '>GAGAL<');
content = content.replace(/'FAIL'/g, "'GAGAL'");
content = content.replace(/>FAILED</g, '>GAGAL<');
content = content.replace(/'FAILED'/g, "'GAGAL'");
content = content.replace(/>WARN</g, '>PERINGATAN<');
content = content.replace(/'WARN'/g, "'PERINGATAN'");
content = content.replace(/>READY</g, '>SIAP<');

fs.writeFileSync('src/Tampuyak.tsx', content);
console.log('Layer terms replaced');
