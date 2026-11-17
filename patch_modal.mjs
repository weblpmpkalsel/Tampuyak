import fs from 'fs';

let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

const modalSearch = `<div className="flex justify-between"><span className="text-[var(--color-eds-text-primary)]">Trend & Peringkat</span><span className="font-medium">{pendingImport.metadata.trendImported || pendingImport.metadata.rankingImported ? "Terdeteksi" : "Tidak Terdeteksi"}</span></div>`;

const modalReplace = `<div className="flex justify-between"><span className="text-[var(--color-eds-text-primary)]">Trend & Peringkat</span><span className="font-medium">{pendingImport.metadata.trendImported || pendingImport.metadata.rankingImported ? "Terdeteksi" : "Tidak Terdeteksi"}</span></div>
                          <div className="flex justify-between"><span className="text-[var(--color-eds-text-primary)]">Rencana Kegiatan (RKT)</span><span className="font-medium">{pendingImport.metadata.rktImported} Baris</span></div>
                          <div className="flex justify-between"><span className="text-[var(--color-eds-text-primary)]">Anggaran (ARKAS)</span><span className="font-medium">{pendingImport.metadata.rkasImported} Baris</span></div>`;

content = content.replace(modalSearch, modalReplace);

// Also need to use schoolData name and NPSN in the modal
const schoolNameSearch = `<div className="flex justify-between"><span className="text-[var(--color-eds-text-primary)]">Nama Sekolah</span><span className="font-medium">{settings.identity?.namaSekolah || "-"}</span></div>`;
const schoolNameReplace = `<div className="flex justify-between"><span className="text-[var(--color-eds-text-primary)]">Nama Sekolah</span><span className="font-medium">{pendingImport.schoolData?.name || settings.school?.name || "-"}</span></div>`;
content = content.replace(schoolNameSearch, schoolNameReplace);

const npsnSearch = `<div className="flex justify-between"><span className="text-[var(--color-eds-text-primary)]">NPSN</span><span className="font-medium">{settings.identity?.npsn || "-"}</span></div>`;
const npsnReplace = `<div className="flex justify-between"><span className="text-[var(--color-eds-text-primary)]">NPSN</span><span className="font-medium">{pendingImport.schoolData?.npsn || settings.school?.npsn || "-"}</span></div>`;
content = content.replace(npsnSearch, npsnReplace);


fs.writeFileSync('src/Tampuyak.tsx', content);
console.log('Tampuyak.tsx patched modal');
