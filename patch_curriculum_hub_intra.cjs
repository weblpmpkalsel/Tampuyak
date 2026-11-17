const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/enterprise/workspace/modules/CurriculumHubModule.tsx');
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('IntracurricularKnowledge')) {
  content = content.replace(
    "import { LearningOrganizationKnowledge } from '../../knowledge/models/curriculum/LearningOrganizationKnowledge';",
    "import { LearningOrganizationKnowledge } from '../../knowledge/models/curriculum/LearningOrganizationKnowledge';\nimport { IntracurricularKnowledge } from '../../knowledge/models/curriculum/IntracurricularKnowledge';\nimport { Trash2, Plus } from 'lucide-react';"
  );

  const intraState = `
  const [intracurricular, setIntracurricular] = useState<IntracurricularKnowledge>(
    new IntracurricularKnowledge('ic-1', '1.0.0', {
      subjects: []
    })
  );

  const intracurricularValidation = intracurricular.validate();

  const handleAddSubject = () => {
    const newSubject = {
      id: \`sub-\${Date.now()}\`,
      subjectName: '',
      educationLevel: knowledge.payload.educationLevel,
      phase: knowledge.payload.phase,
      weeklyLearningHours: 0,
      annualLearningHours: 0,
      learningApproach: 'Mata Pelajaran',
      profilLulusanDimensions: [],
      tujuhKebiasaan: [],
      deepLearningIndicators: [],
      notes: ''
    };
    const newKnowledge = new IntracurricularKnowledge('ic-1', '1.0.0', {
      subjects: [...intracurricular.payload.subjects, newSubject]
    });
    setIntracurricular(newKnowledge);
    if (updateSetting) updateSetting('intracurricular', newKnowledge.payload);
  };

  const handleUpdateSubject = (index: number, field: string, value: any) => {
    const updatedSubjects = [...intracurricular.payload.subjects];
    updatedSubjects[index] = { ...updatedSubjects[index], [field]: value };
    const newKnowledge = new IntracurricularKnowledge('ic-1', '1.0.0', {
      subjects: updatedSubjects
    });
    setIntracurricular(newKnowledge);
    if (updateSetting) updateSetting('intracurricular', newKnowledge.payload);
  };

  const handleRemoveSubject = (index: number) => {
    const updatedSubjects = [...intracurricular.payload.subjects];
    updatedSubjects.splice(index, 1);
    const newKnowledge = new IntracurricularKnowledge('ic-1', '1.0.0', {
      subjects: updatedSubjects
    });
    setIntracurricular(newKnowledge);
    if (updateSetting) updateSetting('intracurricular', newKnowledge.payload);
  };
`;

  content = content.replace(
    "const learningOrganizationValidation = learningOrganization.validate();",
    intraState + "\n  const learningOrganizationValidation = learningOrganization.validate();"
  );

  const intraUI = `
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm mt-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Intracurricular Knowledge</h2>
          </div>
          <button 
            onClick={handleAddSubject}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Subject
          </button>
        </div>
        
        <p className="text-slate-600 mb-6">
          Define the subjects, learning hours, and approaches.
        </p>

        {intracurricularValidation.status === 'ERROR' && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex flex-col gap-2 text-sm border border-red-200">
            <div className="flex items-center gap-2 font-bold">
              <AlertCircle className="w-4 h-4" /> Validation Errors
            </div>
            <ul className="list-disc list-inside">
              {intracurricularValidation.issues.map((issue, idx) => (
                <li key={idx}>{issue.message}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-4">
          {intracurricular.payload.subjects.length === 0 ? (
            <div className="p-8 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-lg">
              No subjects added yet. Click "Add Subject" to begin.
            </div>
          ) : (
            intracurricular.payload.subjects.map((subject, index) => (
              <div key={subject.id} className="p-4 border border-slate-200 rounded-lg space-y-4 bg-slate-50 relative">
                <button
                  onClick={() => handleRemoveSubject(index)}
                  className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Subject Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                      value={subject.subjectName}
                      onChange={(e) => handleUpdateSubject(index, 'subjectName', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Learning Approach</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                      value={subject.learningApproach}
                      onChange={(e) => handleUpdateSubject(index, 'learningApproach', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Weekly Learning Hours (JP)</label>
                    <input 
                      type="number" 
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                      value={subject.weeklyLearningHours}
                      onChange={(e) => handleUpdateSubject(index, 'weeklyLearningHours', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Annual Learning Hours (JP)</label>
                    <input 
                      type="number" 
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                      value={subject.annualLearningHours}
                      onChange={(e) => handleUpdateSubject(index, 'annualLearningHours', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phase</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                      value={subject.phase}
                      onChange={(e) => handleUpdateSubject(index, 'phase', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
  `;

  content = content.replace(
    "    </div>\n  );\n};",
    intraUI + "\n    </div>\n  );\n};"
  );

  fs.writeFileSync(file, content);
  console.log("Updated CurriculumHubModule.tsx with IntracurricularKnowledge");
}
