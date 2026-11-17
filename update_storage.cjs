const fs = require('fs');

let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

if (!code.includes('import { get, set }')) {
  code = 'import { get, set } from "idb-keyval";\n' + code;
}

const oldAppProvider = `export const AppProvider = ({ children }: any) => {
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        let parsed = JSON.parse(stored);

        // MIGRATION LOGIC
        if (!parsed.schemaVersion || parsed.schemaVersion < 1) {
          parsed.schemaVersion = 1;
        }

        const migrated = {
          ...DEFAULT_SETTINGS,
          ...parsed,
          rapor: parsed.rapor || { ...DEFAULT_SETTINGS.rapor },
          school: { ...DEFAULT_SETTINGS.school, ...parsed.school },
          principal: { ...DEFAULT_SETTINGS.principal, ...parsed.principal },
          guru: parsed.guru || [],
          tendik: parsed.tendik || [],
          pesertaDidik: {
            ...DEFAULT_SETTINGS.pesertaDidik,
            ...parsed.pesertaDidik,
          },
          rombel: parsed.rombel || [],
          sarpras: { ...DEFAULT_SETTINGS.sarpras, ...parsed.sarpras },
          bendaharaBOS: { ...DEFAULT_SETTINGS.bendaharaBOS, ...parsed.bendaharaBOS },
          koordinator: { ...DEFAULT_SETTINGS.koordinator, ...parsed.koordinator },
          komite: { ...DEFAULT_SETTINGS.komite, ...parsed.komite },
          pengawas: { ...DEFAULT_SETTINGS.pengawas, ...parsed.pengawas },
          kepalaDinas: {
            ...DEFAULT_SETTINGS.kepalaDinas,
            ...parsed.kepalaDinas,
          },
          budget: { ...DEFAULT_SETTINGS.budget, ...parsed.budget },
          branding: { ...DEFAULT_SETTINGS.branding, ...parsed.branding },
          visualIdentity: { ...DEFAULT_SETTINGS.visualIdentity, ...parsed.visualIdentity },
          identitas: { ...DEFAULT_SETTINGS.identitas, ...parsed.identitas },
          karakteristik: {
            ...DEFAULT_SETTINGS.karakteristik,
            ...parsed.karakteristik,
          },
          potensi: { ...DEFAULT_SETTINGS.potensi, ...parsed.potensi },
          programUnggulan: parsed.programUnggulan || [],
          metadata: { ...DEFAULT_SETTINGS.metadata, ...parsed.metadata },
          planning: parsed.planning || PlanningEngine.createInitialState(),
          documents: parsed.documents || DEFAULT_SETTINGS.documents,
        };

        if (!migrated.academicYears || migrated.academicYears.length === 0) {
          migrated.academicYears = [
            {
              id: \`ay-\${Date.now()}\`,
              name: "2024/2025",
              semester: "Ganjil",
              isActive: true,
              createdAt: Date.now(),
            },
          ];
          migrated.archivedData = {};
        }
        return migrated;
      }
    } catch (error) {
      console.error("Error loading settings", error);
    }
    return DEFAULT_SETTINGS;
  });`;

const newAppProvider = `export const AppProvider = ({ children }: any) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        let parsed = stored ? JSON.parse(stored) : null;
        const heavyData = await get("tampuyak.heavy") || {};

        if (parsed) {
          // MIGRATION LOGIC
          if (!parsed.schemaVersion || parsed.schemaVersion < 1) {
            parsed.schemaVersion = 1;
          }

          const migrated = {
            ...DEFAULT_SETTINGS,
            ...parsed,
            rapor: parsed.rapor || { ...DEFAULT_SETTINGS.rapor },
            school: { ...DEFAULT_SETTINGS.school, ...parsed.school },
            principal: { ...DEFAULT_SETTINGS.principal, ...parsed.principal },
            guru: parsed.guru || [],
            tendik: parsed.tendik || [],
            pesertaDidik: {
              ...DEFAULT_SETTINGS.pesertaDidik,
              ...parsed.pesertaDidik,
            },
            rombel: parsed.rombel || [],
            sarpras: { ...DEFAULT_SETTINGS.sarpras, ...parsed.sarpras },
            bendaharaBOS: { ...DEFAULT_SETTINGS.bendaharaBOS, ...parsed.bendaharaBOS },
            koordinator: { ...DEFAULT_SETTINGS.koordinator, ...parsed.koordinator },
            komite: { ...DEFAULT_SETTINGS.komite, ...parsed.komite },
            pengawas: { ...DEFAULT_SETTINGS.pengawas, ...parsed.pengawas },
            kepalaDinas: {
              ...DEFAULT_SETTINGS.kepalaDinas,
              ...parsed.kepalaDinas,
            },
            budget: { ...DEFAULT_SETTINGS.budget, ...parsed.budget },
            branding: heavyData.branding || parsed.branding || { ...DEFAULT_SETTINGS.branding },
            visualIdentity: heavyData.visualIdentity || parsed.visualIdentity || { ...DEFAULT_SETTINGS.visualIdentity },
            identitas: { ...DEFAULT_SETTINGS.identitas, ...parsed.identitas },
            karakteristik: {
              ...DEFAULT_SETTINGS.karakteristik,
              ...parsed.karakteristik,
            },
            potensi: { ...DEFAULT_SETTINGS.potensi, ...parsed.potensi },
            programUnggulan: parsed.programUnggulan || [],
            metadata: { ...DEFAULT_SETTINGS.metadata, ...parsed.metadata },
            planning: parsed.planning || PlanningEngine.createInitialState(),
            documents: heavyData.documents || parsed.documents || DEFAULT_SETTINGS.documents,
          };

          if (!migrated.academicYears || migrated.academicYears.length === 0) {
            migrated.academicYears = [
              {
                id: \`ay-\${Date.now()}\`,
                name: "2024/2025",
                semester: "Ganjil",
                isActive: true,
                createdAt: Date.now(),
              },
            ];
            migrated.archivedData = {};
          }
          setSettings(migrated);
        }
      } catch (error) {
        console.error("Error loading settings", error);
      } finally {
        setIsReady(true);
      }
    }
    loadData();
  }, []);`;

code = code.replace(oldAppProvider, newAppProvider);

const oldSave = `  useEffect(() => {
    const saveToLocal = setTimeout(() => {
      setSaveStatus("saving");
      try {
        const dataToSave = {
          ...settings,
          metadata: { ...settings.metadata, lastUpdated: Date.now() },
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
        setSaveStatus("saved");
      } catch (error) {
        setSaveStatus("error");
        console.error("Failed to save", error);
      }
    }, 800);
    return () => clearTimeout(saveToLocal);
  }, [settings]);`;

const newSave = `  useEffect(() => {
    if (!isReady) return; // Don't save before initial load
    const saveToLocal = setTimeout(() => {
      setSaveStatus("saving");
      try {
        const dataToSave = {
          ...settings,
          metadata: { ...settings.metadata, lastUpdated: Date.now() },
        };
        
        // Split heavy data for IDB
        const heavyData = {
          documents: dataToSave.documents,
          branding: dataToSave.branding,
          visualIdentity: dataToSave.visualIdentity,
        };
        
        // Remove heavy data from localStorage save payload
        const lightData = { ...dataToSave };
        delete lightData.documents;
        delete lightData.branding;
        delete lightData.visualIdentity;

        localStorage.setItem(STORAGE_KEY, JSON.stringify(lightData));
        set("tampuyak.heavy", heavyData).catch(console.error);
        
        setSaveStatus("saved");
      } catch (error) {
        setSaveStatus("error");
        console.error("Failed to save", error);
      }
    }, 800);
    return () => clearTimeout(saveToLocal);
  }, [settings, isReady]);`;

code = code.replace(oldSave, newSave);

const oldReturn = `  return (
    <AppContext.Provider
      value={{`;
      
const newReturn = `  if (!isReady) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc]">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium animate-pulse">Memuat Database...</p>
      </div>
    );
  }

  return (
    <AppContext.Provider
      value={{`;

code = code.replace(oldReturn, newReturn);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Fixed storage');
