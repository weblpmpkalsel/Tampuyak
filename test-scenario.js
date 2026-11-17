const DEFAULT_SETTINGS = {
  school: { name: "Default School", npsn: "123" },
  identitas: { visi: "" },
  pesertaDidik: { total: 0 },
  academicYears: [],
  archivedData: {}
};

const YEAR_SPECIFIC_KEYS = [
  "rapor", "analisis", "pesertaDidik", "rombel", "education", 
  "budget", "karakteristik", "programUnggulan", "planning", "documents"
];

// simulate state from before patch where archivedData holds EVERYTHING
let prev = {
  school: { name: "SMA Merdeka", npsn: "999" },
  pesertaDidik: { total: 50 },
  academicYears: [
    { id: 'ay-2026', name: "2026/2027", isActive: true },
    { id: 'ay-2027', name: "2027/2028", isActive: false }
  ],
  archivedData: {
    'ay-2027': {
      school: { name: "This should NOT override!" },
      pesertaDidik: { total: 100 }
    }
  }
};

let newSettings = { ...prev };
const currentActive = prev.academicYears.find(y => y.isActive);
const id = 'ay-2027';

if (currentActive) {
  const dataToArchive = {};
  YEAR_SPECIFIC_KEYS.forEach(key => {
     dataToArchive[key] = prev[key];
  });
  newSettings.archivedData = {
    ...prev.archivedData,
    [currentActive.id]: dataToArchive,
  };
}

const dataToLoad = newSettings.archivedData?.[id] || {};

YEAR_SPECIFIC_KEYS.forEach(key => {
  newSettings[key] = dataToLoad[key] || DEFAULT_SETTINGS[key];
});

newSettings.academicYears = prev.academicYears.map((y) => ({
  ...y,
  isActive: y.id === id,
}));

console.log("newSettings.school:", newSettings.school);
console.log("newSettings.pesertaDidik:", newSettings.pesertaDidik);
