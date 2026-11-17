const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/enterprise/workspace/modules/CurriculumHubModule.tsx');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "import { CurriculumStructureKnowledge } from '../../knowledge/models/curriculum/CurriculumStructureKnowledge';",
  "import { CurriculumStructureKnowledge } from '../../knowledge/models/curriculum/CurriculumStructureKnowledge';\nimport { LearningLoadKnowledge } from '../../knowledge/models/curriculum/LearningLoadKnowledge';"
);

const stateInjection = `  const [learningLoad, setLearningLoad] = useState<LearningLoadKnowledge>(
    new LearningLoadKnowledge('ll-1', '1.0.0', {
      educationLevel: 'Sekolah Dasar (SD)',
      phase: 'Fase A',
      academicYear: '2026/2027',
      weeklyLearningLoad: 32,
      annualLearningLoad: 1152,
      effectiveWeeks: 36,
      totalLearningHours: 1152
    })
  );

  const learningLoadValidation = learningLoad.validate();

  const handleLearningLoadUpdate = (field: keyof typeof learningLoad.payload, value: string | number) => {
    setLearningLoad(
      new LearningLoadKnowledge('ll-1', '1.0.0', {
        ...learningLoad.payload,
        [field]: value
      })
    );
  };
`;

content = content.replace(
  "  const validation = knowledge.validate();",
  stateInjection + "\n  const validation = knowledge.validate();"
);

const uiInjection = `      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm mt-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
            <BookOpen className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Learning Load Knowledge</h2>
        </div>
        
        <p className="text-slate-600 mb-6">
          Define the learning load parameters.
        </p>

        {learningLoadValidation.status === 'ERROR' && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex flex-col gap-2 text-sm border border-red-200">
            <div className="flex items-center gap-2 font-bold">
              <AlertCircle className="w-4 h-4" /> Validation Errors
            </div>
            <ul className="list-disc list-inside">
              {learningLoadValidation.issues.map((issue, idx) => (
                <li key={idx}>{issue.message}</li>
              ))}
            </ul>
          </div>
        )}

        {learningLoadValidation.status === 'PASS' && (
          <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-lg flex items-center gap-2 text-sm font-medium border border-emerald-200">
            <CheckCircle className="w-4 h-4" />
            Knowledge is valid and ready for publishing.
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Education Level</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={learningLoad.payload.educationLevel}
              onChange={(e) => handleLearningLoadUpdate('educationLevel', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phase</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={learningLoad.payload.phase}
              onChange={(e) => handleLearningLoadUpdate('phase', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Academic Year</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={learningLoad.payload.academicYear}
              onChange={(e) => handleLearningLoadUpdate('academicYear', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Effective Weeks</label>
            <input 
              type="number" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={learningLoad.payload.effectiveWeeks}
              onChange={(e) => handleLearningLoadUpdate('effectiveWeeks', parseInt(e.target.value) || 0)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Weekly Learning Load (hours)</label>
            <input 
              type="number" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={learningLoad.payload.weeklyLearningLoad}
              onChange={(e) => handleLearningLoadUpdate('weeklyLearningLoad', parseInt(e.target.value) || 0)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Annual Learning Load (hours)</label>
            <input 
              type="number" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={learningLoad.payload.annualLearningLoad}
              onChange={(e) => handleLearningLoadUpdate('annualLearningLoad', parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Total Learning Hours</label>
            <input 
              type="number" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={learningLoad.payload.totalLearningHours}
              onChange={(e) => handleLearningLoadUpdate('totalLearningHours', parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
      </div>`;

content = content.replace(
  "    </div>\n  );\n};",
  uiInjection + "\n    </div>\n  );\n};"
);

fs.writeFileSync(file, content);
console.log("Updated CurriculumHubModule.tsx");
