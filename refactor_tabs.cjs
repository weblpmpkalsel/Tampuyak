const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

code = code.replace(
    /id: "principal",\s*title: "Kepala Sekolah",\s*icon: UserCircle,\s*desc: settings\.principal\.name \|\| "Belum diisi",/g,
    'id: "pejabat",\n      title: "Pejabat Penandatangan",\n      icon: UserCircle,\n      desc: settings.principal.name || "Belum diisi",'
);

code = code.replace(
    /case "principal":\s*return \(\s*<SettingsTabs\.Principal[\s\S]*?\/>\s*\);/g,
    ''
);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Saved');
