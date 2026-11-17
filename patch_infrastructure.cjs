const fs = require('fs');

let file = fs.readFileSync('src/enterprise/knowledge/builders/SchoolContextBuilder.ts', 'utf-8');

file = file.replace(
`export interface InfrastructureKnowledgeDomain {
  totalClassrooms: number;
  specializedLabs: string[];
  internetBandwidth: string;
  accessibilityFeatures?: string[];
}`,
`export interface FacilityStatistic {
  facilityName: string;
  quantity: number;
  condition?: string;
}

export interface InfrastructureKnowledgeDomain {
  totalClassrooms: number;
  specializedLabs: string[];
  internetBandwidth: string;
  accessibilityFeatures?: string[];
  facilities?: FacilityStatistic[];
}

export function buildInfrastructureDomain(raw?: any): InfrastructureKnowledgeDomain | undefined {
  if (!raw) return undefined;
  
  const facilities: FacilityStatistic[] = [];
  let totalClassrooms = 0;
  const specializedLabs: string[] = [];
  
  if (raw.ruangKelas !== undefined) {
    totalClassrooms = Number(raw.ruangKelas) || 0;
    facilities.push({ facilityName: 'Ruang Kelas', quantity: totalClassrooms, condition: 'Baik' });
  }
  if (raw.perpustakaan !== undefined) {
    facilities.push({ facilityName: 'Perpustakaan (Library)', quantity: Number(raw.perpustakaan) || 0, condition: 'Baik' });
  }
  if (raw.laboratorium !== undefined) {
    specializedLabs.push('Laboratorium Komputer/Sains');
    facilities.push({ facilityName: 'Laboratorium (Laboratory)', quantity: Number(raw.laboratorium) || 0, condition: 'Baik' });
  }
  if (raw.uks !== undefined) {
    facilities.push({ facilityName: 'UKS (Usaha Kesehatan Sekolah)', quantity: Number(raw.uks) || 0, condition: 'Baik' });
  }
  if (raw.toilet !== undefined) {
    facilities.push({ facilityName: 'Toilet/Kamar Mandi', quantity: Number(raw.toilet) || 0, condition: 'Baik' });
  }
  if (raw.mushola !== undefined || raw.tempatIbadah !== undefined) {
    facilities.push({ facilityName: 'Tempat Ibadah (Place of Worship)', quantity: Number(raw.mushola || raw.tempatIbadah) || 0, condition: 'Baik' });
  }
  if (raw.lapangan !== undefined) {
    facilities.push({ facilityName: 'Lapangan Olahraga', quantity: Number(raw.lapangan) || 0, condition: 'Baik' });
  }
  if (raw.ruangGuru !== undefined) {
    facilities.push({ facilityName: 'Ruang Guru', quantity: Number(raw.ruangGuru) || 0, condition: 'Baik' });
  }
  if (raw.ruangKepsek !== undefined) {
    facilities.push({ facilityName: 'Ruang Kepala Sekolah', quantity: Number(raw.ruangKepsek) || 0, condition: 'Baik' });
  }
  if (raw.ict !== undefined || raw.tik !== undefined) {
    facilities.push({ facilityName: 'Fasilitas TIK (ICT Facilities)', quantity: Number(raw.ict || raw.tik) || 0, condition: 'Baik' });
  }
  if (raw.learningResources !== undefined || raw.sumberBelajar !== undefined) {
    facilities.push({ facilityName: 'Sumber Belajar (Learning Resources)', quantity: Number(raw.learningResources || raw.sumberBelajar) || 0, condition: 'Baik' });
  }

  // Fallback
  if (facilities.length === 0 && typeof raw === 'object') {
    for (const key of Object.keys(raw)) {
      facilities.push({ facilityName: key, quantity: Number(raw[key]) || 0 });
      if (key.toLowerCase().includes('kelas')) {
        totalClassrooms += Number(raw[key]) || 0;
      }
    }
  }

  return {
    totalClassrooms,
    specializedLabs,
    internetBandwidth: 'Memadai',
    facilities: facilities.length > 0 ? facilities : undefined
  };
}`
);

fs.writeFileSync('src/enterprise/knowledge/builders/SchoolContextBuilder.ts', file);
