const fs = require('fs');

let css = fs.readFileSync('src/index.css', 'utf8');

css = css.replace(/orphans: 3;/g, 'orphans: 2;');
css = css.replace(/widows: 3;/g, 'widows: 2;');

css = css.replace(
`.gdds-list-item {
    margin-bottom: 6pt;
    padding-left: 0.63cm;
  }`,
`.gdds-list-item {
    margin-bottom: 6pt;
  }
  .gdds-list-item > ol, .gdds-list-item > ul {
    margin-top: 6pt;
  }`
);

css += `
@layer utilities {
  .gdds-list {
    padding-left: 1.27cm;
    margin-bottom: 12pt;
  }
  .gdds-list .gdds-list {
    padding-left: 0.63cm;
  }
}
`;

fs.writeFileSync('src/index.css', css);
console.log('CSS fixed');
