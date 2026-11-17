const fs = require('fs');

let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const oldTokensCode = `    "planning.rkjm.status": settings.documents?.find((d: any) => d.type === "RKJM")?.status || "Belum Ada",
    "planning.rkt.status": settings.documents?.find((d: any) => d.type === "RKT")?.status || "Belum Ada",
    "planning.rkas.status": settings.documents?.find((d: any) => d.type === "RKAS")?.status || "Belum Ada",
  };},`;

const newTokensCode = `    "planning.rkjm.status": settings.documents?.find((d: any) => d.type === "RKJM")?.status || "Belum Ada",
    "planning.rkt.status": settings.documents?.find((d: any) => d.type === "RKT")?.status || "Belum Ada",
    "planning.rkas.status": settings.documents?.find((d: any) => d.type === "RKAS")?.status || "Belum Ada",
    
    "visual.logo.available": settings.branding?.logo ? "Ya" : "Tidak",
    "visual.stamp.available": settings.branding?.stamp ? "Ya" : "Tidak",
    
    "documents.total": (settings.documents?.length || 0).toString(),
    "documents.approved": (settings.documents?.filter((d: any) => d.status === "Disetujui" || d.status === "Terkunci")?.length || 0).toString(),
    
    "monitoring.total": (settings.documents?.filter((d: any) => d.type === "Monitoring")?.length || 0).toString(),
    "monitoring.latest.status": settings.documents?.filter((d: any) => d.type === "Monitoring")?.pop()?.status || "Belum Ada",
  };},`;

code = code.replace(oldTokensCode, newTokensCode);
fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Expanded more tokens');
