const fs = require('fs');

let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const oldStepsCode = `  const steps = [
    { id: "dataSekolah", label: "Data Sekolah", check: () => settings?.school?.name !== "" },
    { id: "rapor", label: "Rapor Pendidikan", check: () => settings?.rapor?.isLocked },
    { id: "diagnosis", label: "Analisis Prioritas", check: () => settings?.decisionEngine?.status === "Disetujui" },
    { id: "rkjm", label: "RKJM", check: () => docs.some((d: any) => d.type === "RKJM" && ["Disetujui", "Terkunci", "Diarsipkan", "Siap Dicetak", "Final"].includes(d.status)) },
    { id: "rkt", label: "RKT", check: () => docs.some((d: any) => d.type === "RKT" && ["Disetujui", "Terkunci", "Diarsipkan", "Siap Dicetak", "Final"].includes(d.status)) },
    { id: "rkas", label: "RKAS", check: () => docs.some((d: any) => d.type === "RKAS" && ["Disetujui", "Terkunci", "Diarsipkan", "Siap Dicetak", "Final"].includes(d.status)) },
    { id: "monitoring", label: "Monitoring", check: () => false },
  ];`;

const newStepsCode = `  const steps = [
    { id: "dataSekolah", label: "Data Sekolah", check: () => settings?.school?.name !== "" },
    { id: "rapor", label: "Rapor Pendidikan", check: () => settings?.rapor?.isLocked },
    { id: "diagnosis", label: "Analisis Prioritas", check: () => settings?.decisionEngine?.status === "Disetujui" },
    { id: "rkjm", label: "RKJM", check: () => docs.some((d: any) => d.type === "RKJM" && ["Disetujui", "Terkunci", "Diarsipkan", "Siap Dicetak", "Final"].includes(d.status)) },
    { id: "rkt", label: "RKT", check: () => docs.some((d: any) => d.type === "RKT" && ["Disetujui", "Terkunci", "Diarsipkan", "Siap Dicetak", "Final"].includes(d.status)) },
    { id: "rkas", label: "RKAS", check: () => docs.some((d: any) => d.type === "RKAS" && ["Disetujui", "Terkunci", "Diarsipkan", "Siap Dicetak", "Final"].includes(d.status)) },
    { id: "pelaksanaan", label: "Pelaksanaan", check: () => docs.some((d: any) => d.type === "KSP" && ["Disetujui", "Terkunci", "Diarsipkan", "Siap Dicetak", "Final"].includes(d.status)) },
    { id: "monitoring", label: "Monitoring", check: () => docs.some((d: any) => d.type === "Monitoring" && ["Disetujui", "Terkunci", "Diarsipkan", "Siap Dicetak", "Final"].includes(d.status)) },
    { id: "evaluasi", label: "Evaluasi", check: () => false },
  ];`;

code = code.replace(oldStepsCode, newStepsCode);

const oldViewMap = `  const viewMap: any = {
    "dataSekolah": "dataSekolah",
    "rapor": "rapor",
    "diagnosis": "diagnosis",
    "analisis": "diagnosis",
    "rkjmPipeline": "rkjm",
    "documentDetail_rkjm": "rkjm",
    "rktDerivation": "rkt",
    "documentDetail_rkt": "rkt",
    "rkasDerivation": "rkas",
    "documentDetail_rkas": "rkas",
    "monitoring": "monitoring",
    "kspStudio": "rkt", // Arbitrary
    "documentDetail_ksp": "rkt",
  };`;

const newViewMap = `  const viewMap: any = {
    "dataSekolah": "dataSekolah",
    "rapor": "rapor",
    "diagnosis": "diagnosis",
    "analisis": "diagnosis",
    "rkjmPipeline": "rkjm",
    "documentDetail_rkjm": "rkjm",
    "rktDerivation": "rkt",
    "documentDetail_rkt": "rkt",
    "rkasDerivation": "rkas",
    "documentDetail_rkas": "rkas",
    "pelaksanaan": "pelaksanaan",
    "kspStudio": "pelaksanaan",
    "documentDetail_ksp": "pelaksanaan",
    "monitoring": "monitoring",
    "evaluasi": "evaluasi",
  };`;
code = code.replace(oldViewMap, newViewMap);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Fixed workflow stepper');
