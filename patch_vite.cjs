const fs = require('fs');
let content = fs.readFileSync('vite.config.ts', 'utf8');

const target = `        workbox: {
          maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],`;

const replacement = `        workbox: {
          cleanupOutdatedCaches: true,
          navigateFallback: '/index.html',
          maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],`;

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync('vite.config.ts', content);
    console.log("Patched vite.config.ts");
} else {
    console.log("Target not found");
}
