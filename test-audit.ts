import { CanonicalParser, CompatibilityAdapter } from './src/EducationReportParser.js';

// Simulate what CanonicalParser would do if we feed it dummy data
const sheets = [
  {
    name: "Prioritas Rekomendasi",
    rows: [
      {
        r: 1,
        cells: [
          { c: 1, v: "Indikator" },
          { c: 2, v: "Nilai Rapor" }
        ]
      },
      {
        r: 2,
        cells: [
          { c: 1, v: "A.1 Kemampuan Literasi" },
          { c: 2, v: "82.50" }
        ]
      },
      {
        r: 3,
        cells: [
          { c: 1, v: "A.2 Kemampuan Numerasi" },
          { c: 2, v: "74.30" }
        ]
      }
    ]
  }
];

const canonical = CanonicalParser.parse(sheets);
console.log("Canonical Indicators:", canonical.indicators);

const adapterMap = CompatibilityAdapter.getIndicatorsMap(canonical.indicators);
console.log("CompatibilityAdapter Map:", adapterMap);

