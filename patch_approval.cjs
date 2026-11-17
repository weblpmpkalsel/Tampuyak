const fs = require('fs');

let content = fs.readFileSync('src/enterprise/document/ksp/approval/KspApprovalStructure.ts', 'utf8');

// Replace approval-container-school-signatures -> gsls-signature-grid-school
// approval-container-committee -> gsls-signature-block-committee
// approval-paragraph-committee-action -> gsls-signature-action-committee
// approval-paragraph-committee-title -> gsls-signature-title-committee
// approval-paragraph-committee-signature-space -> (REMOVE)
// approval-paragraph-committee-name -> gsls-signature-name-committee
// and so on...

// Just rewrite the file using replace or string interpolation.
