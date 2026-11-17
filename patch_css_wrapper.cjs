const fs = require('fs');
let cssContent = fs.readFileSync('src/index.css', 'utf8');

const searchCSS = `.gsls-role-block {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    width: fit-content;
  }
  .gsls-role-block p, .gsls-identity-block p {
    margin-bottom: 0 !important;
  }
  .gsls-identity-block {
    display: flex;
    flex-direction: column;
    align-items: flex-start; /* Ensure name and nip align to same left edge */
    text-align: left;
    width: fit-content;      /* Wrapper shrinks to content so entire block can be centered */
  }`;

const replaceCSS = `.gsls-signature-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: fit-content;
  }
  .gsls-role-block {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    width: 100%;
  }
  .gsls-role-block p, .gsls-identity-block p {
    margin-bottom: 2px !important;
    line-height: 1.2;
  }
  .gsls-identity-block {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    width: 100%;
  }`;

if (cssContent.includes(searchCSS)) {
  cssContent = cssContent.replace(searchCSS, replaceCSS);
  fs.writeFileSync('src/index.css', cssContent);
  console.log('patched css');
} else {
  console.log('css search not found');
}
