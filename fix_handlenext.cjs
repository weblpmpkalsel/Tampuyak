const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const oldHandleNext = `  const handleNextStep = () => {
    if (activeStep < RKJMPipelineEngine.Steps.length - 1) setActiveStep(prev => prev + 1);
  };`;

const newHandleNext = `  const validateStep = (stepId: string) => {
    switch (stepId) {
      case "load_school":
        if (!settings.school?.name || !settings.school?.governmentLogo) return "Identitas sekolah atau Logo Pemerintah Daerah belum lengkap.";
        break;
      case "load_decision":
        if (settings.decisionEngine?.status !== "Disetujui") return "Analisis Prioritas belum disetujui.";
        if (!settings.decisionEngine?.data?.program || settings.decisionEngine.data.program.length === 0) return "Program strategis belum dihasilkan.";
        break;
      case "load_target":
        if (settings.targetEngine?.status !== "Disetujui") return "Target Sekolah belum disetujui.";
        break;
      case "preview":
        if (!settings.school?.governmentLogo) return "Logo Pemerintah Daerah wajib diisi sebelum Pratinjau.";
        break;
    }
    return null;
  };

  const handleNextStep = () => {
    const errorMsg = validateStep(currentStepData.id);
    if (errorMsg) {
       alert(errorMsg); // Or standard UI error
       return;
    }
    if (activeStep < RKJMPipelineEngine.Steps.length - 1) setActiveStep(prev => prev + 1);
  };`;

code = code.replace(oldHandleNext, newHandleNext);
fs.writeFileSync('src/Tampuyak.tsx', code);
