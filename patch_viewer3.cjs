const fs = require('fs');
let code = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf-8');

const targetStr = `        {section.tables && section.tables.map((table, idx) => {
          return (
          <div key={idx} className="my-6">
            {table.title && <h4 className="font-bold text-slate-800 mb-3">{table.title}</h4>}
            {table.data && (table.data.identification || (Array.isArray(table.data) && table.title && table.title.includes('Identifikasi'))) ? (`;

const replaceStr = `        {section.tables && section.tables.map((table, idx) => {
          if (table.type === 'signature_block') {
            return (
              <div key={idx} className="signature-block mt-16 page-break-inside-avoid" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                <div className="flex justify-end mb-16 pr-8">
                  <p className="text-lg text-slate-900">{table.location}</p>
                </div>
                <div className="grid grid-cols-2 gap-8 text-center mt-12">
                  {table.signatures.map((sig: any, sIdx: number) => (
                    <div key={sIdx} className="relative inline-block text-left">
                      <p className="mb-24 text-slate-800 whitespace-pre-line">{sig.label}</p>
                      
                      {/* Space for future enhancements: signatures, qr codes, etc (approx 4-5cm) */}
                      <div className="h-24 relative flex items-center justify-center -mt-20 mb-4">
                        {/* Empty block ready for electronic signatures / stamps */}
                      </div>
                      
                      <p className="font-bold underline mt-4 text-slate-900 relative z-20">{sig.name}</p>
                      <p className="text-slate-800 relative z-20">NIP. {sig.nip}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          return (
          <div key={idx} className="my-6">
            {table.title && <h4 className="font-bold text-slate-800 mb-3">{table.title}</h4>}
            {table.data && (table.data.identification || (Array.isArray(table.data) && table.title && table.title.includes('Identifikasi'))) ? (`;

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', code);
console.log("EnterpriseDocumentViewer signature block patched!");
