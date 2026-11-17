const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const oldPrintPreview = `<div className="mb-4 flex justify-between items-center">`;
const newPrintPreview = `<DocumentHealthScore docId={docId} settings={settings} />\n              <div className="mb-4 flex justify-between items-center">`;

// Only replace in the DocumentEditorView (it might match multiple, let's be careful).
const oldEditorView = `          <div className="lg:col-span-2 space-y-4">
            <div className="mb-4 flex justify-between items-center">`;
const newEditorView = `          <div className="lg:col-span-2 space-y-4">
            <DocumentHealthScore docId={docId} settings={settings} />
            <div className="mb-4 flex justify-between items-center">`;

code = code.replace(oldEditorView, newEditorView);

// We should also replace in rkjm pipeline and KSP studio if they have print preview. But they are rendering DocumentEditorView or generating PDF.
// Let's check where the print button is in the app.
// It's mostly in the Review mode of DocumentEditorView and inside RKJM pipeline print view.

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Phase 24 print preview applied');
