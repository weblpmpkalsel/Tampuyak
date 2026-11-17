const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

const target = `    const analysisData = settings.analisis?.data || {};
    const irb = analysisData.program || [];
    const priorities = analysisData.prioritas || [];`;

const replacement = `    const analysisData = settings.analisis?.data || {};
    const irbRaw = analysisData.program || [];
    const priorities = analysisData.prioritas || [];
    const kegiatanRaw = analysisData.kegiatan || [];

    // Enterprise Planning Lifecycle: VALIDATION -> OPERATIONAL
    const isMalformed = (item) => {
       if (item === null || item === undefined || item === "") return true;
       if (typeof item === 'object') {
          if (!item.id || !item.nama || typeof item.nama !== 'string' || item.nama.trim() === "") return true;
       }
       return false;
    };

    const uniqueIrbIds = new Set();
    const irb = irbRaw.filter((p) => {
       if (isMalformed(p)) return false;
       if (typeof p === 'object' && p.id) {
         if (uniqueIrbIds.has(p.id)) return false;
         uniqueIrbIds.add(p.id);
       }
       return true;
    }).map(p => typeof p === 'object' ? { ...p, status: "OPERATIONAL" } : p);

    const uniqueKegIds = new Set();
    const kegiatanList = kegiatanRaw.filter((k) => {
       if (isMalformed(k)) return false;
       if (typeof k === 'object' && k.id) {
         if (uniqueKegIds.has(k.id)) return false;
         uniqueKegIds.add(k.id);
       }
       return true;
    }).map(k => typeof k === 'object' ? { ...k, status: "OPERATIONAL" } : k);`;

code = code.replace(target, replacement);

const targetKegList = `    const kegiatanList = analysisData.kegiatan || [];
    
    kegiatanList.forEach((kegiatan: any, idx: number) => {`;

const replacementKegList = `    kegiatanList.forEach((kegiatan: any, idx: number) => {`;

code = code.replace(targetKegList, replacementKegList);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log("Planning engine patch applied!");
