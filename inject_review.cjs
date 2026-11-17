const fs = require('fs');

const file = 'src/Tampuyak.tsx';
let code = fs.readFileSync(file, 'utf8');

const reviewTabStr = fs.readFileSync('add_review_tab.txt', 'utf8');

const targetStr = "{activeTab === 'pratinjau' && (";

code = code.replace(targetStr, reviewTabStr + '\\n          ' + targetStr);

fs.writeFileSync(file, code);
console.log("Injected review tab");
