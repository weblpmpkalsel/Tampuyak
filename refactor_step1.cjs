const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const regexReplacements = [
    // Wording replacements in text content (JSX Text or string literals)
    [/>\s*Generate with AI\s*</g, '>Planning<'],
    [/"Generate with AI"/g, '"Planning"'],
    [/>\s*AI Engine\s*</g, '>System<'],
    [/"AI Engine"/g, '"System"'],
    [/>\s*Generate RKJM\s*</g, '>Create RKJM<'],
    [/"Generate RKJM"/g, '"Create RKJM"'],
    [/>\s*Blueprint\s*</g, '>Planning Summary<'],
    [/"Blueprint"/g, '"Planning Summary"'],
    [/>\s*Publishing\s*</g, '>Print & Export<'],
    [/"Publishing"/g, '"Print & Export"'],
    [/>\s*Pipeline\s*</g, '>Document Progress<'],
    [/"Pipeline"/g, '"Document Progress"'],
    [/>\s*Assembly\s*</g, '>Document Preparation<'],
    [/"Assembly"/g, '"Document Preparation"'],
    [/>\s*Generator\s*</g, '>Document Builder<'],
    [/"Generator"/g, '"Document Builder"'],

    // Specific text replacements from literals.txt
    [/"AI Diagnosis Rapor"/g, '"Diagnosis Rapor"'],
    [/"AI Diagnosis"/g, '"Diagnosis Rapor"'],
    [/"Diambil langsung\. Tidak boleh diubah AI\."/g, '"Diambil langsung. Diisi manual."'],
    [/"Dihasilkan AI\."/g, '"Diisi otomatis."'],
    [/"Dibuat Document Engine\."/g, '"Dibuat oleh Sistem."'],
    [/"Context-Aware Priority Engine"/g, '"Sistem Prioritas"'],
    [/"SMART Target & Strategy Generator"/g, '"Sistem Target & Strategi"'],
    [/"Implementation & Monitoring Engine"/g, '"Sistem Monitoring"'],
    [/"Template-Driven Document Generator"/g, '"Sistem Pembuat Dokumen"'],
    [/"Dihasilkan AI\. Dapat diedit, diregenerasi, disetujui\."/g, '"Dihasilkan otomatis. Dapat diedit, disesuaikan, disetujui."'],
    [/"Ditulis sepenuhnya oleh pengguna\. Tidak ditimpa AI\."/g, '"Ditulis sepenuhnya oleh pengguna. Tidak ditimpa otomatis."'],
    [/"Konteks utama pendidikan sebagai nyawa bagi penyusunan narasi dokumen oleh AI\."/g, '"Konteks utama pendidikan sebagai panduan bagi penyusunan narasi dokumen."'],
    [/"Mode Pengembang \(AI\)"/g, '"Mode Pengembang"'],
    [/"Publishing History"/g, '"Print & Export History"'],
    [/"AI Request"/g, '"System Request"'],
    [/"AI Response"/g, '"System Response"'],
    [/"AI \+ Knowledge Base"/g, '"Knowledge Base"'],
    [/label: "AI"/g, 'label: "Writing Assistant"'], // Replace AI label
    [/>AI</g, '>Writing Assistant<'], // Replace JSX text AI
];

for (const [regex, replacement] of regexReplacements) {
    code = code.replace(regex, replacement);
}

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Saved to src/Tampuyak.tsx');
