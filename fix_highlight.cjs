const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const regex = /TemplateTokenEngine\.render\("([^"]+)", settings\)/g;
code = code.replace(regex, '<TemplateTokenRenderer content="$1" settings={settings} />');

const jsxComponent = `
const TemplateTokenRenderer = ({ content, settings }: any) => {
  const renderedStr = TemplateTokenEngine.render(content, settings);
  if (!renderedStr.includes("[Token tidak dikenal]")) return <>{renderedStr}</>;
  
  // Custom splitting to highlight [Token tidak dikenal]
  const parts = renderedStr.split(/(\\[Token tidak dikenal\\])/g);
  return (
    <>
      {parts.map((p, i) => p === "[Token tidak dikenal]" ? <span key={i} className="bg-rose-100 text-rose-700 px-1 font-bold rounded print:bg-transparent print:text-black">[Token tidak dikenal]</span> : p)}
    </>
  );
};

const TemplateTokenEngine`;

code = code.replace("const TemplateTokenEngine", jsxComponent);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Fixed token highlighting');
