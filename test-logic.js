const DEFAULT_SETTINGS = {
  school: { name: "Default School" },
  pesertaDidik: { total: 0 }
};

let prev = {
  school: { name: "My Active School" },
  pesertaDidik: { total: 50 },
  academicYears: [{ id: 'ay-1', isActive: true }, { id: 'ay-2', isActive: false }],
  archivedData: {
    'ay-2': {
      school: { name: "Archived School" },
      pesertaDidik: { total: 100 }
    }
  }
};

const id = 'ay-2';
const YEAR_SPECIFIC_KEYS = ["pesertaDidik"];
const currentActive = prev.academicYears.find(y => y.isActive);

let newSettings = { ...prev };
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

console.log("newSettings.school:", newSettings.school);
console.log("newSettings.pesertaDidik:", newSettings.pesertaDidik);
