const fs = require('fs');

// We'll read the ExtracurricularAdapter from source and run it on simulated data.
const rawCode = fs.readFileSync('src/enterprise/workspace/adapters/CurriculumAdapter.ts', 'utf8');
// Just extract ExtracurricularAdapter
const adapterStr = rawCode.substring(
  rawCode.indexOf('export class ExtracurricularAdapter'),
  rawCode.indexOf('export class CocurricularAdapter')
).replace('export class', 'class');

eval(adapterStr);

const simulatedSettingsExtracurricular = {
  mandatoryPrograms: [
    { id: 'mp-1', name: 'Pramuka', description: 'Wajib' }
  ],
  optionalPrograms: [],
  routines: []
};

const normalized = ExtracurricularAdapter.normalize(simulatedSettingsExtracurricular, {});
console.log(normalized);

const hasPrograms = normalized.mandatoryPrograms.length > 0 || 
                    normalized.optionalPrograms.length > 0 || 
                    normalized.routines.length > 0;
console.log('hasPrograms:', hasPrograms);
