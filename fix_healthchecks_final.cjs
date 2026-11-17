const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const regex = /const chaptersComplete = coverageData\.every.*?const getValidationIssues = \(\) => \{/s;

const replacement = `const chaptersComplete = coverageData.every(c => c.status === "Complete" || c.status === "Not Applicable");

  const healthChecks = [
    { id: "govLogo", label: "Logo Pemerintah Daerah", valid: !!settings.identityAssets?.governmentLogo?.url, type: "mandatory" },
    { id: "schoolId", label: "Identitas Sekolah", valid: !!settings.school?.name && !!settings.school?.npsn, type: "mandatory" },
    { id: "principal", label: "Data Kepala Sekolah", valid: !!settings.principal?.name, type: "mandatory" },
    { id: "committee", label: "Data Komite Sekolah", valid: !!settings.komite?.name, type: "mandatory" },
    { id: "chapters", label: "Kelengkapan Bab (Coverage Engine)", valid: chaptersComplete, type: "certification_only" },
    { id: "signatures", label: "Tanda Tangan Pengesah (Digital Signature)", valid: !!settings.identityAssets?.principalSignature?.url && !!settings.identityAssets?.committeeSignature?.url, type: "recommended" },
    { id: "stamp", label: "Stempel Sekolah (Official Seal)", valid: !!settings.identityAssets?.stamp?.url, type: "recommended" },
    { id: "schoolPhoto", label: "Foto Bangunan (Building Photo)", valid: !!settings.identityAssets?.schoolPhoto?.url, type: "recommended" },
    { id: "schoolLogo", label: "Logo Sekolah", valid: !!settings.identityAssets?.schoolLogo?.url, type: "optional" }
  ];
  
  const mandatoryChecks = healthChecks.filter(c => c.type === "mandatory");
  const recommendedChecks = healthChecks.filter(c => c.type === "recommended");
  const certificationOnlyChecks = healthChecks.filter(c => c.type === "certification_only");
  
  const isDraftReady = mandatoryChecks.every(c => c.valid);
  const isPrintReady = isDraftReady && recommendedChecks.every(c => c.valid) && certificationOnlyChecks.every(c => c.valid) && ["Disetujui", "Terkunci", "Siap Dicetak", "Final"].includes(meta.status);
  
  const healthScore = Math.round((healthChecks.filter(c => c.valid && c.type !== "optional").length / (mandatoryChecks.length + recommendedChecks.length + certificationOnlyChecks.length)) * 100);

  const handleExportDocx = () => {
    if (!isPrintReady) return showToast("Dokumen belum mencapai Sertifikasi Final untuk Official Export.", "error");
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
