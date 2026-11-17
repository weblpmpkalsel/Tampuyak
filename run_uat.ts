import { CanonicalParser, CompatibilityAdapter } from './src/EducationReportParser.ts';

const mockSheets = [
  {
    name: 'Report',
    rows: [
      {
        r: 1,
        cells: [
          { c: 1, v: 'Nama Indikator' },
          { c: 2, v: 'Nilai Rapor' }
        ]
      },
      {
        r: 2,
        cells: [
          { c: 1, v: 'A.1 Kemampuan Literasi' },
          { c: 2, v: '80' }
        ]
      },
      {
        r: 3,
        cells: [
          { c: 1, v: 'A2 Kemampuan Numerasi' },
          { c: 2, v: '90' }
        ]
      },
      {
        r: 4,
        cells: [
          { c: 1, v: 'A. 3 Karakter' },
          { c: 2, v: '85' }
        ]
      },
      {
        r: 5,
        cells: [
          { c: 1, v: 'Iklim Kebhinekaan' },
          { c: 2, v: '95' }
        ]
      },
      {
        r: 6,
        cells: [
          { c: 1, v: 'X.9 Unknown Data' },
          { c: 2, v: '10' }
        ]
      }
    ]
  }
];

const parsed = CanonicalParser.parse(mockSheets);
console.log("Extracted IDs:", parsed.indicators.map(i => i.id));
console.log("Compatibility Keys:", Object.keys(CompatibilityAdapter.getIndicatorsMap(parsed.indicators)));
