import fs from 'fs';
import { JSDOM } from 'jsdom';

const dom = new JSDOM(`<!DOCTYPE html><html lang="en"><body><div id="root"></div></body></html>`, {
  runScripts: "dangerously",
  resources: "usable"
});

// Since node doesn't have `self`, jsdom provides `window`.
dom.window.self = dom.window;
global.window = dom.window;
global.document = dom.window.document;
global.self = dom.window;

// we can try to find the index.js and run it
const jsFiles = fs.readdirSync('dist/assets').filter(f => f.endsWith('.js'));
if (jsFiles.length > 0) {
  const code = fs.readFileSync('dist/assets/' + jsFiles[0], 'utf-8');
  try {
    dom.window.eval(code);
    console.log('Script evaluated successfully');
  } catch (e) {
    console.error('Error evaluating script:', e);
  }
}
