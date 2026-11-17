const addAcademicYear = useCallback(
    (
      name: string,
      semester: string,
      copyKeys: string[],
      makeActive: boolean,
    ) => {
      setSettings((prev: any) => {
        const newId = `ay-${Date.now()}`;
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
  );