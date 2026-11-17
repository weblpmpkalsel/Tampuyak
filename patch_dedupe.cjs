const fs = require('fs');
const path = 'src/EducationReportParser.ts';
let content = fs.readFileSync(path, 'utf8');

const target = `                            const existingInd = indicators.find(i => i.id === id);
                            if (existingInd) {
                                if (!existingInd.score && score) existingInd.score = score;
                                if (!existingInd.trend && trendCell) existingInd.trend = trendCell.v;
                                if (!existingInd.rank && rankCell) existingInd.rank = rankCell.v;
                            }`;

const replacement = `                            const existingInd = indicators.find(i => i.id === id);
                            if (existingInd) {
                                if (score) {
                                    const isFromRaporSheet = sheet.name.toLowerCase().includes('rapor') || sheet.name.toLowerCase().includes('capaian');
                                    const existingIsFromRaporSheet = existingInd.origin.worksheet.toLowerCase().includes('rapor') || existingInd.origin.worksheet.toLowerCase().includes('capaian');
                                    const hasDecimal = (s) => s.includes(',') || s.includes('.');
                                    
                                    if (!existingInd.score) {
                                        existingInd.score = score;
                                    } else if (isFromRaporSheet && !existingIsFromRaporSheet) {
                                        existingInd.score = score;
                                    } else if (hasDecimal(score) && !hasDecimal(existingInd.score)) {
                                        existingInd.score = score;
                                    }
                                }
                                if (!existingInd.trend && trendCell) existingInd.trend = trendCell.v;
                                if (!existingInd.rank && rankCell) existingInd.rank = rankCell.v;
                            }`;

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(path, content, 'utf8');
    console.log("Successfully patched dedupe.");
} else {
    console.log("Target not found!");
}
