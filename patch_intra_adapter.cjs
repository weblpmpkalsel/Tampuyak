const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/enterprise/workspace/adapters/CurriculumAdapter.ts');
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('IntracurricularAdapter')) {
  const adapterCode = `
export class IntracurricularAdapter {
  static normalize(rawIntracurricular: any, metadata: any) {
    if (!rawIntracurricular || !rawIntracurricular.subjects || !Array.isArray(rawIntracurricular.subjects)) {
      return {
        subjects: []
      };
    }
    
    return {
      subjects: rawIntracurricular.subjects.map((s: any, idx: number) => ({
        id: s.id || \`sub-\${idx}\`,
        subjectName: s.subjectName || "",
        educationLevel: s.educationLevel || metadata?.educationLevel || "Sekolah Dasar",
        phase: s.phase || metadata?.phase || "Fase A",
        weeklyLearningHours: parseInt(s.weeklyLearningHours) || 0,
        annualLearningHours: parseInt(s.annualLearningHours) || 0,
        learningApproach: s.learningApproach || "Mata Pelajaran",
        profilLulusanDimensions: Array.isArray(s.profilLulusanDimensions) ? s.profilLulusanDimensions : [],
        tujuhKebiasaan: Array.isArray(s.tujuhKebiasaan) ? s.tujuhKebiasaan : [],
        deepLearningIndicators: Array.isArray(s.deepLearningIndicators) ? s.deepLearningIndicators : [],
        notes: s.notes || ""
      }))
    };
  }
}
`;
  content += adapterCode;
  fs.writeFileSync(file, content);
  console.log("Updated CurriculumAdapter.ts with IntracurricularAdapter");
}
