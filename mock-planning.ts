import { PlanningParser } from "./src/EducationReportParser.ts";

const mockTreeList = [
  {
    sheetName: "Planning",
    rows: [
      {
        index: 0,
        cells: [
          { c: 0, val: "Header" },
          { c: 1, val: "Program" },
          { c: 2, val: "Kegiatan" },
          { c: 3, val: "Target" }
        ]
      },
      {
        index: 23,
        cells: [
          { c: 1, val: "Literasi" },
          { c: 2, val: "Pelatihan Guru" },
          { c: 3, val: "100%" }
        ]
      },
      {
        index: 24,
        cells: [
          { c: 3, val: "Continuation of previous row" }
        ]
      }
    ]
  }
];

const metadata = { rktImported: 0, worksheetsFound: [] };
PlanningParser.extract(mockTreeList, metadata);

