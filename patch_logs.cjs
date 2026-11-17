const fs = require('fs');
let file = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

file = file.replace(
`  const switchAcademicYear = useCallback((id: string) => {
    setSettings((prev: any) => {`,
`  const switchAcademicYear = useCallback((id: string) => {
    console.log("[DEBUG] switchAcademicYear CALLED with id:", id);
    setSettings((prev: any) => {
      console.log("[DEBUG] prev.school before switch:", prev.school);
`);

file = file.replace(
`      return newSettings;
    });
  }, []);`,
`      console.log("[DEBUG] newSettings.school after switch:", newSettings.school);
      return newSettings;
    });
  }, []);`
);

fs.writeFileSync('src/Tampuyak.tsx', file);
