import fs from 'fs';
const newCode = `import * as XLSX from 'xlsx';
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
            workbookDetected: file?.name || "Unknown",
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

          const rawSheetNames = workbook?.SheetNames || [];
          const sheetNames = rawSheetNames.map(s => typeof s === 'string' ? s.trim().toUpperCase() : "");
          let isOfficial = false;
          
          const foundLaporan = sheetNames.find(s => typeof s === 'string' && (s.includes("LAPORAN RAPOR") || s.includes("RAPOR PENDIDIKAN")));
          const foundRekomendasiPrioritas = sheetNames.find(s => typeof s === 'string' && (s.includes("REKOMENDASI PRIORITAS") || (s.includes("REKOMENDASI") && !s.includes("KESELURUHAN"))));
          const foundRekomendasiKeseluruhan = sheetNames.find(s => typeof s === 'string' && s.includes("REKOMENDASI KESELURUHAN"));
          const foundRkt = sheetNames.find(s => typeof s === 'string' && s.includes("RKT"));
          const foundArkas = sheetNames.find(s => typeof s === 'string' && (s.includes("ARKAS") || s.includes("RKAS")));
          
          if (foundLaporan || foundRekomendasiPrioritas || foundRkt) {
             isOfficial = true;
          }

          if (foundLaporan) metadata.worksheetsFound.push(foundLaporan);
          if (foundRekomendasiPrioritas) metadata.worksheetsFound.push(foundRekomendasiPrioritas);
          if (foundRekomendasiKeseluruhan) metadata.worksheetsFound.push(foundRekomendasiKeseluruhan);
          if (foundRkt) metadata.worksheetsFound.push(foundRkt);
          if (foundArkas) metadata.worksheetsFound.push(foundArkas);

          let parsedData: any = {};
          let recommendations: any[] = [];
          let rkt: any[] = [];
          let rkas: any[] = [];
          let schoolData: any = {};

          if (isOfficial) {
            metadata.parserMode = "Official";
            metadata.officialVersion = "Kemendikdasmen (Auto-detected)";
            
            // 1. LAPORAN RAPOR
            if (foundLaporan) {
              const sheetIdx = sheetNames.indexOf(foundLaporan);
              if (sheetIdx !== -1) {
                const sheetName = rawSheetNames[sheetIdx];
                const sheet = sheetName ? workbook.Sheets[sheetName] : null;
                if (sheet) {
                  const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) || [];
                  const allInds = RaporDictionary.flatMap(d => d.indikator || []);
                  
                  jsonData.forEach((row: any) => {
                    if (Array.isArray(row)) {
                      const rowStrings = row.map((c: any) => typeof c === 'string' ? c.trim().toLowerCase() : (typeof c === 'number' ? c.toString() : ''));
                      
                      const schoolNameIdx = rowStrings.findIndex((s: string) => typeof s === 'string' && (s.includes("nama sekolah") || s === "sekolah" || s === "nama satuan pendidikan"));
                      if (schoolNameIdx !== -1 && row[schoolNameIdx + 1] !== undefined) {
                         schoolData.name = String(row[schoolNameIdx + 1]);
                      } else if (schoolNameIdx !== -1 && row[schoolNameIdx + 2] !== undefined) {
                         schoolData.name = String(row[schoolNameIdx + 2]);
                      }

                      const npsnIdx = rowStrings.findIndex((s: string) => typeof s === 'string' && s.includes("npsn"));
                      if (npsnIdx !== -1 && row[npsnIdx + 1] !== undefined) {
                         schoolData.npsn = String(row[npsnIdx + 1]);
                      } else if (npsnIdx !== -1 && row[npsnIdx + 2] !== undefined) {
                         schoolData.npsn = String(row[npsnIdx + 2]);
                      }

                      let foundId = "";
                      let foundValue = 0;
                      let trend = "";
                      let districtRank = "";
                      let nationalRank = "";
                      
                      row.forEach((cell: any, index: number) => {
                        if (typeof cell === 'string') {
                          const cStr = cell.trim();
                          const cStrLow = cStr.toLowerCase();
                          const matchInd = allInds.find(ind => ind?.id === cStr || ind?.nama?.toLowerCase() === cStrLow);
                          if (matchInd && matchInd.id) {
                            foundId = matchInd.id;
                          } else {
                            const match = cStr.match(/^[A-E]\.\d+(\.\d+)?$/);
                            if (match && match[0] && !foundId) {
                              foundId = match[0];
                            }
                          }

                          if (foundId) {
                            const scoreCell = row.find((c: any, i: number) => i > index && typeof c === 'number');
                            if (scoreCell !== undefined && scoreCell !== null) {
                              foundValue = Number(scoreCell);
                            } else {
                              const strScore = row.find((c: any, i: number) => i > index && typeof c === 'string' && !isNaN(parseFloat(c)));
                              if (strScore) foundValue = parseFloat(strScore);
                            }
                          }
                          
                          const cLow = cStrLow;
                          if (cLow === "naik" || cLow === "turun" || cLow === "stabil" || cLow.includes("meningkat") || cLow.includes("menurun")) {
                             trend = cell;
                             metadata.trendImported = true;
                          }
                          if (cLow.includes("peringkat") || cLow.includes("posisi")) {
                             if (cLow.includes("kab") || cLow.includes("kota") || cLow.includes("daerah")) {
                                 districtRank = cell;
                             }
                             if (cLow.includes("nasional")) {
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
              }
            }

            // 2. REKOMENDASI PRIORITAS
            if (foundRekomendasiPrioritas) {
               const sheetIdx = sheetNames.indexOf(foundRekomendasiPrioritas);
               if (sheetIdx !== -1) {
                 const sheetName = rawSheetNames[sheetIdx];
                 const sheet = sheetName ? workbook.Sheets[sheetName] : null;
                 if (sheet) {
                   const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) || [];
                   
                   let inDataSection = false;
                   let nameCol = -1, akarCol = -1, benahiCol = -1, kegiatanCol = -1;

                   jsonData.forEach((row: any) => {
                     if (Array.isArray(row) && row.length > 0) {
                        const rowStrings = row.map((c: any) => typeof c === 'string' ? c.trim() : (typeof c === 'number' ? c.toString() : ''));
                        
                        if (!inDataSection) {
                           const headerMatch = rowStrings.some((c: string) => typeof c === 'string' && (c.toLowerCase().includes("indikator") || c.toLowerCase().includes("prioritas") || c.toLowerCase().includes("masalah")));
                           if (headerMatch) {
                              inDataSection = true;
                              nameCol = rowStrings.findIndex((c: string) => typeof c === 'string' && (c.toLowerCase().includes("indikator") || c.toLowerCase().includes("masalah") || c.toLowerCase().includes("prioritas")));
                              akarCol = rowStrings.findIndex((c: string) => typeof c === 'string' && (c.toLowerCase().includes("akar penyebab") || c.toLowerCase().includes("akar masalah")));
                              benahiCol = rowStrings.findIndex((c: string) => typeof c === 'string' && (c.toLowerCase().includes("benahi") || c.toLowerCase().includes("rekomendasi")));
                              kegiatanCol = rowStrings.findIndex((c: string) => typeof c === 'string' && (c.toLowerCase().includes("kegiatan") || c.toLowerCase().includes("inspirasi")));
                              return;
                           }
                        } else {
                           const validCells = rowStrings.filter((c: string) => typeof c === 'string' && c.length > 0);
                           if (validCells.length >= 2) {
                              let indicatorName = "";
                              let akarPenyebab = "";
                              let benahi = "";
                              let kegiatan = "";
                              
                              if (nameCol !== -1 && rowStrings[nameCol]) indicatorName = rowStrings[nameCol];
                              else indicatorName = validCells[0] || "";
                              
                              if (akarCol !== -1 && rowStrings[akarCol]) akarPenyebab = rowStrings[akarCol];
                              else akarPenyebab = validCells[1] || "";

                              if (benahiCol !== -1 && rowStrings[benahiCol]) benahi = rowStrings[benahiCol];
                              else benahi = validCells[2] || validCells[1] || "";
                              
                              if (kegiatanCol !== -1 && rowStrings[kegiatanCol]) kegiatan = rowStrings[kegiatanCol];
                              else kegiatan = validCells[3] || benahi || "";
                              
                              const idMatch = typeof indicatorName === 'string' ? indicatorName.match(/^[A-E]\.\d+(\.\d+)?/) : null;
                              const finalId = idMatch && idMatch[0] ? idMatch[0] : indicatorName;

                              if (typeof indicatorName === 'string' && indicatorName.length > 2) {
                                recommendations.push({
                                    id: finalId,
                                    name: indicatorName,
                                    akarPenyebab: akarPenyebab,
                                    benahi: benahi,
                                    kegiatan: kegiatan
                                });
                                metadata.recommendationsImported++;
                              }
                           }
                        }
                     }
                   });
                 }
               }
            }

            // 3. LEMBAR KERJA RKT
            if (foundRkt) {
               const sheetIdx = sheetNames.indexOf(foundRkt);
               if (sheetIdx !== -1) {
                 const sheetName = rawSheetNames[sheetIdx];
                 const sheet = sheetName ? workbook.Sheets[sheetName] : null;
                 if (sheet) {
                   const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) || [];
                   
                   let inDataSection = false;
                   let mCol = -1, aCol = -1, pCol = -1, kCol = -1, dCol = -1;

                   jsonData.forEach((row: any) => {
                     if (Array.isArray(row)) {
                        const rowStrings = row.map((c: any) => typeof c === 'string' ? c.trim() : (typeof c === 'number' ? c.toString() : ''));
                        
                        if (!inDataSection) {
                           const headerMatch = rowStrings.some((c: string) => typeof c === 'string' && (c.toLowerCase().includes("masalah") || c.toLowerCase().includes("akar masalah") || c.toLowerCase().includes("benahi")));
                           if (headerMatch) {
                              inDataSection = true;
                              mCol = rowStrings.findIndex((c: string) => typeof c === 'string' && (c.toLowerCase() === "masalah" || c.toLowerCase().includes("identifikasi")));
                              aCol = rowStrings.findIndex((c: string) => typeof c === 'string' && (c.toLowerCase() === "akar masalah" || c.toLowerCase().includes("akar penyebab")));
                              pCol = rowStrings.findIndex((c: string) => typeof c === 'string' && (c.toLowerCase() === "program" || c.toLowerCase().includes("benahi")));
                              kCol = rowStrings.findIndex((c: string) => typeof c === 'string' && (c.toLowerCase() === "kegiatan" || c.toLowerCase().includes("inspirasi kegiatan")));
                              dCol = rowStrings.findIndex((c: string) => typeof c === 'string' && (c.toLowerCase() === "penjelasan" || c.toLowerCase().includes("deskripsi")));
                              return;
                           }
                        } else {
                           const validCells = rowStrings.filter((c: string) => typeof c === 'string' && c.length > 0);
                           if (validCells.length >= 2) {
                              let masalah = mCol !== -1 && rowStrings[mCol] ? rowStrings[mCol] : validCells[0] || "";
                              let akarMasalah = aCol !== -1 && rowStrings[aCol] ? rowStrings[aCol] : validCells[1] || "";
                              let program = pCol !== -1 && rowStrings[pCol] ? rowStrings[pCol] : (validCells[2] || "");
                              let kegiatan = kCol !== -1 && rowStrings[kCol] ? rowStrings[kCol] : (validCells[3] || program || "");
                              let deskripsi = dCol !== -1 && rowStrings[dCol] ? rowStrings[dCol] : (validCells[4] || "");
                              
                              if (typeof masalah === 'string' && masalah.length > 2) {
                                rkt.push({
                                    masalah,
                                    akarMasalah,
                                    program,
                                    kegiatan,
                                    deskripsi
                                });
                                metadata.rktImported++;
                              }
                           }
                        }
                     }
                   });
                 }
               }
            }

            // 4. LEMBAR KERJA ARKAS
            if (foundArkas) {
               const sheetIdx = sheetNames.indexOf(foundArkas);
               if (sheetIdx !== -1) {
                 const sheetName = rawSheetNames[sheetIdx];
                 const sheet = sheetName ? workbook.Sheets[sheetName] : null;
                 if (sheet) {
                   const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) || [];
                   
                   let inDataSection = false;
                   let kCol = -1, uCol = -1, jCol = -1, sCol = -1, hCol = -1, tCol = -1;

                   jsonData.forEach((row: any) => {
                     if (Array.isArray(row)) {
                        const rowStrings = row.map((c: any) => typeof c === 'string' ? c.trim() : (typeof c === 'number' ? c.toString() : ''));
                        
                        if (!inDataSection) {
                           const headerMatch = rowStrings.some((c: string) => typeof c === 'string' && (c.toLowerCase().includes("kegiatan") || c.toLowerCase().includes("arkas") || c.toLowerCase().includes("uraian")));
                           if (headerMatch) {
                              inDataSection = true;
                              kCol = rowStrings.findIndex((c: string) => typeof c === 'string' && c.toLowerCase().includes("kegiatan"));
                              uCol = rowStrings.findIndex((c: string) => typeof c === 'string' && (c.toLowerCase().includes("uraian") || c.toLowerCase().includes("deskripsi")));
                              jCol = rowStrings.findIndex((c: string) => typeof c === 'string' && (c.toLowerCase().includes("jumlah") || c.toLowerCase().includes("volume")));
                              sCol = rowStrings.findIndex((c: string) => typeof c === 'string' && c.toLowerCase().includes("satuan"));
                              hCol = rowStrings.findIndex((c: string) => typeof c === 'string' && c.toLowerCase().includes("harga"));
                              tCol = rowStrings.findIndex((c: string) => typeof c === 'string' && c.toLowerCase().includes("total"));
                              return;
                           }
                        } else {
                           const validCells = rowStrings.filter((c: string) => typeof c === 'string' && c.length > 0);
                           if (validCells.length >= 2) {
                              let kegiatan = kCol !== -1 && rowStrings[kCol] ? rowStrings[kCol] : validCells[0] || "";
                              let uraian = uCol !== -1 && rowStrings[uCol] ? rowStrings[uCol] : (validCells[1] || "");
                              let jumlah = jCol !== -1 && rowStrings[jCol] ? rowStrings[jCol] : (validCells[2] || "1");
                              let satuan = sCol !== -1 && rowStrings[sCol] ? rowStrings[sCol] : (validCells[3] || "Tahun");
                              let harga = hCol !== -1 && rowStrings[hCol] ? rowStrings[hCol] : (validCells[4] || "0");
                              let total = tCol !== -1 && rowStrings[tCol] ? rowStrings[tCol] : (validCells[5] || "0");
                              
                              if (typeof kegiatan === 'string' && kegiatan.length > 2) {
                                rkas.push({
                                    kegiatan,
                                    uraian,
                                    jumlah,
                                    satuan,
                                    harga,
                                    total
                                });
                                metadata.rkasImported++;
                              }
                           }
                        }
                     }
                   });
                 }
               }
            }

            metadata.importStatus = "Success";
            
          } else {

            // Fallback Mode (Compatibility)
            metadata.parserMode = "Compatibility";
            
            rawSheetNames.forEach(sheetName => {
              if (sheetName) {
                const sheet = workbook.Sheets[sheetName];
                if (sheet) {
                  const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) || [];
                  
                  jsonData.forEach((row: any) => {
                    if (Array.isArray(row)) {
                      let foundId = "";
                      let foundValue = 0;
                      let idFound = false;

                      const allInds = RaporDictionary.flatMap(d => d.indikator || []);
                      
                      row.forEach((cell: any) => {
                        if (typeof cell === 'string') {
                          const cellTrim = cell.trim();
                          const cellLow = cellTrim.toLowerCase();
                          const matchInd = allInds.find(ind => ind?.id === cellTrim || (ind?.nama && ind.nama.toLowerCase() === cellLow));
                          if (matchInd && matchInd.id) {
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
                             if (match && match[0]) {
                                foundId = match[0];
                                idFound = true;
                             }
                          }
                        });
                        if (idFound) {
                          const num = row.find((c: any) => typeof c === 'number');
                          if (num !== undefined && num !== null) {
                            foundValue = Number(num);
                          } else {
                            const strNum = row.find((c: any) => typeof c === 'string' && !isNaN(parseFloat(c)));
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
                }
              }
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
          console.error("EducationReportParser Error:", error);
          reject(error);
        }
      };
      
      reader.onerror = (error) => {
        console.error("FileReader Error:", error);
        reject(error);
      };
      if (file) {
        reader.readAsBinaryString(file);
      } else {
        reject(new Error("File is undefined or null"));
      }
    });
  }
}
`;
fs.writeFileSync('src/EducationReportParser.ts', newCode);
console.log('Parser official mode rewritten safely');
