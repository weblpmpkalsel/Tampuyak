import fs from 'fs';

let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

// Remove ProcessStepper invocation
code = code.replace(
  '{currentView !== "beranda" && currentView !== "pengaturan" && (\n              <ProcessStepper currentView={currentView} settings={settings} />\n            )}',
  ''
);

// We can also remove the ProcessStepper component itself.
const startIndex = code.indexOf('const ProcessStepper =');
if (startIndex !== -1) {
  const endIndex = code.indexOf('};', startIndex) + 2;
  code = code.substring(0, startIndex) + code.substring(endIndex);
}

fs.writeFileSync('src/Tampuyak.tsx', code);
