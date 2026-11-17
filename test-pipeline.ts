import * as XLSX from 'xlsx';
import { EducationReportParser } from './src/EducationReportParser.ts';

// 1. Create a dummy workbook simulating the RKT sheet
const wb = XLSX.utils.book_new();

const rktData = [
  ['PROGRAM', 'KEGIATAN', 'TARGET / URAIAN / DESKRIPSI'],
  ['Peningkatan Literasi', 'Pelatihan Membaca', 'Siswa dapat membaca dengan baik'],
  ['Peningkatan Numerasi', 'Pelatihan Berhitung', 'Siswa dapat berhitung dengan baik']
];
const ws = XLSX.utils.aoa_to_sheet(rktData);
XLSX.utils.book_append_sheet(wb, ws, 'RKT_RKJM');

// Mock a File object (not available in Node natively)
class MockFile {
  name: string;
  size: number;
  type: string;
  buffer: any;
  constructor(buffer: any, name: string) {
    this.name = name;
    this.size = buffer.length;
    this.type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    this.buffer = buffer;
  }
}

// Override FileReader to read from our MockFile
(global as any).FileReader = class FileReader {
  onload: any;
  readAsBinaryString(file: any) {
    if (this.onload) {
      this.onload({ target: { result: file.buffer.toString('binary') } });
    }
  }
};

const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
const mockFile = new MockFile(buf, 'RAPOR-PBD-SD-2025.xlsx');

async function run() {
  console.log("================================================");
  try {
     const result = await EducationReportParser.parse(mockFile as any);
     console.log("================================================");
     console.log("PlanningParser.extract()");
     console.log("Objects Created:", result.rkt.length);
     console.log("================================================");
     console.log("CanonicalPlanning[]");
     console.log("Length:", result.rkt.length);
     console.log("================================================");
     console.log("metadata.rktImported:", result.metadata.rktImported);
     console.log("================================================");
     // Simulate passing to UI
     // The result from parser goes to the app state
     console.log("settings.analisis.data.rkt.length:", result.rkt.length);
     console.log("================================================");
     console.log("DocumentContext.rkt.length:", result.rkt.length);
     console.log("================================================");
     console.log("DOE Input:", result.rkt.length);
     console.log("================================================");
     console.log("Planning shown in UI:", result.rkt.length);
     console.log("================================================");
  } catch(e) {
     console.error(e);
  }
}
run();
