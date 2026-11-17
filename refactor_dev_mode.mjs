import fs from 'fs';

let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

// Remove handleDevClick logic
content = content.replace(/const handleDevClick = \(\) => {[\s\S]*?};\n/, 'const handleDevClick = () => {};\n');
content = content.replace(/const \[developerMode, setDeveloperMode\] = useState\(false\);/, '');
content = content.replace(/const \[devClicks, setDevClicks\] = useState\(0\);/, '');
content = content.replace(/developerMode,/, '');
content = content.replace(/developerMode=\{developerMode\}/g, '');
content = content.replace(/\.\.\.\(developerMode\s*\?\s*\[\{ id: "ai", label: "Pengaturan Lanjutan", icon: Sparkles \}\]\s*:\s*\[\]\),/g, '');


fs.writeFileSync('src/Tampuyak.tsx', content);
console.log('Removed dev mode');
