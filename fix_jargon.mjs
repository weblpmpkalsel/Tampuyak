import fs from 'fs';

let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

code = code.replace(/Status Pipeline Penyusunan/g, 'Tahapan Penyusunan');
code = code.replace(/Proses di balik layar untuk merakit RKJM./g, 'Tahapan penyusunan Rencana Kerja Jangka Menengah.');

// Also check for "Blueprint", "Registry", etc in user-facing texts.
// Look at DokumenPerencanaanView
// We have "Template Registry", "Regulation Registry", "DQA Engine"
// These might be in the sidebar for Dev mode, which the prompt says: "Developer Mode remains unchanged."
// "DO NOT expose Generator, Renderer, Pipeline, Assembly Log, Blueprint, Registry, or Engine to normal users. Developer Mode remains unchanged."
// So as long as they are only in dev mode, it's fine.

fs.writeFileSync('src/Tampuyak.tsx', code);
