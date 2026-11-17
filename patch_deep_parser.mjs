import fs from 'fs';

let content = fs.readFileSync('src/EducationReportParser.ts', 'utf-8');

const regex = /\/\/ 2\. REKOMENDASI PRIORITAS[\s\S]*metadata\.importStatus = "Success";/m;

const newParser = `// 2. REKOMENDASI PRIORITAS
            if (foundRekomendasiPrioritas) {
               const sheetIdx = sheetNames.indexOf(foundRekomendasiPrioritas);
               if (sheetIdx !== -1) {
                 const sheetName = rawSheetNames[sheetIdx];
                 const sheet = sheetName ? workbook.Sheets[sheetName] : null;
                 if (sheet) {
                   const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) || [];
                   
                   let inDataSection = false;
                   let nameCol = -1, akarCol = -1, benahiCol = -1, kegiatanCol = -1;
                   let emptyRowCount = 0;

                   for (let i = 0; i < jsonData.length; i++) {
                     const row = jsonData[i];
                     if (Array.isArray(row)) {
                        const rowStrings = row.map((c: any) => typeof c === 'string' ? c.trim() : (typeof c === 'number' ? c.toString() : ''));
                        const hasContent = rowStrings.some(c => typeof c === 'string' && c.length > 0);
                        
                        if (!hasContent && inDataSection) {
                            emptyRowCount++;
                            if (emptyRowCount > 5) break; // End of table
                            continue;
                        }

                        if (!inDataSection) {
                           const headerMatch = rowStrings.some((c: string) => typeof c === 'string' && (c.toLowerCase().includes("indikator") || c.toLowerCase().includes("akar masalah") || c.toLowerCase().includes("prioritas") || c.toLowerCase().includes("masalah")));
                           if (headerMatch) {
                              inDataSection = true;
                              nameCol = rowStrings.findIndex((c: string) => typeof c === 'string' && (c.toLowerCase().includes("indikator") || c.toLowerCase().includes("masalah") || c.toLowerCase().includes("prioritas")));
                              akarCol = rowStrings.findIndex((c: string) => typeof c === 'string' && (c.toLowerCase().includes("akar penyebab") || c.toLowerCase().includes("akar masalah")));
                              benahiCol = rowStrings.findIndex((c: string) => typeof c === 'string' && (c.toLowerCase().includes("benahi") || c.toLowerCase().includes("rekomendasi")));
                              kegiatanCol = rowStrings.findIndex((c: string) => typeof c === 'string' && (c.toLowerCase().includes("kegiatan") || c.toLowerCase().includes("inspirasi")));
                              
                              // Check next row just in case headers are split across 2 rows
                              if (i + 1 < jsonData.length) {
                                  const nextRowStrings = (jsonData[i+1] || []).map((c: any) => typeof c === 'string' ? c.trim() : (typeof c === 'number' ? c.toString() : ''));
                                  if (nameCol === -1) nameCol = nextRowStrings.findIndex((c: string) => typeof c === 'string' && (c.toLowerCase().includes("indikator") || c.toLowerCase().includes("masalah")));
                                  if (akarCol === -1) akarCol = nextRowStrings.findIndex((c: string) => typeof c === 'string' && (c.toLowerCase().includes("akar penyebab") || c.toLowerCase().includes("akar masalah")));
                                  if (benahiCol === -1) benahiCol = nextRowStrings.findIndex((c: string) => typeof c === 'string' && (c.toLowerCase().includes("benahi") || c.toLowerCase().includes("rekomendasi")));
                                  if (kegiatanCol === -1) kegiatanCol = nextRowStrings.findIndex((c: string) => typeof c === 'string' && (c.toLowerCase().includes("kegiatan") || c.toLowerCase().includes("inspirasi")));
                              }
                           }
                        } else {
                           emptyRowCount = 0; // reset
                           const validCells = rowStrings.filter((c: string) => typeof c === 'string' && c.length > 0);
                           
                           // If it's a data row, there should be at least an indicator/problem name.
                           // Some merged cells might push data to different columns. Let's be lenient.
                           if (validCells.length >= 1) {
                              let indicatorName = nameCol !== -1 && rowStrings[nameCol] ? rowStrings[nameCol] : "";
                              let akarPenyebab = akarCol !== -1 && rowStrings[akarCol] ? rowStrings[akarCol] : "";
                              let benahi = benahiCol !== -1 && rowStrings[benahiCol] ? rowStrings[benahiCol] : "";
                              let kegiatan = kegiatanCol !== -1 && rowStrings[kegiatanCol] ? rowStrings[kegiatanCol] : "";
                              
                              if (!indicatorName && validCells[0]) indicatorName = validCells[0];
                              if (!akarPenyebab && validCells[1]) akarPenyebab = validCells[1];
                              if (!benahi && validCells[2]) benahi = validCells[2];
                              if (!kegiatan && validCells[3]) kegiatan = validCells[3];
                              
                              // Clean up IDs
                              const idMatch = typeof indicatorName === 'string' ? indicatorName.match(/^[A-E]\.\d+(\.\d+)?/) : null;
                              const finalId = idMatch && idMatch[0] ? idMatch[0] : indicatorName;

                              // Skip if it is just repeating header or empty
                              if (typeof indicatorName === 'string' && indicatorName.length > 2 && !indicatorName.toLowerCase().includes("indikator prioritas")) {
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
                   }
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
                   let emptyRowCount = 0;

                   for (let i = 0; i < jsonData.length; i++) {
                     const row = jsonData[i];
                     if (Array.isArray(row)) {
                        const rowStrings = row.map((c: any) => typeof c === 'string' ? c.trim() : (typeof c === 'number' ? c.toString() : ''));
                        const hasContent = rowStrings.some(c => typeof c === 'string' && c.length > 0);
                        
                        if (!hasContent && inDataSection) {
                            emptyRowCount++;
                            if (emptyRowCount > 5) break;
                            continue;
                        }

                        if (!inDataSection) {
                           const headerMatch = rowStrings.some((c: string) => typeof c === 'string' && (c.toLowerCase().includes("masalah") || c.toLowerCase().includes("akar masalah") || c.toLowerCase().includes("benahi")));
                           if (headerMatch) {
                              inDataSection = true;
                              mCol = rowStrings.findIndex((c: string) => typeof c === 'string' && (c.toLowerCase() === "masalah" || c.toLowerCase().includes("identifikasi")));
                              aCol = rowStrings.findIndex((c: string) => typeof c === 'string' && (c.toLowerCase() === "akar masalah" || c.toLowerCase().includes("akar penyebab")));
                              pCol = rowStrings.findIndex((c: string) => typeof c === 'string' && (c.toLowerCase() === "program" || c.toLowerCase().includes("benahi")));
                              kCol = rowStrings.findIndex((c: string) => typeof c === 'string' && (c.toLowerCase() === "kegiatan" || c.toLowerCase().includes("inspirasi kegiatan")));
                              dCol = rowStrings.findIndex((c: string) => typeof c === 'string' && (c.toLowerCase() === "penjelasan" || c.toLowerCase().includes("deskripsi")));
                              
                              if (i + 1 < jsonData.length) {
                                  const nextRowStrings = (jsonData[i+1] || []).map((c: any) => typeof c === 'string' ? c.trim() : (typeof c === 'number' ? c.toString() : ''));
                                  if (mCol === -1) mCol = nextRowStrings.findIndex((c: string) => typeof c === 'string' && (c.toLowerCase() === "masalah" || c.toLowerCase().includes("identifikasi")));
                                  if (aCol === -1) aCol = nextRowStrings.findIndex((c: string) => typeof c === 'string' && (c.toLowerCase() === "akar masalah" || c.toLowerCase().includes("akar penyebab")));
                                  if (pCol === -1) pCol = nextRowStrings.findIndex((c: string) => typeof c === 'string' && (c.toLowerCase() === "program" || c.toLowerCase().includes("benahi")));
                                  if (kCol === -1) kCol = nextRowStrings.findIndex((c: string) => typeof c === 'string' && (c.toLowerCase() === "kegiatan" || c.toLowerCase().includes("inspirasi kegiatan")));
                                  if (dCol === -1) dCol = nextRowStrings.findIndex((c: string) => typeof c === 'string' && (c.toLowerCase() === "penjelasan" || c.toLowerCase().includes("deskripsi")));
                              }
                           }
                        } else {
                           emptyRowCount = 0;
                           const validCells = rowStrings.filter((c: string) => typeof c === 'string' && c.length > 0);
                           if (validCells.length >= 1) {
                              let masalah = mCol !== -1 && rowStrings[mCol] ? rowStrings[mCol] : validCells[0] || "";
                              let akarMasalah = aCol !== -1 && rowStrings[aCol] ? rowStrings[aCol] : validCells[1] || "";
                              let program = pCol !== -1 && rowStrings[pCol] ? rowStrings[pCol] : (validCells[2] || "");
                              let kegiatan = kCol !== -1 && rowStrings[kCol] ? rowStrings[kCol] : (validCells[3] || program || "");
                              let deskripsi = dCol !== -1 && rowStrings[dCol] ? rowStrings[dCol] : (validCells[4] || "");
                              
                              if (typeof masalah === 'string' && masalah.length > 2 && !masalah.toLowerCase().includes("masalah")) {
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
                   }
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
                   let emptyRowCount = 0;

                   for (let i = 0; i < jsonData.length; i++) {
                     const row = jsonData[i];
                     if (Array.isArray(row)) {
                        const rowStrings = row.map((c: any) => typeof c === 'string' ? c.trim() : (typeof c === 'number' ? c.toString() : ''));
                        const hasContent = rowStrings.some(c => typeof c === 'string' && c.length > 0);
                        
                        if (!hasContent && inDataSection) {
                            emptyRowCount++;
                            if (emptyRowCount > 5) break;
                            continue;
                        }
                        
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
                              
                              if (i + 1 < jsonData.length) {
                                  const nextRowStrings = (jsonData[i+1] || []).map((c: any) => typeof c === 'string' ? c.trim() : (typeof c === 'number' ? c.toString() : ''));
                                  if (kCol === -1) kCol = nextRowStrings.findIndex((c: string) => typeof c === 'string' && c.toLowerCase().includes("kegiatan"));
                                  if (uCol === -1) uCol = nextRowStrings.findIndex((c: string) => typeof c === 'string' && (c.toLowerCase().includes("uraian") || c.toLowerCase().includes("deskripsi")));
                                  if (jCol === -1) jCol = nextRowStrings.findIndex((c: string) => typeof c === 'string' && (c.toLowerCase().includes("jumlah") || c.toLowerCase().includes("volume")));
                                  if (sCol === -1) sCol = nextRowStrings.findIndex((c: string) => typeof c === 'string' && c.toLowerCase().includes("satuan"));
                                  if (hCol === -1) hCol = nextRowStrings.findIndex((c: string) => typeof c === 'string' && c.toLowerCase().includes("harga"));
                                  if (tCol === -1) tCol = nextRowStrings.findIndex((c: string) => typeof c === 'string' && c.toLowerCase().includes("total"));
                              }
                           }
                        } else {
                           emptyRowCount = 0;
                           const validCells = rowStrings.filter((c: string) => typeof c === 'string' && c.length > 0);
                           if (validCells.length >= 1) {
                              let kegiatan = kCol !== -1 && rowStrings[kCol] ? rowStrings[kCol] : validCells[0] || "";
                              let uraian = uCol !== -1 && rowStrings[uCol] ? rowStrings[uCol] : (validCells[1] || "");
                              let jumlah = jCol !== -1 && rowStrings[jCol] ? rowStrings[jCol] : (validCells[2] || "1");
                              let satuan = sCol !== -1 && rowStrings[sCol] ? rowStrings[sCol] : (validCells[3] || "Tahun");
                              let harga = hCol !== -1 && rowStrings[hCol] ? rowStrings[hCol] : (validCells[4] || "0");
                              let total = tCol !== -1 && rowStrings[tCol] ? rowStrings[tCol] : (validCells[5] || "0");
                              
                              if (typeof kegiatan === 'string' && kegiatan.length > 2 && !kegiatan.toLowerCase().includes("kegiatan")) {
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
                   }
                 }
               }
            }

            metadata.importStatus = "Success";`;

content = content.replace(regex, newParser);
fs.writeFileSync('src/EducationReportParser.ts', content);
