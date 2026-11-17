const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const docMeta = `,
      schemaVersion: "1.0",
      regulationVersion: "Permendikbud No. 19/2007",
      templateVersion: "2024-v1",
      migrationVersion: "0"`;

const oldDocs = `  documents: [
    {
      id: "rkjm",
      name: "Rencana Kerja Jangka Menengah (RKJM)",
      type: "RKJM",
      version: "1.0",
      status: "Belum Dibuat",
      createdAt: null,
      updatedAt: null,
      creator: "",
      reviewer: "",
      approver: "",
      history: [],
    },
    {
      id: "rkt",
      name: "Rencana Kerja Tahunan (RKT)",
      type: "RKT",
      version: "1.0",
      status: "Belum Dibuat",
      createdAt: null,
      updatedAt: null,
      creator: "",
      reviewer: "",
      approver: "",
      history: [],
    },
    {
      id: "rkas",
      name: "Rencana Kegiatan dan Anggaran Sekolah (RKAS)",
      type: "RKAS",
      version: "1.0",
      status: "Belum Dibuat",
      createdAt: null,
      updatedAt: null,
      creator: "",
      reviewer: "",
      approver: "",
      history: [],
    },
    {
      id: "ksp",
      name: "Kurikulum Satuan Pendidikan (KSP)",
      type: "KSP",
      version: "1.0",
      status: "Belum Dibuat",
      createdAt: null,
      updatedAt: null,
      creator: "",
      reviewer: "",
      approver: "",
      history: [],
    },
  ],`;

const newDocs = `  documents: [
    {
      id: "rkjm",
      name: "Rencana Kerja Jangka Menengah (RKJM)",
      type: "RKJM",
      version: "1.0",
      status: "Belum Dibuat",
      createdAt: null,
      updatedAt: null,
      creator: "",
      reviewer: "",
      approver: "",
      history: []${docMeta}
    },
    {
      id: "rkt",
      name: "Rencana Kerja Tahunan (RKT)",
      type: "RKT",
      version: "1.0",
      status: "Belum Dibuat",
      createdAt: null,
      updatedAt: null,
      creator: "",
      reviewer: "",
      approver: "",
      history: []${docMeta}
    },
    {
      id: "rkas",
      name: "Rencana Kegiatan dan Anggaran Sekolah (RKAS)",
      type: "RKAS",
      version: "1.0",
      status: "Belum Dibuat",
      createdAt: null,
      updatedAt: null,
      creator: "",
      reviewer: "",
      approver: "",
      history: []${docMeta}
    },
    {
      id: "ksp",
      name: "Kurikulum Satuan Pendidikan (KSP)",
      type: "KSP",
      version: "1.0",
      status: "Belum Dibuat",
      createdAt: null,
      updatedAt: null,
      creator: "",
      reviewer: "",
      approver: "",
      history: []${docMeta}
    },
  ],`;

code = code.replace(oldDocs, newDocs);
fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Fixed document registry');
