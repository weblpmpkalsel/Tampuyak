import fs from 'fs';

let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

// Replace Parser terminology
content = content.replace(/Mesin Parser/g, 'Sistem Pembaca Data');
content = content.replace(/Review data yang berhasil diekstrak oleh parser/g, 'Tinjau data yang berhasil diekstrak');
content = content.replace(/Parser menggunakan mode kompatibilitas/g, 'Sistem menggunakan mode kompatibilitas');

// Replace Developer mode terminology
content = content.replace(/showDevMode/g, 'tampilkanLanjutan');
content = content.replace(/developerMode/g, 'pengaturanLanjutan');

// Replace Coverage Engine
content = content.replace(/Coverage Engine/g, 'Kelengkapan Data');

// Replace Schema
content = content.replace(/DocumentSchema/g, 'StrukturDokumen');
content = content.replace(/Schema: /g, 'Struktur: ');

// State variables
content = content.replace(/State Workflow/g, 'Proses Alur Kerja');
content = content.replace(/Editor State/g, 'Status Teks');

fs.writeFileSync('src/Tampuyak.tsx', content);
console.log('Done cleaning dev terminology');
