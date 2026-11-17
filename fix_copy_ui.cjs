const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const oldMap = `                      {Object.entries({
                        school: "Profil Sekolah",
                        principal: "Kepala Sekolah",
                        guru: "Guru",
                        tendik: "Tendik",
                        komite: "Komite",
                        pengawas: "Pengawas",
                        sarpras: "Sarpras",
                        programUnggulan: "Program Unggulan",
                        potensi: "Kearifan Lokal",
                        identitas: "Identitas Sekolah",
                        karakteristik: "Karakteristik",
                        branding: "Branding & Logo",
                      }).map(([k, label]) => (`;

const newMap = `                      {Object.entries({
                        school: "Profil Sekolah",
                        principal: "Kepala Sekolah",
                        guru: "Guru",
                        tendik: "Tendik",
                        komite: "Komite",
                        pengawas: "Pengawas",
                        sarpras: "Sarpras",
                        programUnggulan: "Program Unggulan",
                        potensi: "Kearifan Lokal",
                        identitas: "Identitas Sekolah",
                        karakteristik: "Karakteristik",
                        branding: "Branding & Logo",
                        planning: "Data Perencanaan (Rapor/Diagnosis)",
                        documents: "Dokumen (RKJM/RKT/RKAS)",
                        visualIdentity: "Tanda Tangan & Stempel",
                      }).map(([k, label]) => (`;

code = code.replace(oldMap, newMap);
fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Fixed copy UI');
