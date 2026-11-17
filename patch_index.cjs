const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

code = code.replace(
  "        image-rendering: -webkit-optimize-contrast; /* Sharp edges */",
  ""
);

code = code.replace(
  '<img src="/icon-512.png" alt="TAMPUYAK OS Logo" class="splash-logo" />',
  '<img src="/icon-512.png" alt="TAMPUYAK OS Logo" class="splash-logo" style="max-width:100%; max-height:100%;" />'
);

fs.writeFileSync('index.html', code);
