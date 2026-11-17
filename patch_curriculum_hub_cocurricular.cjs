const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/enterprise/workspace/modules/CurriculumHubModule.tsx');
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('CocurricularKnowledge')) {
  content = content.replace(
    "import { IntracurricularKnowledge } from '../../knowledge/models/curriculum/IntracurricularKnowledge';",
    "import { IntracurricularKnowledge } from '../../knowledge/models/curriculum/IntracurricularKnowledge';\nimport { CocurricularKnowledge } from '../../knowledge/models/curriculum/CocurricularKnowledge';"
  );

  const cocurricularState = `
  const [cocurricular, setCocurricular] = useState<CocurricularKnowledge>(
    new CocurricularKnowledge('cc-1', '1.0.0', {
      programIdentity: "Program Kokurikuler Terpadu",
      objectives: "Meningkatkan pemahaman dan penerapan Dimensi Profil Lulusan serta 7 Kebiasaan Anak Indonesia Hebat.",
      targetLearners: "Seluruh peserta didik",
      activities: [],
      assessment: "Asesmen proses, observasi, dan portofolio kegiatan.",
      reflection: "Refleksi berkala oleh pendidik dan peserta didik.",
      supportingDocuments: []
    })
  );

  const cocurricularValidation = cocurricular.validate();

  const handleCocurricularUpdate = (field: string, value: any) => {
    const updatedPayload = {
      ...cocurricular.payload,
      [field]: value
    };
    
    const newKnowledge = new CocurricularKnowledge('cc-1', '1.0.0', updatedPayload as any);
    setCocurricular(newKnowledge);
    
    if (updateSetting) {
      updateSetting('cocurricular', newKnowledge.payload);
    }
  };

  const handleAddActivity = () => {
    const newActivity = {
      id: \`act-\${Date.now()}\`,
      activityName: '',
      targetPhase: knowledge.payload.phase,
      implementationTime: '',
      profilLulusanDimensions: [],
      tujuhKebiasaan: [],
      description: ''
    };
    handleCocurricularUpdate('activities', [...cocurricular.payload.activities, newActivity]);
  };

  const handleUpdateActivity = (index: number, field: string, value: any) => {
    const updatedActivities = [...cocurricular.payload.activities];
    updatedActivities[index] = { ...updatedActivities[index], [field]: value };
    handleCocurricularUpdate('activities', updatedActivities);
  };

  const handleRemoveActivity = (index: number) => {
    const updatedActivities = [...cocurricular.payload.activities];
    updatedActivities.splice(index, 1);
    handleCocurricularUpdate('activities', updatedActivities);
  };
`;

  content = content.replace(
    "const intracurricularValidation = intracurricular.validate();",
    cocurricularState + "\n  const intracurricularValidation = intracurricular.validate();"
  );

  const cocurricularUI = `
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm mt-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Cocurricular Knowledge (Kokurikuler)</h2>
          </div>
        </div>
        
        <p className="text-slate-600 mb-6">
          Define the Kokurikuler program, activities, and objectives. (Replaces legacy P5).
        </p>

        {cocurricularValidation.status === 'ERROR' && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex flex-col gap-2 text-sm border border-red-200">
            <div className="flex items-center gap-2 font-bold">
              <AlertCircle className="w-4 h-4" /> Validation Errors
            </div>
            <ul className="list-disc list-inside">
              {cocurricularValidation.issues.map((issue, idx) => (
                <li key={idx}>{issue.message}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Program Identity</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              value={cocurricular.payload.programIdentity}
              onChange={(e) => handleCocurricularUpdate('programIdentity', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Objectives</label>
            <textarea 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white min-h-[80px]"
              value={cocurricular.payload.objectives}
              onChange={(e) => handleCocurricularUpdate('objectives', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Assessment Strategy</label>
              <textarea 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white min-h-[80px]"
                value={cocurricular.payload.assessment}
                onChange={(e) => handleCocurricularUpdate('assessment', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Reflection Strategy</label>
              <textarea 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white min-h-[80px]"
                value={cocurricular.payload.reflection}
                onChange={(e) => handleCocurricularUpdate('reflection', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800">Activities</h3>
          <button 
            onClick={handleAddActivity}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Activity
          </button>
        </div>

        <div className="space-y-4">
          {cocurricular.payload.activities.length === 0 ? (
            <div className="p-8 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-lg">
              No activities added yet. Click "Add Activity" to begin.
            </div>
          ) : (
            cocurricular.payload.activities.map((activity, index) => (
              <div key={activity.id} className="p-4 border border-slate-200 rounded-lg space-y-4 bg-slate-50 relative">
                <button
                  onClick={() => handleRemoveActivity(index)}
                  className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Activity Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                      value={activity.activityName}
                      onChange={(e) => handleUpdateActivity(index, 'activityName', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Target Phase</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                      value={activity.targetPhase}
                      onChange={(e) => handleUpdateActivity(index, 'targetPhase', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Implementation Time</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                      value={activity.implementationTime}
                      onChange={(e) => handleUpdateActivity(index, 'implementationTime', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                      value={activity.description}
                      onChange={(e) => handleUpdateActivity(index, 'description', e.target.value)}
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
    cocurricularUI + "\n    </div>\n  );\n};"
  );

  fs.writeFileSync(file, content);
  console.log("Updated CurriculumHubModule.tsx with CocurricularKnowledge");
}
