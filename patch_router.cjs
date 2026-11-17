const fs = require('fs');
let code = fs.readFileSync('src/document/DocumentRouter.ts', 'utf-8');
const target = `        const planningActivities = authoritativeRkt.map((rktObj: any) => {
            const rkasObj = authoritativeRkas.find((r: any) => r.rktActivityId === rktObj.id) || {};
            return {
                ...rktObj,
                ...rkasObj,
                id: rktObj.id,
                kode: rkasObj.accountCode || rktObj.accountCode || rktObj.kode || rktObj.id,
                nama: rktObj.subActivity || rktObj.activityName || rktObj.activity
            };
        });`;
const replacement = `        const planningActivities = authoritativeRkt.map((rktObj: any) => {
            const rkasObj = authoritativeRkas.find((r: any) => r.rktActivityId === rktObj.id) || {};
            return {
                ...rktObj,
                ...rkasObj,
                id: rktObj.id,
                kode: rktObj.kode || rktObj.id,
                accountCode: rkasObj.accountCode || rktObj.accountCode || '-',
                nama: rktObj.subActivity || rktObj.activityName || rktObj.activity
            };
        });`;
code = code.replace(target, replacement);
fs.writeFileSync('src/document/DocumentRouter.ts', code);
console.log("DocumentRouter patched!");
