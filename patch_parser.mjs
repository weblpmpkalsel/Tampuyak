import fs from 'fs';

let content = fs.readFileSync('src/EducationReportParser.ts', 'utf-8');

// We need to replace the parsing logic with a more resilient one.
// Let's rewrite the core parsing of the official sheets.

const newParseLogic = `
          // Normalize sheet names for matching
          const sheetNames = workbook.SheetNames.map(s => s.trim().toUpperCase());
          let isOfficial = false;
          
          const expectedOfficialSheets = [
            "PANDUAN", // usually PANDUAN PBD
            "LAPORAN RAPOR",
            "REKOMENDASI", // KESELURUHAN or PRIORITAS
            "RKT",
            "ARKAS"
          ];

          // Instead of rigid names, we will use partial matches on expected official keywords.
          // Because the actual file might have "2. Laporan Rapor", "3. Rekomendasi Prioritas"
          const foundLaporan = sheetNames.find(s => s.includes("LAPORAN RAPOR") || s.includes("RAPOR PENDIDIKAN"));
          const foundRekomendasiPrioritas = sheetNames.find(s => s.includes("REKOMENDASI PRIORITAS") || (s.includes("REKOMENDASI") && !s.includes("KESELURUHAN")));
          const foundRekomendasiKeseluruhan = sheetNames.find(s => s.includes("REKOMENDASI KESELURUHAN"));
          const foundRkt = sheetNames.find(s => s.includes("RKT"));
          const foundArkas = sheetNames.find(s => s.includes("ARKAS") || s.includes("RKAS"));
          
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
              const sheet = workbook.Sheets[workbook.SheetNames[sheetNames.indexOf(foundLaporan)]];
              const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
              
              const allInds = RaporDictionary.flatMap(d => d.indikator);
              
              jsonData.forEach((row: any) => {
                if (Array.isArray(row)) {
                  const rowStrings = row.map((c: any) => typeof c === 'string' ? c.trim().toLowerCase() : (typeof c === 'number' ? c.toString() : ''));
                  
                  // Detect School Data
                  const schoolNameIdx = rowStrings.findIndex((s: string) => s.includes("nama sekolah") || s === "sekolah" || s === "nama satuan pendidikan");
                  if (schoolNameIdx !== -1 && row[schoolNameIdx + 1]) {
                     schoolData.name = row[schoolNameIdx + 1];
                  } else if (schoolNameIdx !== -1 && row[schoolNameIdx + 2]) {
                     schoolData.name = row[schoolNameIdx + 2];
                  }

                  const npsnIdx = rowStrings.findIndex((s: string) => s.includes("npsn"));
                  if (npsnIdx !== -1 && row[npsnIdx + 1]) {
                     schoolData.npsn = row[npsnIdx + 1];
                  } else if (npsnIdx !== -1 && row[npsnIdx + 2]) {
                     schoolData.npsn = row[npsnIdx + 2];
                  }

                  let foundId = "";
                  let foundValue = 0;
                  let trend = "";
                  let districtRank = "";
                  let nationalRank = "";
                  
                  row.forEach((cell: any, index: number) => {
                    if (typeof cell === 'string') {
                      const cStr = cell.trim();
                      const matchInd = allInds.find(ind => ind.id === cStr || ind.nama.toLowerCase() === cStr.toLowerCase());
                      if (matchInd) {
                        foundId = matchInd.id;
                      } else {
                        const match = cStr.match(/^[A-E]\\.\\d+(\\.\\d+)?$/);
                        if (match && !foundId) {
                          foundId = match[0];
                        }
                      }

                      if (foundId) {
                        const scoreCell = row.find((c: any, i: number) => i > index && typeof c === 'number');
                        if (scoreCell !== undefined) {
                          foundValue = scoreCell;
                        } else {
                          const strScore = row.find((c: any, i: number) => i > index && typeof c === 'string' && !isNaN(parseFloat(c)));
                          if (strScore) foundValue = parseFloat(strScore);
                        }
                      }
                      
                      const cLow = cell.toLowerCase();
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

            // 2. REKOMENDASI PRIORITAS
            if (foundRekomendasiPrioritas) {
               const sheet = workbook.Sheets[workbook.SheetNames[sheetNames.indexOf(foundRekomendasiPrioritas)]];
               const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
               
               let inDataSection = false;
               let idCol = -1, nameCol = -1, akarCol = -1, benahiCol = -1, kegiatanCol = -1;

               jsonData.forEach((row: any) => {
                 if (Array.isArray(row) && row.length > 0) {
                    const rowStrings = row.map((c: any) => typeof c === 'string' ? c.trim() : (typeof c === 'number' ? c.toString() : ''));
                    
                    if (!inDataSection) {
                       const headerMatch = rowStrings.some((c: string) => c.toLowerCase().includes("indikator") || c.toLowerCase().includes("prioritas") || c.toLowerCase().includes("masalah"));
                       if (headerMatch) {
                          inDataSection = true;
                          // Find column indices
                          nameCol = rowStrings.findIndex((c: string) => c.toLowerCase().includes("indikator") || c.toLowerCase().includes("masalah") || c.toLowerCase().includes("prioritas"));
                          akarCol = rowStrings.findIndex((c: string) => c.toLowerCase().includes("akar penyebab") || c.toLowerCase().includes("akar masalah"));
                          benahiCol = rowStrings.findIndex((c: string) => c.toLowerCase().includes("benahi") || c.toLowerCase().includes("rekomendasi"));
                          kegiatanCol = rowStrings.findIndex((c: string) => c.toLowerCase().includes("kegiatan") || c.toLowerCase().includes("inspirasi"));
                          return;
                       }
                    } else {
                       const validCells = rowStrings.filter((c: string) => c.length > 0);
                       // Heuristic: If we found headers, use them. Else, assume order: ID/Name, Akar, Benahi, Kegiatan
                       if (validCells.length >= 2) { // Need at least indicator and akar/benahi
                          let indicatorName = "";
                          let akarPenyebab = "";
                          let benahi = "";
                          let kegiatan = "";
                          
                          if (nameCol !== -1 && rowStrings[nameCol]) indicatorName = rowStrings[nameCol];
                          else indicatorName = validCells[0];
                          
                          if (akarCol !== -1 && rowStrings[akarCol]) akarPenyebab = rowStrings[akarCol];
                          else akarPenyebab = validCells[1] || "";

                          if (benahiCol !== -1 && rowStrings[benahiCol]) benahi = rowStrings[benahiCol];
                          else benahi = validCells[2] || validCells[1] || "";
                          
                          if (kegiatanCol !== -1 && rowStrings[kegiatanCol]) kegiatan = rowStrings[kegiatanCol];
                          else kegiatan = validCells[3] || benahi || "";
                          
                          const idMatch = indicatorName.match(/^[A-E]\\.\\d+(\\.\\d+)?/);
                          const finalId = idMatch ? idMatch[0] : indicatorName;

                          // Only add if not empty row and looks like data (longer strings)
                          if (indicatorName.length > 2) {
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

            // 3. LEMBAR KERJA RKT
            if (foundRkt) {
               const sheet = workbook.Sheets[workbook.SheetNames[sheetNames.indexOf(foundRkt)]];
               const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
               
               let inDataSection = false;
               let mCol = -1, aCol = -1, pCol = -1, kCol = -1, dCol = -1;

               jsonData.forEach((row: any) => {
                 if (Array.isArray(row)) {
                    const rowStrings = row.map((c: any) => typeof c === 'string' ? c.trim() : (typeof c === 'number' ? c.toString() : ''));
                    
                    if (!inDataSection) {
                       const headerMatch = rowStrings.some((c: string) => c.toLowerCase().includes("masalah") || c.toLowerCase().includes("akar masalah") || c.toLowerCase().includes("benahi"));
                       if (headerMatch) {
                          inDataSection = true;
                          mCol = rowStrings.findIndex((c: string) => c.toLowerCase() === "masalah" || c.toLowerCase().includes("identifikasi"));
                          aCol = rowStrings.findIndex((c: string) => c.toLowerCase() === "akar masalah" || c.toLowerCase().includes("akar penyebab"));
                          pCol = rowStrings.findIndex((c: string) => c.toLowerCase() === "program" || c.toLowerCase().includes("benahi"));
                          kCol = rowStrings.findIndex((c: string) => c.toLowerCase() === "kegiatan" || c.toLowerCase().includes("inspirasi kegiatan"));
                          dCol = rowStrings.findIndex((c: string) => c.toLowerCase() === "penjelasan" || c.toLowerCase().includes("deskripsi"));
                          return;
                       }
                    } else {
                       const validCells = rowStrings.filter((c: string) => c.length > 0);
                       if (validCells.length >= 2) {
                          let masalah = mCol !== -1 ? rowStrings[mCol] : validCells[0];
                          let akarMasalah = aCol !== -1 ? rowStrings[aCol] : validCells[1];
                          let program = pCol !== -1 ? rowStrings[pCol] : (validCells[2] || "");
                          let kegiatan = kCol !== -1 ? rowStrings[kCol] : (validCells[3] || program || "");
                          let deskripsi = dCol !== -1 ? rowStrings[dCol] : (validCells[4] || "");
                          
                          if (masalah && masalah.length > 2) {
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

            // 4. LEMBAR KERJA ARKAS
            if (foundArkas) {
               const sheet = workbook.Sheets[workbook.SheetNames[sheetNames.indexOf(foundArkas)]];
               const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
               
               let inDataSection = false;
               let kCol = -1, uCol = -1, jCol = -1, sCol = -1, hCol = -1, tCol = -1;

               jsonData.forEach((row: any) => {
                 if (Array.isArray(row)) {
                    const rowStrings = row.map((c: any) => typeof c === 'string' ? c.trim() : (typeof c === 'number' ? c.toString() : ''));
                    
                    if (!inDataSection) {
                       const headerMatch = rowStrings.some((c: string) => c.toLowerCase().includes("kegiatan") || c.toLowerCase().includes("arkas") || c.toLowerCase().includes("uraian"));
                       if (headerMatch) {
                          inDataSection = true;
                          kCol = rowStrings.findIndex((c: string) => c.toLowerCase().includes("kegiatan"));
                          uCol = rowStrings.findIndex((c: string) => c.toLowerCase().includes("uraian") || c.toLowerCase().includes("deskripsi"));
                          jCol = rowStrings.findIndex((c: string) => c.toLowerCase().includes("jumlah") || c.toLowerCase().includes("volume"));
                          sCol = rowStrings.findIndex((c: string) => c.toLowerCase().includes("satuan"));
                          hCol = rowStrings.findIndex((c: string) => c.toLowerCase().includes("harga"));
                          tCol = rowStrings.findIndex((c: string) => c.toLowerCase().includes("total"));
                          return;
                       }
                    } else {
                       const validCells = rowStrings.filter((c: string) => c.length > 0);
                       if (validCells.length >= 2) {
                          let kegiatan = kCol !== -1 ? rowStrings[kCol] : validCells[0];
                          let uraian = uCol !== -1 ? rowStrings[uCol] : (validCells[1] || "");
                          let jumlah = jCol !== -1 ? rowStrings[jCol] : (validCells[2] || "1");
                          let satuan = sCol !== -1 ? rowStrings[sCol] : (validCells[3] || "Tahun");
                          let harga = hCol !== -1 ? rowStrings[hCol] : (validCells[4] || "0");
                          let total = tCol !== -1 ? rowStrings[tCol] : (validCells[5] || "0");
                          
                          if (kegiatan && kegiatan.length > 2) {
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

            metadata.importStatus = "Success";
            
          } else {
`;

let oldParseLogic = /const sheetNames = workbook\.SheetNames\.map[\s\S]*?metadata\.importStatus = "Success";\n\s*\} else \{/m;
content = content.replace(oldParseLogic, newParseLogic);

fs.writeFileSync('src/EducationReportParser.ts', content);
console.log('Parser official mode rewritten dynamically');
