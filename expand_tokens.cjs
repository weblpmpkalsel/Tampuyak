const fs = require('fs');

let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const oldTokensCode = `  getTokens: (settings: any): Record<string, string> => ({
    "school.name": settings.school?.name || "NAMA SEKOLAH",
    "school.npsn": settings.school?.npsn || "-",
    "school.address": settings.school?.address || "-",
    "master.principal.name": settings.principal?.name || "Belum diatur",
    "master.principal.nip": settings.principal?.nip || "-",
    "master.committee.name": settings.komite?.name || "Belum diatur",
    "master.supervisor.name": settings.pengawas?.name || "Belum diatur",
    "master.educationOffice.name": settings.kepalaDinas?.name || "Belum diatur",
  }),`;

const newTokensCode = `  getTokens: (settings: any): Record<string, string> => {
    // Determine active academic year
    const activeYear = settings.academicYears?.find((y: any) => y.isActive) || { year: "2024/2025", semester: "Ganjil" };
    return {
    "school.name": settings.school?.name || "NAMA SEKOLAH",
    "school.npsn": settings.school?.npsn || "-",
    "school.address": settings.school?.address || "-",
    "school.status": settings.school?.status || "Negeri",
    "school.level": settings.school?.level || "SD",
    "school.province": settings.school?.province || "-",
    "school.city": settings.school?.city || "-",
    "school.district": settings.school?.district || "-",
    
    "academic.year": activeYear.year || "-",
    "academic.semester": activeYear.semester || "-",
    
    "master.principal.name": settings.principal?.name || "Belum diatur",
    "master.principal.nip": settings.principal?.nip || "-",
    "master.treasurer.name": settings.bendaharaBOS?.name || "Belum diatur",
    "master.treasurer.nip": settings.bendaharaBOS?.nip || "-",
    "master.committee.name": settings.komite?.name || "Belum diatur",
    "master.supervisor.name": settings.pengawas?.name || "Belum diatur",
    "master.supervisor.nip": settings.pengawas?.nip || "-",
    "master.educationOffice.name": settings.kepalaDinas?.name || "Belum diatur",
    
    "planning.rkjm.status": settings.documents?.find((d: any) => d.type === "RKJM")?.status || "Belum Ada",
    "planning.rkt.status": settings.documents?.find((d: any) => d.type === "RKT")?.status || "Belum Ada",
    "planning.rkas.status": settings.documents?.find((d: any) => d.type === "RKAS")?.status || "Belum Ada",
  };},`;

code = code.replace(oldTokensCode, newTokensCode);
fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Expanded tokens');
