import { CanonicalParser } from './src/EducationReportParser.ts';

const mockSheets = [
  {
    name: '3. Prioritas Rekomendasi',
    rows: [
      { r: 1, cells: [ { c: 1, v: 'No' }, { c: 2, v: 'Indikator (Level 1)' }, { c: 3, v: 'Nilai Rapor' } ] },
      { r: 2, cells: [ { c: 1, v: '1' }, { c: 2, v: 'D.1 Kualitas Pembelajaran' }, { c: 3, v: '1' } ] },
      { r: 3, cells: [ { c: 1, v: '2' }, { c: 2, v: 'D.3 Kepemimpinan' }, { c: 3, v: '0' } ] },
      { r: 4, cells: [ { c: 1, v: '3' }, { c: 2, v: 'A.1 Literasi' }, { c: 3, v: '3' } ] } // Ranking 3
    ]
  },
  {
    name: '2. LAPORAN RAPOR',
    rows: [
      { r: 1, cells: [ { c: 1, v: 'No' }, { c: 2, v: 'Indikator' }, { c: 3, v: 'Nilai Rapor' } ] },
      { r: 2, cells: [ { c: 1, v: '1' }, { c: 2, v: 'D.1 Kualitas Pembelajaran' }, { c: 3, v: '55.11' } ] },
      { r: 3, cells: [ { c: 1, v: '2' }, { c: 2, v: 'D.3 Kepemimpinan Instruksional' }, { c: 3, v: '58.16' } ] },
      { r: 4, cells: [ { c: 1, v: '3' }, { c: 2, v: 'A.1 Kemampuan Literasi' }, { c: 3, v: '36.67' } ] },
      { r: 5, cells: [ { c: 1, v: '4' }, { c: 2, v: 'A.2 Kemampuan Numerasi' }, { c: 3, v: '40.00' } ] },
      { r: 6, cells: [ { c: 1, v: '5' }, { c: 2, v: 'D.10 Inklusivitas' }, { c: 3, v: '50.20' } ] },
    ]
  }
];

const parsed = CanonicalParser.parse(mockSheets);
console.log("Extracted:");
parsed.indicators.forEach(i => console.log(`${i.id} = ${i.score}`));
