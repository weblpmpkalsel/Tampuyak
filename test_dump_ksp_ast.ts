globalThis.import = { meta: { env: {} } } as any;
import { assembleKspDocument } from './src/enterprise/document/ksp/KspDocumentAssembler';
import { KspMetadataAdapter } from './src/ksp/KspMetadataAdapter';
const dummyRawSettings = {
  school: { name: 'Test School', level: 'SD' },
  sarpras: {
    ruangKelas: 6,
    perpustakaan: 1,
    laboratorium: 1,
    uks: 1,
    toilet: 4,
    mushola: 1,
    lapangan: 1,
    ruangGuru: 1,
    ruangKepsek: 1,
    ict: 20,
    learningResources: 100
  }
};
const metadata = KspMetadataAdapter.adapt(dummyRawSettings);
const doc = assembleKspDocument(metadata);
const bab1 = doc.sections.find(s => s.id === 'bab1');
if (bab1) {
  const str = JSON.stringify(bab1, null, 2);
  const fs = require('fs');
  fs.writeFileSync('bab1_ast_dump_sarpras.json', str);
}
