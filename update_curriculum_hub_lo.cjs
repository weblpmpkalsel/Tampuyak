const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/enterprise/workspace/modules/CurriculumHubModule.tsx');
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('LearningOrganizationKnowledge')) {
  content = content.replace(
    "import { LearningLoadKnowledge } from '../../knowledge/models/curriculum/LearningLoadKnowledge';",
    "import { LearningLoadKnowledge } from '../../knowledge/models/curriculum/LearningLoadKnowledge';\nimport { LearningOrganizationKnowledge } from '../../knowledge/models/curriculum/LearningOrganizationKnowledge';"
  );

  const loState = `
  const [learningOrganization, setLearningOrganization] = useState<LearningOrganizationKnowledge>(
    new LearningOrganizationKnowledge('lo-1', '1.0.0', {
      educationalPhilosophy: "Pembelajaran berpusat pada peserta didik, memastikan bahwa setiap anak mendapatkan layanan pendidikan yang sesuai dengan tahap perkembangan kognitif, sosial, dan emosionalnya.",
      learningPrinciples: "Interaktif, inspiratif, menyenangkan, menantang, dan memotivasi peserta didik untuk berpartisipasi aktif, serta memberikan ruang yang cukup bagi prakarsa, kreativitas, dan kemandirian sesuai dengan bakat, minat, dan perkembangan fisik serta psikologis peserta didik.",
      implementationStrategy: "Terintegrasi melalui pendekatan holistik dalam kegiatan intrakurikuler, kokurikuler, dan ekstrakurikuler dengan memanfaatkan lingkungan sekolah sebagai sumber belajar utama.",
      responsibleUnit: "Tim Pengembang Kurikulum Satuan Pendidikan bekerjasama dengan seluruh dewan guru dan komite sekolah.",
      targetLearners: "Seluruh peserta didik.",
      assessmentApproach: "Asesmen diagnostik pada awal pembelajaran, asesmen formatif selama proses pembelajaran, dan asesmen sumatif pada akhir materi atau semester secara komprehensif mencakup kognitif, afektif, dan psikomotorik.",
      supportingDocuments: []
    })
  );

  const learningOrganizationValidation = learningOrganization.validate();

  const handleLearningOrganizationUpdate = (field: keyof typeof learningOrganization.payload, value: string) => {
    const updatedPayload = {
      ...learningOrganization.payload,
      [field]: value
    };
    
    const newKnowledge = new LearningOrganizationKnowledge('lo-1', '1.0.0', updatedPayload as any);
    setLearningOrganization(newKnowledge);
    
    if (updateSetting) {
      updateSetting('learningOrganization', newKnowledge.payload);
    }
  };
`;

  content = content.replace(
    "const learningLoadValidation = learningLoad.validate();",
    loState + "\n  const learningLoadValidation = learningLoad.validate();"
  );

  const loUI = `
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm mt-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <BookOpen className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Learning Organization Knowledge</h2>
        </div>
        
        <p className="text-slate-600 mb-6">
          Define the philosophical and strategic foundations for the curriculum implementation.
        </p>

        {learningOrganizationValidation.status === 'ERROR' && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex flex-col gap-2 text-sm border border-red-200">
            <div className="flex items-center gap-2 font-bold">
              <AlertCircle className="w-4 h-4" /> Validation Errors
            </div>
            <ul className="list-disc list-inside">
              {learningOrganizationValidation.issues.map((issue, idx) => (
                <li key={idx}>{issue.message}</li>
              ))}
            </ul>
          </div>
        )}

        {learningOrganizationValidation.status === 'PASS' && (
          <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-lg flex items-center gap-2 text-sm font-medium border border-emerald-200">
            <CheckCircle className="w-4 h-4" />
            Knowledge is valid and ready for publishing.
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Educational Philosophy</label>
            <textarea 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              value={learningOrganization.payload.educationalPhilosophy}
              onChange={(e) => handleLearningOrganizationUpdate('educationalPhilosophy', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Learning Principles</label>
            <textarea 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              value={learningOrganization.payload.learningPrinciples}
              onChange={(e) => handleLearningOrganizationUpdate('learningPrinciples', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Implementation Strategy</label>
            <textarea 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              value={learningOrganization.payload.implementationStrategy}
              onChange={(e) => handleLearningOrganizationUpdate('implementationStrategy', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Assessment Approach</label>
            <textarea 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              value={learningOrganization.payload.assessmentApproach}
              onChange={(e) => handleLearningOrganizationUpdate('assessmentApproach', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Responsible Unit</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={learningOrganization.payload.responsibleUnit}
                onChange={(e) => handleLearningOrganizationUpdate('responsibleUnit', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Target Learners</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={learningOrganization.payload.targetLearners}
                onChange={(e) => handleLearningOrganizationUpdate('targetLearners', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
  `;

  content = content.replace(
    "    </div>\n  );\n};",
    loUI + "\n    </div>\n  );\n};"
  );

  fs.writeFileSync(file, content);
  console.log("Updated CurriculumHubModule.tsx with LearningOrganizationKnowledge");
}
