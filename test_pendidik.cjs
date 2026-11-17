require('ts-node').register();
const { EnterpriseAdapter } = require('./src/enterprise/workspace/adapters/EnterpriseAdapter.ts');
const { KspMetadataAdapter } = require('./src/ksp/KspMetadataAdapter.ts');
const { assembleKspDocument } = require('./src/enterprise/document/ksp/KspDocumentAssembler.ts');

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

const doc = assembleKspDocument(metadata);
const bab1 = doc.sections.find(s => s.chapterId === 'BAB_I');
const blocks = bab1.blocks;

const pendidikBlock = blocks.find(b => b.id === 'bab1-paragraph-pendidik');
console.log("Pendidik Text:", pendidikBlock.nodes[0].text);
