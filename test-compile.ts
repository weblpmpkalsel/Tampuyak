import fs from 'fs';

const code = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');
const addAcademicYearMatch = code.match(/const addAcademicYear = useCallback\([\s\S]*?\],\n  \);/);
const switchAcademicYearMatch = code.match(/const switchAcademicYear = useCallback\([\s\S]*?\n  \}, \[\]\);/);

console.log("addAcademicYear found:", !!addAcademicYearMatch);
console.log("switchAcademicYear found:", !!switchAcademicYearMatch);

fs.writeFileSync('dump_add.js', addAcademicYearMatch ? addAcademicYearMatch[0] : '');
fs.writeFileSync('dump_switch.js', switchAcademicYearMatch ? switchAcademicYearMatch[0] : '');
