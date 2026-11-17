import fs from 'fs';

const content = `import * as XLSX from 'xlsx';
import { RaporDictionary } from './Tampuyak';

export interface ParserMetadata {
  workbookDetected: string;
  officialVersion: string;
  worksheetsFound: string[];
  worksheetsMissing: string[];
  indicatorsImported: number;
  recommendationsImported: number;
  rktImported: number;
  rkasImported: number;
  trendImported: boolean;
  rankingImported: boolean;
  parserMode: "Official" | "Compatibility";
  importStatus: string;
}

export interface ParseResult {
  data: any;
  metadata: ParserMetadata;
  recommendations: any[];
  rkt: any[];
  rkas: any[];
  schoolData: any;
}

export class EducationReportParser {
  static async parse(file: File): Promise<ParseResult> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const fileData = e.target?.result;
          const workbook = XLSX.read(fileData, { type: 'binary' });
          
          const metadata: ParserMetadata = {
            workbookDetected: file.name,
            officialVersion: "Unknown",
            worksheetsFound: [],
            worksheetsMissing: [],
            indicatorsImported: 0,
            recommendationsImported: 0,
            rktImported: 0,
            rkasImported: 0,
            trendImported: false,
            rankingImported: false,
            parserMode: "Compatibility",
            importStatus: "Pending"
          };

          const expectedOfficialSheets = [
            "PANDUAN PBD",
            "LAPORAN RAPOR",
            "REKOMENDASI KESELURUHAN",
            "REKOMENDASI PRIORITAS",
            "LEMBAR KERJA RKT",
            "LEMBAR KERJA ARKAS"
          ];

          const sheetNames = workbook.SheetNames.map(s => s.trim().toUpperCase());
          let isOfficial = false;
          
          expectedOfficialSheets.forEach(sheet => {
             const found = sheetNames.find(s => s.includes(sheet));
             if (found) {
                metadata.worksheetsFound.push(found);
                isOfficial = true;
             } else {
                metadata.worksheetsMissing.push(sheet);
             }
          });

          let parsedData: any = {};
          let recommendations: any[] = [];
          let rkt: any[] = [];
          let rkas: any[] = [];
          let schoolData: any = {};

          if (isOfficial) {
            metadata.parserMode = "Official";
            metadata.officialVersion = "1.0 (Kemendikdasmen)";
            
            // LAPORAN RAPOR
            const laporanSheetName = metadata.worksheetsFound.find(s => s.includes("LAPORAN RAPOR"));
            if (laporanSheetName) {
              const sheet = workbook.Sheets[workbook.SheetNames[sheetNames.indexOf(laporanSheetName)]];
              const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
              
              const allInds = RaporDictionary.flatMap(d => d.indikator);
              
              jsonData.forEach((row: any) => {
                if (Array.isArray(row)) {
                  // Attempt to find School Data
                  if (row[0] && typeof row[0] === 'string') {
                     const text = row[0].toLowerCase();
                     if (text.includes("nama sekolah") || text === "sekolah") {
                        schoolData.name = row[1] || row[2];
                     }
                     if (text.includes("npsn")) {
                        schoolData.npsn = row[1] || row[2];
                     }
                  }

                  let foundId = "";
                  let foundValue = 0;
                  let trend = "";
                  let districtRank = "";
                  let nationalRank = "";
                  
                  row.forEach((cell: any, index: number) => {
                    if (typeof cell === 'string') {
                      const matchInd = allInds.find(ind => ind.id === cell.trim());
                      if (matchInd) {
                        foundId = matchInd.id;
                        const scoreCell = row.find((c: any, i: number) => i > index && typeof c === 'number');
                        if (scoreCell !== undefined) {
                          foundValue = scoreCell;
                        }
                      }
                      
                      const match = cell.match(/^[A-E]\.\d+(\.\d+)?$/);
                      if (match && !foundId) {
                        foundId = match[0];
                        const scoreCell = row.find((c: any, i: number) => i > index && typeof c === 'number');
                        if (scoreCell !== undefined) {
                          foundValue = scoreCell;
                        }
                      }
                      
                      if (cell.toLowerCase().includes("naik") || cell.toLowerCase().includes("turun") || cell.toLowerCase().includes("stabil")) {
                         trend = cell;
                         metadata.trendImported = true;
                      }
                      if (cell.toLowerCase().includes("peringkat")) {
                         if (cell.toLowerCase().includes("kab") || cell.toLowerCase().includes("kota")) {
                             districtRank = cell;
                         }
                         if (cell.toLowerCase().includes("nasional")) {
                             nationalRank = cell;
                         }
                         metadata.rankingImported = true;
                      }
                    }
                  });

                  if (foundId && foundValue > 0) {
                    const kategori = foundValue >= 80 ? "Hijau" : foundValue >= 60 ? "Kuning" : "Merah";
                    parsedData[foundId] = {
                      nilai: foundValue.toString(),
                      kategori: kategori,
                      catatan: "Diimpor dari Laporan Rapor Resmi",
                      trend: trend,
                      peringkatDaerah: districtRank,
                      peringkatNasional: nationalRank
                    };
                    metadata.indicatorsImported++;
                  }
                }
              });
            }

            // REKOMENDASI PRIORITAS
            const rekPrioritasSheetName = metadata.worksheetsFound.find(s => s.includes("REKOMENDASI PRIORITAS"));
            if (rekPrioritasSheetName) {
               const sheet = workbook.Sheets[workbook.SheetNames[sheetNames.indexOf(rekPrioritasSheetName)]];
               const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
               
               let inDataSection = false;
               jsonData.forEach((row: any) => {
                 if (Array.isArray(row) && row.length >= 3) {
                    const rowStrings = row.map(c => typeof c === 'string' ? c.trim() : (typeof c === 'number' ? c.toString() : ''));
                    const hasHeaders = rowStrings.some(c => c.toLowerCase().includes("indikator") || c.toLowerCase().includes("prioritas"));
                    if (hasHeaders && !inDataSection) {
                       inDataSection = true;
                       return;
                    }
                    if (inDataSection) {
                       const validCells = rowStrings.filter(c => c.length > 0);
                       if (validCells.length >= 3) {
                          const idMatch = validCells.find(c => c.match(/^[A-E]\.\d+(\.\d+)?/));
                          const indicatorName = idMatch ? idMatch.match(/^[A-E]\.\d+(\.\d+)?/)?.[0] || validCells[0] : validCells[0];
                          
                          recommendations.push({
                              id: indicatorName,
                              name: validCells[0],
                              akarPenyebab: validCells[1] || "",
                              benahi: validCells[2] || "",
                              kegiatan: validCells[3] || validCells[2] || ""
                          });
                          metadata.recommendationsImported++;
                       }
                    }
                 }
               });
            }

            // LEMBAR KERJA RKT
            const rktSheetName = metadata.worksheetsFound.find(s => s.includes("LEMBAR KERJA RKT"));
            if (rktSheetName) {
               const sheet = workbook.Sheets[workbook.SheetNames[sheetNames.indexOf(rktSheetName)]];
               const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
               let inDataSection = false;
               jsonData.forEach((row: any) => {
                 if (Array.isArray(row)) {
                    const rowStrings = row.map(c => typeof c === 'string' ? c.trim() : (typeof c === 'number' ? c.toString() : ''));
                    const hasHeaders = rowStrings.some(c => c.toLowerCase().includes("masalah") || c.toLowerCase().includes("akar masalah"));
                    if (hasHeaders && !inDataSection) {
                       inDataSection = true;
                       return;
                    }
                    if (inDataSection) {
                       const validCells = rowStrings.filter(c => c.length > 0);
                       if (validCells.length >= 2) {
                          rkt.push({
                              masalah: validCells[0],
                              akarMasalah: validCells[1] || "",
                              program: validCells[2] || "",
                              kegiatan: validCells[3] || validCells[2] || "",
                              deskripsi: validCells[4] || ""
                          });
                          metadata.rktImported++;
                       }
                    }
                 }
               });
            }

            // LEMBAR KERJA ARKAS
            const rkasSheetName = metadata.worksheetsFound.find(s => s.includes("LEMBAR KERJA ARKAS"));
            if (rkasSheetName) {
               const sheet = workbook.Sheets[workbook.SheetNames[sheetNames.indexOf(rkasSheetName)]];
               const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
               let inDataSection = false;
               jsonData.forEach((row: any) => {
                 if (Array.isArray(row)) {
                    const rowStrings = row.map(c => typeof c === 'string' ? c.trim() : (typeof c === 'number' ? c.toString() : ''));
                    const hasHeaders = rowStrings.some(c => c.toLowerCase().includes("kegiatan") || c.toLowerCase().includes("arkas"));
                    if (hasHeaders && !inDataSection) {
                       inDataSection = true;
                       return;
                    }
                    if (inDataSection) {
                       const validCells = rowStrings.filter(c => c.length > 0);
                       if (validCells.length >= 2) {
                          rkas.push({
                              kegiatan: validCells[0],
                              uraian: validCells[1] || "",
                              jumlah: validCells[2] || "1",
                              satuan: validCells[3] || "Tahun",
                              harga: validCells[4] || "0",
                              total: validCells[5] || "0"
                          });
                          metadata.rkasImported++;
                       }
                    }
                 }
               });
            }

            metadata.importStatus = "Success";
            
          } else {
            // Fallback Mode (Compatibility)
            metadata.parserMode = "Compatibility";
            
            workbook.SheetNames.forEach(sheetName => {
              const sheet = workbook.Sheets[sheetName];
              const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
              
              jsonData.forEach((row: any) => {
                if (Array.isArray(row)) {
                  let foundId = "";
                  let foundValue = 0;
                  let idFound = false;

                  const allInds = RaporDictionary.flatMap(d => d.indikator);
                  
                  row.forEach((cell: any) => {
                    if (typeof cell === 'string') {
                      const matchInd = allInds.find(ind => ind.id === cell.trim() || ind.nama.toLowerCase() === cell.trim().toLowerCase());
                      if (matchInd) {
                        foundId = matchInd.id;
                        idFound = true;
                      }
                    } else if (typeof cell === 'number' && idFound && foundValue === 0) {
                       foundValue = cell;
                    }
                  });

                  if (!idFound) {
                    row.forEach((cell: any) => {
                      if (typeof cell === 'string') {
                         const match = cell.match(/^[A-E]\.\d+(\.\d+)?$/);
                         if (match) {
                            foundId = match[0];
                            idFound = true;
                         }
                      }
                    });
                    if (idFound) {
                      const num = row.find(c => typeof c === 'number');
                      if (num !== undefined) {
                        foundValue = num;
                      } else {
                        const strNum = row.find(c => typeof c === 'string' && !isNaN(parseFloat(c)));
                        if (strNum) {
                          foundValue = parseFloat(strNum);
                        }
                      }
                    }
                  }

                  if (foundId && foundValue > 0) {
                    const kategori = foundValue >= 80 ? "Hijau" : foundValue >= 60 ? "Kuning" : "Merah";
                    parsedData[foundId] = {
                      nilai: foundValue.toString(),
                      kategori: kategori,
                      catatan: "Diimpor dari file Excel Rapor Pendidikan (Mode Kompatibilitas)"
                    };
                    metadata.indicatorsImported++;
                  }
                }
              });
            });

            metadata.importStatus = metadata.indicatorsImported > 0 ? "Success (Compatibility)" : "Failed";
          }
          
          resolve({
             data: parsedData,
             metadata: metadata,
             recommendations: recommendations,
             rkt: rkt,
             rkas: rkas,
             schoolData: schoolData
          });
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => reject(error);
      reader.readAsBinaryString(file);
    });
  }
}
`;

fs.writeFileSync('src/EducationReportParser.ts', content);
console.log('Parser updated.');
