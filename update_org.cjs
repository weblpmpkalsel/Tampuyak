const fs = require('fs');
const file = 'src/workspace/OrganizationSetup.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(
  `<select name="educationLevel" value={formData.educationLevel} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2">\n                    <option value="SD">SD</option>\n                    <option value="SMP">SMP</option>\n                    <option value="SMA">SMA</option>\n                    <option value="SMK">SMK</option>\n                  </select>`,
  `<select name="educationLevel" value={formData.educationLevel} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2">\n                    <option value="PAUD">PAUD</option>\n                    <option value="SD">SD</option>\n                    <option value="SMP">SMP</option>\n                    <option value="SMA">SMA</option>\n                    <option value="SMK">SMK</option>\n                    <option value="Kesetaraan">Kesetaraan (PKBM/SKB)</option>\n                  </select>`
);
fs.writeFileSync(file, content);
console.log('done org');
