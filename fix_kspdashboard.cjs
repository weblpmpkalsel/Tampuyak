const fs = require('fs');
let code = fs.readFileSync('src/ksp/KSPDashboard.tsx', 'utf8');

code = code.replace(
  'SMP (Fase D)',
  '{EnterpriseConfigurationCenter.schoolName.includes("SMP") ? "SMP (Fase D)" : "SMA (Fase E/F)"}'
);

if (!code.includes("School Name")) {
  // Let's add them to the summary card grid or create a new section
  const additionalFields = `
            <div>
              <p className="text-gray-500 font-medium mb-1 uppercase tracking-wider text-xs">School Name</p>
              <p className="font-bold text-gray-900">{EnterpriseConfigurationCenter.schoolName}</p>
            </div>
            <div>
              <p className="text-gray-500 font-medium mb-1 uppercase tracking-wider text-xs">Location</p>
              <p className="font-bold text-gray-900">{EnterpriseConfigurationCenter.regencyOrCity}, {EnterpriseConfigurationCenter.province}</p>
            </div>
            <div>
              <p className="text-gray-500 font-medium mb-1 uppercase tracking-wider text-xs">Principal & Supervisor</p>
              <p className="font-bold text-gray-900 truncate" title={\`\${EnterpriseConfigurationCenter.principalName} / \${EnterpriseConfigurationCenter.supervisorName}\`}>{EnterpriseConfigurationCenter.principalName} / {EnterpriseConfigurationCenter.supervisorName}</p>
            </div>
  `;
  
  code = code.replace(
    `<div>
              <p className="text-gray-500 font-medium mb-1 uppercase tracking-wider text-xs">Generated From</p>
              <p className="font-bold text-indigo-700">Enterprise Knowledge</p>
            </div>`,
    `<div>
              <p className="text-gray-500 font-medium mb-1 uppercase tracking-wider text-xs">Generated From</p>
              <p className="font-bold text-indigo-700">Enterprise Knowledge</p>
            </div>` + additionalFields
  );
  
  code = code.replace('grid-cols-2 md:grid-cols-5', 'grid-cols-2 md:grid-cols-4 lg:grid-cols-8');
  fs.writeFileSync('src/ksp/KSPDashboard.tsx', code);
  console.log("Updated Dashboard with dynamic data");
}
