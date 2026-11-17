import fs from 'fs';

const newParserContent = `import * as XLSX from 'xlsx';
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
  static parseLaporanRapor(sheet: XLSX.WorkSheet, metadata: ParserMetadata, parsedData: any, schoolData: any) {
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) || [];
    const allInds = RaporDictionary.flatMap(d => d.indikator || []);
    
    let objectsFound = 0;
    let objectsImported = 0;

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
              const match = cStr.match(/^[A-E]\\.\\d+(\\.\\d+)?$/);
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

        if (foundId) {
           objectsFound++;
           if (foundValue > 0) {
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
              objectsImported++;
           }
        }
      }
    });

    console.log("Worksheet: 2. LAPORAN RAPOR | Parser: parseLaporanRapor | Objects Found: " + objectsFound + " | Objects Imported: " + objectsImported + " | Coverage: " + (objectsFound > 0 ? Math.round((objectsImported/objectsFound)*100) : 0) + "%");
  }

  static parseRekomendasiPrioritas(sheet: XLSX.WorkSheet, metadata: ParserMetadata, recommendations: any[]) {
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) || [];
    let inDataSection = false;
    let nameCol = -1, akarCol = -1, benahiCol = -1, kegiatanCol = -1;
    let emptyRowCount = 0;
    let currentRec: any = null;
    let objectsFound = 0;

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
                 
                 objectsFound++;
                 const idMatch = typeof indicatorName === 'string' ? indicatorName.match(/^[A-E]\\.\\d+(\\.\\d+)?/) : null;
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
    console.log("Worksheet: 2.2 REKOMENDASI PRIORITAS | Parser: parseRekomendasiPrioritas | Objects Found: " + objectsFound + " | Objects Imported: " + metadata.recommendationsImported + " | Coverage: " + (objectsFound > 0 ? Math.round((metadata.recommendationsImported/objectsFound)*100) : 0) + "%");
  }

  static parseRKT(sheet: XLSX.WorkSheet, metadata: ParserMetadata, rkt: any[]) {
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) || [];
    let inDataSection = false;
    let mCol = -1, aCol = -1, pCol = -1, kCol = -1, dCol = -1;
    let emptyRowCount = 0;
    let currentRkt: any = null;
    let objectsFound = 0;

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
                 objectsFound++;
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
    console.log("Worksheet: 3. LEMBAR KERJA RKT | Parser: parseRKT | Objects Found: " + objectsFound + " | Objects Imported: " + metadata.rktImported + " | Coverage: " + (objectsFound > 0 ? Math.round((metadata.rktImported/objectsFound)*100) : 0) + "%");
  }

  static parseARKAS(sheet: XLSX.WorkSheet, metadata: ParserMetadata, rkas: any[]) {
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) || [];
    let inDataSection = false;
    let kCol = -1, uCol = -1, jCol = -1, sCol = -1, hCol = -1, tCol = -1;
    let emptyRowCount = 0;
    let currentArkas: any = null;
    let objectsFound = 0;

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
                 objectsFound++;
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
               }
            }
         }
      }
    }
    if (currentArkas) {
        rkas.push(currentArkas);
        metadata.rkasImported++;
    }
    console.log("Worksheet: 4. LEMBAR KERJA ARKAS | Parser: parseARKAS | Objects Found: " + objectsFound + " | Objects Imported: " + metadata.rkasImported + " | Coverage: " + (objectsFound > 0 ? Math.round((metadata.rkasImported/objectsFound)*100) : 0) + "%");
  }

  static async parse(file: File): Promise<ParseResult> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const fileData = e.target?.result;
          const workbook = XLSX.read(fileData, { type: 'binary' });
          
          const metadata: ParserMetadata = {
            workbookDetected: file?.name || "Unknown",
            officialVersion: "Kemendikdasmen (Auto-detected)",
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
            console.group("==== DEVELOPER TRACE (WORKSHEET TO PARSER MAPPING) ====");
            
            if (foundLaporan) {
              const sheetIdx = sheetNames.indexOf(foundLaporan);
              if (sheetIdx !== -1 && rawSheetNames[sheetIdx]) {
                const sheet = workbook.Sheets[rawSheetNames[sheetIdx]];
                if (sheet) {
                  this.parseLaporanRapor(sheet, metadata, parsedData, schoolData);
                }
              }
            }

            if (foundRekomendasiPrioritas) {
              const sheetIdx = sheetNames.indexOf(foundRekomendasiPrioritas);
              if (sheetIdx !== -1 && rawSheetNames[sheetIdx]) {
                const sheet = workbook.Sheets[rawSheetNames[sheetIdx]];
                if (sheet) {
                  this.parseRekomendasiPrioritas(sheet, metadata, recommendations);
                }
              }
            }

            if (foundRkt) {
              const sheetIdx = sheetNames.indexOf(foundRkt);
              if (sheetIdx !== -1 && rawSheetNames[sheetIdx]) {
                const sheet = workbook.Sheets[rawSheetNames[sheetIdx]];
                if (sheet) {
                  this.parseRKT(sheet, metadata, rkt);
                }
              }
            }

            if (foundArkas) {
              const sheetIdx = sheetNames.indexOf(foundArkas);
              if (sheetIdx !== -1 && rawSheetNames[sheetIdx]) {
                const sheet = workbook.Sheets[rawSheetNames[sheetIdx]];
                if (sheet) {
                  this.parseARKAS(sheet, metadata, rkas);
                }
              }
            }

            console.groupEnd();
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
                             const match = cell.match(/^[A-E]\\.\\d+(\\.\\d+)?$/);
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

fs.writeFileSync('src/EducationReportParser.ts', newParserContent);
console.log('Successfully updated EducationReportParser.ts with specific parsers.');
