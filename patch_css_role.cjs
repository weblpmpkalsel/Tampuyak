const fs = require('fs');
let cssContent = fs.readFileSync('src/index.css', 'utf8');

const searchCSS = `.gsls-identity-block {`;

const replaceCSS = `.gsls-role-block {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    width: fit-content;
  }
  .gsls-role-block p, .gsls-identity-block p {
    margin-bottom: 0 !important;
  }
  .gsls-identity-block {`;

if (cssContent.includes(searchCSS)) {
  cssContent = cssContent.replace(searchCSS, replaceCSS);
  fs.writeFileSync('src/index.css', cssContent);
  console.log('patched css');
} else {
  console.log('css search not found');
}
