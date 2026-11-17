const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const oldCopyOptions = `    const [copyOptions, setCopyOptions] = useState({
      school: true,
      principal: true,
      guru: true,
      tendik: true,
      komite: true,
      pengawas: true,
      sarpras: true,
      programUnggulan: true,
      potensi: true,
      identitas: true,
      karakteristik: true,
      branding: true,
    });`;

const newCopyOptions = `    const [copyOptions, setCopyOptions] = useState({
      school: true,
      principal: true,
      guru: true,
      tendik: true,
      komite: true,
      pengawas: true,
      sarpras: true,
      programUnggulan: true,
      potensi: true,
      identitas: true,
      karakteristik: true,
      branding: true,
      planning: false, // Document Migration Engine RSAT-M02
      documents: false, // Document Migration Engine RSAT-M02
      visualIdentity: true,
    });`;

code = code.replace(oldCopyOptions, newCopyOptions);
fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Fixed copyOptions');
