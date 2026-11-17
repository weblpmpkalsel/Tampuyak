const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const regexRkjmEmpty = /\{\(\!settings\.relationalPlanning \|\| \!settings\.relationalPlanning\.objectives \|\| settings\.relationalPlanning\.objectives\.length === 0\) && \(\n.*?<td.*?Data RKJM belum tersedia.*?<\/td><\/tr>\n.*?\}\)/s;
const regexRktEmpty = /\{\(\!settings\.relationalPlanning\?\.annualPlans\?\.Y1\?\.rkt \|\| settings\.relationalPlanning\.annualPlans\.Y1\.rkt\.length === 0\) && \(\n.*?<td.*?Data RKT belum tersedia.*?<\/td><\/tr>\n.*?\}\)/s;
const regexRkasEmpty = /\{\(\!settings\.relationalPlanning\?\.annualPlans\?\.Y1\?\.rkas \|\| settings\.relationalPlanning\.annualPlans\.Y1\.rkas\.length === 0\) && \(\n.*?<td.*?Data RKAS belum tersedia.*?<\/td><\/tr>\n.*?\}\)/s;
const regexMonEmpty = /\{\(\!settings\.relationalPlanning\?\.annualPlans\?\.Y1\?\.monitoring \|\| settings\.relationalPlanning\.annualPlans\.Y1\.monitoring\.length === 0\) && \(\n.*?<td.*?Data Monitoring belum tersedia.*?<\/td><\/tr>\n.*?\}\)/s;

code = code.replace(regexRkjmEmpty, '');
code = code.replace(regexRktEmpty, '');
code = code.replace(regexRkasEmpty, '');
code = code.replace(regexMonEmpty, '');

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Removed empty placeholders from document print template');
