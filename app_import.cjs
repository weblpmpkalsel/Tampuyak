const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const target = `  const importSettings = (data) => {
    const planningMigrated =
      data.planning || PlanningEngine.createInitialState();
    setSettings({
      ...data,
      metadata: { ...data.metadata, lastUpdated: Date.now() },
      planning: planningMigrated,
    });
    addActivity("Data diimpor dari file JSON.");
  };`;

const replacement = `  const importSettings = (data) => {
    const planningMigrated =
      data.planning || PlanningEngine.createInitialState();
    setSettings({
      ...data,
      metadata: { ...data.metadata, lastUpdated: Date.now() },
      planning: planningMigrated,
    });
    addActivity("Data diimpor dari file JSON.");
  };

  const importModule = (moduleName: string, data: any) => {
    setSettings((prev: any) => {
      const next = { ...prev };
      if (moduleName === "Data Sekolah") {
        next.school = data.school || prev.school;
        next.guru = data.guru || prev.guru;
        next.tendik = data.tendik || prev.tendik;
        next.pesertaDidik = data.pesertaDidik || prev.pesertaDidik;
        next.rombel = data.rombel || prev.rombel;
        next.sarpras = data.sarpras || prev.sarpras;
      } else if (moduleName === "Rapor") {
        next.rapor = data;
      } else if (["RKJM", "RKT", "RKAS", "KSP"].includes(moduleName)) {
        if (!next.documents) next.documents = [];
        const index = next.documents.findIndex((d: any) => d.type === moduleName);
        if (index >= 0) {
          next.documents[index] = data;
        } else {
          next.documents.push(data);
        }
      }
      return next;
    });
    addActivity(\`Data \${moduleName} diimpor dari file JSON.\`);
  };

  const createSnapshot = () => {
    setSettings((prev: any) => {
      const snap = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        version: prev.metadata?.version || "6.6.0",
        size: JSON.stringify(prev).length,
        data: prev
      };
      const snaps = prev.snapshots || [];
      return { ...prev, snapshots: [snap, ...snaps].slice(0, 5) };
    });
  };`;

code = code.replace(target, replacement);

const target2 = `        resetSettings,
        updateMetadata,
        getReadiness,`;

const replacement2 = `        resetSettings,
        updateMetadata,
        getReadiness,
        importModule,
        createSnapshot,`;

code = code.replace(target2, replacement2);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('done importModule');
