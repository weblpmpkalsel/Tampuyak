const fs = require('fs');
let file = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const oldAddAcademicYear = `  const addAcademicYear = useCallback(
    (
      name: string,
      semester: string,
      copyKeys: string[],
      makeActive: boolean,
    ) => {
      setSettings((prev: any) => {
        const newId = \`ay-\${Date.now()}\`;
        const newYear = {
          id: newId,
          name,
          semester,
          isActive: makeActive,
          createdAt: Date.now(),
        };

        let newSettings = { ...prev };

        if (makeActive) {
          const currentActive = prev.academicYears?.find(
            (y: any) => y.isActive,
          );
          if (currentActive) {
            const dataToArchive = { ...prev };
            delete dataToArchive.academicYears;
            delete dataToArchive.archivedData;
            newSettings.archivedData = {
              ...prev.archivedData,
              [currentActive.id]: dataToArchive,
            };
            newSettings.academicYears = prev.academicYears.map((y: any) => ({
              ...y,
              isActive: false,
            }));
          }

          const freshSettings: any = { ...DEFAULT_SETTINGS };
          for (const key of copyKeys) {
            freshSettings[key] = JSON.parse(
              JSON.stringify(
                prev[key] ||
                  DEFAULT_SETTINGS[key as keyof typeof DEFAULT_SETTINGS],
              ),
            );
          }

          newSettings = {
            ...freshSettings,
            academicYears: [...(newSettings.academicYears || []), newYear],
            archivedData: newSettings.archivedData,
          };
        } else {
          const freshSettings: any = { ...DEFAULT_SETTINGS };
          for (const key of copyKeys) {
            freshSettings[key] = JSON.parse(
              JSON.stringify(
                prev[key] ||
                  DEFAULT_SETTINGS[key as keyof typeof DEFAULT_SETTINGS],
              ),
            );
          }
          newSettings.academicYears = [...(prev.academicYears || []), newYear];
          newSettings.archivedData = {
            ...prev.archivedData,
            [newId]: freshSettings,
          };
        }

        return newSettings;
      });
    },
    [],
  );`;

const newAddAcademicYear = `  const addAcademicYear = useCallback(
    (
      name: string,
      semester: string,
      copyKeys: string[],
      makeActive: boolean,
    ) => {
      setSettings((prev: any) => {
        const newId = \`ay-\${Date.now()}\`;
        const newYear = {
          id: newId,
          name,
          semester,
          isActive: makeActive,
          createdAt: Date.now(),
        };

        const YEAR_SPECIFIC_KEYS = [
          "rapor", "analisis", "pesertaDidik", "rombel", "education", 
          "budget", "karakteristik", "programUnggulan", "planning", "documents"
        ];

        let newSettings = { ...prev };

        if (makeActive) {
          const currentActive = prev.academicYears?.find(
            (y: any) => y.isActive,
          );
          if (currentActive) {
            const dataToArchive = {};
            YEAR_SPECIFIC_KEYS.forEach(key => {
               dataToArchive[key] = prev[key];
            });
            newSettings.archivedData = {
              ...prev.archivedData,
              [currentActive.id]: dataToArchive,
            };
            newSettings.academicYears = prev.academicYears.map((y: any) => ({
              ...y,
              isActive: false,
            }));
          }

          for (const key of YEAR_SPECIFIC_KEYS) {
            if (copyKeys.includes(key)) {
              newSettings[key] = JSON.parse(
                JSON.stringify(
                  prev[key] || DEFAULT_SETTINGS[key as keyof typeof DEFAULT_SETTINGS]
                )
              );
            } else {
              newSettings[key] = DEFAULT_SETTINGS[key as keyof typeof DEFAULT_SETTINGS];
            }
          }
          newSettings.academicYears = [...(newSettings.academicYears || []), newYear];
        } else {
          const freshSettings = {};
          for (const key of YEAR_SPECIFIC_KEYS) {
            if (copyKeys.includes(key)) {
              freshSettings[key] = JSON.parse(
                JSON.stringify(
                  prev[key] || DEFAULT_SETTINGS[key as keyof typeof DEFAULT_SETTINGS]
                )
              );
            } else {
              freshSettings[key] = DEFAULT_SETTINGS[key as keyof typeof DEFAULT_SETTINGS];
            }
          }
          newSettings.academicYears = [...(prev.academicYears || []), newYear];
          newSettings.archivedData = {
            ...prev.archivedData,
            [newId]: freshSettings,
          };
        }

        return newSettings;
      });
    },
    [],
  );`;

const oldSwitchAcademicYear = `  const switchAcademicYear = useCallback((id: string) => {
    setSettings((prev: any) => {
      const currentActive = prev.academicYears?.find((y: any) => y.isActive);
      if (currentActive?.id === id) return prev;

      let newSettings = { ...prev };

      if (currentActive) {
        const dataToArchive = { ...prev };
        delete dataToArchive.academicYears;
        delete dataToArchive.archivedData;
        newSettings.archivedData = {
          ...prev.archivedData,
          [currentActive.id]: dataToArchive,
        };
      }

      const dataToLoad = newSettings.archivedData?.[id] || {
        ...DEFAULT_SETTINGS,
      };

      newSettings = {
        ...dataToLoad,
        academicYears: prev.academicYears.map((y: any) => ({
          ...y,
          isActive: y.id === id,
        })),
        archivedData: newSettings.archivedData,
      };

      return newSettings;
    });
  }, []);`;

const newSwitchAcademicYear = `  const switchAcademicYear = useCallback((id: string) => {
    setSettings((prev: any) => {
      const currentActive = prev.academicYears?.find((y: any) => y.isActive);
      if (currentActive?.id === id) return prev;

      const YEAR_SPECIFIC_KEYS = [
        "rapor", "analisis", "pesertaDidik", "rombel", "education", 
        "budget", "karakteristik", "programUnggulan", "planning", "documents"
      ];

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
        newSettings[key] = dataToLoad[key] || DEFAULT_SETTINGS[key as keyof typeof DEFAULT_SETTINGS];
      });

      newSettings.academicYears = prev.academicYears.map((y: any) => ({
        ...y,
        isActive: y.id === id,
      }));

      return newSettings;
    });
  }, []);`;

file = file.replace(oldAddAcademicYear, newAddAcademicYear);
file = file.replace(oldSwitchAcademicYear, newSwitchAcademicYear);

fs.writeFileSync('src/Tampuyak.tsx', file);
