import { readFileSync } from 'fs';
import * as XLSX from 'xlsx';
import { PlanningParser } from './src/EducationReportParser.ts';

const buf = readFileSync('RAPOR-PBD-SD-2025.xlsx');
const workbook = XLSX.read(buf, { type: 'buffer' });

const treeList: any[] = [];
for (const sheetName of workbook.SheetNames) {
  const sheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) || [];
  const rows: any[] = [];
  jsonData.forEach((row: any, rIdx: number) => {
    const cells: any[] = [];
    if (Array.isArray(row)) {
        row.forEach((cellVal: any, cIdx: number) => {
            if (cellVal !== undefined && cellVal !== null && cellVal !== '') {
                cells.push({ c: cIdx, val: String(cellVal) });
            }
        });
    }
    if (cells.length > 0) {
        rows.push({ index: rIdx, cells });
    }
  });
  treeList.push({ sheetName, rows });
}

const metadata = { rktImported: 0, worksheetsFound: [] };
PlanningParser.extract(treeList, metadata);
