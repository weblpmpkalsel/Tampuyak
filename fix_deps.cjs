const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const regexDeps = /  \}, \[\n    settings\.school,\n    settings\.branding,\n    settings\.budget,\n    settings\.education,\n    settings\.principal,\n    settings\.guru,\n    settings\.pesertaDidik,\n    addActivity,\n    showToast,\n  \]\);/;

code = code.replace(regexDeps, "  }, [settings, addActivity, showToast]);");

fs.writeFileSync('src/Tampuyak.tsx', code);
