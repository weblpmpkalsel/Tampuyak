const fs = require('fs');
let code = fs.readFileSync('src/DocumentChapters.tsx', 'utf-8');

if (!code.includes('DocumentOrchestrationEngine')) {
  code = 'import { DocumentOrchestrationEngine } from "./DOE";\n' + code;
}

// Convert implicitly returning arrow functions to explicitly returning ones
function convertToExplicitReturn(str, funcName) {
  const regex = new RegExp(`export const ${funcName} = \\([^)]+\\) => \\([\\s\\S]*?\\n\\);`, 'g');
  return str.replace(regex, (match) => {
    // replace `=> (` with `=> { const doe = new DocumentOrchestrationEngine(settings); return (`
    let res = match.replace(/=> \(/, '=> { const doe = new DocumentOrchestrationEngine(settings); return (');
    // replace the ending `);` with `); };`
    if (res.endsWith(');')) {
      res = res.slice(0, -2) + '); };';
    }
    return res;
  });
}

code = convertToExplicitReturn(code, 'renderKSPChapters');
code = convertToExplicitReturn(code, 'renderRKJMChapters');
code = convertToExplicitReturn(code, 'renderRKTChapters');
code = convertToExplicitReturn(code, 'renderMonitoringChapters');
code = convertToExplicitReturn(code, 'renderEvaluationChapters');

// renderRKASChapters is already explicitly returning `{`
code = code.replace(/export const renderRKASChapters = \([^)]+\) => \{/, (match) => {
    return match + '\n  const doe = new DocumentOrchestrationEngine(settings);';
});

code = code.replace(/GWE\.generateNarrative\("([^"]+)",\s*\{[^}]+\}\)/g, (match, p1) => {
    let docType = "KSP";
    if (p1.startsWith("rkjm")) docType = "RKJM";
    else if (p1.startsWith("rkt")) docType = "RKT";
    else if (p1.startsWith("rkas")) docType = "RKAS";
    else if (p1.startsWith("mon") || p1.includes("monitoring")) docType = "MONITORING";
    else if (p1.startsWith("eval") || p1.includes("evaluation")) docType = "EVALUATION";
    
    return `GWE.generateNarrative(doe.generateContext("${docType}", "${p1}"))`;
});

fs.writeFileSync('src/DocumentChapters.tsx', code);

