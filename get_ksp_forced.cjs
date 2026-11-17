const fs = require('fs');
const { execSync } = require('child_process');

try {
  execSync('npx tsx scripts/generate-ksp.ts', { stdio: 'inherit' });
  console.log('KSP forced generated.');
} catch (e) {
  console.error(e);
}
