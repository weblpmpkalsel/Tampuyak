const fs = require('fs');
let content = fs.readFileSync('vite.config.ts', 'utf8');

const target = `          navigateFallback: '/index.html',
          maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,`;

const replacement = `          navigateFallback: '/index.html',
          navigateFallbackAllowlist: [/^(?!\\/__).*/],
          maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,`;

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync('vite.config.ts', content);
    console.log("Patched vite.config.ts for allowlist");
} else {
    console.log("Target not found");
}
