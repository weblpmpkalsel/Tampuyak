const fs = require('fs');
let code = fs.readFileSync('src/enterprise/workspace/adapters/EnterpriseAdapter.ts', 'utf8');

code = code.replace(
  `  static mergeNonEmpty(legacy: any, modern: any) {
    if (!legacy) return modern || {};
    if (!modern) return legacy || {};
    const result = { ...modern };
    for (const key in legacy) {
      const val = legacy[key];
      if (val !== undefined && val !== null && val !== "" && !(Array.isArray(val) && val.length === 0)) {
        if (typeof val === 'object' && !Array.isArray(val) && typeof result[key] === 'object' && !Array.isArray(result[key])) {
            result[key] = EnterpriseAdapter.mergeNonEmpty(val, result[key]);
        } else {
            result[key] = val;
        }
      }
    }
    return result;
  }`,
  `  static mergeNonEmpty(legacy: any, modern: any) {
    if (!legacy) return modern || {};
    if (!modern) return legacy || {};
    const result = { ...legacy };
    for (const key in modern) {
      const val = modern[key];
      if (val !== undefined && val !== null && val !== "" && !(Array.isArray(val) && val.length === 0)) {
        if (typeof val === 'object' && !Array.isArray(val) && typeof result[key] === 'object' && !Array.isArray(result[key])) {
            result[key] = EnterpriseAdapter.mergeNonEmpty(result[key], val);
        } else {
            result[key] = val;
        }
      }
    }
    return result;
  }`
);

fs.writeFileSync('src/enterprise/workspace/adapters/EnterpriseAdapter.ts', code);
console.log("Patched Adapter");
