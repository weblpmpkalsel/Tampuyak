const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/enterprise/document/ksp/bab1/KspBab1Structure.ts');
let content = fs.readFileSync(file, 'utf8');

const newLingkunganLokasi = `
  // E. Kondisi Lingkungan
  blocks.push({
    id: 'bab1-heading-lingkungan',
    type: 'HEADING',
    level: 2,
    nodes: [{ id: 'bab1-text-heading-lingkungan', type: 'TEXT', text: 'E. Kondisi Lingkungan' }]
  });

  if (payload.culture && payload.culture.environmentalFactors && payload.culture.environmentalFactors.length > 0) {
    blocks.push({
      id: 'bab1-paragraph-lingkungan',
      type: 'PARAGRAPH',
      nodes: [{ id: 'bab1-text-lingkungan', type: 'TEXT', text: payload.culture.environmentalFactors[0] }]
    });
  } else {
    blocks.push({
      id: 'bab1-paragraph-lingkungan',
      type: 'PARAGRAPH',
      nodes: [{ id: 'bab1-text-lingkungan', type: 'TEXT', text: 'Data belum tersedia.' }]
    });
  }

  // F. Lokasi Sekolah
  blocks.push({
    id: 'bab1-heading-lokasi',
    type: 'HEADING',
    level: 2,
    nodes: [{ id: 'bab1-text-heading-lokasi', type: 'TEXT', text: 'F. Lokasi Sekolah' }]
  });

  if (payload.culture && payload.culture.prevailingRegionalCharacteristics && payload.culture.prevailingRegionalCharacteristics.length > 0) {
    blocks.push({
      id: 'bab1-paragraph-lokasi',
      type: 'PARAGRAPH',
      nodes: [{ id: 'bab1-text-lokasi', type: 'TEXT', text: payload.culture.prevailingRegionalCharacteristics[0] }]
    });
  } else {
    blocks.push({
      id: 'bab1-paragraph-lokasi',
      type: 'PARAGRAPH',
      nodes: [{ id: 'bab1-text-lokasi', type: 'TEXT', text: 'Data belum tersedia.' }]
    });
  }
`;

content = content.replace(
  /\/\/ E\. Kondisi Lingkungan dan Lokasi[\s\S]*?(?=  return \{)/m,
  newLingkunganLokasi + "\n"
);

// Also change "C. Karakteristik Pendidik dan Tenaga Kependidikan" to "C. Karakteristik Guru"
content = content.replace("C. Karakteristik Pendidik dan Tenaga Kependidikan", "C. Karakteristik Guru");
// Change "D. Karakteristik Orang Tua dan Masyarakat" to "D. Karakteristik Orang Tua"
content = content.replace("D. Karakteristik Orang Tua dan Masyarakat", "D. Karakteristik Orang Tua");

fs.writeFileSync(file, content);
console.log("Updated KspBab1Structure.ts for E and F");
