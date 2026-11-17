import { readFileSync } from 'fs';
import * as XLSX from 'xlsx';

const buf = readFileSync('RAPOR-PBD-SD-2025.xlsx');
const workbook = XLSX.read(buf, { type: 'buffer' });

function dumpSheet(sheetNameContains: string) {
    let sheetName = workbook.SheetNames.find(n => n.toLowerCase().replace(/[^a-z]/g, '').includes(sheetNameContains));
    if (!sheetName) {
        console.log(`Sheet containing ${sheetNameContains} not found.`);
        return;
    }
    console.log(`\n=====================================================`);
    console.log(`RAW DUMP: ${sheetName}`);
    console.log(`=====================================================`);
    
    const sheet = workbook.Sheets[sheetName];
    const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1:A1');
    
    let rowsDumped = 0;
    for (let r = range.s.r; r <= range.e.r && rowsDumped < 50; r++) {
        let hasData = false;
        let rowStr = `Row ${r + 1}\n`;
        for (let c = range.s.c; c <= range.e.c; c++) {
            const cellAddress = {c, r};
            const cellRef = XLSX.utils.encode_cell(cellAddress);
            const cell = sheet[cellRef];
            if (cell && cell.v !== undefined) {
                hasData = true;
                rowStr += `${cellRef}\n${cell.v}\n`;
            }
        }
        if (hasData) {
            console.log(rowStr + '---');
            rowsDumped++;
        }
    }
}

dumpSheet('datasekolah');
dumpSheet('rekomendasi');
