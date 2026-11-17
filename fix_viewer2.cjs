const fs = require('fs');

let content = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf8');

content = content.replace(
  'className="signature-block mt-16 page-break-inside-avoid" style={{ pageBreakInside: \'avoid\', breakInside: \'avoid\' }}',
  'className={`signature-block mt-16 ${DefaultDocumentLayoutConfig.keepTogether.signatureBlocks ? "page-break-inside-avoid print-no-break" : ""}`} style={DefaultDocumentLayoutConfig.keepTogether.signatureBlocks ? { pageBreakInside: \'avoid\', breakInside: \'avoid\' } : {}}'
);

content = content.replace(
  '<div className="print-no-break" style={{ pageBreakInside: \'avoid\', breakInside: \'avoid\' }}>',
  '<div className={DefaultDocumentLayoutConfig.keepTogether.signatureBlocks ? "print-no-break page-break-inside-avoid" : ""} style={DefaultDocumentLayoutConfig.keepTogether.signatureBlocks ? { pageBreakInside: \'avoid\', breakInside: \'avoid\' } : {}}>'
);

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', content);
