const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const badBlock = `
                    <tr>
                      <td colSpan={7} className="px-4 py-3">
                        <Button variant="outline" size="sm" onClick={() => { setSelectedProgramId(program.id); setShowMasterModal(true); }}>
                          <Plus className="w-4 h-4 mr-2" /> Tambah Komponen dari Referensi Master RKAS
                        </Button>
                      </td>
                    </tr>`;

// First occurrence (8495) - remove
code = code.replace(badBlock, '');

// Third occurrence (13714) - remove
// (Wait, `replace` only replaces the first occurrence, so calling it twice removes the first and second.
// But we want to keep the one that actually belongs to RKASDerivationView, which is the middle one or whichever.)

fs.writeFileSync('src/Tampuyak.tsx', code);
