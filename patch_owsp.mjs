import fs from 'fs';

let content = fs.readFileSync('src/EducationReportParser.ts', 'utf-8');

// We need to replace the parsers for Rekomendasi Prioritas, RKT, and ARKAS

const findRegex = /\/\/ 2\. REKOMENDASI PRIORITAS[\s\S]*metadata\.importStatus = "Success";/m;

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
                   let currentRec: any = null;

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
                           
                           if (validCells.length >= 1) {
                              let indicatorName = nameCol !== -1 && rowStrings[nameCol] ? rowStrings[nameCol] : "";
                              let akarPenyebab = akarCol !== -1 && rowStrings[akarCol] ? rowStrings[akarCol] : "";
                              let benahi = benahiCol !== -1 && rowStrings[benahiCol] ? rowStrings[benahiCol] : "";
                              let kegiatan = kegiatanCol !== -1 && rowStrings[kegiatanCol] ? rowStrings[kegiatanCol] : "";
                              
                              if (nameCol === -1 && akarCol === -1 && benahiCol === -1 && kegiatanCol === -1) {
                                  if (!indicatorName && validCells[0]) indicatorName = validCells[0];
                                  if (!akarPenyebab && validCells[1]) akarPenyebab = validCells[1];
                                  if (!benahi && validCells[2]) benahi = validCells[2];
                                  if (!kegiatan && validCells[3]) kegiatan = validCells[3];
                              }
                              
                              const isNewBlock = typeof indicatorName === 'string' && indicatorName.trim().length > 0 && !indicatorName.toLowerCase().includes("indikator prioritas");
                              
                              if (isNewBlock) {
                                if (currentRec) {
                                    recommendations.push(currentRec);
                                    metadata.recommendationsImported++;
                                }
                                
                                const idMatch = typeof indicatorName === 'string' ? indicatorName.match(/^[A-E]\.\d+(\.\d+)?/) : null;
                                const finalId = idMatch && idMatch[0] ? idMatch[0] : indicatorName;
                                
                                currentRec = {
                                    id: finalId,
                                    name: indicatorName.trim(),
                                    akarPenyebab: akarPenyebab.trim(),
                                    benahi: benahi.trim(),
                                    kegiatan: kegiatan.trim()
                                };
                              } else if (currentRec) {
                                if (akarPenyebab.trim().length > 0) currentRec.akarPenyebab += " " + akarPenyebab.trim();
                                if (benahi.trim().length > 0) currentRec.benahi += " " + benahi.trim();
                                if (kegiatan.trim().length > 0) currentRec.kegiatan += " " + kegiatan.trim();
                              }
                           }
                        }
                     }
                   }
                   if (currentRec) {
                       recommendations.push(currentRec);
                       metadata.recommendationsImported++;
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
                   let currentRkt: any = null;

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
                              let masalah = mCol !== -1 && rowStrings[mCol] ? rowStrings[mCol] : "";
                              let akarMasalah = aCol !== -1 && rowStrings[aCol] ? rowStrings[aCol] : "";
                              let program = pCol !== -1 && rowStrings[pCol] ? rowStrings[pCol] : "";
                              let kegiatan = kCol !== -1 && rowStrings[kCol] ? rowStrings[kCol] : "";
                              let deskripsi = dCol !== -1 && rowStrings[dCol] ? rowStrings[dCol] : "";
                              
                              if (mCol === -1 && aCol === -1 && pCol === -1 && kCol === -1 && dCol === -1) {
                                  if (!masalah && validCells[0]) masalah = validCells[0];
                                  if (!akarMasalah && validCells[1]) akarMasalah = validCells[1];
                                  if (!program && validCells[2]) program = validCells[2];
                                  if (!kegiatan && validCells[3]) kegiatan = validCells[3];
                                  if (!deskripsi && validCells[4]) deskripsi = validCells[4];
                              }
                              
                              const isNewBlock = typeof masalah === 'string' && masalah.trim().length > 0 && !masalah.toLowerCase().includes("masalah");
                              
                              if (isNewBlock) {
                                if (currentRkt) {
                                    rkt.push(currentRkt);
                                    metadata.rktImported++;
                                }
                                currentRkt = {
                                    masalah: masalah.trim(),
                                    akarMasalah: akarMasalah.trim(),
                                    program: program.trim(),
                                    kegiatan: kegiatan.trim(),
                                    deskripsi: deskripsi.trim()
                                };
                              } else if (currentRkt) {
                                if (akarMasalah.trim().length > 0) currentRkt.akarMasalah += " " + akarMasalah.trim();
                                if (program.trim().length > 0) currentRkt.program += " " + program.trim();
                                if (kegiatan.trim().length > 0) currentRkt.kegiatan += " " + kegiatan.trim();
                                if (deskripsi.trim().length > 0) currentRkt.deskripsi += " " + deskripsi.trim();
                              }
                           }
                        }
                     }
                   }
                   if (currentRkt) {
                       rkt.push(currentRkt);
                       metadata.rktImported++;
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
                   let currentArkas: any = null;

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
                              let kegiatan = kCol !== -1 && rowStrings[kCol] ? rowStrings[kCol] : "";
                              let uraian = uCol !== -1 && rowStrings[uCol] ? rowStrings[uCol] : "";
                              let jumlah = jCol !== -1 && rowStrings[jCol] ? rowStrings[jCol] : "";
                              let satuan = sCol !== -1 && rowStrings[sCol] ? rowStrings[sCol] : "";
                              let harga = hCol !== -1 && rowStrings[hCol] ? rowStrings[hCol] : "";
                              let total = tCol !== -1 && rowStrings[tCol] ? rowStrings[tCol] : "";
                              
                              if (kCol === -1 && uCol === -1 && jCol === -1 && sCol === -1 && hCol === -1 && tCol === -1) {
                                  if (!kegiatan && validCells[0]) kegiatan = validCells[0];
                                  if (!uraian && validCells[1]) uraian = validCells[1];
                                  if (!jumlah && validCells[2]) jumlah = validCells[2];
                                  if (!satuan && validCells[3]) satuan = validCells[3];
                                  if (!harga && validCells[4]) harga = validCells[4];
                                  if (!total && validCells[5]) total = validCells[5];
                              }
                              
                              const isNewBlock = typeof kegiatan === 'string' && kegiatan.trim().length > 0 && !kegiatan.toLowerCase().includes("kegiatan");
                              
                              if (isNewBlock) {
                                if (currentArkas) {
                                    rkas.push(currentArkas);
                                    metadata.rkasImported++;
                                }
                                currentArkas = {
                                    kegiatan: kegiatan.trim(),
                                    uraian: uraian.trim(),
                                    jumlah: jumlah.trim() || "1",
                                    satuan: satuan.trim() || "Tahun",
                                    harga: harga.trim() || "0",
                                    total: total.trim() || "0"
                                };
                              } else if (currentArkas) {
                                if (uraian.trim().length > 0) currentArkas.uraian += " " + uraian.trim();
                                // usually numeric values don't span multiple rows, so we leave them
                              }
                           }
                        }
                     }
                   }
                   if (currentArkas) {
                       rkas.push(currentArkas);
                       metadata.rkasImported++;
                   }
                 }
               }
            }

            metadata.importStatus = "Success";`;

content = content.replace(findRegex, newParser);
fs.writeFileSync('src/EducationReportParser.ts', content);
console.log('Parser official structure rewritten safely for block parsing');
