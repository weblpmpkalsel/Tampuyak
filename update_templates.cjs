const fs = require('fs');
let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

// We can just add visualIdentity to all templates
const newTemplatesCode = `      workflowRef: "WorkflowEngine.States",
      documentProfile: "Strategic_Plan_A4",
      visualIdentity: {
        schoolLogo: true,
        governmentLogo: true,
        stamp: false,
        principalSignature: false,
        committeeSignature: false
      }
    },`;

if (!content.includes('visualIdentity: {')) {
   content = content.replace(/workflowRef: "WorkflowEngine\.States",\s+documentProfile: "[^"]+",\n\s*},/g, (match) => {
       return match.replace(/},$/, `  visualIdentity: {\n        schoolLogo: true,\n        governmentLogo: true,\n        stamp: false,\n        principalSignature: false,\n        committeeSignature: false\n      }\n    },`);
   });
}

fs.writeFileSync('src/Tampuyak.tsx', content);
