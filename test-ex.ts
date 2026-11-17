import { EnterpriseAdapter } from './src/enterprise/workspace/adapters/EnterpriseAdapter';
import { KspMetadataAdapter } from './src/ksp/KspMetadataAdapter';
import { ExtracurricularAdapter } from './src/enterprise/workspace/adapters/CurriculumAdapter';

const rawSettings = {
  extracurricular: {
    mandatoryPrograms: [
      { id: "mp1", name: "Pramuka", description: "Wajib" }
    ]
  }
};

const settings = EnterpriseAdapter.normalize(rawSettings);
console.log("Settings Extracurricular:", settings.extracurricular);

const metadata = KspMetadataAdapter.adapt(rawSettings);
console.log("Metadata Raw Extracurricular:", metadata.rawExtracurricular);

const normalized = ExtracurricularAdapter.normalize(metadata.rawExtracurricular, metadata);
console.log("Normalized:", normalized);

