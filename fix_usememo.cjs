const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

// Revert the IIFE memoization
const target = `                  // Memoize to prevent random IDs regenerating on search, zoom, or tab switch
                  const documentModel = React.useMemo(() => {
                    return generateAppDocument(docId, kg, { ...settings, planning });
                  }, [docId, refreshKey, settings.narratives, settings.school, settings.identityAssets, settings.planning, planning]);

                  return <EnterpriseDocumentViewer settings={settings} title={meta.title} document={documentModel} generatedBy={settings.principal?.name || "Kepala Sekolah"} />`;

const replacement = `                  const documentModel = cachedDocumentModel;
                  return <EnterpriseDocumentViewer settings={settings} title={meta.title} document={documentModel} generatedBy={settings.principal?.name || "Kepala Sekolah"} />`;

code = code.replace(target, replacement);

// Insert at the component root
const rootTarget = `  const [qaMode, setQaMode] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);`;

const rootReplacement = `  const [qaMode, setQaMode] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const cachedDocumentModel = React.useMemo(() => {
    try {
      const kg = KnowledgeGraph.getInstance();
      if (settings.canonicalObjects) {
        KnowledgeGraphHydrator.hydrate(kg, settings.canonicalObjects);
      } else {
        seedInitialGraph();
      }
      return generateAppDocument(docId, kg, { ...settings, planning });
    } catch (e) {
      console.error("DocGen Error:", e);
      return null;
    }
  }, [docId, refreshKey, settings.narratives, settings.school, settings.identityAssets, settings.planning, planning]);`;

code = code.replace(rootTarget, rootReplacement);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log("Fixed useMemo location!");
