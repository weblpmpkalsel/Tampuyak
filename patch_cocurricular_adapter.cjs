const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/enterprise/workspace/adapters/CurriculumAdapter.ts');
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('CocurricularAdapter')) {
  const adapterCode = `
export class CocurricularAdapter {
  static normalize(rawCocurricular: any, metadata: any) {
    if (!rawCocurricular) {
      return {
        programIdentity: "Program Kokurikuler Terpadu",
        objectives: "Meningkatkan pemahaman dan penerapan Dimensi Profil Lulusan serta 7 Kebiasaan Anak Indonesia Hebat melalui pengalaman belajar yang bermakna di luar jam pelajaran intrakurikuler.",
        targetLearners: "Seluruh peserta didik",
        activities: [],
        assessment: "Asesmen proses, observasi, dan portofolio kegiatan.",
        reflection: "Refleksi berkala oleh pendidik dan peserta didik setelah setiap kegiatan utama.",
        supportingDocuments: []
      };
    }
    
    return {
      programIdentity: rawCocurricular.programIdentity || "Program Kokurikuler Terpadu",
      objectives: rawCocurricular.objectives || "Meningkatkan pemahaman dan penerapan Dimensi Profil Lulusan serta 7 Kebiasaan Anak Indonesia Hebat.",
      targetLearners: rawCocurricular.targetLearners || "Seluruh peserta didik",
      activities: Array.isArray(rawCocurricular.activities) ? rawCocurricular.activities.map((a: any, idx: number) => ({
        id: a.id || \`act-\${idx}\`,
        activityName: a.activityName || "",
        targetPhase: a.targetPhase || metadata?.phase || "Fase A",
        implementationTime: a.implementationTime || "",
        profilLulusanDimensions: Array.isArray(a.profilLulusanDimensions) ? a.profilLulusanDimensions : [],
        tujuhKebiasaan: Array.isArray(a.tujuhKebiasaan) ? a.tujuhKebiasaan : [],
        description: a.description || ""
      })) : [],
      assessment: rawCocurricular.assessment || "Asesmen proses dan portofolio.",
      reflection: rawCocurricular.reflection || "Refleksi berkala.",
      supportingDocuments: Array.isArray(rawCocurricular.supportingDocuments) ? rawCocurricular.supportingDocuments : []
    };
  }
}
`;
  content += adapterCode;
  fs.writeFileSync(file, content);
  console.log("Updated CurriculumAdapter.ts with CocurricularAdapter");
}
