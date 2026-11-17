const fs = require('fs');
let code = fs.readFileSync('src/enterprise/workspace/adapters/EnterpriseAdapter.ts', 'utf8');

code = code.replace(
  `      // Map curriculum prioritizing legacy Workspace settings over modular settings if both exist
      learningLoad: rawSettings?.learningLoad || rawSettings?.curriculum?.learningLoad,
      learningOrganization: rawSettings?.learningOrganization || rawSettings?.curriculum?.learningOrganization,
      intracurricular: rawSettings?.intracurricular || rawSettings?.curriculum?.intracurricular,
      cocurricular: rawSettings?.cocurricular || rawSettings?.curriculum?.cocurricular,
      extracurricular: rawSettings?.extracurricular || rawSettings?.curriculum?.extracurricular,
      academicCalendar: rawSettings?.academicCalendar || rawSettings?.kalenderPendidikan || rawSettings?.curriculum?.academicCalendar,`,
  `      // Map curriculum prioritizing modular settings over legacy Workspace settings if both exist
      learningLoad: rawSettings?.curriculum?.learningLoad || rawSettings?.learningLoad,
      learningOrganization: rawSettings?.curriculum?.learningOrganization || rawSettings?.learningOrganization,
      intracurricular: rawSettings?.curriculum?.intracurricular || rawSettings?.intracurricular,
      cocurricular: rawSettings?.curriculum?.cocurricular || rawSettings?.cocurricular,
      extracurricular: rawSettings?.curriculum?.extracurricular || rawSettings?.extracurricular,
      academicCalendar: rawSettings?.curriculum?.academicCalendar || rawSettings?.academicCalendar || rawSettings?.kalenderPendidikan,`
);

fs.writeFileSync('src/enterprise/workspace/adapters/EnterpriseAdapter.ts', code);
console.log("Patched Curriculum Mapping");
