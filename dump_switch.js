const switchAcademicYear = useCallback((id: string) => {
    console.log("[DEBUG] switchAcademicYear CALLED with id:", id);
    setSettings((prev: any) => {
      console.log("[DEBUG] prev.school before switch:", prev.school);

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

      console.log("[DEBUG] newSettings.school after switch:", newSettings.school);
      return newSettings;
    });
  }, []);