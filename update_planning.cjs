const fs = require('fs');
const file = 'src/enterprise/workspace/modules/LearningPlanningModule.tsx';
let content = fs.readFileSync(file, 'utf8');

const headRepl = `export const LearningPlanningModule = () => {
  const { settings, updateSetting } = useApp();
  const paudMetadata = settings?.enterpriseProfile?.paudMetadata || {};
  const kesetaraanMetadata = settings?.enterpriseProfile?.kesetaraanMetadata || {};

  const updatePaud = (field: string, value: string) => {
    updateSetting('enterpriseProfile', 'paudMetadata', { ...paudMetadata, [field]: value });
  };

  const updateKesetaraan = (field: string, value: string) => {
    updateSetting('enterpriseProfile', 'kesetaraanMetadata', { ...kesetaraanMetadata, [field]: value });
  };

  const learningPolicy = settings?.learningPolicy || {`;

content = content.replace(`export const LearningPlanningModule = () => {\n  const { settings, updateSetting } = useApp();\n  const learningPolicy = settings?.learningPolicy || {`, headRepl);

const customRepl = `          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900">Kemitraan Pembelajaran</label>
            <textarea
              value={learningPolicy.partnershipPolicy || ''}
              onChange={(e) => updatePolicy('partnershipPolicy', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors resize-none"
            />
          </div>

          {settings?.school?.level === 'PAUD' && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900">Perencanaan Pembelajaran PAUD</label>
              <textarea
                value={paudMetadata.learningPlanning || ''}
                onChange={(e) => updatePaud('learningPlanning', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors resize-none"
                placeholder="Deskripsikan perencanaan pembelajaran khusus PAUD..."
              />
            </div>
          )}

          {settings?.school?.level === 'Kesetaraan' && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900">Perencanaan Andragogi (Kesetaraan)</label>
              <textarea
                value={kesetaraanMetadata.andragogyPlanning || ''}
                onChange={(e) => updateKesetaraan('andragogyPlanning', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors resize-none"
                placeholder="Deskripsikan pendekatan andragogi untuk peserta didik..."
              />
            </div>
          )}`;

content = content.replace(`          <div className="space-y-2">\n            <label className="text-sm font-bold text-slate-900">Kemitraan Pembelajaran</label>\n            <textarea\n              value={learningPolicy.partnershipPolicy || ''}\n              onChange={(e) => updatePolicy('partnershipPolicy', e.target.value)}\n              rows={3}\n              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors resize-none"\n            />\n          </div>`, customRepl);

fs.writeFileSync(file, content);
console.log('done planning');
