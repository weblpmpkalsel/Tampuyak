const fs = require('fs');
const file = 'src/modules/supervision/ui/SupervisionRtlSession.tsx';
let code = fs.readFileSync(file, 'utf8');

const regex = /const handleFinishRtl = async \(\) => \{/;

const replacement = `const handleVerifyRtl = async (actionPlanId: string, isApproved: boolean) => {
    if (!followUp) return;
    try {
      const verifierNotes = isApproved ? 'Bagus, RTL telah selesai dengan baik.' : 'Mohon lengkapi bukti yang diperlukan sesuai dengan deskripsi.';
      const updated = applicationService.verifyActionPlan({
        followUp,
        actionPlanId,
        isApproved,
        verifierNotes
      });
      const saved = await mockFollowUpRepo.update(updated.id, updated);
      setFollowUp(saved);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleFinishRtl = async () => {`;

code = code.replace(regex, replacement);

fs.writeFileSync(file, code);
