const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const oldRKJMValidate = `  const validateBeforePrint = () => {
    const issues = [];
    if (!settings.school?.name || settings.school?.name === "") {
        issues.push("Data Sekolah: Nama Sekolah belum diisi.");
    }
    if (!settings.principal?.name || settings.principal?.name === "") {
        issues.push("Data Sekolah: Nama Kepala Sekolah belum diisi (untuk bagian Lembar Pengesahan).");
    }
    
    if (issues.length > 0) {
        setPrintValidation(issues);
    } else {
        setIsPrintMode(true);
    }
  };`;

const newRKJMValidate = `  const validateBeforePrint = () => {
    const res = PrePrintValidationEngine.validateDocument("rkjm", settings);
    if (!res.valid) {
        setPrintValidation(res.errors);
    } else {
        setIsPrintMode(true);
    }
  };`;

code = code.replace(oldRKJMValidate, newRKJMValidate);

const oldKSPValidate = `  const validateBeforePrint = () => {
    const issues = [];
    if (!settings.school?.name || settings.school?.name === "") {
        issues.push("Data Sekolah: Nama Sekolah belum diisi.");
    }
    if (!settings.school?.principal || settings.school?.principal === "") {
        issues.push("Data Sekolah: Nama Kepala Sekolah belum diisi (untuk bagian Lembar Pengesahan).");
    }
    
    if (issues.length > 0) {
        setPrintValidation(issues);
    } else {
        setIsPrintMode(true);
    }
  };`;

const newKSPValidate = `  const validateBeforePrint = () => {
    const res = PrePrintValidationEngine.validateDocument(docId, settings);
    if (!res.valid) {
        setPrintValidation(res.errors);
    } else {
        setIsPrintMode(true);
    }
  };`;

code = code.replace(oldKSPValidate, newKSPValidate);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Phase 24 validation engine applied to print');
