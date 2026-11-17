import { readFileSync } from 'fs';
import * as XLSX from 'xlsx';

try {
  const buf = readFileSync('RAPOR-PBD-SD-2025.xlsx');
  const wb = XLSX.read(buf, { type: 'buffer' });
  
  const sheetNames = wb.SheetNames;
  
  const trendSheetName = sheetNames.find(n => n.toLowerCase().includes('tren') || n.toLowerCase().includes('trend') || n.toLowerCase() === 'tindak lanjut');
  // Usually the sheet might be called "Panduan Membaca" or something, let's see all sheets first.
  
  console.log("Sheet names:", sheetNames);
  
} catch (e) {
  console.error(e);
}
