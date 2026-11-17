const fs = require('fs');
let config = fs.readFileSync('vite.config.ts', 'utf8');

const oldManifest = `        manifest: {
          name: 'TAMPUYAK OS',
          short_name: 'TAMPUYAK',
          description: 'Platform Tata Kelola Administrasi dan Manajemen Pendidikan',
          theme_color: '#0f172a',
          background_color: '#ffffff',
          display: 'standalone',
          orientation: 'portrait-primary',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: 'icon-192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'icon-256.png',
              sizes: '256x256',
              type: 'image/png'
            },
            {
              src: 'icon-384.png',
              sizes: '384x384',
              type: 'image/png'
            },
            {
              src: 'icon-512.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: 'maskable-icon.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
            }
          ]
        },`;

const newManifest = `        manifest: {
          name: 'TAMPUYAK OS',
          short_name: 'TAMPUYAK',
          description: 'Platform Tata Kelola Administrasi dan Manajemen Pendidikan',
          theme_color: '#0f172a',
          background_color: '#ffffff',
          display: 'standalone',
          orientation: 'portrait-primary',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: 'favicon-16x16.png',
              sizes: '16x16',
              type: 'image/png'
            },
            {
              src: 'favicon-32x32.png',
              sizes: '32x32',
              type: 'image/png'
            },
            {
              src: 'icon-192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'icon-256.png',
              sizes: '256x256',
              type: 'image/png'
            },
            {
              src: 'icon-384.png',
              sizes: '384x384',
              type: 'image/png'
            },
            {
              src: 'icon-512.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: 'maskable-icon-192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'maskable'
            },
            {
              src: 'maskable-icon-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
            },
            {
              src: 'maskable-icon.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
            },
            {
              src: 'tampuyak-icon.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        },`;

config = config.replace(oldManifest, newManifest);

const oldInclude = `includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'maskable-icon.png'],`;
const newInclude = `includeAssets: ['favicon.ico', 'favicon-16x16.png', 'favicon-32x32.png', 'apple-touch-icon.png', 'maskable-icon-192.png', 'maskable-icon-512.png', 'maskable-icon.png', 'tampuyak-icon.png', 'robots.txt'],`;

config = config.replace(oldInclude, newInclude);

// Also bust cache
config = config.replace(/google-fonts-cache-v2/g, 'google-fonts-cache-v3');
config = config.replace(/gstatic-fonts-cache-v2/g, 'gstatic-fonts-cache-v3');

fs.writeFileSync('vite.config.ts', config);
