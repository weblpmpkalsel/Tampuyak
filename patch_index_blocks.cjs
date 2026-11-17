const fs = require('fs');
let file = fs.readFileSync('src/index.css', 'utf8');

if (!file.includes('.gdds-table-block')) {
  file += `
@layer utilities {
  .gdds-table-block {
    margin-top: 12pt;
    margin-bottom: 12pt;
    padding-bottom: 0;
  }
  .gdds-image-block {
    display: flex;
    justify-content: center;
    margin-top: 12pt;
    margin-bottom: 12pt;
  }
  .gdds-attachment-block {
    margin-top: 12pt;
    margin-bottom: 12pt;
  }
  .gdds-cover-logos {
    display: flex;
    justify-content: center;
    margin-top: 24pt;
    margin-bottom: 24pt;
  }
}
`;
  fs.writeFileSync('src/index.css', file);
}
