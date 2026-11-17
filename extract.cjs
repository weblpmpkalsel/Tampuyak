const fs = require('fs');

const extractText = () => {
    const lines = fs.readFileSync('src/Tampuyak.tsx', 'utf8').split('\n');
    let uiMatches = [];
    lines.forEach((line, i) => {
        if (line.match(/['">]([^'<]*?(Blueprint|Pipeline|Assembly|Generator|Engine|Publishing|Generate with AI|AI)[^'>]*?)['"<]/i)) {
            uiMatches.push(`${i + 1}: ${line.trim()}`);
        }
    });
    fs.writeFileSync('ui_matches.txt', uiMatches.join('\n'));
}

extractText();
