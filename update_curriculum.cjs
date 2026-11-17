const fs = require('fs');
const file = 'src/enterprise/workspace/modules/CurriculumHubModule.tsx';
let content = fs.readFileSync(file, 'utf8');

const headRepl = `export const CurriculumHubModule = ({ settings, updateSetting }: any) => {
  const metadata = KspMetadataAdapter.adapt(settings);
  const paudMetadata = settings?.enterpriseProfile?.paudMetadata || {};
  const kesetaraanMetadata = settings?.enterpriseProfile?.kesetaraanMetadata || {};

  const updatePaud = (field: string, value: string) => {
    if (updateSetting) {
      updateSetting('enterpriseProfile', 'paudMetadata', { ...paudMetadata, [field]: value });
    }
  };

  const updateKesetaraan = (field: string, value: string) => {
    if (updateSetting) {
      updateSetting('enterpriseProfile', 'kesetaraanMetadata', { ...kesetaraanMetadata, [field]: value });
    }
  };`;

content = content.replace(`export const CurriculumHubModule = ({ settings, updateSetting }: any) => {\n  const metadata = KspMetadataAdapter.adapt(settings);`, headRepl);

const pengorganisasianRepl = `                  <h3 className="text-lg font-bold text-slate-800">Pengorganisasian Pembelajaran</h3>
                </div>
              </div>

              {settings?.school?.level === 'PAUD' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-slate-200">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-900 mb-2 block">Pengorganisasian Kelompok Usia (PAUD)</label>
                    <textarea
                      value={paudMetadata.ageGroupOrganization || ''}
                      onChange={(e) => updatePaud('ageGroupOrganization', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Deskripsikan pengorganisasian kelompok usia PAUD..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-900 mb-2 block">Muatan Pembelajaran (PAUD)</label>
                    <textarea
                      value={paudMetadata.learningContent || ''}
                      onChange={(e) => updatePaud('learningContent', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Deskripsikan muatan pembelajaran PAUD..."
                    />
                  </div>
                </div>
              )}

              {settings?.school?.level === 'Kesetaraan' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-slate-200">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-900 mb-2 block">Struktur SKK (Kesetaraan)</label>
                    <textarea
                      value={kesetaraanMetadata.skkStructure || ''}
                      onChange={(e) => updateKesetaraan('skkStructure', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Deskripsikan struktur SKK kesetaraan..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-900 mb-2 block">Keterampilan Vokasional (Kesetaraan)</label>
                    <textarea
                      value={kesetaraanMetadata.vocationalSkills || ''}
                      onChange={(e) => updateKesetaraan('vocationalSkills', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Deskripsikan keterampilan vokasional kesetaraan..."
                    />
                  </div>
                </div>
              )}`;

content = content.replace(`                  <h3 className="text-lg font-bold text-slate-800">Pengorganisasian Pembelajaran</h3>\n                </div>\n              </div>`, pengorganisasianRepl);

const intraRepl = `                  <h3 className="text-lg font-bold text-slate-800">Intrakurikuler</h3>
                </div>
              </div>

              {settings?.school?.level === 'PAUD' && (
                <div className="mb-6">
                  <label className="text-sm font-bold text-slate-900 mb-2 block">Intrakurikuler Berbasis Bermain (PAUD)</label>
                  <textarea
                    value={paudMetadata.playBasedIntracurricular || ''}
                    onChange={(e) => updatePaud('playBasedIntracurricular', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Deskripsikan intrakurikuler berbasis bermain PAUD..."
                  />
                </div>
              )}`;

content = content.replace(`                  <h3 className="text-lg font-bold text-slate-800">Intrakurikuler</h3>\n                </div>\n              </div>`, intraRepl);

const cocurrRepl = `                  <h3 className="text-lg font-bold text-slate-800">Kokurikuler (Proyek Penguatan Profil Pelajar Pancasila)</h3>
                </div>
              </div>

              {settings?.school?.level === 'PAUD' && (
                <div className="mb-6">
                  <label className="text-sm font-bold text-slate-900 mb-2 block">Kokurikuler PAUD</label>
                  <textarea
                    value={paudMetadata.paudCocurricular || ''}
                    onChange={(e) => updatePaud('paudCocurricular', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Deskripsikan pelaksanaan kokurikuler PAUD..."
                  />
                </div>
              )}`;

content = content.replace(`                  <h3 className="text-lg font-bold text-slate-800">Kokurikuler (Proyek Penguatan Profil Pelajar Pancasila)</h3>\n                </div>\n              </div>`, cocurrRepl);

const extracurrRepl = `                  <h3 className="text-lg font-bold text-slate-800">Ekstrakurikuler</h3>
                </div>
              </div>

              {settings?.school?.level === 'PAUD' && (
                <div className="mb-6">
                  <label className="text-sm font-bold text-slate-900 mb-2 block">Ekstrakurikuler PAUD</label>
                  <textarea
                    value={paudMetadata.paudExtracurricular || ''}
                    onChange={(e) => updatePaud('paudExtracurricular', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Deskripsikan pelaksanaan ekstrakurikuler PAUD..."
                  />
                </div>
              )}`;

content = content.replace(`                  <h3 className="text-lg font-bold text-slate-800">Ekstrakurikuler</h3>\n                </div>\n              </div>`, extracurrRepl);

const loadRepl = `                  <h3 className="text-lg font-bold text-slate-800">Beban Belajar</h3>
                </div>
              </div>

              {settings?.school?.level === 'PAUD' && (
                <div className="mb-6">
                  <label className="text-sm font-bold text-slate-900 mb-2 block">Alokasi Waktu Belajar (PAUD)</label>
                  <textarea
                    value={paudMetadata.learningTimeAllocation || ''}
                    onChange={(e) => updatePaud('learningTimeAllocation', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Deskripsikan alokasi waktu belajar PAUD..."
                  />
                </div>
              )}`;

content = content.replace(`                  <h3 className="text-lg font-bold text-slate-800">Beban Belajar</h3>\n                </div>\n              </div>`, loadRepl);

fs.writeFileSync(file, content);
console.log('done curr hub');
