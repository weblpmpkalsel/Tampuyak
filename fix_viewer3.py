import re

with open('src/EnterpriseDocumentViewer.tsx', 'r') as f:
    content = f.read()

old_sig = """                <div className="flex justify-end mb-16 pr-8">
                  <p className="text-lg text-slate-900">{table.location}</p>
                </div>
                <div className="grid grid-cols-2 gap-8 text-center mt-12">
                  {table.signatures.map((sig: any, sIdx: number) => (
                    <div key={sIdx} className="relative inline-block text-left">
                      <p className="text-slate-800 whitespace-pre-line">{sig.label}</p>
                      
                      {/* Space for future enhancements: signatures, qr codes, etc (approx 4-5cm) */}
                      <div className="relative flex items-center justify-center mb-2 w-full" style={{ minHeight: DefaultDocumentLayoutConfig.spacing.signatureBlockHeight }}>
                        {/* Empty block ready for electronic signatures / stamps */}
                      </div>
                      
                      <p className="font-bold underline text-slate-900 relative z-20">{sig.name}</p>
                      <p className="text-slate-800 relative z-20">NIP. {sig.nip}</p>
                    </div>
                  ))}
                </div>"""

new_sig = """                <div className="flex justify-end mt-12 pr-8">
                  <p className="text-slate-900">{table.location}</p>
                </div>
                <div className="gdds-signature-grid">
                  {table.signatures.map((sig: any, sIdx: number) => (
                    <div key={sIdx} className="gdds-signature-cell gdds-signature-center">
                      <p className="text-slate-800 m-0 leading-snug whitespace-pre-line">{sig.label}</p>
                      <p className="gdds-signature-name relative z-20 m-0 leading-snug">{sig.name}</p>
                      <p className="text-slate-800 relative z-20 m-0 leading-snug">NIP. {sig.nip}</p>
                    </div>
                  ))}
                </div>"""

if old_sig in content:
    content = content.replace(old_sig, new_sig)
    with open('src/EnterpriseDocumentViewer.tsx', 'w') as f:
        f.write(content)
    print("Success")
else:
    print("Not found")

