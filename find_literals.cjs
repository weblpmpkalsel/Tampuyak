const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const replacements = [
    [/Generate with AI/g, "Planning"],
    [/AI Engine/g, "System"],
    [/>Generate RKJM</g, ">Create RKJM<"],
    [/"Generate RKJM"/g, '"Create RKJM"'],
    [/>Generator</g, ">Document Builder<"],
    [/"Generator"/g, '"Document Builder"'],
    [/>Pipeline</g, ">Document Progress<"],
    [/"Pipeline"/g, '"Document Progress"'],
    [/>Assembly</g, ">Document Preparation<"],
    [/"Assembly"/g, '"Document Preparation"'],
    [/>Engine</g, ">System<"],
    [/"Engine"/g, '"System"'],
    [/>Blueprint</g, ">Planning Summary<"],
    [/"Blueprint"/g, '"Planning Summary"'],
    [/>Publishing</g, ">Print & Export<"],
    [/"Publishing"/g, '"Print & Export"'],
    [/Generator/g, "Document Builder"],
    // Be careful with blanket replacements! Let's restrict it to specific labels.
];

// Let's first dump all literal strings in the file to see what we actually need to change.
let literalStrings = [];
const regex = /["'](.*?)["']/g;
let match;
while ((match = regex.exec(code)) !== null) {
    literalStrings.push(match[1]);
}
fs.writeFileSync('literals.txt', literalStrings.join('\n'));
