const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const injectHelp = (targetRegex, helpComponent) => {
    // Find the first main div opening after the component declaration
    const match = code.match(targetRegex);
    if (match) {
        // Just inject after the first return (
        // But some components might have condition before return.
        // It's safer to just replace a specific known string in the return.
        // I will do specific string replacements.
    }
}

// 1. DataSekolahView
code = code.replace(
    /(<div className="flex-1 overflow-x-hidden p-6 md:p-8">)/,
    '$1\n        <PageHelp title="Data Sekolah" description="Pusat pengaturan profil, identitas, sarana prasarana, dan tenaga pendidik." importance="Menjadi sumber data utama bagi seluruh dokumen yang akan dihasilkan secara otomatis." nextStep="Lengkapi seluruh informasi secara akurat pada setiap tab." />'
);

// 2. RaporPendidikanView
code = code.replace(
    /(<div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">)/,
    '$1\n      <PageHelp title="Rapor Pendidikan" description="Halaman untuk memasukkan dan menyinkronkan hasil Evaluasi Diri Sekolah atau Rapor Pendidikan." importance="Merupakan dasar evaluasi untuk menentukan program prioritas sekolah secara tepat." nextStep="Unggah data rapor pendidikan terbaru Anda dan kunci data jika sudah sesuai." />'
);

// 3. DecisionEngineView (Analisis Prioritas)
code = code.replace(
    /(<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">)/,
    '$1\n      <PageHelp title="Analisis Prioritas" description="Halaman untuk menganalisis capaian rapor dan menentukan program strategis." importance="Menjadi fondasi program kerja yang akan dituangkan dalam RKJM dan RKT." nextStep="Evaluasi rekomendasi program dan setujui jika sesuai dengan visi sekolah." />'
);

// 4. DokumenPerencanaanView
// Need to find where to put it. Let's look at DokumenPerencanaanView.
// grep -n -A 10 "const DokumenPerencanaanView =" src/Tampuyak.tsx

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Saved');
