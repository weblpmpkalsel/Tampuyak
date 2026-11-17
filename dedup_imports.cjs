const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

let start = code.indexOf('import {');
let end = code.indexOf('} from "lucide-react";');

if (start !== -1 && end !== -1 && start < end) {
  let importBlock = code.substring(start, end + '} from "lucide-react";'.length);
  let content = importBlock.substring('import {'.length, importBlock.lastIndexOf('}')).trim();
  
  let items = content.split(',').map(i => i.trim()).filter(i => i);
  let uniqueItems = new Set(items);
  
  let newImportBlock = 'import {\n  ' + Array.from(uniqueItems).join(',\n  ') + '\n} from "lucide-react";';
  
  code = code.replace(importBlock, newImportBlock);
  fs.writeFileSync('src/Tampuyak.tsx', code);
  console.log("Imports deduplicated");
}
