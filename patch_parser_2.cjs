const fs = require('fs');
const path = 'src/EducationReportParser.ts';
let content = fs.readFileSync(path, 'utf8');

const target = `                        let id = "IND-" + (indicators.length + 1);
                        let name = indCell.v;
                        
                        // Strategy 1: Regex with permissive formatting
                        const codeRegex = /^([a-eA-E])[\\.\\-\\_\\s]*(\\d+(?:\\.\\d+)?)/;
                        const matchId = name.match(codeRegex);
                        if (matchId) {
                            id = \`\${matchId[1].toUpperCase()}.\${matchId[2]}\`;
                        } else {
                            // Strategy 2: Dictionary lookup (canonical names)
                            const normalizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
                            const nameToId = {
                                "kemampuanliterasi": "A.1",
                                "kemampuannumerasi": "A.2",
                                "karakter": "A.3",
                                "kualitaspembelajaran": "D.1",
                                "refleksidanperbaikanpembelajaranolehguru": "D.2",
                                "kepemimpinaninstruksional": "D.3",
                                "iklimkeamanansekolah": "D.4",
                                "iklimkebinekaan": "D.8",
                                "iklimkebhinekaan": "D.8",
                                "ikliminklusivitas": "D.10"
                            };
                            for (const [key, val] of Object.entries(nameToId)) {
                                if (normalizedName.includes(key)) {
                                    id = val;
                                    break;
                                }
                            }
                        }`;

const replacement = `                        let id = "IND-" + (indicators.length + 1);
                        let name = indCell.v;
                        let extractedId = null;

                        const RaporDictionaryValidIDs = new Set([
                          "A.1", "A.2", "A.3",
                          "D.1", "D.2", "D.3", "D.4", "D.8", "D.10"
                        ]);
                        
                        // Strategy 1: Regex with permissive formatting
                        const codeRegex = /^([a-eA-E])[\\.\\-\\_\\s]*(\\d+(?:\\.\\d+)?)/;
                        const matchId = name.match(codeRegex);
                        
                        if (matchId) {
                            const tempId = \`\${matchId[1].toUpperCase()}.\${matchId[2]}\`;
                            if (RaporDictionaryValidIDs.has(tempId)) {
                                extractedId = tempId;
                            }
                        }
                        
                        if (!extractedId) {
                            // Strategy 2: Dictionary lookup (canonical names)
                            const normalizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
                            const nameToId = {
                                "kemampuanliterasi": "A.1",
                                "kemampuannumerasi": "A.2",
                                "karakter": "A.3",
                                "kualitaspembelajaran": "D.1",
                                "refleksidanperbaikanpembelajaranolehguru": "D.2",
                                "kepemimpinaninstruksional": "D.3",
                                "iklimkeamanansekolah": "D.4",
                                "iklimkebinekaan": "D.8",
                                "iklimkebhinekaan": "D.8",
                                "ikliminklusivitas": "D.10"
                            };
                            
                            for (const [key, val] of Object.entries(nameToId)) {
                                if (normalizedName.includes(key)) {
                                    if (RaporDictionaryValidIDs.has(val)) {
                                        extractedId = val;
                                        break;
                                    }
                                }
                            }
                        }

                        if (extractedId) {
                            id = extractedId;
                        }`;

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(path, content, 'utf8');
    console.log("Successfully replaced target content.");
} else {
    console.log("Target content not found!");
}
