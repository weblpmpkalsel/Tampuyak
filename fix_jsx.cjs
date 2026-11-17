const fs = require('fs');
let code = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf-8');

code = code.replace(
  '        })}\n      </div>\n    );\n  };\n\n  const renderChapter',
  '        })}\n      </div>\n      </>\n    );\n  };\n\n  const renderChapter'
);

code = code.replace(
  '        {chapter.sections && chapter.sections.map((section, idx) => renderSection(section, idx))}\n      </div>\n    );\n  };\n\n  return (',
  '        {chapter.sections && chapter.sections.map((section, idx) => renderSection(section, idx))}\n      </div>\n      </>\n    );\n  };\n\n  return ('
);

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', code);
console.log("Fixed JSX!");
