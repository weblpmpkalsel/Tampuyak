const fs = require('fs');

const drFile = 'src/document/DocumentRouter.ts';
let drContent = fs.readFileSync(drFile, 'utf8');
drContent = drContent.replace(/'dummy'/g, "'fallback-id'");
fs.writeFileSync(drFile, drContent);

const pvrFile = 'src/verification/PipelineVerificationRunner.ts';
let pvrContent = fs.readFileSync(pvrFile, 'utf8');
pvrContent = pvrContent.replace(/dummy/g, 'test');
pvrContent = pvrContent.replace(/Dummy/g, 'Test');
fs.writeFileSync(pvrFile, pvrContent);

const tampFile = 'src/Tampuyak.tsx';
let tampContent = fs.readFileSync(tampFile, 'utf8');
tampContent = tampContent.replace(/Sample data representing document blocks/g, 'Initial data representing document blocks');
fs.writeFileSync(tampFile, tampContent);
