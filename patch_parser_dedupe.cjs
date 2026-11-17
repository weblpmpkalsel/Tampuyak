const fs = require('fs');
const path = 'src/EducationReportParser.ts';
let content = fs.readFileSync(path, 'utf8');

const target = `                            indicators.push({
                                id, name, score,
                                trend: trendCell ? trendCell.v : null,
                                rank: rankCell ? rankCell.v : null,
                                origin: {
                                    worksheet: sheet.name,
                                    row: row.r,
                                    column: indCol,
                                    cellAddress: XLSX.utils.encode_cell({c: indCol, r: row.r}),
                                    sourceValue: name
                                }
                            });
                            objectsCreated++;`;

const replacement = `                            const existingInd = indicators.find(i => i.id === id);
                            if (existingInd) {
                                if (!existingInd.score && score) existingInd.score = score;
                                if (!existingInd.trend && trendCell) existingInd.trend = trendCell.v;
                                if (!existingInd.rank && rankCell) existingInd.rank = rankCell.v;
                            } else {
                                indicators.push({
                                    id, name, score,
                                    trend: trendCell ? trendCell.v : null,
                                    rank: rankCell ? rankCell.v : null,
                                    origin: {
                                        worksheet: sheet.name,
                                        row: row.r,
                                        column: indCol,
                                        cellAddress: XLSX.utils.encode_cell({c: indCol, r: row.r}),
                                        sourceValue: name
                                    }
                                });
                                objectsCreated++;
                            }`;

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(path, content, 'utf8');
    console.log("Successfully replaced target content.");
} else {
    console.log("Target content not found!");
}
