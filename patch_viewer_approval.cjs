const fs = require('fs');
let file = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf8');

file = file.replace(
  /<p className="text-slate-800 m-0 leading-snug">Menyetujui,<br\/>Ketua Komite Sekolah<\/p>\s*<EditableRegion id="approval-committee-name"/g,
  '<div className="gsls-signature-content"><div className="gsls-role-block"><p className="text-slate-800 m-0 leading-snug">Menyetujui,<br/>Ketua Komite Sekolah</p></div><div className="gsls-signature-space"></div><div className="gsls-identity-block"><EditableRegion id="approval-committee-name"'
);

// close the tags for komite
file = file.replace(
  /as="p" className="gdds-signature-name" \/>\s*<\/div>/,
  'as="p" className="gdds-signature-name" /></div></div>\n             </div>'
);

// principal
file = file.replace(
  /<p className="text-slate-800 m-0 leading-snug">Mengesahkan,<br\/>Kepala Sekolah<\/p>\s*<EditableRegion id="approval-principal-name"/g,
  '<div className="gsls-signature-content"><div className="gsls-role-block"><p className="text-slate-800 m-0 leading-snug">Mengesahkan,<br/>Kepala Sekolah</p></div><div className="gsls-signature-space"></div><div className="gsls-identity-block"><EditableRegion id="approval-principal-name"'
);
// close the tags for principal
file = file.replace(
  /NIP\. <EditableRegion id="approval-principal-nip" fallback=\{settings\?\.principal\?\.nip \|\| "-"} \/><\/p>\s*<\/div>/,
  'NIP. <EditableRegion id="approval-principal-nip" fallback={settings?.principal?.nip || "-"} /></p></div></div>\n             </div>'
);

// pengawas
file = file.replace(
  /<p className="text-slate-800 m-0 leading-snug">Mengetahui,<br\/>Pengawas Sekolah<\/p>\s*<EditableRegion id="approval-pengawas-name"/g,
  '<div className="gsls-signature-content"><div className="gsls-role-block"><p className="text-slate-800 m-0 leading-snug">Mengetahui,<br/>Pengawas Sekolah</p></div><div className="gsls-signature-space"></div><div className="gsls-identity-block"><EditableRegion id="approval-pengawas-name"'
);
// close the tags for pengawas
file = file.replace(
  /NIP\. <EditableRegion id="approval-pengawas-nip" fallback=\{settings\.pengawas\.nip \|\| "-"} \/><\/p>\s*<\/div>/,
  'NIP. <EditableRegion id="approval-pengawas-nip" fallback={settings.pengawas.nip || "-"} /></p></div></div>\n               </div>'
);

// Replace gdds-signature-cell with gsls-signature-cell
file = file.replace(/gdds-signature-cell/g, 'gsls-signature-cell');
file = file.replace(/gdds-signature-center/g, 'center');

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', file);
