const fs = require('fs');
let code = fs.readFileSync('src/ksp/KspMetadataAdapter.ts', 'utf8');

code = code.replace(/const activeYear = settings\?\.academicYears\?\.find\(\(y: any\) => y\.isActive\);[\s\S]*?return {/, \`    const activeYear = settings?.academicYears?.find((y: any) => y.isActive);
    const fallbackYear = \\\`\\\${\new Date().getFullYear()}/\\\${\new Date().getFullYear() + 1}\\\`;
    const academicYear = activeYear?.name || fallbackYear;
    
    const rawApprovalDate = settings?.administrasi?.establishmentDate || settings?.administrasi?.approvalDate || settings?.approval?.date || '';
    let approvalDateStr = rawApprovalDate;
    if (rawApprovalDate) {
        try {
            const d = new Date(rawApprovalDate);
            if (!isNaN(d.getTime())) {
                approvalDateStr = new Intl.DateTimeFormat('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }).format(d);
            }
        } catch (e) {
            // ignore
        }
    }
    
    return {\`);

fs.writeFileSync('src/ksp/KspMetadataAdapter.ts', code);
console.log('Done');
