const fs = require('fs');
const file = 'src/enterprise/workspace/modules/ProfileModule.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  `const kesetaraanMetadata = profile.kesetaraanMetadata || {};\n  const paudMetadata = profile.paudMetadata || {};\n\n  const updateIdentity = (field: string, value: string) => {`,
  `const updateIdentity = (field: string, value: string) => {`
);

content = content.replace(
  `const updateCharacteristics = (field: string, value: any) => {\n    updateSetting('enterpriseProfile', 'characteristics', { ...characteristics, [field]: value });\n  };\n\n  const updateKesetaraan = (field: string, value: string) => {\n    updateSetting('enterpriseProfile', 'kesetaraanMetadata', { ...kesetaraanMetadata, [field]: value });\n  };\n\n  const updatePaud = (field: string, value: string) => {\n    updateSetting('enterpriseProfile', 'paudMetadata', { ...paudMetadata, [field]: value });\n  };`,
  `const updateCharacteristics = (field: string, value: any) => {\n    updateSetting('enterpriseProfile', 'characteristics', { ...characteristics, [field]: value });\n  };`
);

content = content.replace(
  `                </div>\n              </div>\n\n              {settings?.school?.level === 'Kesetaraan' && (\n                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-slate-200">\n                  <div className="space-y-2">\n                    <label className="text-sm font-bold text-slate-900 mb-2 block">Karakteristik Tutor (Kesetaraan)</label>\n                    <textarea\n                      value={kesetaraanMetadata.tutorCharacteristics || ''}\n                      onChange={(e) => updateKesetaraan('tutorCharacteristics', e.target.value)}\n                      rows={3}\n                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors resize-none"\n                      placeholder="Deskripsikan karakteristik tutor kesetaraan..."\n                    />\n                  </div>\n                  <div className="space-y-2">\n                    <label className="text-sm font-bold text-slate-900 mb-2 block">Kemitraan DUDI (Kesetaraan)</label>\n                    <textarea\n                      value={kesetaraanMetadata.partnershipDUDI || ''}\n                      onChange={(e) => updateKesetaraan('partnershipDUDI', e.target.value)}\n                      rows={3}\n                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors resize-none"\n                      placeholder="Deskripsikan kemitraan dengan DUDI..."\n                    />\n                  </div>\n                </div>\n              )}\n\n            </div>`,
  `                </div>\n              </div>\n\n            </div>`
);

fs.writeFileSync(file, content);
console.log('reverted');
