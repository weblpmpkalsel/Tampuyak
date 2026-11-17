import { KspMetadataAdapter } from './src/ksp/KspMetadataAdapter';
import { assembleKspDocument } from './src/enterprise/document/ksp/KspDocumentAssembler';

const rawSettingsSD = {
  identitas: { schoolName: "SDN 1 Test" },
  school: { level: "SD" },
  rombel: [{ nama: "Class 1", siswa: 23 }]
};

const metadataSD = KspMetadataAdapter.adapt(rawSettingsSD as any);
const docSD = assembleKspDocument(metadataSD);

const rawSettingsSMP = {
  identitas: { schoolName: "SMPN 1 Test" },
  school: { level: "SMP" },
  rombel: [{ nama: "Class 1", siswa: 23 }]
};

const metadataSMP = KspMetadataAdapter.adapt(rawSettingsSMP as any);
const docSMP = assembleKspDocument(metadataSMP);

const getTableTitle = (doc: any) => {
  const bab1 = doc.sections.find((s: any) => s.id === 'ksp-bab-1');
  const tableTitleBlock = bab1.blocks.find((b: any) => b.id === 'bab1-paragraph-karakteristik-table-title');
  if (tableTitleBlock && tableTitleBlock.nodes && tableTitleBlock.nodes.length > 0) {
    return tableTitleBlock.nodes[0].text;
  }
  return null;
};

console.log("SD Title:", getTableTitle(docSD));
console.log("SMP Title:", getTableTitle(docSMP));

