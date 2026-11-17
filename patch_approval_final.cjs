const fs = require('fs');

const code = `import { DocumentChapter, DocumentSection } from '../DocumentCompositionEngine/DocumentModel';
import { RkasGeneratorResult } from '../rkas/generator/RkasGeneratorResult';

export class ApprovalBuilder {
  public build(result: RkasGeneratorResult, settings?: any): DocumentChapter {
    const locationStr = settings?.school?.district ? \`\${settings.school.district}, ..........................\` : '................., ..................';
    
    const sections: DocumentSection[] = [
      {
        id: 'approval_main',
        title: 'LEMBAR PENGESAHAN',
        paragraphs: [
          'Rencana Kegiatan dan Anggaran Sekolah (RKAS) ini telah disusun oleh Tim Pengembang Sekolah, diverifikasi oleh Bendahara Sekolah/Bendahara BOS, dan disahkan oleh Kepala Sekolah sesuai ketentuan yang berlaku.'
        ],
        tables: [{
          type: 'signature_block',
          location: locationStr,
          signatures: [
            { 
               label: 'Mengetahui,\\nKepala Sekolah', 
               name: settings?.principal?.name || '(Belum diisi pada Profil Sekolah)', 
               nip: settings?.principal?.nip || '................................'
            },
            { 
               label: 'Bendahara Sekolah / Bendahara BOS', 
               name: settings?.bendaharaBOS?.name || '(Belum diisi pada Profil Sekolah)', 
               nip: settings?.bendaharaBOS?.nip || '................................'
            }
          ]
        }]
      }
    ];

    return {
      id: 'approval',
      title: 'Lembar Pengesahan',
      sections,
      paragraphs: [],
      tables: [],
      figures: [],
      references: [],
      metadata: { generated: true }
    };
  }
}
`;

fs.writeFileSync('src/RKASDocument/ApprovalBuilder.ts', code);
console.log("RKAS ApprovalBuilder patched!");
