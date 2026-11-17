import { EnterpriseAdapter } from './src/enterprise/workspace/adapters/EnterpriseAdapter';
import { KspMetadataAdapter } from './src/ksp/KspMetadataAdapter';
import { assembleKspDocument } from './src/enterprise/document/ksp/KspDocumentAssembler';

const rawSettings = {
  enterpriseProfile: {
    characteristics: {
      pendidik: "Karakteristik pendidik di workspace"
    }
  }
};

const settings = EnterpriseAdapter.normalize(rawSettings);
console.log("Settings Karakteristik:", settings.karakteristik);

const metadata = KspMetadataAdapter.adapt(rawSettings);
console.log("Metadata RawCharacteristics:", metadata.rawCharacteristics);

const doc = assembleKspDocument(metadata as any);
const bab1 = doc.sections.find(s => s.chapterId === 'BAB_I');
const blocks = bab1?.blocks || [];

const pendidikBlock = blocks.find(b => b.id === 'bab1-paragraph-pendidik');
console.log("Pendidik Text:", (pendidikBlock?.nodes as any)[0].text);
