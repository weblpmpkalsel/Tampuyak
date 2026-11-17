const fs = require('fs');

let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const validationModal = `
  const [showPrintValidation, setShowPrintValidation] = useState(false);

  const getValidationIssues = () => {
    const issues = [];
    if (!settings.school?.name) issues.push({ type: "Missing Data", message: "Identitas Sekolah belum lengkap (Nama Sekolah)." });
    if (!settings.school?.npsn) issues.push({ type: "Missing Data", message: "Identitas Sekolah belum lengkap (NPSN)." });
    if (!settings.rapor?.isLocked) issues.push({ type: "Consistency", message: "Data Rapor Pendidikan belum dikunci/disinkronkan." });
    if (!settings.relationalPlanning || settings.relationalPlanning.objectives.length === 0) {
       issues.push({ type: "Missing Activities", message: "RKJM Master Plan belum disusun." });
    } else {
       const rp = settings.relationalPlanning;
       if (!rp.annualPlans?.Y1?.rkt || rp.annualPlans.Y1.rkt.length === 0) issues.push({ type: "Missing Activities", message: "RKT Tahun 1 kosong, belum ada aktivitas yang diturunkan dari RKJM." });
       if (!rp.annualPlans?.Y1?.rkas || rp.annualPlans.Y1.rkas.length === 0) issues.push({ type: "Missing Budgets", message: "RKAS Tahun 1 kosong, belum ada anggaran untuk RKT." });
       if (!rp.annualPlans?.Y1?.monitoring || rp.annualPlans.Y1.monitoring.length === 0) issues.push({ type: "Missing Evidence", message: "Monitoring Tahun 1 kosong, belum ada bukti pelaksanaan untuk anggaran." });
    }
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
  };
`;

const renderValidationModal = `
      {showPrintValidation && printValidation && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-rose-50 p-6 border-b border-rose-100 flex items-center">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mr-4 shrink-0">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-rose-900">Validasi Pra-Cetak Gagal</h3>
                <p className="text-rose-700 text-sm mt-1">Ditemukan inkonsistensi atau data yang hilang pada sistem perencanaan.</p>
              </div>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="space-y-3">
                {printValidation.map((issue, idx) => (
                  <div key={idx} className="flex p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm">
                    <span className="font-bold text-slate-700 w-32 shrink-0">{issue.type}</span>
                    <span className="text-slate-600">{issue.message}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end">
              <Button onClick={() => setShowPrintValidation(false)} className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-6">
                Tutup & Perbaiki
              </Button>
            </div>
          </div>
        </div>
      )}
`;

// Replace handlePrint definition inside DocumentWorkspaceView
const handlePrintRegex = /const handlePrint = \(\) => \{[\s\S]*?\};/;
code = code.replace(handlePrintRegex, validationModal);

// Inject renderValidationModal before the final closing div of DocumentWorkspaceView
// Let's find the end of DocumentWorkspaceView: `      <style>{`
const styleInjectionIndex = code.indexOf('<style>{`\\n        @media print');
if (styleInjectionIndex !== -1) {
  code = code.slice(0, styleInjectionIndex) + renderValidationModal + '\\n      ' + code.slice(styleInjectionIndex);
}

// We also need to change `onClick={handlePrint}` to `onClick={handlePrintClick}`
code = code.replace(/onClick=\{handlePrint\}/g, 'onClick={handlePrintClick}');

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Validation injected');
