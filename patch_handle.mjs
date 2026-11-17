import fs from 'fs';

let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

const searchStr = `const { data: parsedData, metadata, recommendations } = parseResult;`;
const replaceStr = `const { data: parsedData, metadata, recommendations, rkt, rkas, schoolData } = parseResult;`;
content = content.replace(searchStr, replaceStr);

const setPendingSearch = `setPendingImport({
            fileInfo: {
                fileName: file.name,
                importTimestamp: Date.now(),
            },
            metadata,
            recommendations,
            parsedData,
            dataCoverage,
            warnings
        });`;

const setPendingReplace = `setPendingImport({
            fileInfo: {
                fileName: file.name,
                importTimestamp: Date.now(),
            },
            metadata,
            recommendations,
            rkt,
            rkas,
            schoolData,
            parsedData,
            dataCoverage,
            warnings
        });`;

content = content.replace(setPendingSearch, setPendingReplace);
fs.writeFileSync('src/Tampuyak.tsx', content);
console.log('Tampuyak.tsx patched for pendingImport');
