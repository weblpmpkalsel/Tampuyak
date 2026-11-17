import { CanonicalParser } from './src/EducationReportParser.ts';

const mockSheets = [
  {
    name: '3. Prioritas Rekomendasi',
    rows: [
      { r: 1, cells: [ { c: 1, v: 'No' }, { c: 2, v: 'Indikator (Level 1)' }, { c: 3, v: 'Nilai Rapor' } ] },
      { r: 2, cells: [ { c: 1, v: '1' }, { c: 2, v: 'D.1 Kualitas Pembelajaran' }, { c: 3, v: '1' } ] },
      { r: 3, cells: [ { c: 1, v: '2' }, { c: 2, v: 'D.3 Kepemimpinan' }, { c: 3, v: '0' } ] },
    ]
  },
  {
    name: '2. LAPORAN RAPOR',
    rows: [
      { r: 1, cells: [ { c: 1, v: 'No' }, { c: 2, v: 'Indikator' }, { c: 3, v: 'Nilai Rapor' } ] },
      { r: 2, cells: [ { c: 1, v: '1' }, { c: 2, v: 'D.1 Kualitas Pembelajaran' }, { c: 3, v: '55,11' } ] },
      { r: 3, cells: [ { c: 1, v: '2' }, { c: 2, v: 'D.3 Kepemimpinan Instruksional' }, { c: 3, v: '58,16' } ] },
    ]
  }
];

const parsed = CanonicalParser.parse(mockSheets);
console.log("Extracted:", parsed.indicators.map(i => ({ id: i.id, name: i.name, score: i.score, sheet: i.origin.worksheet })));
