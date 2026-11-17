const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const regex2 = /const getValidationIssues = \(\) => \{.*?const handlePrintClick = \(\) => \{[\s\S]*?\};/s;

const replacement2 = `const getValidationIssues = () => {
    const issues = [];
    if (!settings.identityAssets?.governmentLogo?.url) issues.push({ type: "Missing Data", message: "Logo Pemerintah Daerah belum diunggah." });
    if (!settings.school?.name) issues.push({ type: "Missing Data", message: "Identitas Sekolah belum lengkap (Nama Sekolah)." });
    if (!settings.school?.npsn) issues.push({ type: "Missing Data", message: "Identitas Sekolah belum lengkap (NPSN)." });
    if (!settings.principal?.name) issues.push({ type: "Missing Data", message: "Data Kepala Sekolah belum lengkap." });
    if (!settings.komite?.name) issues.push({ type: "Missing Data", message: "Data Komite Sekolah belum lengkap." });
    
    // Recommended issues (we don't push them to the block array, they just show a warning)
    return issues;
  };

  const handlePrintClick = () => {
    const issues = getValidationIssues();
    if (issues.length > 0) {
      setPrintValidation(issues);
      setShowPrintValidation(true);
    } else {
      setShowPrintValidation(false);
      setTimeout(() => window.print(), 100);
    }
  };`;

code = code.replace(regex2, replacement2);
fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Replaced validation issues');
