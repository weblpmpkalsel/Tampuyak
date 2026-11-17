import fs from 'fs';

const configFile = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf-8'));
console.log('--- Firebase Config ---');
console.log('projectId:', configFile.projectId);
console.log('authDomain:', configFile.authDomain);
if (configFile.apiKey) {
    const key = configFile.apiKey;
    console.log('apiKey:', key.substring(0, 4) + '...' + key.substring(key.length - 4));
}
console.log('storageBucket:', configFile.storageBucket);
