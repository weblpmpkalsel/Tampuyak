const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/enterprise/document/ksp/bab1/KspBab1Structure.ts');
let content = fs.readFileSync(file, 'utf8');

const newRenderCode = `
  // B. Karakteristik Peserta Didik
  blocks.push({
    id: 'bab1-heading-karakteristik',
    type: 'HEADING',
    level: 2,
    nodes: [{ id: 'bab1-text-heading-karakteristik', type: 'TEXT', text: 'B. Karakteristik Peserta Didik' }]
  });

  if (students) {
    const hasTotal = students.totalStudents !== undefined;
    const hasGender = students.genderDistribution !== undefined;
    const hasChars = students.generalCharacteristics && students.generalCharacteristics.length > 0;
    const hasNeeds = students.dominantLearningNeeds && students.dominantLearningNeeds.length > 0;

    if (!hasTotal && !hasGender && !hasChars && !hasNeeds) {
      blocks.push({
        id: 'bab1-paragraph-karakteristik-1',
        type: 'PARAGRAPH',
        nodes: [{ id: 'bab1-text-karakteristik-1', type: 'TEXT', text: 'Data belum tersedia.' }]
      });
    } else {
      const totalStr = hasTotal ? students.totalStudents : 'Belum diisi.';
      const genderStr = hasGender ? \`\${students.genderDistribution!.male} laki-laki dan \${students.genderDistribution!.female} perempuan\` : 'Belum diisi.';
      const charStr = hasChars ? students.generalCharacteristics!.join(', ') : 'Belum diisi.';
      const needsStr = hasNeeds ? students.dominantLearningNeeds!.join(', ') : 'Belum diisi.';
      
      const studentText = \`\${profile.schoolName} memiliki jumlah peserta didik sebanyak \${totalStr} orang, dengan sebaran gender terdiri dari \${genderStr}. Secara umum, peserta didik memiliki karakteristik \${charStr}. Kebutuhan belajar yang dominan adalah \${needsStr}. Keberagaman karakteristik dan kebutuhan ini menuntut sekolah untuk merancang strategi pembelajaran yang berdiferensiasi guna memastikan setiap individu dapat mencapai potensi maksimalnya.\`;
      
      blocks.push({
        id: 'bab1-paragraph-karakteristik-1',
        type: 'PARAGRAPH',
        nodes: [{ id: 'bab1-text-karakteristik-1', type: 'TEXT', text: studentText }]
      });
    }
  } else {
    blocks.push({
      id: 'bab1-paragraph-karakteristik-1',
      type: 'PARAGRAPH',
      nodes: [{ id: 'bab1-text-karakteristik-1', type: 'TEXT', text: 'Data belum tersedia.' }]
    });
  }

  // C. Karakteristik Guru / Pendidik
  blocks.push({
    id: 'bab1-heading-pendidik',
    type: 'HEADING',
    level: 2,
    nodes: [{ id: 'bab1-text-heading-pendidik', type: 'TEXT', text: 'C. Karakteristik Pendidik dan Tenaga Kependidikan' }]
  });
  
  if (payload.educators && payload.educators.generalCharacteristics && payload.educators.generalCharacteristics.length > 0) {
    blocks.push({
      id: 'bab1-paragraph-pendidik',
      type: 'PARAGRAPH',
      nodes: [{ id: 'bab1-text-pendidik', type: 'TEXT', text: payload.educators.generalCharacteristics[0] }]
    });
  } else {
    blocks.push({
      id: 'bab1-paragraph-pendidik',
      type: 'PARAGRAPH',
      nodes: [{ id: 'bab1-text-pendidik', type: 'TEXT', text: 'Data belum tersedia.' }]
    });
  }

  // D. Karakteristik Orang Tua
  blocks.push({
    id: 'bab1-heading-orang-tua',
    type: 'HEADING',
    level: 2,
    nodes: [{ id: 'bab1-text-heading-orang-tua', type: 'TEXT', text: 'D. Karakteristik Orang Tua dan Masyarakat' }]
  });

  if (payload.partnerships && payload.partnerships.generalCharacteristics && payload.partnerships.generalCharacteristics.length > 0) {
    blocks.push({
      id: 'bab1-paragraph-orang-tua',
      type: 'PARAGRAPH',
      nodes: [{ id: 'bab1-text-orang-tua', type: 'TEXT', text: payload.partnerships.generalCharacteristics[0] }]
    });
  } else {
    blocks.push({
      id: 'bab1-paragraph-orang-tua',
      type: 'PARAGRAPH',
      nodes: [{ id: 'bab1-text-orang-tua', type: 'TEXT', text: 'Data belum tersedia.' }]
    });
  }

  // E. Kondisi Lingkungan dan Lokasi
  blocks.push({
    id: 'bab1-heading-lingkungan',
    type: 'HEADING',
    level: 2,
    nodes: [{ id: 'bab1-text-heading-lingkungan', type: 'TEXT', text: 'E. Kondisi Lingkungan dan Lokasi' }]
  });

  if (payload.culture && (payload.culture.prevailingRegionalCharacteristics?.length > 0 || payload.culture.environmentalFactors?.length > 0)) {
    const texts = [];
    if (payload.culture.prevailingRegionalCharacteristics?.[0]) texts.push(payload.culture.prevailingRegionalCharacteristics[0]);
    if (payload.culture.environmentalFactors?.[0]) texts.push(payload.culture.environmentalFactors[0]);
    
    blocks.push({
      id: 'bab1-paragraph-lingkungan',
      type: 'PARAGRAPH',
      nodes: [{ id: 'bab1-text-lingkungan', type: 'TEXT', text: texts.join(' ') }]
    });
  } else {
    blocks.push({
      id: 'bab1-paragraph-lingkungan',
      type: 'PARAGRAPH',
      nodes: [{ id: 'bab1-text-lingkungan', type: 'TEXT', text: 'Data belum tersedia.' }]
    });
  }
`;

content = content.replace(
  /\/\/ B\. Karakteristik Peserta Didik[\s\S]*?return \{/m,
  newRenderCode + "\n\n  return {"
);

fs.writeFileSync(file, content);
console.log("Updated KspBab1Structure.ts");
