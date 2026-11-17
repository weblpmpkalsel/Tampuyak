const fs = require('fs');
let file = fs.readFileSync('src/index.css', 'utf8');

file = file.replace(/\.gsls-signature-cell \{[\s\S]*?\}/, `.gsls-signature-cell {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-start;
    height: 100%;
  }`);

file = file.replace(/\.gsls-signature-content \{[\s\S]*?\}/, `.gsls-signature-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    height: 100%;
  }`);

file = file.replace(/\.gsls-signature-space \{[\s\S]*?\}/, `.gsls-signature-space {
    flex-grow: 1;
    min-height: 3.5cm;
    width: 100%;
  }`);

fs.writeFileSync('src/index.css', file);
