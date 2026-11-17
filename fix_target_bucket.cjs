const fs = require('fs');

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix Tampuyak.tsx line 7536
    content = content.replace(
        /const targetYear = String\(opActivity\.planningYear\)\.startsWith\('Y'\) \? opActivity\.planningYear : 'Y' \+ opActivity\.planningYear;/g,
        "const targetYear = `Y${String(opActivity.planningYear).replace(/[^0-9]/g, '')}`; // Normalized to guarantee Y1-Y4"
    );
    
    // Fix Tampuyak.tsx line 10109
    content = content.replace(
        /const targetBucket = String\(opActivity\.planningYear\)\.startsWith\('Y'\) \? opActivity\.planningYear : 'Y' \+ opActivity\.planningYear;/g,
        "const targetBucket = `Y${String(opActivity.planningYear).replace(/[^0-9]/g, '')}`; // Normalized to guarantee Y1-Y4"
    );
    
    // Fix DocumentSynchronizationEngine.ts targetYear
    content = content.replace(
        /const targetYear = opActivity\.planningYear;/g,
        "const targetYear = `Y${String(opActivity.planningYear).replace(/[^0-9]/g, '')}`; // Normalized"
    );

    fs.writeFileSync(filePath, content);
}

fixFile('/app/applet/src/Tampuyak.tsx');
fixFile('/app/applet/src/DocumentSynchronizationEngine.ts');
