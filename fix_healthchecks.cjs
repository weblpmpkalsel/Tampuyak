const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const regex = /const chaptersComplete = coverageData\.every.*?const getValidationIssues = \(\) => \{/s;

const replacement = `const chaptersComplete = coverageData.every(c => c.status === "Complete" || c.status === "Not Applicable");

  const healthChecks = [
    { id: "govLogo", label: "Logo Pemerintah Daerah", valid: !!settings.identityAssets?.governmentLogo?.url, type: "mandatory" },
    { id: "schoolId", label: "Identitas Sekolah", valid: !!settings.school?.name && !!settings.school?.npsn, type: "mandatory" },
    { id: "chapters", label: "Kelengkapan Bab (Coverage Engine)", valid: chaptersComplete, type: "mandatory" },
    { id: "signatures", label: "Tanda Tangan Pengesah", valid: !!settings.identityAssets?.principalSignature?.url && !!settings.identityAssets?.committeeSignature?.url, type: "recommended" },
    { id: "stamp", label: "Stempel Sekolah", valid: !!settings.identityAssets?.stamp?.url, type: "recommended" },
    { id: "schoolPhoto", label: "Foto Sekolah", valid: !!settings.identityAssets?.schoolPhoto?.url, type: "optional" },
    { id: "schoolLogo", label: "Logo Sekolah", valid: !!settings.identityAssets?.schoolLogo?.url, type: "optional" }
  ];
  
  const mandatoryChecks = healthChecks.filter(c => c.type === "mandatory");
  const recommendedChecks = healthChecks.filter(c => c.type === "recommended");
  
  const isDraftReady = mandatoryChecks.every(c => c.valid);
  const isPrintReady = isDraftReady && recommendedChecks.every(c => c.valid) && ["Disetujui", "Terkunci", "Siap Dicetak", "Final"].includes(meta.status);
  
  const healthScore = Math.round((healthChecks.filter(c => c.valid && c.type !== "optional").length / (mandatoryChecks.length + recommendedChecks.length)) * 100);

  const handleExportDocx = () => {
    if (!isDraftReady) return showToast("Dokumen belum siap dicetak. Periksa Data Wajib.", "error");
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + document.getElementById("printable-doc").innerHTML + footer;
    const source = "data:application/vnd.ms-word;charset=utf-8," + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = \`\${meta.title} - \${settings.school?.name || "Sekolah"}.doc\`;
    fileDownload.click();
    document.body.removeChild(fileDownload);
  };
  
  
  const [showPrintValidation, setShowPrintValidation] = useState(false);

  const getValidationIssues = () => {`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Replaced healthchecks');
