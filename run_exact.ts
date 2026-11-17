import fs from 'fs';

const stored = fs.readFileSync('test_storage.json', 'utf8').trim(); // wait, we don't have localStorage here
// Wait, we can't access localStorage of the browser.
// But if the user says the browser displays old values...
