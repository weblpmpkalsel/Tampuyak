const fs = require('fs');
const file = 'src/workspace/OrganizationSetup.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(
  `<option value="Kesetaraan">Kesetaraan (PKBM/SKB)</option>\n                  </select>`,
  `</select>`
);
content = content.replace(
  `<option value="PAUD">PAUD</option>\n                    <option value="SD">SD</option>`,
  `<option value="SD">SD</option>`
);
fs.writeFileSync(file, content);
