const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

const target = `                  const documentModel = generateAppDocument(docId, kg, { ...settings, planning });
                  return <EnterpriseDocumentViewer settings={settings} title={meta.title} document={documentModel} generatedBy={settings.principal?.name || "Kepala Sekolah"} />`;

const replacement = `                  // Memoize to prevent random IDs regenerating on search, zoom, or tab switch
                  const documentModel = React.useMemo(() => {
                    return generateAppDocument(docId, kg, { ...settings, planning });
                  }, [docId, refreshKey, settings.narratives, settings.school, settings.identityAssets, settings.planning, planning]);

                  return <EnterpriseDocumentViewer settings={settings} title={meta.title} document={documentModel} generatedBy={settings.principal?.name || "Kepala Sekolah"} />`;

code = code.replace(target, replacement);
fs.writeFileSync('src/Tampuyak.tsx', code);
console.log("Patched documentModel memoization!");
