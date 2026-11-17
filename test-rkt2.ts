import { readFileSync } from 'fs';
import * as XLSX from 'xlsx';

const buf = readFileSync('RAPOR-PBD-SD-2025.xlsx');
const workbook = XLSX.read(buf, { type: 'buffer' });
let sheet = null;
for (const n of workbook.SheetNames) {
    if (n.includes('RKT')) {
        sheet = workbook.Sheets[n];
        console.log("Found sheet:", n);
        break;
    }
}
if (sheet) {
  const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  console.log("Rows: " + jsonData.length);
  for (let i = 0; i < Math.min(25, jsonData.length); i++) {
     const row = (jsonData[i] as any[]).map(c => typeof c === 'string' ? c.trim() : c);
     if (row.filter(c => c).length > 0) {
        console.log("Row " + i + ": " + JSON.stringify(row));
     }
  }
} else {
  console.log("Sheet not found");
}
