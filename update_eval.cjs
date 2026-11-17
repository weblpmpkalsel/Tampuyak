const fs = require('fs');
const file = 'src/enterprise/workspace/modules/EvaluationHubModule.tsx';
let content = fs.readFileSync(file, 'utf8');

const headRepl = `export const EvaluationHubModule = () => {
  const { settings, updateSetting } = useApp();
  const paudMetadata = settings?.enterpriseProfile?.paudMetadata || {};
  const kesetaraanMetadata = settings?.enterpriseProfile?.kesetaraanMetadata || {};

  const updatePaud = (field: string, value: string) => {
    updateSetting('enterpriseProfile', 'paudMetadata', { ...paudMetadata, [field]: value });
  };

  const updateKesetaraan = (field: string, value: string) => {
    updateSetting('enterpriseProfile', 'kesetaraanMetadata', { ...kesetaraanMetadata, [field]: value });
  };

  const evaluation = settings?.evaluation || {`;

content = content.replace(`export const EvaluationHubModule = () => {\n  const { settings, updateSetting } = useApp();\n  const evaluation = settings?.evaluation || {`, headRepl);

const customRepl = `            <label className="text-sm font-bold text-slate-900">Tindak Lanjut & Peningkatan Berkelanjutan</label>
            <textarea
              value={evaluation.followUpPlanning || ''}
              onChange={(e) => updateEval('followUpPlanning', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-colors resize-none"
            />
          </div>

          {settings?.school?.level === 'PAUD' && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900">Asesmen Otentik (PAUD)</label>
              <textarea
                value={paudMetadata.authenticAssessment || ''}
                onChange={(e) => updatePaud('authenticAssessment', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-colors resize-none"
                placeholder="Deskripsikan asesmen otentik untuk anak usia dini..."
              />
            </div>
          )}

          {settings?.school?.level === 'Kesetaraan' && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900">Evaluasi Program Keterampilan (Kesetaraan)</label>
              <textarea
                value={kesetaraanMetadata.programEvaluation || ''}
                onChange={(e) => updateKesetaraan('programEvaluation', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-colors resize-none"
                placeholder="Deskripsikan evaluasi program vokasional..."
              />
            </div>
          )}`;

content = content.replace(`            <label className="text-sm font-bold text-slate-900">Tindak Lanjut & Peningkatan Berkelanjutan</label>\n            <textarea\n              value={evaluation.followUpPlanning || ''}\n              onChange={(e) => updateEval('followUpPlanning', e.target.value)}\n              rows={3}\n              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-colors resize-none"\n            />\n          </div>`, customRepl);

fs.writeFileSync(file, content);
console.log('done eval');
