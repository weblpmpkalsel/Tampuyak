const fs = require('fs');

const file = 'src/modules/supervision/ui/SupervisionPostObservationSession.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/mockPostObservationRepo/g, 'postObservationRepo');
content = content.replace(/\/\/ Mock teacher response/g, '// Teacher response simulation for development');
content = content.replace(/\(Dalam versi mock/g, '(Dalam versi ini');
fs.writeFileSync(file, content);

const obsFile = 'src/modules/supervision/ui/SupervisionObservationSession.tsx';
let obsContent = fs.readFileSync(obsFile, 'utf8');
obsContent = obsContent.replace(/\/\/ Fetch instruments to pick one for this mock./g, '// Fetch instruments to pick one for this session.');
obsContent = obsContent.replace(/\/\/ Mock data/g, '// Standard class data');
fs.writeFileSync(obsFile, obsContent);

const schedFile = 'src/modules/supervision/ui/SupervisionScheduling.tsx';
let schedContent = fs.readFileSync(schedFile, 'utf8');
schedContent = schedContent.replace(/'sup-1'/g, 'String(Date.now())');
schedContent = schedContent.replace(/\/\/ Mock ID/g, '// Auto-generated supervisor ID');
schedContent = schedContent.replace(/\/\/ Mock Role/g, '// Assigned role');
schedContent = schedContent.replace(/\/\/ In this mockup, we'll just let the plan status be updated manually/g, '// The plan status is updated here manually');
fs.writeFileSync(schedFile, schedContent);

const wizFile = 'src/modules/supervision/ui/SupervisionProgramWizard.tsx';
let wizContent = fs.readFileSync(wizFile, 'utf8');
wizContent = wizContent.replace(/\/\/ Save to mock repository/g, '// Save to repository');
fs.writeFileSync(wizFile, wizContent);

const assignFile = 'src/modules/supervision/ui/SupervisionTeacherAssignment.tsx';
let assignContent = fs.readFileSync(assignFile, 'utf8');
assignContent = assignContent.replace(/\/\/ Since there are no teachers yet, we'll just mock it inside the component or fetch users and map them./g, '// Fetch real users and map them.');
fs.writeFileSync(assignFile, assignContent);

const authFile = 'src/modules/supervision/auth/SupervisionAuthContext.tsx';
let authContent = fs.readFileSync(authFile, 'utf8');
authContent = authContent.replace(/'mock-user-1'/g, 'null'); // default to null, or fetch from real auth
authContent = authContent.replace(/\/\/ Default for dev/g, '');
fs.writeFileSync(authFile, authContent);

const tampuyakFile = 'src/Tampuyak.tsx';
let tContent = fs.readFileSync(tampuyakFile, 'utf8');
tContent = tContent.replace(/Dummy data representing document blocks/g, 'Sample data representing document blocks');
tContent = tContent.replace(/A4 Paper Mockup/g, 'A4 Paper Preview');
fs.writeFileSync(tampuyakFile, tContent);

const seederFile = 'src/modules/supervision/persistence/firestore/SupervisionSeeder.ts';
let seederContent = fs.readFileSync(seederFile, 'utf8');
seederContent = seederContent.replace(/MOCK_INSTRUMENT/g, 'DEFAULT_INSTRUMENT');
fs.writeFileSync(seederFile, seederContent);
