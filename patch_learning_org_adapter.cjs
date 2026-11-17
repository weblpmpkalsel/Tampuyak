const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/enterprise/workspace/adapters/CurriculumAdapter.ts');
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('LearningOrganizationAdapter')) {
  const adapterCode = `
export class LearningOrganizationAdapter {
  static normalize(rawLearningOrg: any, metadata: any) {
    if (!rawLearningOrg) {
      return {
        educationalPhilosophy: "Pembelajaran berpusat pada peserta didik, memastikan bahwa setiap anak mendapatkan layanan pendidikan yang sesuai dengan tahap perkembangan kognitif, sosial, dan emosionalnya.",
        learningPrinciples: "Interaktif, inspiratif, menyenangkan, menantang, dan memotivasi peserta didik untuk berpartisipasi aktif, serta memberikan ruang yang cukup bagi prakarsa, kreativitas, dan kemandirian sesuai dengan bakat, minat, dan perkembangan fisik serta psikologis peserta didik.",
        implementationStrategy: "Terintegrasi melalui pendekatan holistik dalam kegiatan intrakurikuler, kokurikuler, dan ekstrakurikuler dengan memanfaatkan lingkungan sekolah sebagai sumber belajar utama.",
        responsibleUnit: "Tim Pengembang Kurikulum Satuan Pendidikan bekerjasama dengan seluruh dewan guru dan komite sekolah.",
        targetLearners: "Seluruh peserta didik pada jenjang " + (metadata?.educationLevel || "Pendidikan Dasar") + ".",
        assessmentApproach: "Asesmen diagnostik pada awal pembelajaran, asesmen formatif selama proses pembelajaran, dan asesmen sumatif pada akhir materi atau semester secara komprehensif mencakup kognitif, afektif, dan psikomotorik.",
        supportingDocuments: []
      };
    }
    
    return {
      educationalPhilosophy: rawLearningOrg.educationalPhilosophy || "Pembelajaran berpusat pada peserta didik.",
      learningPrinciples: rawLearningOrg.learningPrinciples || "Interaktif, inspiratif, menyenangkan, menantang, dan memotivasi.",
      implementationStrategy: rawLearningOrg.implementationStrategy || "Terintegrasi melalui kegiatan intrakurikuler, kokurikuler, dan ekstrakurikuler.",
      responsibleUnit: rawLearningOrg.responsibleUnit || "Tim Pengembang Kurikulum Satuan Pendidikan",
      targetLearners: rawLearningOrg.targetLearners || "Seluruh peserta didik",
      assessmentApproach: rawLearningOrg.assessmentApproach || "Asesmen komprehensif.",
      supportingDocuments: rawLearningOrg.supportingDocuments || []
    };
  }
}
`;
  content += adapterCode;
  fs.writeFileSync(file, content);
  console.log("Updated CurriculumAdapter.ts with LearningOrganizationAdapter");
}
