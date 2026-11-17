const DEFAULT_SETTINGS = {
  school: { name: "Default School" },
  pesertaDidik: { total: 0 }
};

let prev = {
  school: { name: "My Active School" },
  pesertaDidik: { total: 50 },
  academicYears: [{ id: 'ay-1', isActive: true }],
  archivedData: {}
};

const makeActive = true;
const copyKeys = [];
const newYear = { id: 'ay-2', isActive: true };

const YEAR_SPECIFIC_KEYS = ["pesertaDidik"];
let newSettings = { ...prev };

if (makeActive) {
  const currentActive = prev.academicYears.find(y => y.isActive);
  if (currentActive) {
    const dataToArchive = {};
    YEAR_SPECIFIC_KEYS.forEach(key => {
       dataToArchive[key] = prev[key];
    });
    newSettings.archivedData = {
      ...prev.archivedData,
      [currentActive.id]: dataToArchive,
    };
    newSettings.academicYears = prev.academicYears.map((y) => ({
      ...y,
      isActive: false,
    }));
  }

  for (const key of YEAR_SPECIFIC_KEYS) {
    if (copyKeys.includes(key)) {
      newSettings[key] = JSON.parse(
        JSON.stringify(
          prev[key] || DEFAULT_SETTINGS[key]
        )
      );
    } else {
      newSettings[key] = DEFAULT_SETTINGS[key];
    }
  }
  newSettings.academicYears = [...(newSettings.academicYears || []), newYear];
}

console.log("newSettings.school:", newSettings.school);
