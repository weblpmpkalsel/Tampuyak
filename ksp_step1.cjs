const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

// 1. Add kepalaDinas to DEFAULT_SETTINGS
code = code.replace(
  '  pengawas: { name: "", nip: "", pangkat: "", instansi: "", tglMulai: "", phone: "" },',
  '  pengawas: { name: "", nip: "", pangkat: "", instansi: "", tglMulai: "", phone: "" },\n  kepalaDinas: { name: "", nip: "", jabatan: "", instansi: "", noSk: "", tglMulai: "", tglSelesai: "", statusAktif: true },'
);

// 2. Add kepalaDinas to migration in AppProvider
code = code.replace(
  '          pengawas: { ...DEFAULT_SETTINGS.pengawas, ...parsed.pengawas },',
  '          pengawas: { ...DEFAULT_SETTINGS.pengawas, ...parsed.pengawas },\n          kepalaDinas: { ...DEFAULT_SETTINGS.kepalaDinas, ...parsed.kepalaDinas },'
);

// 3. Update tabs in DataSekolahView
const oldTabs = `    { id: "principal", label: "Kepala Sekolah", icon: UserCircle },
    { id: "guru", label: "Guru", icon: Users },
    { id: "tendik", label: "Tenaga Kependidikan", icon: Briefcase },
    { id: "pesertaDidik", label: "Peserta Didik", icon: Users },
    { id: "rombel", label: "Rombel", icon: Layers },
    { id: "sarpras", label: "Sarpras", icon: Home },
    { id: "komite", label: "Komite", icon: Users },
    { id: "pengawas", label: "Pengawas", icon: UserCheck },
    { id: "academicYear", label: "Tahun Pelajaran", icon: Calendar },`;

const newTabs = `    { id: "pejabat", label: "Pejabat Penandatangan", icon: FileSignature },
    { id: "guru", label: "Guru", icon: Users },
    { id: "tendik", label: "Tenaga Kependidikan", icon: Briefcase },
    { id: "pesertaDidik", label: "Peserta Didik", icon: Users },
    { id: "rombel", label: "Rombel", icon: Layers },
    { id: "sarpras", label: "Sarpras", icon: Home },
    { id: "academicYear", label: "Tahun Pelajaran", icon: Calendar },`;

code = code.replace(oldTabs, newTabs);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('done modifying DataSekolahView tabs and DEFAULT_SETTINGS');
