import { KspMetadataAdapter } from './src/ksp/KspMetadataAdapter';
import fs from 'fs';

// Try to read settings from Tampuyak if we can, but since it's a browser thing, 
// let's look at the default settings from the file
let file = fs.readFileSync('src/Tampuyak.tsx', 'utf8');
let defaultSettingsStr = file.match(/const DEFAULT_SETTINGS = (\{[\s\S]*?\n  \});\n/);
if (defaultSettingsStr) {
  // Can't easily eval it because of nested references and JS syntax
  console.log("Found DEFAULT_SETTINGS");
} else {
  console.log("Could not find DEFAULT_SETTINGS");
}
