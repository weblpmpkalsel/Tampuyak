const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

// 1. ADD REGULATION REGISTRY
const oldRegulationEngine = `const RegulationGovernanceEngine = {`;
const newRegulationEngine = `const MasterRegulationRegistry = {
  RKJM: {
    regulationNumber: "Permendikbud No. 19/2007",
    regulationTitle: "Standar Pengelolaan Pendidikan",
    effectiveDate: "2007-05-23",
    version: "2024-v1",
    requiredChapters: ["Pendahuluan", "Kondisi Objektif", "Tujuan dan Sasaran", "Program Strategis", "Penutup"],
    printRules: {
      requireSignatures: ["Kepala Sekolah", "Ketua Komite"],
      requireStempel: true,
      requireLogoSekolah: true
    }
  },
  RKT: {
    regulationNumber: "Permendikbudristek No. 47/2023",
    regulationTitle: "Standar Pengelolaan pada PAUD, Jenjang Pendidikan Dasar, dan Menengah",
    effectiveDate: "2023-08-04",
    version: "2024-v1",
    requiredChapters: ["Pendahuluan", "Evaluasi Pelaksanaan", "Rencana Kerja", "Jadwal", "Penutup"],
    printRules: {
      requireSignatures: ["Kepala Sekolah", "Ketua Komite"],
      requireStempel: true,
      requireLogoSekolah: true
    }
  },
  RKAS: {
    regulationNumber: "Permendikbudristek No. 63/2022",
    regulationTitle: "Petunjuk Teknis Pengelolaan Dana BOS",
    effectiveDate: "2022-12-28",
    version: "2024-v1",
    requiredChapters: ["Pendahuluan", "Rincian Penerimaan", "Rincian Belanja", "Penutup"],
    printRules: {
      requireSignatures: ["Kepala Sekolah", "Bendahara", "Ketua Komite"],
      requireStempel: true,
      requireLogoSekolah: true
    }
  },
  KSP: {
    regulationNumber: "Panduan KSP Revisi 2025",
    regulationTitle: "Panduan Pengembangan Kurikulum Satuan Pendidikan Edisi Revisi",
    effectiveDate: "2025-01-01",
    version: "2025-v1",
    requiredChapters: ["Karakteristik Satuan Pendidikan", "Visi, Misi, dan Tujuan", "Pengorganisasian Pembelajaran", "Perencanaan Pembelajaran", "Evaluasi"],
    printRules: {
      requireSignatures: ["Kepala Sekolah", "Kepala Dinas", "Ketua Komite"],
      requireStempel: true,
      requireLogoSekolah: true
    }
  }
};

const RegulationGovernanceEngine = {`;

code = code.replace(oldRegulationEngine, newRegulationEngine);

// 2. ADD VERSION FREEZE TO METADATA
code = code.replace(
  'version: "6.6.0",',
  'version: "1.0.0-RC",\n    versionFreeze: false,'
);

// 3. PRE-PRINT VALIDATION ENGINE
const newPrintValidation = `const PrePrintValidationEngine = {
  validateDocument: (docId: string, settings: any) => {
    const docMeta = settings.documents?.find((d: any) => d.id === docId);
    if (!docMeta) return { valid: false, errors: ["Dokumen tidak ditemukan"] };
    
    const reg = MasterRegulationRegistry[docMeta.type as keyof typeof MasterRegulationRegistry];
    if (!reg) return { valid: false, errors: ["Regulasi tidak ditemukan"] };
    
    const errors: string[] = [];
    
    // Validate Profile
    if (!settings.school?.name) errors.push("Nama sekolah wajib diisi");
    if (!settings.school?.npsn) errors.push("NPSN wajib diisi");
    
    // Validate Signatures & Logos
    if (reg.printRules.requireLogoSekolah && !settings.visualIdentity?.logoSekolah) {
       errors.push("Logo Sekolah wajib diunggah sesuai regulasi.");
    }
    if (reg.printRules.requireStempel && !settings.visualIdentity?.stempel) {
       errors.push("Stempel resmi wajib diunggah.");
    }
    reg.printRules.requireSignatures.forEach((sig: string) => {
       if (sig === "Kepala Sekolah" && !settings.visualIdentity?.ttdKepalaSekolah) errors.push("Tanda tangan Kepala Sekolah belum diunggah.");
       if (sig === "Ketua Komite" && !settings.visualIdentity?.ttdKomite) errors.push("Tanda tangan Ketua Komite belum diunggah.");
    });
    
    // Check workflow status
    if (docMeta.status !== "Disetujui" && docMeta.status !== "Terkunci" && docMeta.status !== "Siap Dicetak" && docMeta.status !== "Final") {
       errors.push(\`Status dokumen saat ini adalah \${docMeta.status}. Dokumen harus disetujui sebelum dicetak.\`);
    }

    // Check version freeze
    if (settings.metadata?.versionFreeze && docMeta.status === "Draft") {
       errors.push("Sistem dalam mode Version Freeze. Tidak bisa mencetak draft.");
    }
    
    return { valid: errors.length === 0, errors };
  }
};

const TemplateTokenEngine`;

code = code.replace('const TemplateTokenEngine', newPrintValidation);

// 4. DOCUMENT HEALTH SCORE Component
const DocumentHealthScoreComponent = `
const DocumentHealthScore = ({ docId, settings }: { docId: string, settings: any }) => {
  const docMeta = settings.documents?.find((d: any) => d.id === docId);
  if (!docMeta) return null;

  const validRes = PrePrintValidationEngine.validateDocument(docId, settings);
  const healthScore = validRes.valid ? 100 : Math.max(0, 100 - validRes.errors.length * 20);
  
  let status = "FAILED";
  let statusColor = "bg-rose-100 text-rose-700";
  if (healthScore === 100) {
    status = "PASS";
    statusColor = "bg-emerald-100 text-emerald-700";
  } else if (healthScore > 50) {
    status = "WARNING";
    statusColor = "bg-amber-100 text-amber-700";
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm mb-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h4 className="font-bold text-slate-800">Document Health Score</h4>
          <p className="text-xs text-slate-500">Enterprise Pre-Print Validation</p>
        </div>
        <div className={\`px-3 py-1 font-bold text-sm rounded-lg \${statusColor}\`}>
          {status} ({healthScore}%)
        </div>
      </div>
      {!validRes.valid && (
        <div className="space-y-2">
          {validRes.errors.map((e: string, i: number) => (
             <div key={i} className="flex items-start text-xs text-slate-700">
               <AlertCircle className="w-4 h-4 text-rose-500 mr-2 flex-shrink-0" />
               {e}
             </div>
          ))}
        </div>
      )}
    </div>
  );
};
`;

code = code.replace('const LayoutContainer =', DocumentHealthScoreComponent + '\n\nconst LayoutContainer =');

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Phase 24 changes applied successfully');
